export const getCookie = (name: string): string | null => {
  if (typeof document === 'undefined') return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() ?? null;
  return null;
};

export const fetchWithAuth = async (endpoint: string): Promise<Response> => {
  const token = getCookie('accessToken');

  if (!token || token === 'undefined' || token === 'null') {
    document.cookie = 'accessToken=; path=/; max-age=0';
    window.location.href = '/login';
    return new Promise(() => {});
  }

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/${endpoint}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (res.status === 401) {
    document.cookie = 'accessToken=; path=/; max-age=0';
    window.location.href = '/login';
    return new Promise(() => {});
  }

  if (!res.ok) {
    throw new Error(`Request to ${endpoint} failed with status ${res.status}`);
  }

  return res;
};
