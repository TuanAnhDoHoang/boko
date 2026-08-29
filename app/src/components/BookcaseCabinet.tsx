import React, { useState } from 'react';
import logoImg from '../assets/images/app_main_logo_1786578722639.jpg';
import { OFFICIAL_BRANDS } from '../data/brands';

export type CabinetTheme =
  | 'mahogany' // Tất cả Mall (Classic Mahogany)
  | 'oak' // Nhã Nam (Warm Honey Oak)
  | 'rosewood' // Fahasa (Heritage Rosewood)
  | 'forest' // NXB Trẻ (Forest Green Teak)
  | 'pine' // NXB Kim Đồng (Golden Amber Pine)
  | 'walnut' // Phương Nam Book (Artisan Walnut)
  | 'ebony' // Đông A (Luxury Ebony & Gold)
  | 'slate'; // Alpha Books (Modern Slate)

interface BookcaseCabinetProps {
  children: React.ReactNode;
  activeCategoryFilter: string | null;
  onSelectCategory: (category: string | null) => void;
  categories: string[];
  totalBooksCount: number;
  selectedBrandId: string | null;
  onSelectBrand?: (brandId: string | null) => void;
}

export const BookcaseCabinet: React.FC<BookcaseCabinetProps> = ({
  children,
  activeCategoryFilter,
  onSelectCategory,
  categories,
  totalBooksCount,
  selectedBrandId,
  onSelectBrand,
}) => {
  const [isCabinetLightOn, setIsCabinetLightOn] = useState<boolean>(true);

  // Map each selected Mall Brand to its dedicated wood cabinet theme
  const brandToThemeMap: Record<string, CabinetTheme> = {
    'nha-nam': 'oak',
    'fahasa': 'rosewood',
    'nxb-tre': 'forest',
    'kim-dong': 'pine',
    'phuong-nam': 'walnut',
    'dong-a': 'ebony',
    'alpha-books': 'slate',
  };

  const currentThemeKey: CabinetTheme =
    selectedBrandId && brandToThemeMap[selectedBrandId]
      ? brandToThemeMap[selectedBrandId]
      : 'mahogany';

  // Comprehensive theme styling definitions for every wood material
  const themeStyles = {
    mahogany: {
      name: 'Gỗ Gụ Cổ Điển',
      tagline: 'Sang trọng & Trầm ấm Di sản',
      badgeBg: 'bg-amber-950 text-amber-200 border-amber-800/50',
      pillarBg: 'bg-gradient-to-r from-amber-950 via-amber-900 to-amber-950 border-amber-900/60',
      crownBg: 'bg-gradient-to-b from-amber-950 via-amber-900 to-amber-950 border-amber-800/80',
      plinthBg: 'bg-gradient-to-b from-amber-900 to-amber-950 border-amber-800/80',
      backboardBg: '#1c120c',
      backboardPattern: 'radial-gradient(circle at 50% 0%, rgba(217, 119, 6, 0.14) 0%, rgba(28, 18, 12, 0.98) 75%)',
      brassAccent: 'bg-gradient-to-br from-amber-300 via-yellow-500 to-amber-700 text-amber-950 border-amber-200/50',
      woodDetail: 'border-amber-800/40',
      shelfLedgeColor: 'bg-gradient-to-b from-amber-850 to-amber-950',
      dotColor: 'bg-[#78350f] border-[#d97706]'
    },
    oak: {
      name: 'Gỗ Sồi Mật Ong (Nhã Nam)',
      tagline: 'Ấm áp, mộc mạc & đậm chất văn chương',
      badgeBg: 'bg-amber-900 text-amber-100 border-amber-700/50',
      pillarBg: 'bg-gradient-to-r from-[#7c2d12] via-[#9a3412] to-[#7c2d12] border-amber-700/60',
      crownBg: 'bg-gradient-to-b from-[#7c2d12] via-[#9a3412] to-[#7c2d12] border-amber-600/80',
      plinthBg: 'bg-gradient-to-b from-[#9a3412] to-[#7c2d12] border-amber-600/80',
      backboardBg: '#2a170d',
      backboardPattern: 'radial-gradient(circle at 50% 0%, rgba(251, 191, 36, 0.18) 0%, rgba(42, 23, 13, 0.98) 75%)',
      brassAccent: 'bg-gradient-to-br from-amber-200 via-yellow-400 to-amber-600 text-amber-950 border-amber-100/50',
      woodDetail: 'border-amber-600/40',
      shelfLedgeColor: 'bg-gradient-to-b from-amber-700 to-amber-900',
      dotColor: 'bg-[#b45309] border-[#f59e0b]'
    },
    rosewood: {
      name: 'Gỗ Đỏ Di Sản (Fahasa)',
      tagline: 'Màu đỏ sẫm quý phái, đồ sộ & uy nghiêm',
      badgeBg: 'bg-rose-950 text-rose-200 border-rose-800/50',
      pillarBg: 'bg-gradient-to-r from-[#4c0519] via-[#881337] to-[#4c0519] border-rose-900/60',
      crownBg: 'bg-gradient-to-b from-[#4c0519] via-[#881337] to-[#4c0519] border-rose-800/80',
      plinthBg: 'bg-gradient-to-b from-[#881337] to-[#4c0519] border-rose-800/80',
      backboardBg: '#1f040a',
      backboardPattern: 'radial-gradient(circle at 50% 0%, rgba(244, 63, 94, 0.15) 0%, rgba(31, 4, 10, 0.98) 75%)',
      brassAccent: 'bg-gradient-to-br from-amber-300 via-yellow-500 to-amber-600 text-amber-950 border-amber-200/50',
      woodDetail: 'border-rose-800/40',
      shelfLedgeColor: 'bg-gradient-to-b from-rose-900 to-rose-950',
      dotColor: 'bg-[#881337] border-[#f43f5e]'
    },
    forest: {
      name: 'Gỗ Trầm Rừng Xanh (NXB Trẻ)',
      tagline: 'Sắc xanh rêu tri thức & năng động tuổi trẻ',
      badgeBg: 'bg-emerald-950 text-emerald-200 border-emerald-800/50',
      pillarBg: 'bg-gradient-to-r from-[#022c22] via-[#064e3b] to-[#022c22] border-emerald-900/60',
      crownBg: 'bg-gradient-to-b from-[#022c22] via-[#064e3b] to-[#022c22] border-emerald-800/80',
      plinthBg: 'bg-gradient-to-b from-[#064e3b] to-[#022c22] border-emerald-800/80',
      backboardBg: '#031a14',
      backboardPattern: 'radial-gradient(circle at 50% 0%, rgba(16, 185, 129, 0.16) 0%, rgba(3, 26, 20, 0.98) 75%)',
      brassAccent: 'bg-gradient-to-br from-emerald-300 via-teal-400 to-emerald-700 text-emerald-950 border-emerald-200/50',
      woodDetail: 'border-emerald-800/40',
      shelfLedgeColor: 'bg-gradient-to-b from-emerald-900 to-emerald-950',
      dotColor: 'bg-[#064e3b] border-[#10b981]'
    },
    pine: {
      name: 'Gỗ Thông Vàng Ấm (NXB Kim Đồng)',
      tagline: 'Vàng mật ong ấm áp, tươi vui & chắp cánh ước mơ',
      badgeBg: 'bg-amber-900 text-amber-100 border-amber-600/50',
      pillarBg: 'bg-gradient-to-r from-[#78350f] via-[#b45309] to-[#78350f] border-amber-600/60',
      crownBg: 'bg-gradient-to-b from-[#78350f] via-[#b45309] to-[#78350f] border-amber-500/80',
      plinthBg: 'bg-gradient-to-b from-[#b45309] to-[#78350f] border-amber-500/80',
      backboardBg: '#261204',
      backboardPattern: 'radial-gradient(circle at 50% 0%, rgba(245, 158, 11, 0.22) 0%, rgba(38, 18, 4, 0.98) 75%)',
      brassAccent: 'bg-gradient-to-br from-yellow-200 via-amber-400 to-yellow-600 text-amber-950 border-yellow-100/50',
      woodDetail: 'border-amber-500/40',
      shelfLedgeColor: 'bg-gradient-to-b from-amber-600 to-amber-800',
      dotColor: 'bg-[#d97706] border-[#fbbf24]'
    },
    walnut: {
      name: 'Gỗ Óc Chó Nghệ Thuật (Phương Nam)',
      tagline: 'Nâu hạt dẻ espresso trầm tĩnh & phong cách mỹ thuật',
      badgeBg: 'bg-stone-900 text-stone-200 border-stone-700',
      pillarBg: 'bg-gradient-to-r from-[#291e18] via-[#44332a] to-[#291e18] border-stone-700/60',
      crownBg: 'bg-gradient-to-b from-[#291e18] via-[#44332a] to-[#291e18] border-stone-600/80',
      plinthBg: 'bg-gradient-to-b from-[#44332a] to-[#291e18] border-stone-600/80',
      backboardBg: '#17110e',
      backboardPattern: 'radial-gradient(circle at 50% 0%, rgba(214, 180, 150, 0.14) 0%, rgba(23, 17, 14, 0.98) 75%)',
      brassAccent: 'bg-gradient-to-br from-amber-200 via-orange-300 to-amber-700 text-amber-950 border-amber-200/50',
      woodDetail: 'border-stone-700/40',
      shelfLedgeColor: 'bg-gradient-to-b from-stone-800 to-stone-950',
      dotColor: 'bg-[#451a03] border-[#92400e]'
    },
    ebony: {
      name: 'Gỗ Mun Mạ Vàng (Đông A)',
      tagline: 'Gỗ mun đen tuyền kết hợp chỉ vàng hoàng gia siêu sang trọng',
      badgeBg: 'bg-zinc-950 text-yellow-300 border-yellow-600/60',
      pillarBg: 'bg-gradient-to-r from-[#09090b] via-[#18181b] to-[#09090b] border-yellow-600/50',
      crownBg: 'bg-gradient-to-b from-[#09090b] via-[#18181b] to-[#09090b] border-yellow-500/80',
      plinthBg: 'bg-gradient-to-b from-[#18181b] to-[#09090b] border-yellow-500/80',
      backboardBg: '#09090b',
      backboardPattern: 'radial-gradient(circle at 50% 0%, rgba(234, 179, 8, 0.18) 0%, rgba(9, 9, 11, 0.99) 75%)',
      brassAccent: 'bg-gradient-to-br from-yellow-300 via-yellow-500 to-amber-600 text-zinc-950 border-yellow-200 font-black',
      woodDetail: 'border-yellow-600/40',
      shelfLedgeColor: 'bg-gradient-to-b from-zinc-800 to-zinc-950',
      dotColor: 'bg-[#18181b] border-[#eab308]'
    },
    slate: {
      name: 'Xám Đá Atelier (Alpha Books)',
      tagline: 'Phong cách tối giản đương đại, tư duy quản trị & học thuật',
      badgeBg: 'bg-slate-900 text-slate-100 border-slate-700',
      pillarBg: 'bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-slate-700',
      crownBg: 'bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 border-slate-700',
      plinthBg: 'bg-gradient-to-b from-slate-800 to-slate-950 border-slate-700',
      backboardBg: '#0f172a',
      backboardPattern: 'radial-gradient(circle at 50% 0%, rgba(59, 130, 246, 0.15) 0%, rgba(15, 23, 42, 0.98) 75%)',
      brassAccent: 'bg-gradient-to-br from-blue-400 via-blue-600 to-slate-800 text-white border-blue-300/50',
      woodDetail: 'border-slate-700/60',
      shelfLedgeColor: 'bg-gradient-to-b from-slate-800 to-slate-950',
      dotColor: 'bg-[#334155] border-[#94a3b8]'
    },
  };

  const currentTheme = themeStyles[currentThemeKey];
  const activeBrand = OFFICIAL_BRANDS.find((b) => b.id === selectedBrandId) || null;

  return (
    <div className="w-full max-w-[1700px] mx-auto px-2 sm:px-4 md:px-8 py-4">
      {/* Top Cabinet Toolbar */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 bg-white/90 backdrop-blur-md p-4 rounded-2xl border border-slate-200/90 shadow-xs">
        {/* Left: Cabinet Title & Live Brand State */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-800 to-amber-950 flex items-center justify-center text-amber-200 shadow-sm border border-amber-700/50">
            <i className="fa-solid fa-layer-group text-lg"></i>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-display font-bold text-base md:text-lg text-slate-900 leading-tight">
                Tủ Sách BOKO
              </h2>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                <i className="fa-solid fa-store text-[10px]"></i>
                <span>Mall</span>
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Kiến trúc tủ sách 3D chạm khắc • Đang hiển thị {totalBooksCount} tác phẩm
            </p>
          </div>
        </div>

        {/* Right Controls: Active Display / Backlight Toggle */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Active Brand / Material Indicator */}
          <div className="flex items-center gap-2 bg-slate-100/90 px-3 py-1.5 rounded-xl border border-slate-200/80">
            <span className={`w-3 h-3 rounded-full border shadow-2xs ${currentTheme.dotColor}`}></span>
            <div className="text-left">
              <span className="text-xs font-bold text-slate-800 leading-tight">
                {currentTheme.name}
              </span>
            </div>
            {activeBrand && onSelectBrand && (
              <button
                onClick={() => onSelectBrand(null)}
                className="ml-1 text-slate-400 hover:text-slate-700 p-0.5 rounded-full hover:bg-slate-200 cursor-pointer"
                title="Khôi phục mặc định"
              >
                <i className="fa-solid fa-xmark text-xs"></i>
              </button>
            )}
          </div>

          {/* Cabinet Backlight Toggle */}
          <button
            onClick={() => setIsCabinetLightOn(!isCabinetLightOn)}
            className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 border cursor-pointer ${
              isCabinetLightOn
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-800 shadow-2xs'
                : 'bg-slate-100 border-slate-200 text-slate-500 hover:text-slate-800'
            }`}
            title="Bật/Tắt ánh đèn tủ sách"
          >
            <i className={`fa-solid fa-lightbulb text-sm ${isCabinetLightOn ? 'text-amber-600' : 'text-slate-400'}`}></i>
            <span className="hidden md:inline">Đèn Tủ Sách</span>
          </button>
        </div>
      </div>

      {/* Category Filter Bar */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 px-2">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => onSelectCategory(null)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase transition-all cursor-pointer ${
              activeCategoryFilter === null
                ? 'bg-blue-600 text-white shadow-sm shadow-blue-200'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 shadow-2xs'
            }`}
          >
            Tất cả kệ ({totalBooksCount})
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => onSelectCategory(activeCategoryFilter === cat ? null : cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase transition-all cursor-pointer ${
                activeCategoryFilter === cat
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-200'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 shadow-2xs'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* =========================================================
          THE FULL 3D BOOKCASE CABINET ARCHITECTURE
         ========================================================= */}
      <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-amber-950/20 bg-slate-950 text-amber-50 transition-all duration-500">
        
        {/* 1. TOP CABINET CROWN / CANOPY */}
        <div className={`relative w-full py-5 px-6 sm:px-12 ${currentTheme.crownBg} border-b-2 shadow-lg z-20 flex items-center justify-between transition-colors duration-500`}>
          {/* Decorative Corner Brass Moldings - Left */}
          <div className="hidden sm:flex items-center gap-2">
            <div className={`w-8 h-8 rounded-lg ${currentTheme.brassAccent} shadow-sm flex items-center justify-center border text-xs font-bold`}>
              <i className="fa-solid fa-award text-xs"></i>
            </div>
            <div className="h-6 w-px bg-white/20"></div>
            <span className="text-[11px] uppercase tracking-widest text-amber-200/80 font-semibold truncate max-w-[150px]">
              {activeBrand ? activeBrand.shortName : 'KẾT CẤU GỖ NGUYÊN KHỐI'}
            </span>
          </div>

          {/* Center Brass Medallion Plaque */}
          <div className="mx-auto flex items-center gap-3 px-5 py-2 rounded-xl bg-slate-950/80 border border-amber-500/40 shadow-inner">
            <img
              src={logoImg}
              alt="Boko"
              className="w-6 h-6 rounded-md object-cover border border-amber-400/50 shadow-sm"
              referrerPolicy="no-referrer"
            />
            <span className="font-display font-bold text-sm sm:text-base tracking-widest uppercase text-amber-100 truncate">
              {activeBrand ? `MALL • ${activeBrand.shortName.toUpperCase()}` : 'BOKO • TỦ SÁCH DI SẢN'}
            </span>
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse shadow-sm shadow-amber-300"></span>
          </div>

          {/* Decorative Corner Brass Moldings - Right */}
          <div className="hidden sm:flex items-center gap-2">
            <span className="text-[11px] uppercase tracking-widest text-amber-200/80 font-semibold">
              {currentTheme.name}
            </span>
            <div className="h-6 w-px bg-white/20"></div>
            <div className="w-8 h-8 rounded-lg text-amber-950 bg-gradient-to-br from-amber-300 via-yellow-400 to-amber-600 shadow-sm flex items-center justify-center border border-amber-200 text-xs font-bold">
              <i className="fa-solid fa-circle-check text-xs"></i>
            </div>
          </div>

          {/* Bottom Bevel Lip of Crown */}
          <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-black/40"></div>
        </div>

        {/* 2. INNER CABINET RECESS */}
        <div
          style={{
            backgroundColor: currentTheme.backboardBg,
            backgroundImage: currentTheme.backboardPattern,
          }}
          className="relative w-full flex min-h-[600px] transition-all duration-500"
        >
          {/* Ambient Downlight Spotlight Effect */}
          {isCabinetLightOn && (
            <div className="absolute top-0 left-0 right-0 h-96 bg-gradient-to-b from-amber-200/15 via-amber-400/5 to-transparent pointer-events-none z-10"></div>
          )}

          {/* =========================================================
              LEFT CABINET SIDE PILLAR
             ========================================================= */}
          <div
            className={`relative z-20 w-8 sm:w-12 md:w-16 lg:w-20 shrink-0 ${currentTheme.pillarBg} border-r-2 shadow-2xl flex flex-col justify-between py-6 select-none transition-colors duration-500`}
          >
            {/* Front Bevel Highlight */}
            <div className="absolute top-0 bottom-0 left-1 w-1 bg-white/10 pointer-events-none"></div>

            {/* Brass Bracket Fitting - Top Left */}
            <div className="px-1.5 sm:px-2 py-3 flex flex-col items-center gap-3 border-b border-white/10">
              <div className="w-full h-3 sm:h-4 bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-600 rounded-xs shadow-xs border border-amber-200/40 flex items-center justify-around px-1">
                <span className="w-1 h-1 rounded-full bg-amber-950"></span>
                <span className="w-1 h-1 rounded-full bg-amber-950"></span>
              </div>
            </div>

            {/* Shelf Peg Holes */}
            <div className="flex-1 flex flex-col items-center justify-around py-8 opacity-70">
              {Array.from({ length: 12 }).map((_, i) => (
                <div
                  key={i}
                  className="w-2 h-2 rounded-full bg-black/60 inset-shadow border border-white/10 shadow-inner"
                  title="Lỗ chốt đợt tủ sách"
                ></div>
              ))}
            </div>

            {/* Brass Bracket Fitting - Bottom Left */}
            <div className="px-1.5 sm:px-2 py-3 border-t border-white/10 flex flex-col items-center">
              <div className="w-full h-3 sm:h-4 bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-600 rounded-xs shadow-xs border border-amber-200/40 flex items-center justify-around px-1">
                <span className="w-1 h-1 rounded-full bg-amber-950"></span>
                <span className="w-1 h-1 rounded-full bg-amber-950"></span>
              </div>
            </div>

            {/* Inner Drop Shadow Overlay onto the shelves */}
            <div className="absolute top-0 bottom-0 left-full w-8 sm:w-12 bg-gradient-to-r from-black/60 via-black/25 to-transparent pointer-events-none z-10"></div>
          </div>

          {/* =========================================================
              CENTER MAIN BOOKSHELVES CANVAS
             ========================================================= */}
          <div className="flex-1 relative z-0 py-8 min-w-0 overflow-hidden">
            {children}
          </div>

          {/* =========================================================
              RIGHT CABINET SIDE PILLAR
             ========================================================= */}
          <div
            className={`relative z-20 w-8 sm:w-12 md:w-16 lg:w-20 shrink-0 ${currentTheme.pillarBg} border-l-2 shadow-2xl flex flex-col justify-between py-6 select-none transition-colors duration-500`}
          >
            {/* Front Bevel Highlight */}
            <div className="absolute top-0 bottom-0 right-1 w-1 bg-white/10 pointer-events-none"></div>

            {/* Brass Bracket Fitting - Top Right */}
            <div className="px-1.5 sm:px-2 py-3 flex flex-col items-center gap-3 border-b border-white/10">
              <div className="w-full h-3 sm:h-4 bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-600 rounded-xs shadow-xs border border-amber-200/40 flex items-center justify-around px-1">
                <span className="w-1 h-1 rounded-full bg-amber-950"></span>
                <span className="w-1 h-1 rounded-full bg-amber-950"></span>
              </div>
            </div>

            {/* Shelf Peg Holes */}
            <div className="flex-1 flex flex-col items-center justify-around py-8 opacity-70">
              {Array.from({ length: 12 }).map((_, i) => (
                <div
                  key={i}
                  className="w-2 h-2 rounded-full bg-black/60 inset-shadow border border-white/10 shadow-inner"
                  title="Lỗ chốt đợt tủ sách"
                ></div>
              ))}
            </div>

            {/* Brass Bracket Fitting - Bottom Right */}
            <div className="px-1.5 sm:px-2 py-3 border-t border-white/10 flex flex-col items-center">
              <div className="w-full h-3 sm:h-4 bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-600 rounded-xs shadow-xs border border-amber-200/40 flex items-center justify-around px-1">
                <span className="w-1 h-1 rounded-full bg-amber-950"></span>
                <span className="w-1 h-1 rounded-full bg-amber-950"></span>
              </div>
            </div>

            {/* Inner Drop Shadow Overlay onto the shelves from right */}
            <div className="absolute top-0 bottom-0 right-full w-8 sm:w-12 bg-gradient-to-l from-black/60 via-black/25 to-transparent pointer-events-none z-10"></div>
          </div>

        </div>

        {/* 3. BOTTOM CABINET PLINTH BASE */}
        <div className={`relative w-full py-4 px-8 ${currentTheme.plinthBg} border-t-2 border-black/40 shadow-2xl z-20 flex items-center justify-between transition-colors duration-500`}>
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-amber-500/80 border border-amber-200 shadow-sm"></div>
            <span className="text-xs font-semibold text-amber-200/90 tracking-wider uppercase font-display">
              CHÂN TỦ CHỊU LỰC BOKO • {currentTheme.name}
            </span>
          </div>

          <div className="text-xs text-amber-300/70 italic hidden md:block">
            {currentTheme.tagline}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] text-amber-300/80 font-mono">BOKO-CABINET-MALL-2026</span>
          </div>
        </div>

      </div>
    </div>
  );
};
