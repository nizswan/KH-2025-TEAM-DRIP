# backend/app.py
import os, io, math, json, time, requests
from datetime import datetime, timezone
from fastapi import FastAPI, UploadFile, File, Form, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, StreamingResponse
from pydantic import BaseModel

# ----------------------------
# Simple JSON logger
# ----------------------------
def jlog(event: str, **fields):
    print(json.dumps({
        "ts": datetime.now(timezone.utc).isoformat(),
        "level": "info",
        "logger": "app",
        "msg": json.dumps({"event": event, **fields})
    }), flush=True)

# ---- HARD-CODED KEYS (hackathon style) ----
ELEVEN_API_KEY = os.getenv("ELEVEN_API_KEY", "sk_c12d87782b434fe6c3346f74075d14e0c64318564af1c31f").strip()
GEMINI_API_KEY = "AIzaSyBT0KkgEDI0QR2TqxHVxgAHKQE54mhoA20".strip()  # your working key

# ---- Voice IDs ----
VOICE_IDS = {
    "mark": "S3r79cHxlnEjlFBAKrCC",
    "eve":  "vb40ieiNHUW8xg549Vzv",
    "omni": "agLyzFJ3lzFIYukpcAOZ",
}
MODEL_ID_TTS = "eleven_turbo_v2_5"

# ---- FastAPI + CORS ----
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "Backend is running!"}

# ============= BART summarizer (lazy load + preload on startup) =============
import torch
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM
_MODEL_TXT = "facebook/bart-large-cnn"
_tok = _model = _dev = None

def _init_bart():
    global _tok, _model, _dev
    if _model is not None:
        return
    jlog("bart.load.start", model=_MODEL_TXT)
    _dev = torch.device("cuda:0" if torch.cuda.is_available() else "cpu")
    jlog("bart.device", device=_dev.type)
    t0 = time.time()
    jlog("bart.tokenizer.download")
    _tok = AutoTokenizer.from_pretrained(_MODEL_TXT, use_fast=True)
    jlog("bart.tokenizer.ready")
    jlog("bart.weights.download")
    _model = AutoModelForSeq2SeqLM.from_pretrained(_MODEL_TXT)
    jlog("bart.weights.ready", seconds=f"{time.time()-t0:.2f}")
    jlog("bart.model.to_device.start")
    _model = _model.to(_dev)
    jlog("bart.model.to_device.done")
    max_src = getattr(_model.config, "max_position_embeddings", 1024)
    jlog("bart.load.ok", max_src=max_src)

def _summarize(text: str) -> str:
    _init_bart()
    enc = _tok([text], return_tensors="pt", truncation=True, max_length=1024)
    enc = {k: v.to(_dev) for k, v in enc.items()}
    with torch.no_grad():
        out = _model.generate(**enc, num_beams=2, no_repeat_ngram_size=4,
                              length_penalty=1.0, early_stopping=True, max_new_tokens=420)
    return _tok.decode(out[0], skip_special_tokens=True).strip()

# ============= ElevenLabs STT / TTS ====================
def _tts_bytes(text: str, voice: str = "mark") -> bytes:
    vid = VOICE_IDS.get(voice.lower(), VOICE_IDS["mark"])
    url = f"https://api.elevenlabs.io/v1/text-to-speech/{vid}"
    headers = {"xi-api-key": ELEVEN_API_KEY, "accept": "audio/mpeg", "Content-Type": "application/json"}
    payload = {
        "text": text,
        "model_id": MODEL_ID_TTS,
        "voice_settings": {"stability": 0.5, "similarity_boost": 0.8, "style": 0.1, "use_speaker_boost": True},
    }
    r = requests.post(url, headers=headers, json=payload, timeout=60)
    r.raise_for_status()
    return r.content

def _stt_text(file_name: str, blob: bytes, content_type: str | None) -> str:
    url = "https://api.elevenlabs.io/v1/speech-to-text"
    headers = {"xi-api-key": ELEVEN_API_KEY}
    data = {"model_id": "scribe_v1", "language_code": "en"}
    files = {"file": (file_name, io.BytesIO(blob), content_type or "audio/mpeg")}
    r = requests.post(url, headers=headers, data=data, files=files, timeout=600)
    r.raise_for_status()
    return (r.json().get("text") or "").strip()

# ============= Gemini helpers (auto-pick model) ================
import google.generativeai as genai
genai.configure(api_key=GEMINI_API_KEY)

def _pick_gemini():
    key_tail = GEMINI_API_KEY[-6:] if GEMINI_API_KEY else "none"
    try:
        models = list(genai.list_models())
    except Exception as e:
        jlog("gemini.list_models.error", error=str(e), key_tail=key_tail)
        return "models/gemini-1.5-flash"  # blind fallback (generate will still fail if key is bad)
    def ok(m):
        ms = set(getattr(m, "supported_generation_methods", []) or [])
        return "generateContent" in ms or "generate_content" in ms
    avail = {m.name.split("/")[-1]: m.name for m in models if ok(m)}
    prefs = [
        "gemini-2.0-flash-exp",
        "gemini-1.5-flash-002","gemini-1.5-flash-001","gemini-1.5-flash",
        "gemini-1.5-pro-002","gemini-1.5-pro-001","gemini-1.5-pro",
        "gemini-1.0-pro","gemini-pro",
    ]
    for p in prefs:
        if p in avail:
            jlog("gemini.pick", chosen=p, full=avail[p], key_tail=key_tail)
            return avail[p]
    # first available
    if avail:
        name = next(iter(avail.values()))
        jlog("gemini.pick", chosen=name.split("/")[-1], full=name, key_tail=key_tail)
        return name
    jlog("gemini.pick.none", key_tail=key_tail)
    return "models/gemini-pro"

_GEMINI_MODEL = genai.GenerativeModel(_pick_gemini())
_GEMINI_PROMPT = (
    "You are an ADDITIVE summarizer.\n"
        "Goal: write a short continuation that covers important points from the ORIGINAL INPUT\n"
        "that are NOT yet present in the CURRENT SUMMARY.\n"
        "Rules:\n"
        "- Output ONLY neutral, declarative prose (no bullets).\n"
        "- Do NOT mention 'input', 'summary', 'missing', 'omits', 'fails', or any meta commentary.\n"
        "- Do NOT quote verbatim; paraphrase concisely.\n"
        "- Do NOT repeat points already present in CURRENT SUMMARY.\n"
        "- Return ONLY the continuation text.\n"
)

def _gemini_missing(original: str, current_summary: str) -> str:
    out = _GEMINI_MODEL.generate_content(
        f"{_GEMINI_PROMPT}\n\nORIGINAL INPUT:\n{original}\n\nCURRENT SUMMARY:\n{current_summary}\n\nWhat’s missing?"
    )
    return (getattr(out, "text", None) or "").strip()

def _target_ratio(n_chars: int) -> float:
    if n_chars <= 100: return 1.0
    if n_chars >= 2000: return 0.2
    m = (0.2 - 1.0) / (2000 - 100)
    b = 1.0 - m * 100
    return m * n_chars + b

def _ratio_str(now: str, ref: str):
    r = len(now) / max(1, len(ref))
    return r, f"{100*r:.1f}%"

# ------------- Startup: preload BART -------------
@app.on_event("startup")
async def _startup():
    jlog("server.startup")
    _init_bart()

# ============= Schemas & Endpoints ======================
class SummarizeTextIn(BaseModel):
    text: str
    voice: str | None = "mark"
    tts: bool | None = True

class ProgressiveIn(BaseModel):
    text: str
    voice: str | None = "mark"
    max_iters: int = 3
    tolerance: float = 0.03
    tts: bool | None = True

class TTSIn(BaseModel):
    text: str
    voice: str | None = "mark"

@app.post("/tts")
def tts_endpoint(payload: TTSIn):
    text = (payload.text or "").strip()
    if not text:
        return JSONResponse({"error": "text is required"}, status_code=400)
    audio = _tts_bytes(text, payload.voice or "mark")
    return StreamingResponse(io.BytesIO(audio), media_type="audio/mpeg")

@app.post("/summarize-text")
def summarize_text(payload: SummarizeTextIn):
    text = (payload.text or "").strip()
    if not text:
        return JSONResponse({"error":"text is required"}, status_code=400)
    jlog("summarize.text.request", tts=bool(payload.tts))
    summary = _summarize(text)
    jlog("summarize.text.done", chars=len(summary))
    if payload.tts:
        audio = _tts_bytes(summary, payload.voice or "mark")
        return StreamingResponse(io.BytesIO(audio), media_type="audio/mpeg")
    return {"summary": summary}

@app.post("/summarize-audio")
async def summarize_audio(file: UploadFile = File(...), voice: str = Form("mark"), tts: bool = Form(True)):
    jlog("summarize.audio.request", filename=file.filename, tts=bool(tts))
    blob = await file.read()
    transcript = _stt_text(file.filename, blob, file.content_type)
    summary = _summarize(transcript) if transcript else ""
    jlog("summarize.audio.done", transcript_chars=len(transcript), summary_chars=len(summary))
    if tts and summary:
        audio = _tts_bytes(summary, voice)
        return StreamingResponse(io.BytesIO(audio), media_type="audio/mpeg",
                                 headers={"X-Summary": summary})
    return {"transcript": transcript, "summary": summary}


@app.post("/summarize-text-progressive")
def summarize_text_progressive(payload: ProgressiveIn):
    original = (payload.text or "").strip()
    if not original:
        return JSONResponse({"error":"text is required"}, status_code=400)

    voice = (payload.voice or "mark")
    max_iters = int(payload.max_iters or 3)
    tolerance = float(payload.tolerance or 0.03)

    target = _target_ratio(len(original))

    # JSON (non-streaming) version: build parts, return at once
    pieces = []
    s1 = _summarize(original)
    pieces.append(s1)
    concat = s1
    ratio, _ = _ratio_str(concat, original)
    it = 1

    while ratio < (target - tolerance) and it < max_iters:
        it += 1
        missing = _gemini_missing(original, concat)
        if not missing or missing.strip().upper() == "NO_MISSING":
            break
        s2 = _summarize(missing)
        pieces.append(s2)
        concat = " ".join(pieces)
        ratio, _ = _ratio_str(concat, original)

    # if tts requested, return audio. otherwise JSON.
    if payload.tts:
        audio = _tts_bytes(concat, voice)
        return StreamingResponse(io.BytesIO(audio), media_type="audio/mpeg",
                                 headers={"X-Final-Summary": concat})
    return {"final_text": concat, "parts": pieces}


@app.post("/summarize-text-progressive-stream")
def summarize_text_progressive_stream(payload: ProgressiveIn):
    original = (payload.text or "").strip()
    if not original:
        return JSONResponse({"error":"text is required"}, status_code=400)

    max_iters = int(payload.max_iters or 3)
    tolerance = float(payload.tolerance or 0.03)
    target = _target_ratio(len(original))

    def gen():
        try:
            s1 = _summarize(original)
            yield json.dumps({"type": "part", "index": 1, "text": s1}) + "\n"
            pieces = [s1]
            concat = s1
            ratio, _ = _ratio_str(concat, original)
            it = 1

            while ratio < (target - tolerance) and it < max_iters:
                it += 1
                missing = _gemini_missing(original, concat)
                if not missing or missing.strip().upper() == "NO_MISSING":
                    break
                s2 = _summarize(missing)
                pieces.append(s2)
                yield json.dumps({"type": "part", "index": it, "text": s2}) + "\n"
                concat = " ".join(pieces)
                ratio, _ = _ratio_str(concat, original)

            yield json.dumps({"type": "done", "final_text": concat}) + "\n"
        except Exception as e:
            yield json.dumps({"type": "error", "message": str(e)}) + "\n"

    return StreamingResponse(gen(), media_type="application/x-ndjson")

@app.get("/debug/bart")
def debug_bart():
    _init_bart()
    return {"model": _MODEL_TXT, "device": _dev.type}

@app.get("/debug/gemini")
def debug_gemini():
    try:
        out = _GEMINI_MODEL.generate_content("ping")
        txt = (getattr(out, "text", None) or "").strip()
        return {"ok": True, "model": getattr(_GEMINI_MODEL, "_model_name", "unknown"), "reply": txt}
    except Exception as e:
        return JSONResponse({"ok": False, "error": str(e)}, status_code=500)
