import React, { useState, useEffect } from 'react';
import { User, ShippingAddress } from '../types';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onUpdateUser: (updatedUser: User) => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  user,
  onUpdateUser
}) => {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [province, setProvince] = useState('');
  const [ward, setWard] = useState('');
  const [streetAddress, setStreetAddress] = useState('');

  const [toastMsg, setToastMsg] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      const addr = user.shippingAddress;
      setFullName(addr?.fullName || user.name || '');
      setPhone(addr?.phone || '');
      setProvince(addr?.province || 'Hà Nội');
      setWard(addr?.ward || '');
      setStreetAddress(addr?.streetAddress || '');
    }
  }, [user, isOpen]);

  if (!isOpen || !user) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    const newAddress: ShippingAddress = {
      fullName: fullName.trim() || user.name,
      phone: phone.trim(),
      province: province.trim(),
      ward: ward.trim(),
      streetAddress: streetAddress.trim()
    };

    const updatedUser: User = {
      ...user,
      shippingAddress: newAddress
    };

    onUpdateUser(updatedUser);
    setToastMsg('Đã lưu địa chỉ nhận hàng thành công!');

    setTimeout(() => {
      setToastMsg(null);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/50 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden text-slate-800 my-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-950 via-amber-900 to-amber-950 p-6 text-amber-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-amber-800/80 border border-amber-500/40 p-0.5 shadow-md flex items-center justify-center overflow-hidden">
              {user.avatarUrl ? (
                <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover rounded-full" />
              ) : (
                <span className="text-lg font-bold text-amber-100">{user.name.charAt(0)}</span>
              )}
            </div>
            <div>
              <h3 className="font-display text-xl font-bold tracking-tight text-white">{user.name}</h3>
              <p className="text-xs text-amber-200/80 font-body">{user.email}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-amber-900/60 hover:bg-amber-800 text-amber-200 hover:text-white flex items-center justify-center transition-colors border border-amber-700/50 cursor-pointer"
            title="Đóng"
          >
            <i className="fa-solid fa-xmark text-base"></i>
          </button>
        </div>

        {/* Content Body */}
        <form onSubmit={handleSave} className="p-6 sm:p-8 space-y-5 max-h-[80vh] overflow-y-auto">
          {toastMsg && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-fadeIn">
              <i className="fa-solid fa-circle-check text-emerald-600 text-sm"></i>
              <span>{toastMsg}</span>
            </div>
          )}

          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h4 className="font-display font-bold text-base text-slate-900 flex items-center gap-2">
                <i className="fa-solid fa-truck-fast text-amber-700 text-base"></i>
                <span>Địa Chỉ Nhận Hàng Mặc Định</span>
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Cấu hình thông tin giao hàng để tự động điền khi thanh toán.
              </p>
            </div>
          </div>

          <div className="space-y-4 pt-1">
            {/* Tên người nhận */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Tên người nhận <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Ví dụ: Nguyễn Văn A"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-body text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-800/30 focus:border-amber-800"
              />
            </div>

            {/* Số điện thoại */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Số điện thoại liên hệ <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Ví dụ: 0912 345 678"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-body text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-800/30 focus:border-amber-800"
              />
            </div>

            {/* Tỉnh / Thành phố & Phường / Xã */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Tỉnh / Thành phố <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={province}
                  onChange={(e) => setProvince(e.target.value)}
                  placeholder="Ví dụ: TP. Hồ Chí Minh / Hà Nội"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-body text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-800/30 focus:border-amber-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Phường / Xã / Quận / Huyện <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={ward}
                  onChange={(e) => setWard(e.target.value)}
                  placeholder="Ví dụ: Phường Bến Nghé, Quận 1"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-body text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-800/30 focus:border-amber-800"
                />
              </div>
            </div>

            {/* Tên đường / Tòa nhà / Số nhà */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Tên đường / Tòa nhà / Số nhà <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={2}
                required
                value={streetAddress}
                onChange={(e) => setStreetAddress(e.target.value)}
                placeholder="Ví dụ: Số 123 Đường Đồng Khởi, Tòa nhà Vincom"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-body text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-800/30 focus:border-amber-800 resize-none"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-amber-900 hover:bg-amber-800 active:bg-amber-950 text-amber-50 font-semibold text-xs transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
            >
              <i className="fa-solid fa-floppy-disk text-sm"></i>
              <span>Lưu Thông Tin Địa Chỉ</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
