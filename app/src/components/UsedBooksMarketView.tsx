import React, { useState } from 'react';
import { Book, CartItem, Currency, UsedBookListing, User } from '../types';

interface UsedBooksMarketViewProps {
  usedBooks: UsedBookListing[];
  currency: Currency;
  user: User | null;
  onAddToCart: (book: Book) => void;
  onAddNewListing: (listing: UsedBookListing) => void;
  onDeleteListing?: (id: string) => void;
  onToggleListingStatus?: (id: string) => void;
  onOpenAuth?: () => void;
}

export const UsedBooksMarketView: React.FC<UsedBooksMarketViewProps> = ({
  usedBooks,
  currency,
  user,
  onAddToCart,
  onAddNewListing,
  onDeleteListing,
  onToggleListingStatus,
  onOpenAuth
}) => {
  // Filter & Search states
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedCondition, setSelectedCondition] = useState<string>('all');
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const [showOnlyMyListings, setShowOnlyMyListings] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'newest' | 'price-asc' | 'price-desc' | 'popular'>('newest');

  // Modal states
  const [isPostModalOpen, setIsPostModalOpen] = useState<boolean>(false);
  const [viewingListing, setViewingListing] = useState<UsedBookListing | null>(null);
  const [contactSellerModal, setContactSellerModal] = useState<UsedBookListing | null>(null);
  const [copiedPhone, setCopiedPhone] = useState<boolean>(false);

  // Post Book Form States
  const [formTitle, setFormTitle] = useState<string>('');
  const [formAuthor, setFormAuthor] = useState<string>('');
  const [formCategory, setFormCategory] = useState<string>('VĂN HỌC');
  const [formPriceVND, setFormPriceVND] = useState<string>('150000');
  const [formOriginalPriceVND, setFormOriginalPriceVND] = useState<string>('250000');
  const [formCondition, setFormCondition] = useState<UsedBookListing['condition']>('very-good');
  const [formConditionPercentage, setFormConditionPercentage] = useState<number>(90);
  const [formConditionDetails, setFormConditionDetails] = useState<string>('');
  const [formDescription, setFormDescription] = useState<string>('');
  const [formCoverUrl, setFormCoverUrl] = useState<string>('https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=600');
  const [formSellerName, setFormSellerName] = useState<string>(user?.name || '');
  const [formSellerPhone, setFormSellerPhone] = useState<string>('0912 888 999');
  const [formSellerLocation, setFormSellerLocation] = useState<string>('Hà Nội');
  const [formTags, setFormTags] = useState<string>('');
  const [formError, setFormError] = useState<string | null>(null);

  // Preset cover images for quick selection
  const presetCovers = [
    { label: 'Văn học cổ điển', url: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=600' },
    { label: 'Trinh thám & Bí ẩn', url: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=600' },
    { label: 'Khoa học & Vũ trụ', url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=600' },
    { label: 'Lịch sử & Triết lý', url: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=600' },
    { label: 'Hội họa nghệ thuật', url: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&q=80&w=600' },
    { label: 'Sách xưa cổ điển', url: 'https://images.unsplash.com/photo-1463320726281-696a485928c7?auto=format&fit=crop&q=80&w=600' }
  ];

  // Helper for price formatting
  const formatPrice = (priceEUR: number, priceVND: number) => {
    if (currency === 'EUR') {
      return `€${priceEUR.toFixed(2)}`;
    }
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(priceVND);
  };

  // Convert UsedBookListing to Book object for Boko Cart integration
  const convertToBook = (listing: UsedBookListing): Book => {
    return {
      id: listing.id,
      title: `[Sách cũ] ${listing.title}`,
      author: listing.author,
      category: listing.category,
      priceEUR: listing.priceEUR,
      priceVND: listing.priceVND,
      coverUrl: listing.coverUrl,
      description: `${listing.description} (Tình trạng: ${listing.conditionLabel} ${listing.conditionPercentage}% - Người bán: ${listing.sellerName})`,
      sampleChapters: {
        title: 'Thông Tin Hiện Trạng Sách',
        page1: [
          `Tác phẩm: ${listing.title}`,
          `Tác giả: ${listing.author}`,
          `Tình trạng: ${listing.conditionLabel} (${listing.conditionPercentage}%)`,
          `Ghi chú: ${listing.conditionDetails}`
        ],
        page2: [
          `Người bán: ${listing.sellerName}`,
          `Khu vực: ${listing.sellerLocation}`,
          `Liên hệ: ${listing.sellerPhone}`,
          `Ngày đăng: ${listing.createdAt}`
        ],
        page3: [
          `Mô tả từ chủ sách:`,
          listing.description
        ]
      }
    };
  };

  // Filter listings
  const filteredListings = usedBooks.filter((book) => {
    const matchCategory = selectedCategory === 'all' || book.category === selectedCategory;
    const matchCondition = selectedCondition === 'all' || book.condition === selectedCondition;
    const matchLocation = selectedLocation === 'all' || book.sellerLocation.toLowerCase().includes(selectedLocation.toLowerCase());
    const matchMyListings = !showOnlyMyListings || (user && book.sellerId === user.id) || book.sellerName.toLowerCase().includes(user?.name.toLowerCase() || 'xyz');
    
    const matchSearch =
      searchQuery.trim() === '' ||
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.sellerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.sellerLocation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchCategory && matchCondition && matchLocation && matchMyListings && matchSearch;
  }).sort((a, b) => {
    if (sortBy === 'price-asc') {
      return a.priceVND - b.priceVND;
    }
    if (sortBy === 'price-desc') {
      return b.priceVND - a.priceVND;
    }
    if (sortBy === 'popular') {
      return b.viewsCount - a.viewsCount;
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  // Handle local image upload via FileReader
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setFormCoverUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleOpenPostModal = () => {
    if (user && !formSellerName) {
      setFormSellerName(user.name);
    }
    setFormError(null);
    setIsPostModalOpen(true);
  };

  const handleCreateListing = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) {
      setFormError('Vui lòng nhập tên cuốn sách.');
      return;
    }
    if (!formAuthor.trim()) {
      setFormError('Vui lòng nhập tác giả.');
      return;
    }
    const numPriceVND = parseInt(formPriceVND.replace(/\D/g, ''), 10);
    if (isNaN(numPriceVND) || numPriceVND <= 0) {
      setFormError('Vui lòng nhập giá bán hợp lệ.');
      return;
    }

    const numOrigVND = parseInt(formOriginalPriceVND.replace(/\D/g, ''), 10) || numPriceVND * 1.5;
    const numPriceEUR = Number((numPriceVND / 26000).toFixed(2));
    const numOrigEUR = Number((numOrigVND / 26000).toFixed(2));

    const conditionMap: Record<UsedBookListing['condition'], string> = {
      'like-new': 'Như Mới',
      'very-good': 'Rất Tốt',
      'good': 'Khá Tốt',
      'fair': 'Trung Bình',
      'vintage': 'Sách Xưa Quý'
    };

    const parsedTags = formTags
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    if (parsedTags.length === 0) {
      parsedTags.push(formCategory, 'Sách sang nhượng');
    }

    const newListing: UsedBookListing = {
      id: `ub-${Date.now()}`,
      title: formTitle.trim(),
      author: formAuthor.trim(),
      category: formCategory,
      priceEUR: numPriceEUR,
      priceVND: numPriceVND,
      originalPriceEUR: numOrigEUR,
      originalPriceVND: numOrigVND,
      condition: formCondition,
      conditionLabel: conditionMap[formCondition],
      conditionPercentage: formConditionPercentage,
      conditionDetails: formConditionDetails.trim() || 'Sách được giữ gìn cẩn thận trong tủ sách gia đình.',
      description: formDescription.trim() || 'Sách chính hãng, trang in rõ nét, phù hợp cho bạn đọc yêu thích tác phẩm này.',
      coverUrl: formCoverUrl,
      sellerId: user?.id || `user-local-${Date.now()}`,
      sellerName: formSellerName.trim() || 'Bạn đọc yêu sách',
      sellerPhone: formSellerPhone.trim() || '0900 000 000',
      sellerLocation: formSellerLocation.trim() || 'TP. Hồ Chí Minh',
      status: 'available',
      createdAt: new Date().toLocaleDateString('vi-VN'),
      likesCount: 1,
      viewsCount: 1,
      tags: parsedTags
    };

    onAddNewListing(newListing);
    setIsPostModalOpen(false);

    // Reset Form
    setFormTitle('');
    setFormAuthor('');
    setFormConditionDetails('');
    setFormDescription('');
    setFormTags('');
    setFormError(null);
  };

  const categories = ['TRINH THÁM', 'VĂN HỌC', 'LỊCH SỬ', 'KHOA HỌC', 'NGHỆ THUẬT'];

  return (
    <div className="w-full max-w-[1600px] mx-auto px-6 md:px-12 py-8 animate-fadeIn">
      {/* Hero Banner: Secondhand Book Market */}
      <div className="bg-gradient-to-r from-amber-950 via-stone-900 to-slate-900 rounded-3xl p-8 md:p-12 text-amber-100 shadow-xl relative overflow-hidden mb-10 border border-amber-800/30">
        {/* Background decorative illustrations */}
        <div className="absolute right-0 top-0 bottom-0 opacity-10 pointer-events-none hidden lg:flex items-center pr-12">
          <i className="fa-solid fa-store text-[200px] text-amber-300"></i>
        </div>

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-bold uppercase tracking-wider">
            <i className="fa-solid fa-store text-xs"></i>
            <span>Chợ Sách Cũ & Trao Đổi Tri Âm Boko</span>
          </div>

          <h1 className="font-display font-bold text-3xl md:text-5xl text-white tracking-tight">
            Sang Nhượng & Tìm Mua Sách Cũ
          </h1>

          <p className="text-amber-200/80 text-sm md:text-base leading-relaxed">
            Không gian dành cho bạn đọc đăng bán những cuốn sách mình đang sở hữu với mức giá tiết kiệm từ 30% - 70%, trao đi những trang sách cũ để tiếp nối hành trình tri thức mới.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4">
            <button
              onClick={handleOpenPostModal}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-6 py-3.5 rounded-full text-xs uppercase tracking-wider shadow-lg shadow-amber-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 cursor-pointer"
            >
              <i className="fa-solid fa-cart-plus text-base"></i>
              <span>Đăng Bán Sách Của Tôi</span>
            </button>

            <div className="text-xs text-amber-300/80 flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <i className="fa-solid fa-circle-check text-xs text-amber-400"></i>
                <span>{usedBooks.length} Cuốn sách đang rao bán</span>
              </span>
              <span className="flex items-center gap-1.5">
                <i className="fa-solid fa-truck-fast text-xs text-amber-400"></i>
                <span>Giao hàng toàn quốc</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs mb-8 space-y-4">
        {/* Row 1: Search, Sort, Category Pills */}
        <div className="flex flex-col lg:flex-row justify-between items-stretch lg:items-center gap-4">
          {/* Categories */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 hide-scrollbar">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-full text-xs font-bold tracking-wide whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-200'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <span>Tất Cả Thể Loại</span>
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-bold tracking-wide whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-200'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Input & Sort */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1 md:w-72">
              <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm"></i>
              <input
                type="text"
                placeholder="Tìm tên sách, tác giả, người bán..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-full focus:outline-none focus:border-blue-600 focus:bg-white transition-all text-slate-800"
              />
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-full px-4 py-2.5 font-semibold text-slate-700 focus:outline-none focus:border-blue-600 cursor-pointer"
            >
              <option value="newest">Mới đăng gần đây</option>
              <option value="popular">Lượt xem cao nhất</option>
              <option value="price-asc">Giá: Thấp đến Cao</option>
              <option value="price-desc">Giá: Cao đến Thấp</option>
            </select>
          </div>
        </div>

        {/* Row 2: Secondary Quick Filters (Condition & Location) */}
        <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">Tình trạng:</span>
            {[
              { key: 'all', label: 'Tất cả' },
              { key: 'like-new', label: '✨ Như mới (95-99%)' },
              { key: 'very-good', label: '👍 Rất tốt (90%)' },
              { key: 'good', label: '📖 Khá (80-85%)' },
              { key: 'vintage', label: '🕰️ Sách xưa quý' }
            ].map((cond) => (
              <button
                key={cond.key}
                onClick={() => setSelectedCondition(cond.key)}
                className={`px-3 py-1 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
                  selectedCondition === cond.key
                    ? 'bg-amber-50 text-amber-900 border-amber-300 ring-1 ring-amber-400/40'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                }`}
              >
                {cond.label}
              </button>
            ))}
          </div>

          {/* Location select */}
          <div className="flex items-center gap-2">
            <i className="fa-solid fa-location-dot text-slate-400 text-xs"></i>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="text-xs bg-transparent border-0 font-semibold text-slate-700 focus:ring-0 cursor-pointer"
            >
              <option value="all">Mọi khu vực</option>
              <option value="Hà Nội">Hà Nội</option>
              <option value="Hồ Chí Minh">TP. Hồ Chí Minh</option>
              <option value="Đà Nẵng">Đà Nẵng</option>
              <option value="Cần Thơ">Cần Thơ</option>
            </select>
          </div>
        </div>
      </div>

      {/* Used Books Grid */}
      {filteredListings.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-700 flex items-center justify-center mx-auto">
            <i className="fa-solid fa-book-open text-2xl"></i>
          </div>
          <h3 className="font-display font-bold text-lg text-slate-800">Không tìm thấy sách cũ phù hợp</h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            Hiện chưa có cuốn sách nào khớp với bộ lọc của bạn. Hãy thử chọn thể loại khác hoặc đăng bán cuốn sách của bạn ngay hôm nay!
          </p>
          <button
            onClick={handleOpenPostModal}
            className="bg-amber-600 text-white font-bold text-xs uppercase px-5 py-2.5 rounded-full tracking-wider hover:bg-amber-700 transition-colors shadow-md shadow-amber-200 inline-flex items-center gap-2 cursor-pointer"
          >
            <i className="fa-solid fa-circle-plus text-sm"></i>
            <span>Đăng bán sách ngay</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredListings.map((book) => {
            const savingsPercent = book.originalPriceVND
              ? Math.round(((book.originalPriceVND - book.priceVND) / book.originalPriceVND) * 100)
              : 0;

            const conditionBadgeColor = {
              'like-new': 'bg-emerald-50 text-emerald-700 border-emerald-200',
              'very-good': 'bg-blue-50 text-blue-700 border-blue-200',
              'good': 'bg-amber-50 text-amber-800 border-amber-200',
              'fair': 'bg-stone-100 text-stone-700 border-stone-300',
              'vintage': 'bg-rose-50 text-rose-800 border-rose-200'
            }[book.condition] || 'bg-slate-100 text-slate-700';

            return (
              <div
                key={book.id}
                className="bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group hover:-translate-y-1"
              >
                {/* Book Cover Top Image */}
                <div
                  className="relative h-64 bg-slate-100 overflow-hidden cursor-pointer flex items-center justify-center p-4"
                  onClick={() => setViewingListing(book)}
                >
                  <img
                    src={book.coverUrl}
                    alt={book.title}
                    referrerPolicy="no-referrer"
                    className="h-full object-contain drop-shadow-lg group-hover:scale-105 transition-transform duration-500 rounded-md"
                  />

                  {/* Savings Pill */}
                  {savingsPercent > 0 && (
                    <div className="absolute top-3 left-3 bg-red-600 text-white font-black text-[10px] uppercase tracking-wider px-2 py-1 rounded-md shadow-md">
                      Tiết kiệm {savingsPercent}%
                    </div>
                  )}

                  {/* Condition Badge */}
                  <div
                    className={`absolute top-3 right-3 text-[10px] font-bold px-2 py-0.5 rounded-full border shadow-xs ${conditionBadgeColor}`}
                  >
                    {book.conditionLabel} {book.conditionPercentage}%
                  </div>

                  {/* Category overlay */}
                  <div className="absolute bottom-2 left-3 text-[9px] font-bold uppercase tracking-widest text-slate-500 bg-white/90 backdrop-blur-xs px-2 py-0.5 rounded">
                    {book.category}
                  </div>
                </div>

                {/* Book Info Body */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h3
                      onClick={() => setViewingListing(book)}
                      className="font-display font-bold text-slate-900 text-base leading-snug line-clamp-2 cursor-pointer hover:text-blue-600 transition-colors mb-1"
                    >
                      {book.title}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium line-clamp-1 mb-2">
                      Tác giả: {book.author}
                    </p>

                    {/* Condition details quote */}
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-[11px] text-slate-600 line-clamp-2 italic leading-relaxed">
                      "{book.conditionDetails}"
                    </div>
                  </div>

                  {/* Seller Info & Location */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                    <div className="flex items-center gap-1.5 truncate">
                      <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-[9px] shrink-0">
                        {book.sellerName.charAt(0)}
                      </span>
                      <span className="font-semibold text-slate-700 truncate">{book.sellerName}</span>
                    </div>
                    <div className="flex items-center gap-1 shrink-0 text-slate-400">
                      <i className="fa-solid fa-location-dot text-xs"></i>
                      <span>{book.sellerLocation.split(',')[0]}</span>
                    </div>
                  </div>

                  {/* Pricing Bar */}
                  <div className="flex items-baseline justify-between pt-1">
                    <div>
                      <span className="font-display font-bold text-lg text-amber-600">
                        {formatPrice(book.priceEUR, book.priceVND)}
                      </span>
                      {book.originalPriceVND && (
                        <span className="text-xs text-slate-400 line-through ml-2 font-normal">
                          {formatPrice(book.originalPriceEUR || 0, book.originalPriceVND)}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 gap-2 pt-2">
                    <button
                      onClick={() => setContactSellerModal(book)}
                      className="w-full py-2 px-3 rounded-xl border border-slate-200 hover:border-slate-400 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      title="Liên hệ người bán qua SĐT/Zalo"
                    >
                      <i className="fa-solid fa-phone text-xs text-emerald-600"></i>
                      <span>Liên hệ</span>
                    </button>

                    <button
                      onClick={() => onAddToCart(convertToBook(book))}
                      className="w-full py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm shadow-blue-200 cursor-pointer"
                    >
                      <i className="fa-solid fa-cart-shopping text-xs"></i>
                      <span>Mua sách</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* POST A USED BOOK MODAL ("Đăng Bán Sách Của Tôi") */}
      {isPostModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white w-full max-w-3xl max-h-[92vh] rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col animate-scaleUp">
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-slate-100 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 flex items-center justify-center">
                  <i className="fa-solid fa-square-plus text-xl"></i>
                </div>
                <div>
                  <h2 className="font-display font-bold text-lg text-white">Đăng Bán Sách Của Bạn</h2>
                  <p className="text-xs text-amber-200/80">Rao bán nhanh chóng - Tiếp cận hàng ngàn độc giả Boko</p>
                </div>
              </div>
              <button
                onClick={() => setIsPostModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <i className="fa-solid fa-xmark text-xl"></i>
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleCreateListing} className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
              {formError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-medium flex items-center gap-2">
                  <i className="fa-solid fa-circle-exclamation text-sm"></i>
                  <span>{formError}</span>
                </div>
              )}

              {/* Title & Author */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Tên cuốn sách *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ví dụ: Rừng Na Uy, Nhà Giả Kim..."
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    className="paper-input w-full text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Tác giả *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ví dụ: Haruki Murakami, Paulo Coelho..."
                    value={formAuthor}
                    onChange={(e) => setFormAuthor(e.target.value)}
                    className="paper-input w-full text-xs"
                  />
                </div>
              </div>

              {/* Category & Pricing */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Thể loại
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="paper-input w-full text-xs font-medium cursor-pointer"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Giá bạn muốn bán (VND) *
                  </label>
                  <input
                    type="number"
                    required
                    step="5000"
                    placeholder="150000"
                    value={formPriceVND}
                    onChange={(e) => setFormPriceVND(e.target.value)}
                    className="paper-input w-full text-xs font-bold text-amber-700"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Giá bìa gốc (VND)
                  </label>
                  <input
                    type="number"
                    step="5000"
                    placeholder="250000"
                    value={formOriginalPriceVND}
                    onChange={(e) => setFormOriginalPriceVND(e.target.value)}
                    className="paper-input w-full text-xs text-slate-500"
                  />
                </div>
              </div>

              {/* Condition Section */}
              <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/80 space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-900 block">
                  Đánh Giá Hiện Trạng Sách Thực Tế
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Mức độ mới (%)</label>
                    <div className="flex items-center gap-3">
                      <input
                        type="range"
                        min="60"
                        max="99"
                        value={formConditionPercentage}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          setFormConditionPercentage(val);
                          if (val >= 95) setFormCondition('like-new');
                          else if (val >= 88) setFormCondition('very-good');
                          else if (val >= 80) setFormCondition('good');
                          else setFormCondition('fair');
                        }}
                        className="flex-1 accent-amber-600"
                      />
                      <span className="font-bold text-amber-900 text-sm w-12 text-right">
                        {formConditionPercentage}%
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Xếp loại tình trạng</label>
                    <select
                      value={formCondition}
                      onChange={(e) => setFormCondition(e.target.value as any)}
                      className="paper-input w-full text-xs cursor-pointer"
                    >
                      <option value="like-new">Như Mới (95 - 99%)</option>
                      <option value="very-good">Rất Tốt (88 - 94%)</option>
                      <option value="good">Khá Tốt (80 - 87%)</option>
                      <option value="fair">Trung Bình (60 - 79%)</option>
                      <option value="vintage">Sách Xưa Quý / Sưu Tầm</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Mô tả chi tiết hiện trạng cuốn sách (gáy sách, vết ố, chữ ký, bọc bìa,...)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ví dụ: Bìa mica cẩn thận, ruột sách sạch không quăn góc, gáy thẳng..."
                    value={formConditionDetails}
                    onChange={(e) => setFormConditionDetails(e.target.value)}
                    className="paper-input w-full text-xs bg-white"
                  />
                </div>
              </div>

              {/* Cover Image Selection / Upload */}
              <div className="space-y-3">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Ảnh bìa sách thực tế
                </label>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  {/* Image Preview Thumbnail */}
                  <div className="w-24 h-32 rounded-xl border border-slate-300 bg-slate-100 overflow-hidden shrink-0 flex items-center justify-center shadow-xs">
                    <img
                      src={formCoverUrl}
                      alt="Xem trước bìa"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  <div className="flex-1 space-y-2 w-full">
                    {/* File Upload Input */}
                    <label className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold cursor-pointer transition-colors border border-slate-200">
                      <i className="fa-solid fa-file-arrow-up text-sm text-blue-600"></i>
                      <span>Tải ảnh từ máy tính</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageFileChange}
                        className="hidden"
                      />
                    </label>

                    <div className="text-[11px] text-slate-500">Hoặc chọn mẫu ảnh bìa có sẵn:</div>
                    <div className="flex flex-wrap gap-1.5">
                      {presetCovers.map((preset, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setFormCoverUrl(preset.url)}
                          className={`text-[10px] px-2.5 py-1 rounded-lg border font-medium transition-all cursor-pointer ${
                            formCoverUrl === preset.url
                              ? 'bg-blue-50 text-blue-700 border-blue-400 font-bold'
                              : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Description & Review */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Giới thiệu / Lời tâm tình về cuốn sách
                </label>
                <textarea
                  rows={3}
                  placeholder="Chia sẻ lý do bạn bán sách, cảm nhận khi đọc, hoặc lời nhắn nhủ đến người mua..."
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="paper-input w-full text-xs"
                ></textarea>
              </div>

              {/* Seller Information */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                  Thông Tin Người Bán (Để người mua liên hệ & giao sách)
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Tên / Bút danh *</label>
                    <input
                      type="text"
                      required
                      placeholder="Nguyễn Văn A"
                      value={formSellerName}
                      onChange={(e) => setFormSellerName(e.target.value)}
                      className="paper-input w-full text-xs bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Số điện thoại / Zalo *</label>
                    <input
                      type="text"
                      required
                      placeholder="0912 345 678"
                      value={formSellerPhone}
                      onChange={(e) => setFormSellerPhone(e.target.value)}
                      className="paper-input w-full text-xs bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Khu vực / Tỉnh thành *</label>
                    <input
                      type="text"
                      required
                      placeholder="Quận 1, TP. Hồ Chí Minh"
                      value={formSellerLocation}
                      onChange={(e) => setFormSellerLocation(e.target.value)}
                      className="paper-input w-full text-xs bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Thẻ từ khóa (Phân cách bằng dấu phẩy)
                </label>
                <input
                  type="text"
                  placeholder="Ví dụ: Nhã Nam, Bìa cứng, Murakami, Giá rẻ..."
                  value={formTags}
                  onChange={(e) => setFormTags(e.target.value)}
                  className="paper-input w-full text-xs"
                />
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsPostModalOpen(false)}
                  className="px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-6 py-2.5 rounded-full text-xs uppercase tracking-wider shadow-md shadow-amber-200 flex items-center gap-2 transition-all cursor-pointer"
                >
                  <i className="fa-solid fa-upload text-sm"></i>
                  <span>Đăng Bán Sách Ngay</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VIEW USED BOOK DETAIL MODAL */}
      {viewingListing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white w-full max-w-3xl max-h-[92vh] rounded-3xl overflow-hidden shadow-2xl flex flex-col border border-slate-200 animate-scaleUp">
            {/* Top Toolbar */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-900 text-white">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-300">
                <i className="fa-solid fa-store text-xs"></i>
                <span>Thông Tin Chi Tiết Sách Cũ #{viewingListing.id.slice(-4)}</span>
              </div>
              <button
                onClick={() => setViewingListing(null)}
                className="p-1.5 rounded-full hover:bg-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                <i className="fa-solid fa-xmark text-xl"></i>
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
              <div className="flex flex-col md:flex-row gap-6 items-start">
                {/* Book Cover Image Large */}
                <div className="w-full md:w-56 h-72 bg-slate-100 rounded-2xl p-4 flex items-center justify-center border border-slate-200 shadow-inner shrink-0 relative">
                  <img
                    src={viewingListing.coverUrl}
                    alt={viewingListing.title}
                    referrerPolicy="no-referrer"
                    className="max-h-full object-contain drop-shadow-xl rounded-md"
                  />
                  <div className="absolute bottom-3 left-3 bg-slate-900/80 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                    {viewingListing.category}
                  </div>
                </div>

                {/* Details */}
                <div className="flex-1 space-y-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                        {viewingListing.conditionLabel} ({viewingListing.conditionPercentage}%)
                      </span>
                      <span className="text-slate-300">•</span>
                      <span className="text-xs text-slate-500 font-mono">Đăng ngày {viewingListing.createdAt}</span>
                    </div>

                    <h2 className="font-display font-bold text-2xl text-slate-900 leading-snug">
                      {viewingListing.title}
                    </h2>
                    <p className="text-sm font-semibold text-slate-600 mt-1">
                      Tác giả: {viewingListing.author}
                    </p>
                  </div>

                  {/* Price Box */}
                  <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] uppercase font-bold text-amber-800 tracking-wider block">
                        Giá chuyển nhượng
                      </span>
                      <div className="flex items-baseline gap-2">
                        <span className="font-display font-bold text-2xl text-amber-600">
                          {formatPrice(viewingListing.priceEUR, viewingListing.priceVND)}
                        </span>
                        {viewingListing.originalPriceVND && (
                          <span className="text-xs text-slate-400 line-through">
                            Giá gốc: {formatPrice(viewingListing.originalPriceEUR || 0, viewingListing.originalPriceVND)}
                          </span>
                        )}
                      </div>
                    </div>

                    {viewingListing.originalPriceVND && (
                      <div className="text-right">
                        <span className="bg-amber-600 text-white text-xs font-black px-2.5 py-1 rounded-lg">
                          Tiết kiệm {Math.round(((viewingListing.originalPriceVND - viewingListing.priceVND) / viewingListing.originalPriceVND) * 100)}%
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Condition Details */}
                  <div className="space-y-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                      Tình trạng thực tế:
                    </span>
                    <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-200 leading-relaxed">
                      {viewingListing.conditionDetails}
                    </p>
                  </div>

                  {/* Description */}
                  <div className="space-y-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                      Mô tả từ người bán:
                    </span>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {viewingListing.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Seller Profile Card */}
              <div className="p-5 rounded-2xl bg-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-lg shadow-md">
                    {viewingListing.sellerName.charAt(0)}
                  </div>
                  <div>
                    <span className="text-[10px] text-amber-300 uppercase font-bold tracking-wider block">
                      Người sở hữu sách
                    </span>
                    <h4 className="font-bold text-sm text-white">{viewingListing.sellerName}</h4>
                    <p className="text-xs text-slate-300 flex items-center gap-1">
                      <i className="fa-solid fa-location-dot text-xs text-amber-400"></i>
                      <span>{viewingListing.sellerLocation}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button
                    onClick={() => {
                      setContactSellerModal(viewingListing);
                    }}
                    className="flex-1 sm:flex-none px-4 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-md shadow-emerald-900 cursor-pointer"
                  >
                    <i className="fa-solid fa-phone text-sm"></i>
                    <span>Liên hệ người bán</span>
                  </button>

                  <button
                    onClick={() => {
                      onAddToCart(convertToBook(viewingListing));
                      setViewingListing(null);
                    }}
                    className="flex-1 sm:flex-none px-5 py-2.5 rounded-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-md shadow-amber-500/30 cursor-pointer"
                  >
                    <i className="fa-solid fa-bag-shopping text-sm"></i>
                    <span>Thêm vào giỏ hàng Boko</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CONTACT SELLER MODAL */}
      {contactSellerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl border border-slate-200 animate-scaleUp p-6 space-y-6 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto shadow-inner">
              <i className="fa-solid fa-phone-volume text-2xl"></i>
            </div>

            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Liên Hệ Mua Cuốn Sách
              </span>
              <h3 className="font-display font-bold text-lg text-slate-900">
                "{contactSellerModal.title}"
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Người bán: <span className="font-bold text-slate-800">{contactSellerModal.sellerName}</span> ({contactSellerModal.sellerLocation})
              </p>
            </div>

            {/* Phone Number Display Box */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="text-[11px] text-slate-500 block">Số điện thoại & Zalo liên hệ:</span>
              <div className="font-mono font-bold text-xl text-emerald-700 tracking-wider">
                {contactSellerModal.sellerPhone}
              </div>
              <p className="text-[11px] text-slate-400">
                Bạn có thể gọi điện trực tiếp hoặc nhắn tin Zalo để trao đổi về tình trạng sách và phương thức giao hàng.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(contactSellerModal.sellerPhone);
                  setCopiedPhone(true);
                  setTimeout(() => setCopiedPhone(false), 2500);
                }}
                className="flex-1 py-3 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                {copiedPhone ? (
                  <i className="fa-solid fa-check text-xs"></i>
                ) : (
                  <i className="fa-solid fa-copy text-xs"></i>
                )}
                <span>{copiedPhone ? 'Đã sao chép' : 'Sao chép SĐT'}</span>
              </button>

              <a
                href={`tel:${contactSellerModal.sellerPhone.replace(/\s+/g, '')}`}
                className="flex-1 py-3 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-md shadow-emerald-200 cursor-pointer"
              >
                <i className="fa-solid fa-phone text-xs"></i>
                <span>Gọi Ngay</span>
              </a>
            </div>

            <button
              onClick={() => setContactSellerModal(null)}
              className="text-xs text-slate-400 hover:text-slate-600 font-medium cursor-pointer"
            >
              Đóng hộp thoại
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
