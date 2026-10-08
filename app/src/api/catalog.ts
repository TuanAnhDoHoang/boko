import { Book } from '../types';
import { safeFetchJson } from './client';
import { normalizeBook, normalizeCategoryName } from './normalizers';

export async function fetchBooksFromBackend(): Promise<Book[]> {
  const response = await safeFetchJson<{ data?: any[]; total?: number; page?: number; limit?: number }>(`/api/books`);
  if (!response.ok || !response.data) return [];

  const payload = Array.isArray(response.data) ? response.data : response.data.data ?? [];
  return (payload as any[]).map(normalizeBook);
}

export async function fetchBookDetailFromBackend(id: string | number): Promise<Book | null> {
  const response = await safeFetchJson<{ data?: { book?: any; reviews?: any[] } }>(`/api/books/${id}`);
  if (!response.ok || !response.data) return null;

  return response.data.data?.book ? normalizeBook(response.data.data.book) : null;
}

export async function fetchCategoriesFromBackend(): Promise<string[]> {
  const response = await safeFetchJson<{ data?: any[] }>(`/api/categories`);
  if (!response.ok || !response.data) return [];

  const categories = Array.isArray(response.data) ? response.data : response.data.data ?? [];
  return categories
    .map((category: any) => normalizeCategoryName(category?.name))
    .filter((name: string | undefined): name is string => Boolean(name && String(name).trim()));
}
