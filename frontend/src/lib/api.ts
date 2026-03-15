import type { Profile } from "./storage";

export interface DebugResponse {
  total_schemes: number;
  sample_schemes: Array<{
    id: string;
    name: string;
  }>;
  error?: string;
}

export interface Scheme {
  id: string;
  name: string;
  description: string;
  target_group?: string;
  state_availability?: string[];
  ministry?: string;
  income_limit?: number;
  age_min?: number;
  age_max?: number;
  required_documents?: string[];
  application_link?: string;
  offline_office?: string;
  application_steps?: string[];
}

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

export async function listSchemes(q?: string, state?: string): Promise<Scheme[]> {
  const url = new URL(`${API_BASE}/api/v1/schemes`);
  if (q) url.searchParams.set("q", q);
  if (state) url.searchParams.set("state", state);
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`Schemes failed: ${res.status}`);
  return res.json();
}

export async function getScheme(id: string): Promise<Scheme> {
  const res = await fetch(`${API_BASE}/api/v1/schemes/${id}`);
  if (!res.ok) throw new Error(`Scheme failed: ${res.status}`);
  return res.json();
}

export async function debugSchemes(): Promise<DebugResponse> {
  const res = await fetch(`${API_BASE}/api/v1/debug/schemes`);
  if (!res.ok) throw new Error(`Debug failed: ${res.status}`);
  return res.json();
}

