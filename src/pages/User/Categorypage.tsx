import { useState, useEffect, useRef } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface CategoryTreeResponse {
    id: number;
    name: string;
    slug: string;
    path: string;
    isActive: boolean;
    children: CategoryTreeResponse[];
}

interface BookResponse {
    id: number;
    title: string;
    slug: string;
    coverImage: string;
    price: number;
    salePrice?: number;
    saleFrom?: string;
    saleTo?: string;
    isOnSale: boolean;
    effectivePrice: number;
    authors: string[];
    publisher: string;
    language: string;
    yearPublished?: number;
    stockQuantity: number;
    isActive: boolean;
}

interface PageResponse<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    number: number;
    size: number;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MOCK_CATEGORIES: CategoryTreeResponse[] = [
    {
        id: 1, name: "Văn học", slug: "van-hoc", path: "/van-hoc", isActive: true,
        children: [
            { id: 11, name: "Tiểu thuyết", slug: "tieu-thuyet", path: "/van-hoc/tieu-thuyet", isActive: true, children: [] },
            { id: 12, name: "Truyện ngắn", slug: "truyen-ngan", path: "/van-hoc/truyen-ngan", isActive: true, children: [] },
            { id: 13, name: "Thơ ca", slug: "tho-ca", path: "/van-hoc/tho-ca", isActive: true, children: [] },
        ],
    },
    {
        id: 2, name: "Kinh tế", slug: "kinh-te", path: "/kinh-te", isActive: true,
        children: [
            { id: 21, name: "Khởi nghiệp", slug: "khoi-nghiep", path: "/kinh-te/khoi-nghiep", isActive: true, children: [] },
            { id: 22, name: "Đầu tư", slug: "dau-tu", path: "/kinh-te/dau-tu", isActive: true, children: [] },
        ],
    },
    {
        id: 3, name: "Kỹ năng sống", slug: "ky-nang-song", path: "/ky-nang-song", isActive: true,
        children: [
            { id: 31, name: "Tự phát triển", slug: "tu-phat-trien", path: "/ky-nang-song/tu-phat-trien", isActive: true, children: [] },
            { id: 32, name: "Giao tiếp", slug: "giao-tiep", path: "/ky-nang-song/giao-tiep", isActive: true, children: [] },
        ],
    },
    {
        id: 4, name: "Khoa học", slug: "khoa-hoc", path: "/khoa-hoc", isActive: true,
        children: [
            { id: 41, name: "Vật lý", slug: "vat-ly", path: "/khoa-hoc/vat-ly", isActive: true, children: [] },
            { id: 42, name: "Sinh học", slug: "sinh-hoc", path: "/khoa-hoc/sinh-hoc", isActive: true, children: [] },
        ],
    },
    {
        id: 5, name: "Thiếu nhi", slug: "thieu-nhi", path: "/thieu-nhi", isActive: true,
        children: [
            { id: 51, name: "Truyện tranh", slug: "truyen-tranh", path: "/thieu-nhi/truyen-tranh", isActive: true, children: [] },
            { id: 52, name: "Sách học", slug: "sach-hoc", path: "/thieu-nhi/sach-hoc", isActive: true, children: [] },
        ],
    },
    {
        id: 6, name: "Lịch sử", slug: "lich-su", path: "/lich-su", isActive: true,
        children: [
            { id: 61, name: "Lịch sử Việt Nam", slug: "lich-su-viet-nam", path: "/lich-su/viet-nam", isActive: true, children: [] },
            { id: 62, name: "Lịch sử Thế giới", slug: "lich-su-the-gioi", path: "/lich-su/the-gioi", isActive: true, children: [] },
        ],
    },
];

const MOCK_BOOKS: BookResponse[] = [
    {
        id: 1, title: "Đắc Nhân Tâm", slug: "dac-nhan-tam",
        coverImage: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=420&fit=crop",
        price: 85000, salePrice: 68000, isOnSale: true, effectivePrice: 68000,
        authors: ["Dale Carnegie"], publisher: "NXB Tổng hợp TP.HCM",
        language: "vi", yearPublished: 2023, stockQuantity: 50, isActive: true,
    },
    {
        id: 2, title: "Nhà Giả Kim", slug: "nha-gia-kim",
        coverImage: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300&h=420&fit=crop",
        price: 79000, isOnSale: false, effectivePrice: 79000,
        authors: ["Paulo Coelho"], publisher: "NXB Hội Nhà Văn",
        language: "vi", yearPublished: 2022, stockQuantity: 30, isActive: true,
    },
    {
        id: 3, title: "Tư Duy Phản Biện", slug: "tu-duy-phan-bien",
        coverImage: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=420&fit=crop",
        price: 95000, salePrice: 76000, isOnSale: true, effectivePrice: 76000,
        authors: ["Tom Chatfield"], publisher: "NXB Dân Trí",
        language: "vi", yearPublished: 2023, stockQuantity: 20, isActive: true,
    },
    {
        id: 4, title: "Sapiens: Lược Sử Loài Người", slug: "sapiens",
        coverImage: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=300&h=420&fit=crop",
        price: 189000, isOnSale: false, effectivePrice: 189000,
        authors: ["Yuval Noah Harari"], publisher: "NXB Tri Thức",
        language: "vi", yearPublished: 2022, stockQuantity: 15, isActive: true,
    },
    {
        id: 5, title: "Rừng Na-uy", slug: "rung-na-uy",
        coverImage: "https://images.unsplash.com/photo-1495640388908-05fa85288e61?w=300&h=420&fit=crop",
        price: 125000, salePrice: 100000, isOnSale: true, effectivePrice: 100000,
        authors: ["Haruki Murakami"], publisher: "NXB Hội Nhà Văn",
        language: "vi", yearPublished: 2021, stockQuantity: 25, isActive: true,
    },
    {
        id: 6, title: "Chiến Tranh và Hòa Bình", slug: "chien-tranh-hoa-binh",
        coverImage: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=300&h=420&fit=crop",
        price: 245000, isOnSale: false, effectivePrice: 245000,
        authors: ["Leo Tolstoy"], publisher: "NXB Văn học",
        language: "vi", yearPublished: 2020, stockQuantity: 10, isActive: true,
    },
    {
        id: 7, title: "Zero to One", slug: "zero-to-one",
        coverImage: "https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=300&h=420&fit=crop",
        price: 150000, salePrice: 120000, isOnSale: true, effectivePrice: 120000,
        authors: ["Peter Thiel"], publisher: "NXB Thế Giới",
        language: "vi", yearPublished: 2023, stockQuantity: 40, isActive: true,
    },
    {
        id: 8, title: "Dám Nghĩ Lớn", slug: "dam-nghi-lon",
        coverImage: "https://images.unsplash.com/photo-1585779034823-7e9ac8faec70?w=300&h=420&fit=crop",
        price: 110000, isOnSale: false, effectivePrice: 110000,
        authors: ["David Schwartz"], publisher: "NXB Lao Động",
        language: "vi", yearPublished: 2023, stockQuantity: 35, isActive: true,
    },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatPrice = (price: number) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price);

const sortOptions = [
    { value: "newest", label: "Mới nhất" },
    { value: "price_asc", label: "Giá tăng dần" },
    { value: "price_desc", label: "Giá giảm dần" },
    { value: "name_asc", label: "Tên A → Z" },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function CategorySidebarItem({
    cat,
    depth,
    activeSlug,
    onSelect,
}: {
    cat: CategoryTreeResponse;
    depth: number;
    activeSlug: string | null;
    onSelect: (slug: string) => void;
}) {
    const [expanded, setExpanded] = useState(depth === 0);
    const hasChildren = cat.children.length > 0;
    const isActive = cat.slug === activeSlug;

    return (
        <li>
            <div
                className={`flex items-center justify-between rounded-lg px-3 py-2 cursor-pointer transition-all duration-200 group
          ${isActive
                        ? "bg-cyan-50 text-cyan-700 font-semibold border-l-4 border-cyan-500"
                        : "hover:bg-stone-100 text-stone-700 border-l-4 border-transparent"
                    }
          ${depth > 0 ? "ml-4 text-sm" : "text-base font-medium"}
        `}
                onClick={() => {
                    onSelect(cat.slug);
                    if (hasChildren) setExpanded((e) => !e);
                }}
            >
                <span className="truncate">{cat.name}</span>
                {hasChildren && (
                    <svg
                        className={`w-4 h-4 shrink-0 transition-transform duration-200 text-stone-400 group-hover:text-stone-600
              ${expanded ? "rotate-90" : ""}`}
                        fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                )}
            </div>
            {hasChildren && expanded && (
                <ul className="mt-1 space-y-0.5">
                    {cat.children.map((child) => (
                        <CategorySidebarItem
                            key={child.id}
                            cat={child}
                            depth={depth + 1}
                            activeSlug={activeSlug}
                            onSelect={onSelect}
                        />
                    ))}
                </ul>
            )}
        </li>
    );
}

function BookCard({ book, view }: { book: BookResponse; view: "grid" | "list" }) {
    const [added, setAdded] = useState(false);
    const discount = book.isOnSale && book.salePrice
        ? Math.round((1 - book.salePrice / book.price) * 100)
        : null;

    const handleAdd = () => {
        setAdded(true);
        setTimeout(() => setAdded(false), 1800);
    };

    if (view === "list") {
        return (
            <div className="flex gap-5 bg-white rounded-2xl border border-stone-200 p-4 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 group">
                <div className="relative shrink-0 w-24 h-36 overflow-hidden rounded-xl shadow-md">
                    <img
                        src={book.coverImage}
                        alt={book.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {discount && (
                        <span className="absolute top-1.5 left-1.5 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md">
                            -{discount}%
                        </span>
                    )}
                </div>
                <div className="flex flex-col justify-between flex-1 min-w-0">
                    <div>
                        <h3 className="text-stone-900 font-semibold text-base leading-snug line-clamp-2 group-hover:text-cyan-700 transition-colors">
                            {book.title}
                        </h3>
                        <p className="text-stone-500 text-sm mt-1">{book.authors.join(", ")}</p>
                        <p className="text-stone-400 text-xs mt-0.5">{book.publisher} · {book.yearPublished}</p>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                        <div className="flex items-baseline gap-2">
                            <span className="text-cyan-600 font-bold text-lg">
                                {formatPrice(book.effectivePrice)}
                            </span>
                            {book.isOnSale && (
                                <span className="text-stone-400 text-sm line-through">
                                    {formatPrice(book.price)}
                                </span>
                            )}
                        </div>
                        <button
                            onClick={handleAdd}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200
                ${added
                                    ? "bg-green-500 text-white scale-95"
                                    : "bg-cyan-500 hover:bg-cyan-600 text-white hover:scale-105 active:scale-95"
                                }`}
                        >
                            {added ? (
                                <>
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                    Đã thêm
                                </>
                            ) : (
                                <>
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6h13" />
                                    </svg>
                                    Thêm vào giỏ
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col">
            <div className="relative aspect-[3/4] overflow-hidden bg-stone-100">
                <img
                    src={book.coverImage}
                    alt={book.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {discount && (
                    <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-lg shadow">
                        -{discount}%
                    </span>
                )}
                {book.stockQuantity <= 5 && book.stockQuantity > 0 && (
                    <span className="absolute top-3 right-3 bg-orange-400 text-white text-[10px] font-semibold px-2 py-1 rounded-lg">
                        Còn {book.stockQuantity}
                    </span>
                )}
                <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <button
                        onClick={handleAdd}
                        className={`w-full py-3 font-semibold text-sm transition-colors duration-200
              ${added ? "bg-green-500 text-white" : "bg-cyan-500 hover:bg-cyan-600 text-white"}`}
                    >
                        {added ? "✓ Đã thêm vào giỏ" : "Thêm vào giỏ hàng"}
                    </button>
                </div>
            </div>
            <div className="p-4 flex flex-col flex-1">
                <p className="text-stone-400 text-xs truncate">{book.authors.join(", ")}</p>
                <h3 className="text-stone-900 font-semibold text-sm mt-1 leading-snug line-clamp-2 group-hover:text-cyan-700 transition-colors flex-1">
                    {book.title}
                </h3>
                <div className="mt-3 flex items-baseline gap-2">
                    <span className="text-cyan-600 font-bold text-base">
                        {formatPrice(book.effectivePrice)}
                    </span>
                    {book.isOnSale && (
                        <span className="text-stone-400 text-xs line-through">
                            {formatPrice(book.price)}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function CategoryPage() {
    const [categories] = useState<CategoryTreeResponse[]>(MOCK_CATEGORIES);
    const [books, setBooks] = useState<BookResponse[]>(MOCK_BOOKS);
    const [activeSlug, setActiveSlug] = useState<string | null>(null);
    const [sort, setSort] = useState("newest");
    const [view, setView] = useState<"grid" | "list">("grid");
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [page, setPage] = useState(0);
    const searchRef = useRef<HTMLInputElement>(null);

    const activeCategory = activeSlug
        ? (() => {
            for (const cat of categories) {
                if (cat.slug === activeSlug) return cat;
                for (const child of cat.children) {
                    if (child.slug === activeSlug) return child;
                }
            }
            return null;
        })()
        : null;

    // Simulate fetch
    useEffect(() => {
        setLoading(true);
        const timer = setTimeout(() => {
            let result = [...MOCK_BOOKS];
            if (search.trim()) {
                result = result.filter((b) =>
                    b.title.toLowerCase().includes(search.toLowerCase()) ||
                    b.authors.some((a) => a.toLowerCase().includes(search.toLowerCase()))
                );
            }
            if (sort === "price_asc") result.sort((a, b) => a.effectivePrice - b.effectivePrice);
            if (sort === "price_desc") result.sort((a, b) => b.effectivePrice - a.effectivePrice);
            if (sort === "name_asc") result.sort((a, b) => a.title.localeCompare(b.title));
            setBooks(result);
            setLoading(false);
        }, 350);
        return () => clearTimeout(timer);
    }, [activeSlug, sort, search]);

    const handleCategorySelect = (slug: string) => {
        setActiveSlug((prev) => (prev === slug ? null : slug));
        setPage(0);
        setSidebarOpen(false);
    };

    const totalPages = Math.ceil(books.length / 8) || 1;

    return (
        <div className="min-h-screen bg-stone-50 font-sans pt-20">

            {/* ── Breadcrumb ── */}
            <div className="max-w-7xl mx-auto px-4 py-3">
                <nav className="flex items-center gap-1.5 text-sm text-stone-500">
                    <a href="/" className="hover:text-cyan-600 transition-colors">Trang chủ</a>
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                    <span className="text-stone-400">Thể loại</span>
                    {activeCategory && (
                        <>
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                            </svg>
                            <span className="text-cyan-600 font-medium">{activeCategory.name}</span>
                        </>
                    )}
                </nav>
            </div>

            {/* ── Body ── */}
            <div className="max-w-7xl mx-auto px-4 pb-16">
                <div className="flex gap-6">

                    {/* ── Sidebar (desktop) ── */}
                    <aside className="hidden lg:block w-64 shrink-0">
                        <div className="sticky top-24 bg-white rounded-2xl border border-stone-200 p-5 shadow-sm">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="font-bold text-stone-900 text-base">Thể loại sách</h2>
                                {activeSlug && (
                                    <button
                                        onClick={() => setActiveSlug(null)}
                                        className="text-xs text-cyan-600 hover:underline"
                                    >
                                        Xóa lọc
                                    </button>
                                )}
                            </div>
                            <ul className="space-y-1">
                                {categories.map((cat) => (
                                    <CategorySidebarItem
                                        key={cat.id}
                                        cat={cat}
                                        depth={0}
                                        activeSlug={activeSlug}
                                        onSelect={handleCategorySelect}
                                    />
                                ))}
                            </ul>
                        </div>
                    </aside>

                    {/* ── Mobile sidebar overlay ── */}
                    {sidebarOpen && (
                        <div className="fixed inset-0 z-50 lg:hidden">
                            <div className="absolute inset-0 bg-black/40" onClick={() => setSidebarOpen(false)} />
                            <div className="absolute left-0 top-0 h-full w-72 bg-white shadow-2xl overflow-y-auto">
                                <div className="p-5">
                                    <div className="flex items-center justify-between mb-4">
                                        <h2 className="font-bold text-stone-900 text-base">Thể loại sách</h2>
                                        <button onClick={() => setSidebarOpen(false)} className="text-stone-400 hover:text-stone-700">
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                    <ul className="space-y-1">
                                        {categories.map((cat) => (
                                            <CategorySidebarItem
                                                key={cat.id}
                                                cat={cat}
                                                depth={0}
                                                activeSlug={activeSlug}
                                                onSelect={handleCategorySelect}
                                            />
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ── Main Content ── */}
                    <main className="flex-1 min-w-0">
                        {/* Toolbar */}
                        <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
                            <div className="flex items-center gap-3">
                                {/* Mobile menu toggle */}
                                <button
                                    onClick={() => setSidebarOpen(true)}
                                    className="lg:hidden flex items-center gap-2 px-3 py-2 rounded-xl border border-stone-200 text-sm text-stone-700 hover:bg-stone-100 transition-colors"
                                >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h7" />
                                    </svg>
                                    Thể loại
                                </button>

                                <div>
                                    <h1 className="text-lg font-bold text-stone-900">
                                        {activeCategory ? activeCategory.name : "Tất cả sách"}
                                    </h1>
                                    <p className="text-stone-400 text-xs">{books.length} kết quả</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                {/* Sort */}
                                <select
                                    value={sort}
                                    onChange={(e) => setSort(e.target.value)}
                                    className="text-sm border border-stone-200 rounded-xl px-3 py-2 bg-white text-stone-700 focus:outline-none focus:ring-2 focus:ring-cyan-400 cursor-pointer"
                                >
                                    {sortOptions.map((opt) => (
                                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                                    ))}
                                </select>

                                {/* View toggle */}
                                <div className="flex border border-stone-200 rounded-xl overflow-hidden bg-white">
                                    <button
                                        onClick={() => setView("grid")}
                                        className={`p-2.5 transition-colors ${view === "grid" ? "bg-cyan-500 text-white" : "text-stone-500 hover:bg-stone-50"}`}
                                    >
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M4 4h6v6H4V4zm10 0h6v6h-6V4zM4 14h6v6H4v-6zm10 0h6v6h-6v-6z" />
                                        </svg>
                                    </button>
                                    <button
                                        onClick={() => setView("list")}
                                        className={`p-2.5 transition-colors ${view === "list" ? "bg-cyan-500 text-white" : "text-stone-500 hover:bg-stone-50"}`}
                                    >
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Active filter chips */}
                        {(activeCategory || search) && (
                            <div className="flex flex-wrap gap-2 mb-4">
                                {activeCategory && (
                                    <span className="flex items-center gap-1.5 bg-cyan-50 border border-cyan-200 text-cyan-700 text-sm px-3 py-1.5 rounded-full">
                                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                        </svg>
                                        {activeCategory.name}
                                        <button onClick={() => setActiveSlug(null)} className="hover:text-cyan-900 ml-0.5">×</button>
                                    </span>
                                )}
                                {search && (
                                    <span className="flex items-center gap-1.5 bg-blue-50 border border-blue-200 text-blue-700 text-sm px-3 py-1.5 rounded-full">
                                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                        "{search}"
                                        <button onClick={() => setSearch("")} className="hover:text-blue-900 ml-0.5">×</button>
                                    </span>
                                )}
                            </div>
                        )}

                        {/* Books grid / list */}
                        {loading ? (
                            <div className={`${view === "grid" ? "grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4" : "flex flex-col gap-4"}`}>
                                {Array.from({ length: 8 }).map((_, i) => (
                                    <div key={i} className={`bg-white rounded-2xl border border-stone-200 overflow-hidden animate-pulse
                    ${view === "list" ? "flex gap-5 p-4" : ""}`}>
                                        <div className={`bg-stone-100 ${view === "list" ? "w-24 h-36 rounded-xl shrink-0" : "aspect-[3/4] w-full"}`} />
                                        {view === "list" && (
                                            <div className="flex-1 py-2 space-y-2">
                                                <div className="h-3 bg-stone-100 rounded w-3/4" />
                                                <div className="h-4 bg-stone-100 rounded w-full" />
                                                <div className="h-3 bg-stone-100 rounded w-1/2" />
                                            </div>
                                        )}
                                        {view === "grid" && (
                                            <div className="p-4 space-y-2">
                                                <div className="h-3 bg-stone-100 rounded w-1/2" />
                                                <div className="h-4 bg-stone-100 rounded w-full" />
                                                <div className="h-4 bg-stone-100 rounded w-3/4" />
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : books.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-24 text-center">
                                <div className="w-20 h-20 rounded-2xl bg-stone-100 flex items-center justify-center mb-4">
                                    <svg className="w-10 h-10 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                    </svg>
                                </div>
                                <h3 className="text-stone-700 font-semibold text-lg">Không tìm thấy sách</h3>
                                <p className="text-stone-400 text-sm mt-1">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
                                <button
                                    onClick={() => { setSearch(""); setActiveSlug(null); }}
                                    className="mt-4 px-5 py-2.5 bg-cyan-500 hover:bg-cyan-600 text-white font-medium rounded-xl text-sm transition-colors"
                                >
                                    Xem tất cả sách
                                </button>
                            </div>
                        ) : (
                            <>
                                <div className={view === "grid"
                                    ? "grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4"
                                    : "flex flex-col gap-4"
                                }>
                                    {books.map((book) => (
                                        <BookCard key={book.id} book={book} view={view} />
                                    ))}
                                </div>

                                {/* Pagination */}
                                {totalPages > 1 && (
                                    <div className="mt-10 flex justify-center items-center gap-2">
                                        <button
                                            onClick={() => setPage((p) => Math.max(0, p - 1))}
                                            disabled={page === 0}
                                            className="w-9 h-9 rounded-xl border border-stone-200 flex items-center justify-center text-stone-600 hover:bg-stone-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                        >
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                                            </svg>
                                        </button>
                                        {Array.from({ length: totalPages }).map((_, i) => (
                                            <button
                                                key={i}
                                                onClick={() => setPage(i)}
                                                className={`w-9 h-9 rounded-xl text-sm font-medium transition-all
                          ${page === i
                                                        ? "bg-cyan-500 text-white shadow-sm"
                                                        : "border border-stone-200 text-stone-600 hover:bg-stone-100"
                                                    }`}
                                            >
                                                {i + 1}
                                            </button>
                                        ))}
                                        <button
                                            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                                            disabled={page === totalPages - 1}
                                            className="w-9 h-9 rounded-xl border border-stone-200 flex items-center justify-center text-stone-600 hover:bg-stone-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                        >
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                            </svg>
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
}