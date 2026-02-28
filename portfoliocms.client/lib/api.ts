export const getCookie = (name: string): string | null => {
  if (typeof document === 'undefined') return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() ?? null;
  return null;
};

const handleUnauth = () => {
  document.cookie = 'accessToken=; path=/; max-age=0';
  window.location.href = '/login';
};

export const fetchWithAuth = async (endpoint: string): Promise<Response> => {
  const token = getCookie('accessToken');
  if (!token || token === 'undefined' || token === 'null') {
    handleUnauth();
    return new Promise(() => {});
  }
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/${endpoint}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  if (res.status === 401) { handleUnauth(); return new Promise(() => {}); }
  if (!res.ok) throw new Error(`Request to ${endpoint} failed with status ${res.status}`);
  return res;
};

export const fetchWithAuthMutation = async (
  endpoint: string,
  method: 'POST' | 'PUT' | 'PATCH' | 'DELETE',
  body?: unknown
): Promise<Response> => {
  const token = getCookie('accessToken');
  if (!token || token === 'undefined' || token === 'null') {
    handleUnauth();
    return new Promise(() => {});
  }
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/${endpoint}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  if (res.status === 401) { handleUnauth(); return new Promise(() => {}); }
  return res;
};

export const uploadFile = async (endpoint: string, file: File): Promise<{ url: string }> => {
  const token = getCookie('accessToken');
  if (!token || token === 'undefined' || token === 'null') {
    handleUnauth();
    return new Promise(() => {});
  }
  const form = new FormData();
  form.append('file', file);
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/${endpoint}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: form,
  });
  if (res.status === 401) { handleUnauth(); return new Promise(() => {}); }
  if (!res.ok) throw new Error('Upload failed');
  const json = await res.json();
  return json.data ?? json;
};
