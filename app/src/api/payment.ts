import { getBackendBaseUrl } from './serverAuth';

export interface PaymentStatusResponse {
  order_id: number;
  total: number;
  status: string;
  payment_method: string;
  payment_status: string;
  payment_trans_id: string;
  payment_order_id: string;
  updated_at: string;
}

export interface CreatePaypalPaymentParams {
  orderId?: number;
  amount?: number;
  shippingAddress?: string;
  phone?: string;
  email?: string;
  redirectUrl?: string;
}

export interface PaypalPaymentResponse {
  message: string;
  order_id: number;
  amount: number;
  amount_usd: number;
  paypal_order_id: string;
  approve_url: string;
}

function getAuthToken(): string {
  try {
    const token = localStorage.getItem('boko_auth_token') || '';
    // Nếu là mock-token từ chế độ giả lập offline thì không gửi lên backend thật
    if (!token || token.startsWith('mock-token-')) {
      return '';
    }
    return token;
  } catch {
    return '';
  }
}

function authHeaders(): Record<string, string> {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

/**
 * Khởi tạo giao dịch PayPal cho đơn hàng (cần đăng nhập, đơn thuộc về user)
 * Endpoint: POST /api/payment/paypal/create
 */
export async function createPaypalPaymentApi(
  params: CreatePaypalPaymentParams
): Promise<PaypalPaymentResponse> {
  const baseUrl = getBackendBaseUrl();
  if (!baseUrl) throw new Error('Chưa cấu hình backend (VITE_BACKEND_URL).');

  const response = await fetch(`${baseUrl}/api/payment/paypal/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...authHeaders(),
    },
    body: JSON.stringify({
      order_id: params.orderId || 0,
      amount: params.amount,
      shipping_address: params.shippingAddress || '',
      phone: params.phone || '',
      email: params.email || '',
      redirect_url: params.redirectUrl || `${window.location.origin}/payment/paypal-callback`,
    }),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || data.message || `Lỗi tạo thanh toán PayPal: HTTP ${response.status}`);
  }

  return data;
}

/**
 * Thu tiền đơn PayPal đã được user approve
 * Endpoint: POST /api/payment/paypal/capture
 */
export async function capturePaypalPaymentApi(
  params: { paypalOrderId: string }
): Promise<PaymentStatusResponse & { message: string }> {
  const baseUrl = getBackendBaseUrl();
  if (!baseUrl) throw new Error('Chưa cấu hình backend (VITE_BACKEND_URL).');

  const response = await fetch(`${baseUrl}/api/payment/paypal/capture`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...authHeaders(),
    },
    body: JSON.stringify({ paypal_order_id: params.paypalOrderId }),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || data.message || `Lỗi capture PayPal: HTTP ${response.status}`);
  }

  return data;
}

/**
 * Lấy trạng thái đơn hàng thanh toán PayPal từ Backend
 * Endpoint: GET /api/payment/paypal/status/:id
 */
export async function getPaypalStatusApi(
  orderId: number | string
): Promise<PaymentStatusResponse> {
  const baseUrl = getBackendBaseUrl();
  if (!baseUrl) throw new Error('Chưa cấu hình backend (VITE_BACKEND_URL).');

  const response = await fetch(`${baseUrl}/api/payment/paypal/status/${orderId}`, {
    headers: {
      Accept: 'application/json',
      ...authHeaders(),
    },
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || data.message || `Lỗi lấy trạng thái PayPal: HTTP ${response.status}`);
  }

  return data;
}
