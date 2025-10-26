const BASE = import.meta.env.VITE_API_BASE || "http://127.0.0.1:8000";

function handleAudioOrJson(res) {
  const ct = res.headers.get("content-type") || "";
  if (ct.includes("audio/mpeg")) {
    return res.blob().then((blob) => ({
      audioUrl: URL.createObjectURL(blob),
      summary:
        res.headers.get("X-Final-Summary") ||
        res.headers.get("X-Summary") ||
        null,
    }));
  }
  return res.json();
}

export async function summarizeText({
  text,
  tts = false,
  voice = "mark",
  progressive = false,
  max_iters = 3,
  tolerance = 0.03,
} = {}) {
  const url = `${BASE}/${progressive ? "summarize-text-progressive" : "summarize-text"}`;
  const body = progressive
    ? { text, tts, voice, max_iters, tolerance }
    : { text, tts, voice };

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return handleAudioOrJson(res);
}

export async function summarizeAudio(file, { voice = "mark", tts = false } = {}) {
  if (!file) throw new Error("No file provided to summarizeAudio");
  const fd = new FormData();
  fd.append("file", file);
  fd.append("voice", voice);
  fd.append("tts", String(tts));

  const res = await fetch(`${BASE}/summarize-audio`, { method: "POST", body: fd });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return handleAudioOrJson(res);
}

export async function summarizeTextProgressive({
  text,
  voice = "mark",
  max_iters = 5,
  tolerance = 0.05,
  tts = false, // return JSON so we can stream parts to chat
}) {
  const res = await fetch(`${BASE}/summarize-text-progressive`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, voice, max_iters, tolerance, tts }),
  });
  if (!res.ok) {
    const msg = await res.text().catch(() => "");
    throw new Error(`progressive: ${res.status} ${msg}`);
  }
  return res.json(); // { final_text, parts: [...] }
}

export async function* streamTextProgressive({
  text,
  voice = "mark",
  max_iters = 5,
  tolerance = 0.05,
}) {
  const res = await fetch(`${BASE}/summarize-text-progressive-stream`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, voice, max_iters, tolerance, tts: false }),
  });
  if (!res.ok || !res.body) {
    const msg = await res.text().catch(() => "");
    throw new Error(`stream: ${res.status} ${msg}`);
  }
  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;
      let obj;
      try { obj = JSON.parse(trimmed); } catch { continue; }
      yield obj; // {type:"part"|"done"|"error"}
    }
  }
  if (buffer.trim()) {
    try { yield JSON.parse(buffer.trim()); } catch {}
  }
}

export async function tts({ text, voice = "mark" }) {
  const res = await fetch(`${BASE}/tts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, voice }),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const blob = await res.blob();
  return URL.createObjectURL(blob); // object URL to play
}