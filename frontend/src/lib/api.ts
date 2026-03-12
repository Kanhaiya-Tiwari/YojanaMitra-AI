import type { Profile } from "./storage";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000";

export async function chat(message: string, profile: Profile, language: "en" | "hi") {
  const res = await fetch(`${API_BASE}/api/v1/chat`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ message, profile, language }),
  });
  if (!res.ok) throw new Error(`Chat failed: ${res.status}`);
  return res.json();
}

export async function listSchemes(q?: string, state?: string) {
  const url = new URL(`${API_BASE}/api/v1/schemes`);
  if (q) url.searchParams.set("q", q);
  if (state) url.searchParams.set("state", state);
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`Schemes failed: ${res.status}`);
  return res.json();
}

