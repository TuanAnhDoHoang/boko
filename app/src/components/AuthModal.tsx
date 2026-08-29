import React, { useState, useEffect } from 'react';
import { User } from '../types';
import forestBgImg from '../assets/images/auth_forest_bg_1786582595599.jpg';
import { loginApi, signupApi, socialLoginApi, MOCK_USER_CREDENTIALS } from '../api/auth';

interface AuthModalProps {
  isOpen: boolean;
  onClose?: () => void;
  onLoginSuccess: (user: User) => void;
  initialMode?: 'login' | 'signup';
  isDismissible?: boolean;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  initialMode = 'login',
  isDismissible = true
}) => {
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>(initialMode);
  
  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // UI states
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successInfo, setSuccessInfo] = useState<string | null>(null);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleFillMockAccount = () => {
    setEmail(MOCK_USER_CREDENTIALS.username);
    setPassword(MOCK_USER_CREDENTIALS.password);
    setErrorMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessInfo(null);

    if (mode === 'forgot') {
      if (!email || !email.includes('@')) {
        setErrorMessage('Vui lòng nhập địa chỉ email hợp lệ.');
        return;
      }
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        setSuccessInfo('Chúng tôi đã gửi đường dẫn hướng dẫn khôi phục mật khẩu vào email của bạn.');
      }, 800);
      return;
    }

    if (mode === 'signup') {
      if (!name.trim()) {
        setErrorMessage('Vui lòng nhập Họ và Tên.');
        return;
      }
      if (!email || !email.includes('@')) {
        setErrorMessage('Vui lòng nhập Email hợp lệ.');
        return;
      }
      if (password.length < 6) {
        setErrorMessage('Mật khẩu phải có ít nhất 6 ký tự.');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMessage('Mật khẩu nhập lại không trùng khớp.');
        return;
      }

      setIsLoading(true);
      try {
        const res = await signupApi({
          name: name.trim(),
          email: email.trim(),
          password
        });

        setIsLoading(false);
        if (res.success && res.user) {
          onLoginSuccess(res.user);
        } else {
          setErrorMessage(res.error || 'Đăng ký không thành công. Vui lòng thử lại.');
        }
      } catch (err: any) {
        setIsLoading(false);
        setErrorMessage(err?.message || 'Có lỗi xảy ra khi kết nối máy chủ.');
      }
      return;
    }

    // Login mode
    if (!email.trim()) {
      setErrorMessage('Vui lòng nhập Username hoặc Email.');
      return;
    }
    if (!password) {
      setErrorMessage('Vui lòng nhập mật khẩu.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await loginApi({
        identifier: email.trim(),
        password
      });

      setIsLoading(false);
      if (res.success && res.user) {
        onLoginSuccess(res.user);
      } else {
        setErrorMessage(res.error || 'Đăng nhập không thành công. Vui lòng kiểm tra lại thông tin.');
      }
    } catch (err: any) {
      setIsLoading(false);
      setErrorMessage(err?.message || 'Có lỗi xảy ra khi gọi API đăng nhập.');
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'facebook' | 'apple') => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await socialLoginApi(provider);
      setIsLoading(false);
      if (res.success && res.user) {
        onLoginSuccess(res.user);
      } else {
        setErrorMessage(res.error || 'Đăng nhập xã hội không thành công.');
      }
    } catch (err: any) {
      setIsLoading(false);
      setErrorMessage(err?.message || 'Có lỗi xảy ra khi xác thực tài khoản.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-hidden animate-fadeIn">
      {/* Background Overlay with Forest Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-all duration-700"
        style={{ backgroundImage: `url(${forestBgImg})` }}
      >
        <div className="absolute inset-0 bg-black/45 backdrop-blur-xs" />
      </div>

      {/* Close Modal Button - only if isDismissible */}
      {isDismissible && onClose && (
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 sm:top-5 sm:right-5 z-20 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/40 hover:bg-black/70 text-white/80 hover:text-white flex items-center justify-center transition-colors border border-white/20 shadow-lg cursor-pointer"
          title="Đóng"
        >
          <i className="fa-solid fa-xmark text-lg sm:text-xl"></i>
        </button>
      )}

      {/* Centered Glass Card - Compact strictly non-scrolling design */}
      <div className="relative z-10 w-full max-w-[420px] bg-white/90 backdrop-blur-xl border border-white/80 rounded-2xl sm:rounded-3xl shadow-2xl p-5 sm:p-6 text-slate-800 transition-all flex flex-col justify-center overflow-hidden">
        {/* Title & Subtitle Header */}
        <div className="text-center mb-2.5 sm:mb-3">
          <div className="inline-block px-2.5 py-0.5 rounded-full bg-amber-100/80 border border-amber-300 text-[10px] uppercase font-bold tracking-widest text-amber-900 mb-1">
            Boko Bookstore Gateway
          </div>
          <h2 className="font-display font-serif text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 mb-0.5">
            {mode === 'login' && 'Welcome Back'}
            {mode === 'signup' && 'Create Account'}
            {mode === 'forgot' && 'Reset Password'}
          </h2>
          <p className="text-[11px] sm:text-xs font-body text-slate-600 max-w-xs mx-auto leading-tight">
            {mode === 'login' && 'Đăng nhập để vào trang chủ & khám phá tủ sách.'}
            {mode === 'signup' && 'Tạo tài khoản để lưu trữ tủ sách cá nhân.'}
            {mode === 'forgot' && 'Nhập email để nhận đường dẫn đặt lại mật khẩu.'}
          </p>
        </div>

        {/* Mock Account Fast-Fill Helper Banner (Only in Login Mode) */}
        {mode === 'login' && (
          <div className="mb-2.5 p-2 rounded-xl bg-amber-500/10 border border-amber-600/20 text-slate-800 flex items-center justify-between gap-2 shadow-2xs">
            <div className="text-[10px] sm:text-[11px] leading-tight">
              <div className="font-bold text-amber-950 flex items-center gap-1">
                <i className="fa-solid fa-key text-amber-800 text-[11px]"></i>
                <span>Tài khoản dùng thử:</span>
              </div>
              <div className="text-slate-600 mt-0.5">
                <span className="font-mono font-semibold text-slate-900">test_user</span> hoặc <span className="font-mono font-semibold text-slate-900">test@gmail.com</span> / <span className="font-mono font-semibold text-slate-900">testpass</span>
              </div>
            </div>
            <button
              type="button"
              onClick={handleFillMockAccount}
              className="px-2.5 py-1 rounded-lg bg-[#8c6d62] hover:bg-[#785b51] text-white text-[10px] font-bold tracking-wide uppercase shadow-xs shrink-0 cursor-pointer transition-all active:scale-95"
            >
              Điền nhanh
            </button>
          </div>
        )}

        {/* Error / Success Feedback */}
        {errorMessage && (
          <div className="mb-2.5 p-2 rounded-lg bg-red-500/10 border border-red-500/30 text-red-700 text-[11px] font-medium flex items-center gap-2">
            <i className="fa-solid fa-circle-exclamation text-xs shrink-0"></i>
            <span className="leading-tight">{errorMessage}</span>
          </div>
        )}

        {successInfo && (
          <div className="mb-2.5 p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 text-[11px] font-medium flex items-center gap-2">
            <i className="fa-solid fa-circle-check text-xs shrink-0"></i>
            <span className="leading-tight">{successInfo}</span>
          </div>
        )}

        {/* Form Body - Compact without scrolling */}
        <form onSubmit={handleSubmit} className="space-y-2 sm:space-y-2.5">
          {/* Full Name (Sign Up only) */}
          {mode === 'signup' && (
            <div>
              <label className="block text-[10px] uppercase tracking-wider font-bold text-slate-600 mb-0.5">
                HỌ VÀ TÊN
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nhập họ và tên..."
                className="w-full px-3 py-1.5 sm:py-2 rounded-xl bg-white/90 border border-slate-200/90 text-slate-900 text-xs placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-700/40 focus:border-amber-700 shadow-2xs transition-all"
              />
            </div>
          )}

          {/* Email / Username */}
          <div>
            <label className="block text-[10px] uppercase tracking-wider font-bold text-slate-600 mb-0.5">
              USERNAME / EMAIL
            </label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={mode === 'signup' ? 'email@example.com' : 'test_user hoặc test@gmail.com'}
              className="w-full px-3 py-1.5 sm:py-2 rounded-xl bg-white/90 border border-slate-200/90 text-slate-900 text-xs placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-700/40 focus:border-amber-700 shadow-2xs transition-all"
            />
          </div>

          {/* Password (Login and Signup) */}
          {mode !== 'forgot' && (
            <div>
              <label className="block text-[10px] uppercase tracking-wider font-bold text-slate-600 mb-0.5">
                MẬT KHẨU
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-1.5 sm:py-2 pr-9 rounded-xl bg-white/90 border border-slate-200/90 text-slate-900 text-xs placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-700/40 focus:border-amber-700 shadow-2xs transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
                >
                  {showPassword ? (
                    <i className="fa-solid fa-eye-slash text-xs"></i>
                  ) : (
                    <i className="fa-solid fa-eye text-xs"></i>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Confirm Password (Sign Up only) */}
          {mode === 'signup' && (
            <div>
              <label className="block text-[10px] uppercase tracking-wider font-bold text-slate-600 mb-0.5">
                XÁC NHẬN MẬT KHẨU
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-1.5 sm:py-2 rounded-xl bg-white/90 border border-slate-200/90 text-slate-900 text-xs placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-700/40 focus:border-amber-700 shadow-2xs transition-all"
              />
            </div>
          )}

          {/* Forgot Password Link */}
          {mode === 'login' && (
            <div className="text-right">
              <button
                type="button"
                onClick={() => {
                  setMode('forgot');
                  setErrorMessage(null);
                  setSuccessInfo(null);
                }}
                className="text-[11px] font-semibold text-amber-900 hover:text-amber-700 hover:underline transition-colors cursor-pointer"
              >
                Quên mật khẩu?
              </button>
            </div>
          )}

          {/* Primary Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 px-5 rounded-xl bg-[#8c6d62] hover:bg-[#785b51] active:bg-[#674b41] text-white font-bold text-xs tracking-wider uppercase shadow-md transition-all flex items-center justify-center gap-2 mt-1 cursor-pointer"
          >
            {isLoading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>ĐANG XỬ LÝ...</span>
              </>
            ) : (
              <span>
                {mode === 'login' && 'ĐĂNG NHẬP'}
                {mode === 'signup' && 'TẠO TÀI KHOẢN'}
                {mode === 'forgot' && 'GỬI YÊU CẦU'}
              </span>
            )}
          </button>
        </form>

        {/* Social Logins Divider & Buttons */}
        {mode !== 'forgot' && (
          <div className="mt-2.5 pt-2 sm:mt-3 sm:pt-2.5 border-t border-slate-200/80 text-center">
            {/* Direct Google OAuth Login Button */}
            <button
              type="button"
              onClick={() => handleSocialLogin('google')}
              disabled={isLoading}
              className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 shadow-2xs flex items-center justify-center gap-2.5 transition-all hover:border-slate-400 active:scale-[0.98] cursor-pointer mb-2.5 group text-slate-700 font-semibold text-xs"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Tiếp tục bằng Google (OAuth)</span>
            </button>

            <span className="text-[10px] sm:text-[11px] font-medium text-slate-400 block mb-2">
              Hoặc các phương thức khác
            </span>

            <div className="flex items-center justify-center gap-3">
              {/* Facebook Button */}
              <button
                type="button"
                onClick={() => handleSocialLogin('facebook')}
                disabled={isLoading}
                title="Đăng nhập bằng Facebook"
                className="w-9 h-9 rounded-xl bg-[#1877F2] hover:bg-[#166fe5] text-white shadow-xs flex items-center justify-center transition-all hover:scale-105 active:scale-95 cursor-pointer"
              >
                <i className="fa-brands fa-facebook-f text-sm"></i>
              </button>

              {/* Apple Button */}
              <button
                type="button"
                onClick={() => handleSocialLogin('apple')}
                disabled={isLoading}
                title="Đăng nhập bằng Apple ID"
                className="w-9 h-9 rounded-xl bg-slate-900 hover:bg-black text-white shadow-xs flex items-center justify-center transition-all hover:scale-105 active:scale-95 cursor-pointer"
              >
                <i className="fa-brands fa-apple text-sm"></i>
              </button>
            </div>
          </div>
        )}

        {/* Footer Toggle (Sign Up <-> Login) */}
        <div className="mt-2.5 sm:mt-3 text-center text-xs font-body text-slate-600">
          {mode === 'login' && (
            <p>
              Chưa có tài khoản?{' '}
              <button
                type="button"
                onClick={() => {
                  setMode('signup');
                  setErrorMessage(null);
                  setSuccessInfo(null);
                }}
                className="font-bold text-amber-900 hover:text-amber-700 hover:underline ml-1 cursor-pointer"
              >
                Đăng ký ngay
              </button>
            </p>
          )}

          {mode === 'signup' && (
            <p>
              Đã có tài khoản?{' '}
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setErrorMessage(null);
                  setSuccessInfo(null);
                }}
                className="font-bold text-amber-900 hover:text-amber-700 hover:underline ml-1 cursor-pointer"
              >
                Đăng nhập
              </button>
            </p>
          )}

          {mode === 'forgot' && (
            <p>
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setErrorMessage(null);
                  setSuccessInfo(null);
                }}
                className="font-bold text-amber-900 hover:text-amber-700 hover:underline ml-1 cursor-pointer"
              >
                Quay lại Đăng nhập
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

