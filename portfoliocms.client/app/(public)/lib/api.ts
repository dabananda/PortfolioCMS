import type {
  PublicPortfolio,
  BlogPostPagedResponse,
  BlogPost,
  ContactMessageRequest,
} from '../types/portfolio';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? '';
export const USERNAME = process.env.NEXT_PUBLIC_USERNAME ?? '';

export async function getPortfolio(): Promise<PublicPortfolio | null> {
  try {
    const res = await fetch(`${API_URL}/portfolio/${USERNAME}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data ?? json;
  } catch {
    return null;
  }
}

export async function getBlogPosts(params?: {
  page?: number;
  pageSize?: number;
  search?: string;
  categoryId?: string;
}): Promise<BlogPostPagedResponse | null> {
  try {
    const query = new URLSearchParams();
    if (params?.page) query.set('Page', String(params.page));
    if (params?.pageSize) query.set('PageSize', String(params.pageSize));
    if (params?.search) query.set('Search', params.search);
    if (params?.categoryId) query.set('CategoryId', params.categoryId);

    const res = await fetch(
      `${API_URL}/portfolio/${USERNAME}/blog?${query.toString()}`,
      { next: { revalidate: 60 } }
    );
    if (!res.ok) return null;
    const json = await res.json();
    return json.data ?? json;
  } catch {
    return null;
  }
}

export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  try {
    const res = await fetch(
      `${API_URL}/portfolio/${USERNAME}/blog/${slug}`,
      { next: { revalidate: 60 } }
    );
    if (!res.ok) return null;
    const json = await res.json();
    return json.data ?? json;
  } catch {
    return null;
  }
}

export async function sendContactMessage(
  data: ContactMessageRequest
): Promise<{ success: boolean; message: string }> {
  try {
    const res = await fetch(`${API_URL}/portfolio/${USERNAME}/contact-message`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const text = await res.text();
    if (!res.ok) {
      let errMsg = 'Failed to send message. Please try again.';
      try {
        const json = JSON.parse(text);
        errMsg = json.message ?? json.title ?? errMsg;
      } catch { /* ignore */ }
      return { success: false, message: errMsg };
    }
    return { success: true, message: text || 'Your message has been sent successfully.' };
  } catch {
    return { success: false, message: 'Network error. Please try again.' };
  }
}
