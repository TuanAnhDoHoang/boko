import React, { useState } from 'react';
import { Book, Currency } from '../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  books: Book[];
  onSelectBook: (book: Book) => void;
  currency: Currency;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  books,
  onSelectBook,
  currency
}) => {
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const filteredBooks = books.filter(
    (b) =>
      b.title.toLowerCase().includes(query.toLowerCase()) ||
      b.author.toLowerCase().includes(query.toLowerCase()) ||
      b.category.toLowerCase().includes(query.toLowerCase()) ||
      (b.brandName && b.brandName.toLowerCase().includes(query.toLowerCase())) ||
      (b.publisher && b.publisher.toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-start justify-center pt-16 sm:pt-24 px-4 animate-fadeIn">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden border border-slate-200">
        {/* Search Bar Input */}
        <div className="p-4 sm:p-6 border-b border-slate-200 bg-slate-50 flex items-center gap-3">
          <i className="fa-solid fa-magnifying-glass text-xl text-blue-600"></i>
          <input
            type="text"
            autoFocus
            placeholder="Tìm sách, tác giả, nhà xuất bản, gian hàng (Nhã Nam, Fahasa, Kim Đồng)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent border-none text-base sm:text-lg text-slate-900 placeholder:text-slate-400 focus:ring-0 focus:outline-none font-body"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 hover:bg-slate-200/60 rounded-full text-slate-500 cursor-pointer"
            >
              <i className="fa-solid fa-xmark text-base"></i>
            </button>
          )}
          <button
            onClick={onClose}
            className="ml-2 font-label-caps text-xs text-slate-500 uppercase hover:text-slate-900 font-semibold cursor-pointer"
          >
            Đóng
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-[60vh] overflow-y-auto p-4 sm:p-6 space-y-3">
          {filteredBooks.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <p className="font-body text-base">Không tìm thấy sách phù hợp với "{query}"</p>
            </div>
          ) : (
            filteredBooks.map((book) => {
              const formattedPrice =
                currency === 'EUR'
                  ? `€ ${book.priceEUR.toFixed(2)}`
                  : `${book.priceVND.toLocaleString('vi-VN')} ₫`;

              return (
                <div
                  key={book.id}
                  onClick={() => {
                    onSelectBook(book);
                    onClose();
                  }}
                  className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer group border border-transparent hover:border-slate-200"
                >
                  <div className="w-12 h-16 shrink-0 bg-slate-100 rounded-md overflow-hidden book-spine-shadow border border-slate-200">
                    {book.coverUrl ? (
                      <img src={book.coverUrl} alt={book.title} className="w-full h-full object-cover" />
                    ) : (
                      <div
                        style={{ backgroundColor: book.bgColor || '#334155' }}
                        className="w-full h-full flex items-center justify-center p-1 text-[7px] text-white font-bold text-center"
                      >
                        {book.title}
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700">
                        {book.category}
                      </span>
                      {book.brandName && (
                        <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <i className="fa-solid fa-circle-check text-[10px]"></i>
                          <span>{book.brandName}</span>
                        </span>
                      )}
                    </div>
                    <h4 className="font-display font-bold text-base text-slate-900 group-hover:text-blue-600 truncate mt-1">
                      {book.title}
                    </h4>
                    <p className="font-body text-xs text-slate-500">{book.author} {book.editionType ? `• ${book.editionType}` : ''}</p>
                  </div>

                  <div className="font-body font-bold text-sm text-slate-900 shrink-0">
                    {formattedPrice}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
