import { CustomerOrderSummary } from '../types';

/**
 * sanitizeBokoOrdersCache — Làm sạch toàn bộ dữ liệu lưu trữ boko_orders trong localStorage
 * Loại bỏ vĩnh viễn các trường nhạy cảm (cardCvv, cardNumber, cardExpiry) khỏi cache trình duyệt.
 * Áp dụng nguyên tắc Fail-Closed: Nếu dữ liệu bị hỏng hoặc parse lỗi, reset key về [] để ngăn rò rỉ dữ liệu thẻ cũ.
 */
export function sanitizeBokoOrdersCache(): void {
  const STORAGE_KEY = 'boko_orders';
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      localStorage.setItem(STORAGE_KEY, '[]');
      return;
    }

    const cleanedOrders = parsed.map((o: any) => {
      const cust = o.customer || {};
      const safeCustomer: CustomerOrderSummary = {
        firstName: String(cust.firstName || ''),
        lastName: String(cust.lastName || ''),
        email: String(cust.email || ''),
        telephone: String(cust.telephone || ''),
        address: cust.address ? String(cust.address) : undefined,
        streetAddress: cust.streetAddress ? String(cust.streetAddress) : undefined,
        ward: cust.ward ? String(cust.ward) : undefined,
        province: cust.province ? String(cust.province) : undefined,
        shippingAddress: String(cust.shippingAddress || o.shippingAddress || cust.address || ''),
        paymentMethod: String(cust.paymentMethod || o.paymentMethod || 'cod'),
      };

      return {
        ...o,
        customer: safeCustomer,
      };
    });

    localStorage.setItem(STORAGE_KEY, JSON.stringify(cleanedOrders));
  } catch (e) {
    console.warn('Dữ liệu boko_orders bị lỗi, tiến hành fail-closed reset:', e);
    localStorage.setItem(STORAGE_KEY, '[]');
  }
}
