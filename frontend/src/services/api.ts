const API_BASE = '/api';

async function handleRes(res: Response) {
  const text = await res.text();
  const ct = (res.headers.get('content-type') || '').toLowerCase();

  if (!res.ok) {
    throw new Error(text || res.statusText);
  }

  if (!ct.includes('application/json')) {
    throw new Error(`Esperado JSON, recebeu: ${text.slice(0, 1000)}`);
  }

  return JSON.parse(text);
}

export async function apiGet<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}/${path}`);
  return handleRes(res);
}

export async function apiPost<T>(path: string, body: any): Promise<T> {
  const res = await fetch(`${API_BASE}/${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return handleRes(res);
}

export async function apiDelete(path: string): Promise<void> {
  const res = await fetch(`${API_BASE}/${path}`, { method: 'DELETE' });
  await handleRes(res);
}