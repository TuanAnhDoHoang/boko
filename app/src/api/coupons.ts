import { safeFetchJson } from './client';
import { isBackendConfigured } from './serverAuth';

export interface CouponValidationResult {
  isValid: boolean;
  code: string;
  discountPercent: number;
  isFreeShipping: boolean;
  message: string;
  source: 'backend' | 'local' | 'fallback';
}

export const KNOWN_COUPONS: Record<string, { code: string; discountPercent: number; isFreeShipping: boolean; message: string }> = {
  GIAM10: {
    code: 'GIAM10',
    discountPercent: 10,
    isFreeShipping: false,
    message: 'Mã GIAM10 đã được áp dụng thành công.',
  },
  FREESHIP: {
    code: 'FREESHIP',
    discountPercent: 0,
    isFreeShipping: true,
    message: 'Mã FREESHIP đã được áp dụng thành công.',
  },
};

export function normalizeCouponCode(code?: string): string {
  return (code || '').trim().toUpperCase();
}

export async function validateCouponCode(rawCode: string): Promise<CouponValidationResult> {
  const code = normalizeCouponCode(rawCode);
  if (!code) {
    return { isValid: false, code: '', discountPercent: 0, isFreeShipping: false, message: 'Vui lòng nhập mã giảm giá.', source: 'local' };
  }

  if (!isBackendConfigured()) {
    const match = KNOWN_COUPONS[code];
    if (match) {
      return { isValid: true, code: match.code, discountPercent: match.discountPercent, isFreeShipping: match.isFreeShipping, message: match.message, source: 'local' };
    }
    return { isValid: false, code, discountPercent: 0, isFreeShipping: false, message: 'Mã giảm giá không hợp lệ. Thử GIAM10 hoặc FREESHIP', source: 'local' };
  }

  try {
    const response = await safeFetchJson<{ message?: string; code?: string; discount_percent?: number; discountPercent?: number; expires_at?: string }>(`/api/apply-coupon`, {
      method: 'POST',
      body: JSON.stringify({ code }),
    });

    if (!response.ok) {
      throw new Error(response.error || 'Mã giảm giá không hợp lệ');
    }

    const payload = response.data ?? {};
    const normalized = normalizeCouponCode(payload.code || code);
    const discount = Number(payload.discount_percent ?? payload.discountPercent ?? 0);

    if (!normalized || !Number.isFinite(discount)) {
      throw new Error('Mã giảm giá không hợp lệ.');
    }

    return {
      isValid: true,
      code: normalized,
      discountPercent: discount,
      isFreeShipping: normalized === 'FREESHIP',
      message: payload.message || 'Mã giảm giá hợp lệ!',
      source: 'backend',
    };
  } catch {
    const match = KNOWN_COUPONS[code];
    if (match) {
      return { isValid: true, code: match.code, discountPercent: match.discountPercent, isFreeShipping: match.isFreeShipping, message: match.message, source: 'fallback' };
    }
    return { isValid: false, code, discountPercent: 0, isFreeShipping: false, message: 'Mã giảm giá không hợp lệ. Thử GIAM10 hoặc FREESHIP', source: 'fallback' };
  }
}
