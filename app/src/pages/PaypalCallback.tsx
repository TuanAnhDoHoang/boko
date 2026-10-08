import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { capturePaypalPaymentApi } from '../api/payment';

interface PaypalCallbackProps {
  onOrderSuccessFinished?: () => void;
}

export const PaypalCallback: React.FC<PaypalCallbackProps> = ({ onOrderSuccessFinished }) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<number | null>(null);

  // PayPal redirect về với ?token=<paypal_order_id>&PayerID=...
  const token = searchParams.get('token') || '';
  const cancelled = searchParams.get('cancel') === '1' || searchParams.get('cancelled') === '1';

  const isSuccess = !cancelled && orderId !== null && !error;

  useEffect(() => {
    let isMounted = true;

    async function confirm() {
      if (!token || cancelled) {
        if (isMounted) setLoading(false);
        return;
      }
      try {
        const res = await capturePaypalPaymentApi({ paypalOrderId: token });
        if (isMounted) {
          setOrderId(res.order_id);
          setLoading(false);
          if (onOrderSuccessFinished) onOrderSuccessFinished();
        }
      } catch (err: unknown) {
        if (isMounted) {
          setError((err as Error)?.message || 'Xác thực thanh toán PayPal thất bại.');
          setLoading(false);
        }
      }
    }

    confirm();
    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden border border-slate-200">
        <div className="p-6 sm:p-8 text-center space-y-4">
          {loading ? (
            <>
              <span className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin inline-block" />
              <h2 className="font-display font-bold text-xl text-slate-900">
                Đang xác thực thanh toán PayPal...
              </h2>
              <p className="font-body text-xs text-slate-500">Vui lòng đợi, không tắt trang.</p>
            </>
          ) : isSuccess ? (
            <>
              <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                <i className="fa-solid fa-circle-check text-3xl"></i>
              </div>
              <h2 className="font-display font-bold text-2xl text-slate-900">
                Thanh toán PayPal thành công!
              </h2>
              <p className="font-body text-xs sm:text-sm text-slate-500">
                Mã đơn hàng: <strong className="text-slate-900 font-mono">#{orderId}</strong>
              </p>
            </>
          ) : (
            <>
              <div className="w-16 h-16 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto">
                <i className="fa-solid fa-circle-xmark text-3xl"></i>
              </div>
              <h2 className="font-display font-bold text-2xl text-slate-900">
                Thanh toán chưa thành công
              </h2>
              <p className="font-body text-xs sm:text-sm text-slate-500">
                {cancelled
                  ? 'Bạn đã hủy thanh toán PayPal.'
                  : error || 'Giao dịch bị từ chối hoặc đã bị hủy'}
              </p>
            </>
          )}

          {!loading && (
            <div className="pt-2 space-y-2.5">
              <button
                onClick={() => navigate('/')}
                className="w-full py-3 px-4 rounded-xl font-bold text-sm bg-slate-900 text-white hover:bg-slate-800 active:scale-[0.99] transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Về Trang Chủ Tiếp Tục Mua Sắm</span>
              </button>
              {!isSuccess && (
                <button
                  onClick={() => navigate('/checkout')}
                  className="w-full py-2.5 px-4 rounded-xl font-semibold text-xs text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  Quay lại màn hình thanh toán
                </button>
              )}
            </div>
          )}
        </div>

        <div className="bg-slate-50/70 p-3 text-center border-t border-slate-100 text-[11px] text-slate-400">
          Hệ thống Boko Book Store • Thanh toán an toàn qua PayPal
        </div>
      </div>
    </div>
  );
};
