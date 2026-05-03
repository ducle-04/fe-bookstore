import { useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Product {
    id: number;
    brand: string;
    name: string;
    salePrice: number;
    originalPrice: number;
    discount: number;
    image: string;
    badge?: "free-shipping" | "new";
    isBook?: boolean;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────
const allProducts: Product[] = [
    {
        id: 5,
        brand: "Holly Lansley",
        name: "Harry Potter Và Bảo Bối Tử Thần",
        salePrice: 285000,
        originalPrice: 233000,
        discount: 8,
        image: "https://cdn1.fahasa.com/media/catalog/product/h/a/harry_potter_va_bao_boi_tu_than___tap_7_tai_ban_2017__1_2018_07_05_14_18_35.JPG",
        isBook: true,
    },
    {
        id: 6,
        brand: "Sophie Collingwo...",
        name: "Glow in the Dark Unicorns...",
        salePrice: 225000,
        originalPrice: 249000,
        discount: 10,
        image: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=300&h=300&fit=crop",
        isBook: true,
    },
    {
        id: 7,
        brand: "Holly Lansley",
        name: "Never Touch a Pop-up Shark!",
        salePrice: 299000,
        originalPrice: 325000,
        discount: 8,
        image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=300&fit=crop",
        isBook: true,
    },
    {
        id: 8,
        brand: "Alexandra Robins...",
        name: "My Dinosaur Play Book",
        salePrice: 249000,
        originalPrice: 269000,
        discount: 7,
        image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300&h=300&fit=crop",
        isBook: true,
    },
    {
        id: 9,
        brand: "J.K. Rowling",
        name: "Harry Potter Và Bảo Bối Tử Thần",
        salePrice: 233000,
        originalPrice: 285000,
        discount: 18,
        image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=300&fit=crop",
        isBook: true,
    },
    {
        id: 10,
        brand: "J.K. Rowling",
        name: "Harry Potter Và Hoàng Tử Lai",
        salePrice: 200900,
        originalPrice: 245000,
        discount: 18,
        image: "https://images.unsplash.com/photo-1589998059171-988d887df646?w=300&h=300&fit=crop",
        isBook: true,
    },
    {
        id: 11,
        brand: "J.K. Rowling",
        name: "Harry Potter Và Hội Phượng Hoàng",
        salePrice: 315000,
        originalPrice: 385000,
        discount: 18,
        image: "https://images.unsplash.com/photo-1495640388908-05fa85288e61?w=300&h=300&fit=crop",
        isBook: true,
    },
    {
        id: 12,
        brand: "J.K. Rowling",
        name: "Harry Potter Và Chiếc Cốc Lửa",
        salePrice: 254000,
        originalPrice: 310000,
        discount: 18,
        image: "https://images.unsplash.com/photo-1476275466078-4007374efbbe?w=300&h=300&fit=crop",
        isBook: true,
    },
    {
        id: 13,
        brand: "J.K. Rowling",
        name: "Harry Potter Và Tên Tù Nhân Azkaban",
        salePrice: 168000,
        originalPrice: 205000,
        discount: 18,
        image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300&h=300&fit=crop",
        isBook: true,
    },
    {
        id: 14,
        brand: "J.K. Rowling",
        name: "Harry Potter Và Phòng Chứa Bí Mật",
        salePrice: 139000,
        originalPrice: 170000,
        discount: 18,
        image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=300&fit=crop",
        isBook: true,
    },
    {
        id: 15,
        brand: "J.K. Rowling",
        name: "Harry Potter Và Hòn Đá Phù Thuỷ",
        salePrice: 123000,
        originalPrice: 150000,
        discount: 18,
        badge: "free-shipping",
        image: "https://images.unsplash.com/photo-1589998059171-988d887df646?w=300&h=300&fit=crop",
        isBook: true,
    },
    {
        id: 16,
        brand: "Dương Thụy",
        name: "Beloved Oxford (Tái Bản 2018)",
        salePrice: 92000,
        originalPrice: 110000,
        discount: 16,
        image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=300&fit=crop",
        isBook: true,
    },
    {
        id: 17,
        brand: "Dương Thụy",
        name: "Cung Đường Vàng Nắng",
        salePrice: 65000,
        originalPrice: 80000,
        discount: 19,
        image: "https://images.unsplash.com/photo-1495640388908-05fa85288e61?w=300&h=300&fit=crop",
        isBook: true,
    },
    {
        id: 18,
        brand: "Dương Thụy",
        name: "Búp Bê Nhỏ Xíu Và Chàng...",
        salePrice: 42000,
        originalPrice: 52000,
        discount: 19,
        image: "https://images.unsplash.com/photo-1476275466078-4007374efbbe?w=300&h=300&fit=crop",
        isBook: true,
    },
    {
        id: 19,
        brand: "Dương Thụy",
        name: "Yêu Em Bằng Mắt, Giữ Em...",
        salePrice: 143000,
        originalPrice: 175000,
        discount: 18,
        image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300&h=300&fit=crop",
        isBook: true,
    },
    {
        id: 20,
        brand: "Dương Thụy",
        name: "Hai Người Đến Từ Phương Xa",
        salePrice: 68000,
        originalPrice: 80000,
        discount: 15,
        image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=300&fit=crop",
        isBook: true,
    },
];

const ITEMS_PER_PAGE = 12;

const sortOptions = ["Mặc định", "Tên A-Z", "Tên Z-A", "Hàng mới", "Giá thấp đến cao", "Giá cao xuống thấp"];

const categories = ["Tiểu thuyết", "Truyện ngắn", "Thiếu nhi", "Tâm lý học", "Nghệ thuật sống", "Khoa học viễn tưởng", "Lịch Sử"];
const priceRanges = ["Dưới 100.000đ", "Từ 100.000đ - 200.000đ", "Từ 200.000đ - 500.000đ", "Từ 500.000đ - 1 triệu", "Từ 1 triệu - 2 triệu"];
const brands = ["WanLongDa", "Tiger Family", "HooHooHaHa®", "Sophie Collingwood", "Annie Simpson"];
const publishers = ["NXB Kim Đồng", "NXB Trẻ", "Định Tị", "Nhã Nam", "Tân Việt"];
const languages = ["Tiếng Việt", "Tiếng Anh", "Song Ngữ Anh - Việt", "Tiếng Trung", "Tiếng Nhật"];

const formatPrice = (p: number) => p.toLocaleString("vi-VN") + "đ";

// ─── Icons ────────────────────────────────────────────────────────────────────
const CartIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
);

const PlusIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
    </svg>
);

const SearchIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <circle cx="11" cy="11" r="8" /><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35" />
    </svg>
);

const SortIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
    </svg>
);

// ─── Components ───────────────────────────────────────────────────────────────
function SidebarSection({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div className="mb-6">
            <h3 className="font-bold text-gray-900 text-sm tracking-wide mb-3">{title}</h3>
            {children}
        </div>
    );
}

function CheckboxList({ items }: { items: string[] }) {
    const [checked, setChecked] = useState<string[]>([]);
    return (
        <ul className="space-y-2">
            {items.map((item) => (
                <li key={item} className="flex items-center gap-2 cursor-pointer group"
                    onClick={() => setChecked(p => p.includes(item) ? p.filter(x => x !== item) : [...p, item])}>
                    <div className={`w-4 h-4 border rounded flex-shrink-0 flex items-center justify-center transition-colors ${checked.includes(item) ? "bg-cyan-500 border-cyan-500" : "border-gray-300 group-hover:border-cyan-400"}`}>
                        {checked.includes(item) && (
                            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                        )}
                    </div>
                    <span className="text-sm text-gray-600 group-hover:text-gray-900">{item}</span>
                </li>
            ))}
        </ul>
    );
}

function ProductCard({ product }: { product: Product }) {
    const [inCart, setInCart] = useState(false);
    return (
        <div className="group relative flex flex-col">
            <div className="relative overflow-hidden rounded-xl bg-gray-50 mb-3 aspect-[3/4]">
                <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {product.discount > 0 && (
                    <div className="absolute top-3 right-3 bg-cyan-500 text-white text-xs font-bold px-2.5 py-1 rounded">
                        -{product.discount}%
                    </div>
                )}
                {product.badge === "free-shipping" && (
                    <div className="absolute top-3 left-3 bg-cyan-500 text-white text-xs font-bold px-2.5 py-1 rounded">
                        FREE SHIPPING
                    </div>
                )}
            </div>

            <div className="flex-1 flex flex-col">
                <p className="text-cyan-600 text-xs font-semibold mb-1">{product.brand}</p>
                <div className="flex items-start justify-between gap-2 mb-2">
                    <p className="text-sm text-gray-800 font-medium leading-snug line-clamp-2 flex-1">
                        {product.name}
                    </p>
                    <div className="flex flex-col gap-1 flex-shrink-0">
                        {product.isBook && (
                            <button className="w-8 h-8 rounded-full bg-cyan-100 hover:bg-cyan-200 text-cyan-600 flex items-center justify-center transition-colors">
                                ★
                            </button>
                        )}
                        <button
                            onClick={() => setInCart(!inCart)}
                            className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${inCart ? "bg-cyan-600 text-white" : "bg-cyan-100 hover:bg-cyan-200 text-cyan-600"}`}
                        >
                            <CartIcon />
                        </button>
                    </div>
                </div>

                <div className="flex items-baseline gap-2 mt-auto">
                    <span className="text-cyan-600 font-bold text-base">{formatPrice(product.salePrice)}</span>
                    {product.originalPrice > 0 && (
                        <span className="text-gray-400 text-sm line-through">{formatPrice(product.originalPrice)}</span>
                    )}
                </div>
            </div>
        </div>
    );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function ProductPage() {
    const [sortBy, setSortBy] = useState("Mặc định");
    const [page, setPage] = useState(1);
    const [onSaleOnly, setOnSaleOnly] = useState(false);

    let filteredProducts = [...allProducts];
    if (onSaleOnly) {
        filteredProducts = filteredProducts.filter(p => p.discount > 0);
    }

    const sorted = filteredProducts.sort((a, b) => {
        if (sortBy === "Tên A-Z") return a.name.localeCompare(b.name);
        if (sortBy === "Tên Z-A") return b.name.localeCompare(a.name);
        if (sortBy === "Giá thấp đến cao") return a.salePrice - b.salePrice;
        if (sortBy === "Giá cao xuống thấp") return b.salePrice - a.salePrice;
        return 0;
    });

    const totalPages = Math.ceil(sorted.length / ITEMS_PER_PAGE);
    const paginated = sorted.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

    return (
        <div className="min-h-screen bg-white font-sans">
            {/* Header Title */}
            <div className="pt-28 pb-16 text-center border-b border-gray-100 bg-gradient-to-b from-cyan-50 to-white">

                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-500 to-blue-500">
                        Tất cả sản phẩm
                    </span>
                </h1>

                <p className="text-base text-gray-600 mt-4 max-w-xl mx-auto">
                    Khám phá bộ sưu tập sách mới nhất với nhiều ưu đãi hấp dẫn dành cho bạn
                </p>

                <div className="w-24 h-1 bg-gradient-to-r from-cyan-400 to-blue-500 mx-auto mt-6 rounded-full"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8 flex gap-8">
                {/* Sidebar */}
                <aside className="w-64 flex-shrink-0">
                    <SidebarSection title="THỂ LOẠI SÁCH">
                        <ul className="space-y-2">
                            {categories.map((cat) => (
                                <li key={cat} className="flex items-center justify-between text-sm text-gray-600 hover:text-gray-900 cursor-pointer group py-0.5">
                                    <span>{cat}</span>
                                    <PlusIcon />
                                </li>
                            ))}
                        </ul>
                    </SidebarSection>

                    <div className="border-t border-gray-100 my-6" />

                    <SidebarSection title="CHỌN MỨC GIÁ">
                        <CheckboxList items={priceRanges} />
                    </SidebarSection>

                    <div className="border-t border-gray-100 my-6" />

                    <SidebarSection title="TRẠNG THÁI">
                        <ul className="space-y-2">
                            <li
                                className="flex items-center gap-2 cursor-pointer group"
                                onClick={() => { setOnSaleOnly(!onSaleOnly); setPage(1); }}
                            >
                                <div className={`w-4 h-4 border rounded flex-shrink-0 flex items-center justify-center transition-colors ${onSaleOnly ? "bg-cyan-500 border-cyan-500" : "border-gray-300 group-hover:border-cyan-400"}`}>
                                    {onSaleOnly && (
                                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                        </svg>
                                    )}
                                </div>
                                <span className="text-sm text-gray-600 group-hover:text-gray-900">
                                    Sản phẩm giảm giá
                                </span>
                            </li>
                        </ul>
                    </SidebarSection>

                    <div className="border-t border-gray-100 my-6" />

                    <SidebarSection title="TÁC GIẢ - THƯƠNG HIỆU">
                        <div className="relative mb-3">
                            <input type="text" placeholder="Tìm kiếm" className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-cyan-400" />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"><SearchIcon /></span>
                        </div>
                        <CheckboxList items={brands} />
                    </SidebarSection>

                    <div className="border-t border-gray-100 my-6" />

                    <SidebarSection title="NHÀ XUẤT BẢN">
                        <CheckboxList items={publishers} />
                    </SidebarSection>

                    <div className="border-t border-gray-100 my-6" />

                    <SidebarSection title="NGÔN NGỮ">
                        <CheckboxList items={languages} />
                    </SidebarSection>
                </aside>

                {/* Main Content */}
                <div className="flex-1 min-w-0">
                    {/* Sort Bar */}
                    <div className="flex items-center gap-4 mb-8 pb-4 border-b border-gray-100 flex-wrap">
                        <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                            <SortIcon />
                            <span>Sắp xếp theo</span>
                        </div>
                        {sortOptions.map((opt) => (
                            <button
                                key={opt}
                                onClick={() => { setSortBy(opt); setPage(1); }}
                                className={`text-sm px-4 py-1.5 rounded-lg transition-all ${sortBy === opt
                                    ? "bg-cyan-500 text-white font-semibold"
                                    : "text-gray-600 hover:bg-gray-100"}`}
                            >
                                {opt}
                            </button>
                        ))}
                    </div>

                    {/* Product Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {paginated.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-center gap-2 mt-12">
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                                <button
                                    key={p}
                                    onClick={() => setPage(p)}
                                    className={`w-10 h-10 rounded-xl text-sm font-medium transition-colors ${p === page
                                        ? "bg-cyan-500 text-white"
                                        : "border border-gray-200 text-gray-600 hover:border-cyan-300 hover:text-cyan-600"}`}
                                >
                                    {p}
                                </button>
                            ))}
                            <button
                                onClick={() => setPage(p => Math.min(p + 1, totalPages))}
                                className="w-10 h-10 rounded-xl border border-gray-200 text-gray-600 hover:border-cyan-300 hover:text-cyan-600 text-xl font-bold transition-colors"
                            >
                                »
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}