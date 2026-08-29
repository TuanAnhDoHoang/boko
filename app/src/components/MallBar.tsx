import React, { useRef, useState, useEffect } from 'react';
import { OFFICIAL_BRANDS } from '../data/brands';

interface MallBarProps {
  selectedBrandId: string | null;
  onSelectBrand: (brandId: string | null) => void;
  filteredBooksCount?: number;
}

export const MallBar: React.FC<MallBarProps> = ({
  selectedBrandId,
  onSelectBrand,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Drag to scroll state & refs
  const [isMouseDown, setIsMouseDown] = useState(false);
  const startXRef = useRef<number>(0);
  const scrollLeftRef = useRef<number>(0);
  const hasDraggedRef = useRef<boolean>(false);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -260 : 260;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!scrollRef.current) return;
    setIsMouseDown(true);
    hasDraggedRef.current = false;
    startXRef.current = e.pageX - scrollRef.current.offsetLeft;
    scrollLeftRef.current = scrollRef.current.scrollLeft;
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isMouseDown || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startXRef.current) * 1.5; // Drag speed multiplier

    if (Math.abs(walk) > 4) {
      hasDraggedRef.current = true;
    }

    scrollRef.current.scrollLeft = scrollLeftRef.current - walk;
  };

  const handleMouseUpOrLeave = () => {
    setIsMouseDown(false);
  };

  // Prevent accidental selection click if user was dragging
  const handleItemClick = (callback: () => void) => {
    if (hasDraggedRef.current) {
      hasDraggedRef.current = false;
      return;
    }
    callback();
  };

  useEffect(() => {
    const handleGlobalMouseUp = () => {
      setIsMouseDown(false);
    };
    window.addEventListener('mouseup', handleGlobalMouseUp);
    return () => {
      window.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, []);

  return (
    <div className="w-full max-w-[1700px] mx-auto px-2 sm:px-4 md:px-8 mb-6">
      {/* Section Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3 px-2">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-600/10 border border-blue-600/30 flex items-center justify-center text-blue-600">
            <i className="fa-solid fa-shop text-sm"></i>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-display font-bold text-base md:text-lg text-slate-900 leading-tight">
                Mall
              </h2>
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] text-slate-400">
                <i className="fa-solid fa-arrows-left-right text-[10px]"></i>
                <span>Kéo thả chuột để lướt</span>
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Chọn thương hiệu để lọc danh mục sách và tự động chuyển đổi tủ sách
            </p>
          </div>
        </div>

        {/* Scroll Controls */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => scroll('left')}
            className="w-8 h-8 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 flex items-center justify-center transition-colors shadow-2xs cursor-pointer"
            title="Cuộn sang trái"
          >
            <i className="fa-solid fa-chevron-left text-xs"></i>
          </button>
          <button
            onClick={() => scroll('right')}
            className="w-8 h-8 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 flex items-center justify-center transition-colors shadow-2xs cursor-pointer"
            title="Cuộn sang phải"
          >
            <i className="fa-solid fa-chevron-right text-xs"></i>
          </button>
        </div>
      </div>

      {/* Horizontal Mall Storefronts with Drag-to-Scroll */}
      <div className="relative">
        <div
          ref={scrollRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUpOrLeave}
          onMouseLeave={handleMouseUpOrLeave}
          className={`flex overflow-x-auto hide-scrollbar gap-2.5 sm:gap-3 py-1.5 px-1 select-none transition-all ${
            isMouseDown ? 'cursor-grabbing select-none' : 'cursor-grab'
          }`}
        >
          {/* "TẤT CẢ MALL" Option */}
          <div
            onClick={() => handleItemClick(() => onSelectBrand(null))}
            className={`flex-none w-[170px] sm:w-[185px] p-3.5 rounded-2xl cursor-pointer transition-all duration-300 border flex flex-col justify-between relative select-none group ${
              selectedBrandId === null
                ? 'bg-gradient-to-b from-amber-950 via-slate-900 to-amber-950 text-white border-amber-500 shadow-md ring-2 ring-amber-400/40'
                : 'bg-white border-slate-200 hover:border-amber-300 hover:bg-amber-50/20 text-slate-800 shadow-2xs'
            }`}
          >
            {/* Top row */}
            <div className="flex items-center justify-between mb-2 pointer-events-none">
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  selectedBrandId === null
                    ? 'bg-amber-500/30 text-amber-200 border border-amber-400/40'
                    : 'bg-slate-100 text-slate-700 border border-slate-200'
                }`}
              >
                Tất Cả
              </span>
              <span className="w-3.5 h-3.5 rounded-full bg-amber-900 border border-amber-600 shadow-2xs" title="Gỗ Gụ Cổ Điển"></span>
            </div>

            {/* Middle: Name */}
            <div className="my-1 pointer-events-none">
              <h3 className="font-display font-bold text-xs sm:text-sm truncate leading-tight">
                Toàn Bộ Tác Phẩm
              </h3>
              <p
                className={`text-[11px] truncate mt-0.5 font-medium ${
                  selectedBrandId === null ? 'text-amber-300' : 'text-slate-500'
                }`}
              >
                Tất cả nhà sách & NXB
              </p>
            </div>
          </div>

          {/* Individual Mall Stores */}
          {OFFICIAL_BRANDS.map((brand) => {
            const isSelected = selectedBrandId === brand.id;

            return (
              <div
                key={brand.id}
                onClick={() => handleItemClick(() => onSelectBrand(isSelected ? null : brand.id))}
                className={`flex-none w-[180px] sm:w-[195px] p-3.5 rounded-2xl cursor-pointer transition-all duration-300 border flex flex-col justify-between relative select-none group ${
                  isSelected
                    ? 'bg-gradient-to-b from-slate-900 via-amber-950 to-slate-950 text-white border-amber-500 shadow-lg ring-2 ring-amber-400/40'
                    : 'bg-white border-slate-200 hover:border-amber-300 hover:bg-amber-50/20 text-slate-800 shadow-2xs'
                }`}
              >
                {/* Top Row: Type Badge & Material Color Swatch */}
                <div className="flex items-center justify-between mb-2 pointer-events-none">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isSelected
                        ? 'bg-amber-500/30 text-amber-200 border border-amber-400/40'
                        : brand.type === 'publisher'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-blue-50 text-blue-700 border border-blue-200'
                    }`}
                  >
                    {brand.type === 'publisher' ? 'NXB' : 'Nhà Sách'}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`w-3.5 h-3.5 rounded-full border shadow-2xs ${brand.woodColorDot}`}
                      title={brand.woodMaterialName}
                    ></span>
                    <span className="text-[10px] font-semibold text-amber-500 flex items-center">
                      ★ {brand.rating}
                    </span>
                  </div>
                </div>

                {/* Middle: Brand Title & Type */}
                <div className="my-1 pointer-events-none">
                  <div className="flex items-center gap-1">
                    <h3 className="font-display font-bold text-xs sm:text-sm truncate leading-tight group-hover:text-amber-500 transition-colors">
                      {brand.shortName}
                    </h3>
                    {brand.verified && (
                      <i className="fa-solid fa-circle-check text-blue-500 text-[10px]"></i>
                    )}
                  </div>
                  <p
                    className={`text-[11px] truncate mt-0.5 font-medium ${
                      isSelected ? 'text-amber-300' : 'text-slate-500'
                    }`}
                  >
                    {brand.typeLabel}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
