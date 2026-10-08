import { CartItem } from '../types';
import { safeFetchJson } from './client';
import { normalizeCartItem } from './normalizers';

export async function fetchCartFromBackend(): Promise<CartItem[]> {
  const response = await safeFetchJson<{ data?: { items?: any[]; total?: number } }>(`/api/cart`);
  if (!response.ok || !response.data || !response.data.data) return [];

  const items = response.data.data.items ?? [];
  return (items as any[]).map(normalizeCartItem);
}

export async function addToCartSafe(bookId: string | number, quantity = 1): Promise<CartItem | null> {
  const response = await safeFetchJson<{ message?: string; data?: any; quantity?: number }>(`/api/cart`, {
    method: 'POST',
    body: JSON.stringify({ book_id: Number(bookId), quantity: Number(quantity) || 1 }),
  });

  if (!response.ok || !response.data) return null;

  const payload = response.data.data ?? {
    book_id: Number(bookId),
    quantity: Number(response.data.quantity ?? quantity),
    title: 'Book',
    author: 'Boko',
    price: 0,
    image_url: '',
  };

  return normalizeCartItem({ ...payload, quantity: Number(payload.quantity ?? quantity) });
}

export async function updateCartItemSafe(serverCartId: string | number, quantity: number): Promise<boolean> {
  if (!serverCartId) return false;
  const response = await safeFetchJson<{ message?: string; quantity?: number }>(`/api/cart/${serverCartId}`, {
    method: 'PUT',
    body: JSON.stringify({ quantity: Number(quantity) || 1 }),
  });
  return response.ok;
}

export async function removeCartItemSafe(serverCartId: string | number): Promise<boolean> {
  if (!serverCartId) return false;
  const response = await safeFetchJson<{ message?: string }>(`/api/cart/${serverCartId}`, {
    method: 'DELETE',
  });
  return response.ok;
}
