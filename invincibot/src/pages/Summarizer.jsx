// src/pages/Summarizer.jsx
import { useEffect, useMemo, useState } from "react";

const API_BASE =
  (import.meta.env.VITE_API_BASE || "http://127.0.0.1:8000").replace(/\/$/, "");

const VOICES = [
  { id: "mark", label: "Mark" },
  { id: "eve", label: "Eve" },
  { id: "omni", label: "Omni-Man" },
];

export default function Summarizer({ onBack }) {
  const [text, setText] = useState("");
  const [voice, setVoice] = useState("mark");
  const [wantTTS, setWantTTS] = useState(false);

  const [file, setFile] = useState(null);

  const [summary, setSummary] = useState("");
  const [transcript, setTranscript] = useState("");
  const [audioUrl, setAudioUrl] = useState("");
  const [loading, setLoading] = useState("idle"); // 'idle' | 'text' | 'audio'
  const [error, setError] = useState("");

  useEffect(() => {
    console.log("[Summarizer] API_BASE =", API_BASE);
  }, []);

  useEffect(() => {
    return () => {
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  }, [audioUrl]);

  async function summarizeTextHandler() {
    setError("");
    setSummary("");
    setTranscript("");
    setAudioUrl("");
    if (!text.trim()) {
      setError("Please enter some text first.");
      return;
    }

    try {
      setLoading("text");

      // 1) Always get JSON summary first (fast + shows text to user)
      const res = await fetch(`${API_BASE}/summarize-text`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, voice, tts: false }),
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setSummary(data.summary || "");

      // 2) If user wants TTS, request the mp3 (second call). We can optimize later.
      if (wantTTS) {
        const res2 = await fetch(`${API_BASE}/summarize-text`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text, voice, tts: true }),
        });
        if (!res2.ok) throw new Error(await res2.text());
        const blob = await res2.blob();
        setAudioUrl(URL.createObjectURL(blob));
      }
    } catch (e) {
      setError(e.message || "Something went wrong.");
    } finally {
      setLoading("idle");
    }
  }

  async function summarizeAudioHandler() {
    setError("");
    setSummary("");
    setTranscript("");
    setAudioUrl("");

    if (!file) {
      setError("Pick an audio file first.");
      return;
    }

    try {
      setLoading("audio");
      const fd = new FormData();
      fd.append("file", file);
      fd.append("voice", voice);
      fd.append("tts", String(wantTTS));

      const res = await fetch(`${API_BASE}/summarize-audio`, {
        method: "POST",
        body: fd,
      });
      if (!res.ok) throw new Error(await res.text());

      const ct = res.headers.get("content-type") || "";
      if (ct.includes("audio/")) {
        // TTS audio stream; summary text may be in header (X-Summary)
        const blob = await res.blob();
        setAudioUrl(URL.createObjectURL(blob));
        const s = res.headers.get("X-Summary");
        if (s) setSummary(s);
      } else {
        const data = await res.json();
        setTranscript(data.transcript || "");
        setSummary(data.summary || "");
      }
    } catch (e) {
      setError(e.message || "Something went wrong.");
    } finally {
      setLoading("idle");
    }
  }

  return (
    <div className="w-full max-w-3xl mx-auto p-6 text-white">
      <div className="flex items-center gap-3 mb-6">
        {onBack && (
          <button
            onClick={onBack}
            className="px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700"
          >
            ← Back
          </button>
        )}
        <h1 className="text-3xl font-extrabold tracking-tight">Summarizer</h1>
        <div className="ml-auto text-xs opacity-80">
          API: <code>{API_BASE}</code>
        </div>
      </div>

      {/* Controls */}
      <div className="grid gap-4">
        <div className="grid md:grid-cols-3 gap-3">
          <label className="flex flex-col gap-1">
            <span className="text-sm opacity-90">Voice</span>
            <select
              className="bg-gray-800 rounded-lg px-3 py-2"
              value={voice}
              onChange={(e) => setVoice(e.target.value)}
            >
              {VOICES.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.label}
                </option>
              ))}
            </select>
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={wantTTS}
              onChange={(e) => setWantTTS(e.target.checked)}
            />
            <span className="opacity-90">Speak the summary (TTS)</span>
          </label>

          <div className="text-sm opacity-80 self-center">
            {loading !== "idle" ? "Working…" : ""}
          </div>
        </div>

        {/* Text box */}
        <label className="flex flex-col gap-2">
          <span className="opacity-90">Paste text to summarize</span>
          <textarea
            className="bg-gray-800 rounded-xl p-3 min-h-[120px] outline-none"
            placeholder="Paste or type text here…"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <button
            onClick={summarizeTextHandler}
            disabled={loading !== "idle"}
            className="self-start px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50"
          >
            {loading === "text" ? "Summarizing…" : "Summarize Text"}
          </button>
        </label>

        {/* Audio upload */}
        <div className="grid gap-2">
          <span className="opacity-90">Or upload audio (mp3/wav/m4a…)</span>
          <input
            type="file"
            accept="audio/*"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
          <button
            onClick={summarizeAudioHandler}
            disabled={loading !== "idle"}
            className="self-start px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-50"
          >
            {loading === "audio" ? "Transcribing + Summarizing…" : "Summarize Audio"}
          </button>
        </div>

        {error && (
          <div className="bg-red-900/50 border border-red-700 rounded-xl p-3">
            <div className="font-semibold mb-1">Error</div>
            <div className="text-sm break-words">{error}</div>
          </div>
        )}

        {transcript && (
          <div className="bg-gray-800 rounded-xl p-3">
            <div className="font-semibold mb-1">Transcript</div>
            <p className="text-sm whitespace-pre-wrap">{transcript}</p>
          </div>
        )}

        {summary && (
          <div className="bg-gray-800 rounded-xl p-3">
            <div className="font-semibold mb-1">Summary</div>
            <p className="text-sm whitespace-pre-wrap">{summary}</p>
          </div>
        )}

        {audioUrl && (
          <div className="bg-gray-800 rounded-xl p-3">
            <div className="font-semibold mb-2">Audio</div>
            <audio controls src={audioUrl} className="w-full" />
          </div>
        )}
      </div>
    </div>
  );
}
