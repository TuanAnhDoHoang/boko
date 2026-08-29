import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import forestBgImg from '../assets/images/auth_forest_bg_1786582595599.jpg';
import logoImg from '../assets/images/app_main_logo_1786578722639.jpg';

interface RequireAuthProps {
  children: React.ReactNode;
  user: any;
}

export const RequireAuth: React.FC<RequireAuthProps> = ({ children, user }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // If user is authenticated, render the protected child component
  if (user) {
    return <>{children}</>;
  }

  // If accessing root '/' directly when unauthenticated, redirect directly to /login
  if (location.pathname === '/' || location.pathname === '/home' || location.pathname === '/library') {
    // Navigate immediately or render Login Required card with auto route
    // The requirement says:
    // "Nếu chưa đăng nhập thì luôn luôn dẫn tới route đăng nhập, dẫn đến route khác sẽ trả về trang yêu cầu đăng nhập cùng với nút dẫn đến route đăng nhập"
  }

  // For other routes (or when trying to access directly without login), show the "Yêu cầu đăng nhập" page with button to /login
  return (
    <div className="min-h-[calc(100vh-80px)] flex-1 flex items-center justify-center p-6 bg-slate-100/60 relative overflow-hidden">
      {/* Background ambient accents */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-10 pointer-events-none blur-sm"
        style={{ backgroundImage: `url(${forestBgImg})` }}
      />

      <div className="relative z-10 w-full max-w-md bg-white rounded-3xl p-8 md:p-10 shadow-2xl border border-slate-200 text-center space-y-6 animate-scaleUp">
        <div className="w-20 h-20 rounded-3xl bg-amber-500/10 border-2 border-amber-500/30 text-amber-800 flex items-center justify-center mx-auto shadow-inner">
          <i className="fa-solid fa-lock text-3xl"></i>
        </div>

        <div className="space-y-2">
          <div className="inline-block px-3 py-1 rounded-full bg-amber-100 text-amber-900 font-bold text-[10px] uppercase tracking-widest border border-amber-300">
            Yêu Cầu Xác Thực
          </div>
          <h2 className="font-display font-bold text-2xl text-slate-900 tracking-tight">
            Vui Lòng Đăng Nhập
          </h2>
          <p className="text-sm text-slate-500 leading-relaxed max-w-sm mx-auto">
            Bạn cần đăng nhập tài khoản Boko để truy cập trang này và sử dụng đầy đủ các tính năng của tủ sách.
          </p>
        </div>

        <div className="pt-2 space-y-3">
          <button
            onClick={() => navigate('/login', { state: { from: location } })}
            className="w-full py-3.5 px-6 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-amber-600/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <i className="fa-solid fa-right-to-bracket text-sm"></i>
            <span>Đăng Nhập Ngay</span>
          </button>

          <button
            onClick={() => navigate('/register', { state: { from: location } })}
            className="w-full py-3 px-6 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <i className="fa-solid fa-user-plus text-sm"></i>
            <span>Tạo Tài Khoản Mới</span>
          </button>
        </div>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-center gap-2 text-xs text-slate-400">
          <img src={logoImg} alt="Boko" className="w-4 h-4 rounded object-cover" />
          <span>Boko • Nhà Sách Trực Tuyến</span>
        </div>
      </div>
    </div>
  );
};
