const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000/api";

export async function getItems() {
  const res = await fetch(`${API_BASE}/items/`);
  if (!res.ok) throw new Error(`Failed to fetch items: ${res.status}`);
  return res.json();
}

export async function getLatestAnalysis() {
  const res = await fetch(`${API_BASE}/analysis/latest`);
  if (!res.ok) {
    if (res.status === 404) return null;
    throw new Error(`Failed to fetch latest analysis: ${res.status}`);
  }
  return res.json();
}