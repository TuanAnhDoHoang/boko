import { Book, CartItem } from '../types';

export const DEFAULT_SAMPLE_CHAPTERS = {
  title: 'Boko Preview',
  page1: ['Đọc thử mẫu trong app dài đến 1-2 trang.', 'Sách đang được đồng bộ từ backend.'],
  page2: ['Dữ liệu catalog đang được map về UI hiện có.', 'Boko sẽ hiển thị chính xác thông tin sách và giá.'],
  page3: ['Bạn có thể tiếp tục đọc hoặc mua ngay từ góc phải.', 'Sách luôn được kiểm tra tồn kho và trạng thái phân phối.'],
};

const getNumeric = (...values: Array<number | string | undefined | null>) => {
  for (const value of values) {
    const num = typeof value === 'number' ? value : Number(String(value ?? '').replace(/[^0-9.-]/g, ''));
    if (Number.isFinite(num)) return num;
  }
  return 0;
};

export function normalizeCategoryName(value?: string | null): string {
  const name = String(value ?? '').trim().toLowerCase();

  if (!name) return 'Literature';
  if (['trinh tham', 'trinh-tham', 'detective', 'mystery', 'crime', 'bí ẩn', 'thriller'].some((token) => name.includes(token))) {
    return 'Mystery';
  }
  if (['van hoc', 'literature', 'novel', 'tiểu thuyết', 'story', 'văn học', 'ngôn tình'].some((token) => name.includes(token))) {
    return 'Literature';
  }
  if (['lich su', 'history', 'historical', 'lịch sử'].some((token) => name.includes(token))) {
    return 'History';
  }
  if (['khoa hoc', 'science', 'technology', 'tech', 'it', 'công nghệ', 'tin học', 'khoa học'].some((token) => name.includes(token))) {
    return 'Science';
  }
  if (['nghe thuat', 'art', 'artistic', 'nghệ thuật', 'hội họa'].some((token) => name.includes(token))) {
    return 'Art';
  }
  if (['kinh te', 'economics', 'business', 'marketing', 'finance', 'kinh doanh'].some((token) => name.includes(token))) {
    return 'Literature';
  }
  if (['ngoai ngu', 'foreign language', 'english', 'japanese', 'korean', 'ngoại ngữ'].some((token) => name.includes(token))) {
    return 'Literature';
  }

  return 'Literature';
}

export function normalizeBook(raw: any): Book {
  const id = String(raw?.id ?? raw?.book_id ?? raw?.book?.id ?? 'book-temp');
  const categoryName = normalizeCategoryName(raw?.category?.name || raw?.category_name || raw?.category || 'VĂN HỌC');
  const priceVND = getNumeric(raw?.price, raw?.price_vnd, raw?.priceVND);
  const priceEUR = Number((priceVND / 27000).toFixed(2));
  const coverUrl = raw?.image_url || raw?.cover_url || raw?.book?.image_url || 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=800';

  return {
    id,
    title: raw?.title || 'Untitled Book',
    author: raw?.author || raw?.book?.author || 'Boko Editorial',
    category: categoryName,
    priceEUR: Number.isFinite(priceEUR) ? priceEUR : 0,
    priceVND: Number.isFinite(priceVND) ? priceVND : 0,
    originalPriceVND: raw?.original_price_vnd ?? raw?.originalPriceVND ?? undefined,
    discountPercent: raw?.discount_percent ?? raw?.discountPercent ?? undefined,
    coverUrl,
    bgColor: raw?.bgColor || raw?.bg_color || '#334155',
    description: raw?.description || raw?.book?.description || 'Mô tả từ backend chưa được cung cấp.',
    publisher: raw?.publisher || raw?.user?.name || raw?.brandName || 'Boko',
    brandId: raw?.brand_id || raw?.brandId || raw?.category_id ? String(raw.category_id) : undefined,
    brandName: raw?.brand_name || raw?.brandName || raw?.user?.name || 'Boko',
    editionType: raw?.edition_type || raw?.editionType || 'Bìa mềm',
    isbn: raw?.isbn || raw?.book?.isbn || undefined,
    pageCount: raw?.page_count ?? raw?.pageCount ?? undefined,
    publishYear: raw?.publish_year ?? raw?.publishYear ?? undefined,
    stock: raw?.stock ?? raw?.book?.stock ?? undefined,
    sampleChapters: raw?.sampleChapters || raw?.sample_chapters || DEFAULT_SAMPLE_CHAPTERS,
  };
}

export function normalizeCartItem(raw: any): CartItem & { serverCartId?: string } {
  const bookData = raw?.book || raw;
  const quantity = Number(raw?.quantity ?? 1);
  const book = normalizeBook({
    ...bookData,
    id: raw?.book_id ?? raw?.book_id ?? bookData?.id,
    book_id: raw?.book_id ?? raw?.book_id ?? bookData?.id,
    price: raw?.price ?? bookData?.price ?? 0,
    image_url: raw?.image_url || bookData?.image_url || bookData?.cover_url,
    title: raw?.title || bookData?.title || 'Book',
    author: raw?.author || bookData?.author || 'Boko',
    category: bookData?.category || raw?.category || 'LITERATURE',
  });

  return {
    book,
    quantity: Number.isFinite(quantity) ? quantity : 1,
    serverCartId: String(raw?.cart_id ?? raw?.id ?? raw?.book_id ?? ''),
  };
}
