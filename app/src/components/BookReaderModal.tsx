import React, { useState } from 'react';
import { Book, Currency } from '../types';

interface BookReaderModalProps {
  book: Book | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (book: Book) => void;
  currency: Currency;
}

export const BookReaderModal: React.FC<BookReaderModalProps> = ({
  book,
  isOpen,
  onClose,
  onAddToCart,
  currency
}) => {
  const [currentSpread, setCurrentSpread] = useState<number>(1);
  const totalSpreads = 2;

  if (!isOpen || !book) return null;

  const formattedPrice =
    currency === 'EUR'
      ? `€ ${book.priceEUR.toFixed(2)}`
      : `${book.priceVND.toLocaleString('vi-VN')} ₫`;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 md:p-12 animate-fadeIn">
      <div className="bg-white w-full max-w-5xl h-[88vh] rounded-2xl shadow-2xl relative flex flex-col overflow-hidden border border-slate-200">
        {/* Modal Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-slate-200 text-slate-900 bg-slate-50 z-20">
          <div className="flex items-center gap-3">
            <span className="font-label-caps text-xs tracking-widest uppercase font-bold text-blue-600">
              ĐỌC THỬ TRỰC TUYẾN
            </span>
            <span className="text-slate-300 text-sm">•</span>
            <span className="font-display font-semibold text-sm sm:text-base text-slate-900 truncate max-w-[200px] sm:max-w-xs">
              {book.title}
            </span>
            {book.brandName && (
              <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                <i className="fa-solid fa-circle-check text-blue-500 text-xs"></i>
                <span>{book.brandName}</span>
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-200/60 text-slate-600 transition-colors flex items-center justify-center cursor-pointer w-8 h-8"
            title="Đóng"
          >
            <i className="fa-solid fa-xmark text-lg"></i>
          </button>
        </div>

        {/* Modal Content - Book Spread View */}
        <div className="flex-1 relative overflow-hidden bg-slate-50 flex flex-col md:flex-row">
          {/* Central Book Spine Shadow in Spread */}
          <div className="hidden md:block absolute inset-y-0 left-1/2 w-12 -ml-6 bg-gradient-to-r from-transparent via-slate-200/50 to-transparent pointer-events-none z-10"></div>

          {/* SPREAD 1 (Pages 1 & 2) */}
          {currentSpread === 1 && (
            <div className="flex-1 flex flex-col md:flex-row w-full h-full overflow-hidden">
              {/* Page 1 (Left) */}
              <div className="w-full md:w-1/2 h-full p-5 sm:p-8 lg:p-10 md:pr-12 border-b md:border-b-0 md:border-r border-slate-200 text-slate-900 flex flex-col justify-start overflow-hidden">
                <div className="mb-4 md:mb-6 text-center shrink-0">
                  <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold block mb-1">
                    TRANG 1
                  </span>
                  <h1 className="font-display text-xl md:text-2xl font-bold text-slate-900">
                    {book.sampleChapters.title}
                  </h1>
                </div>
                <div className="space-y-3 md:space-y-4 font-body text-sm md:text-base text-slate-700 leading-relaxed overflow-hidden flex-1">
                  {book.sampleChapters.page1.map((p, idx) => (
                    <p key={idx} className="indent-4">
                      {p}
                    </p>
                  ))}
                </div>
              </div>

              {/* Page 2 (Right) */}
              <div className="w-full md:w-1/2 h-full p-5 sm:p-8 lg:p-10 md:pl-12 text-slate-900 flex flex-col justify-start overflow-hidden">
                <div className="mb-4 md:mb-6 text-center shrink-0">
                  <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold block mb-1">
                    TRANG 2
                  </span>
                </div>
                <div className="space-y-3 md:space-y-4 font-body text-sm md:text-base text-slate-700 leading-relaxed overflow-hidden flex-1">
                  {book.sampleChapters.page2.map((p, idx) => (
                    <p key={idx} className="indent-4">
                      {p}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* SPREAD 2 (Page 3 & Paywall Page 4) */}
          {currentSpread === 2 && (
            <div className="flex-1 flex flex-col md:flex-row w-full h-full overflow-hidden">
              {/* Page 3 (Left) */}
              <div className="w-full md:w-1/2 h-full p-5 sm:p-8 lg:p-10 md:pr-12 border-b md:border-b-0 md:border-r border-slate-200 text-slate-900 flex flex-col justify-start overflow-hidden">
                <div className="mb-4 md:mb-6 text-center shrink-0">
                  <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold block mb-1">
                    TRANG 3
                  </span>
                </div>
                <div className="space-y-3 md:space-y-4 font-body text-sm md:text-base text-slate-700 leading-relaxed overflow-hidden flex-1">
                  {book.sampleChapters.page3.map((p, idx) => (
                    <p key={idx} className="indent-4">
                      {p}
                    </p>
                  ))}
                </div>
              </div>

              {/* Page 4 - Paywall / Purchase Prompt (Right) */}
              <div className="w-full md:w-1/2 h-full p-5 sm:p-8 lg:p-10 flex flex-col items-center justify-center text-center text-slate-900 overflow-y-auto">
                <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mb-3 shadow-xs">
                  <i className="fa-solid fa-lock text-blue-600 text-xl"></i>
                </div>
                <h2 className="font-display text-lg md:text-xl font-bold mb-1 text-slate-900">
                  Mua sách để tiếp tục đọc
                </h2>
                <p className="font-body text-xs text-slate-500 mb-4 max-w-sm leading-relaxed">
                  Bạn đã đọc hết phần đọc thử. Đặt mua trực tiếp từ gian hàng đối tác chính hãng để nhận sách nguyên bọc màng co.
                </p>

                {/* B2C Book Specifications & Seller Box */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 w-full max-w-sm text-left mb-4 text-xs space-y-1.5 shadow-2xs">
                  <div className="flex justify-between items-center text-slate-700">
                    <span className="text-slate-500">Gian hàng:</span>
                    <span className="font-bold text-blue-700 flex items-center gap-1">
                      <i className="fa-solid fa-circle-check text-blue-500 text-xs"></i>
                      {book.brandName || 'Boko Official'}
                    </span>
                  </div>
                  {book.publisher && (
                    <div className="flex justify-between items-center text-slate-700">
                      <span className="text-slate-500">Nhà xuất bản:</span>
                      <span className="font-medium text-slate-800">{book.publisher}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center text-slate-700">
                    <span className="text-slate-500">Định dạng:</span>
                    <span className="font-medium text-slate-800">{book.editionType || 'Bìa Mềm Tiêu Chuẩn'}</span>
                  </div>
                  {book.isbn && (
                    <div className="flex justify-between items-center text-slate-700">
                      <span className="text-slate-500">Mã ISBN:</span>
                      <span className="font-mono text-slate-800">{book.isbn}</span>
                    </div>
                  )}
                </div>

                {/* Price & Add to cart button */}
                <div className="bg-white p-4 rounded-xl border border-slate-200 w-full max-w-sm shadow-xs">
                  <div className="flex justify-between items-center mb-3 pb-2.5 border-b border-slate-100">
                    <div>
                      <span className="font-body text-xs font-semibold text-slate-600 block">Giá bán B2C:</span>
                      {book.originalPriceVND && currency === 'VND' && (
                        <span className="text-[11px] text-slate-400 line-through">
                          {book.originalPriceVND.toLocaleString('vi-VN')} ₫
                        </span>
                      )}
                    </div>
                    <div className="text-right">
                      <span className="font-display font-bold text-lg text-blue-600">{formattedPrice}</span>
                      {book.discountPercent && book.discountPercent > 0 && (
                        <span className="ml-1 text-[10px] font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded-sm border border-red-200">
                          -{book.discountPercent}%
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      onAddToCart(book);
                      onClose();
                    }}
                    className="bg-blue-600 hover:bg-blue-700 w-full text-white py-3 px-4 rounded-lg font-label-caps text-xs tracking-wider uppercase font-bold flex items-center justify-center gap-2 shadow-md shadow-blue-200 transition-all cursor-pointer"
                  >
                    <i className="fa-solid fa-cart-shopping text-sm"></i>
                    <span>THÊM VÀO GIỎ / MUA NGAY</span>
                  </button>
                  <p className="text-[10px] text-slate-400 text-center mt-2 flex items-center justify-center gap-1.5">
                    <i className="fa-solid fa-circle-check text-emerald-600 text-xs"></i>
                    Cam kết 100% sách chính hãng • Đổi trả trong 7 ngày
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer / Spread Pagination */}
        <div className="p-4 border-t border-slate-200 flex justify-between items-center bg-slate-50 z-20">
          <button
            disabled={currentSpread === 1}
            onClick={() => setCurrentSpread(1)}
            className={`flex items-center gap-2 font-label-caps text-xs font-bold tracking-wider transition-opacity ${
              currentSpread === 1
                ? 'text-slate-300 cursor-not-allowed'
                : 'text-slate-700 hover:text-blue-600 cursor-pointer'
            }`}
          >
            <i className="fa-solid fa-chevron-left text-xs"></i>
            <span>TRANG TRƯỚC</span>
          </button>

          <div className="font-body text-xs sm:text-sm text-slate-500 font-medium">
            Trang <span className="font-bold text-slate-900">{currentSpread === 1 ? '1 - 2' : '3 - 4'}</span> / 4
          </div>

          <button
            disabled={currentSpread === totalSpreads}
            onClick={() => setCurrentSpread(2)}
            className={`flex items-center gap-2 font-label-caps text-xs font-bold tracking-wider transition-opacity ${
              currentSpread === totalSpreads
                ? 'text-slate-300 opacity-0 pointer-events-none'
                : 'text-slate-700 hover:text-blue-600 cursor-pointer'
            }`}
          >
            <span>TRANG TIẾP</span>
            <i className="fa-solid fa-chevron-right text-xs"></i>
          </button>
        </div>
      </div>
    </div>
  );
};
