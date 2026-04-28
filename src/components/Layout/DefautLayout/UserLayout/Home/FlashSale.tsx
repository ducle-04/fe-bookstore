import { useState, useEffect, useRef } from "react";

interface Product {
    id: number;
    name: string;
    salePrice: number;
    originalPrice?: number;
    image: string;
    hasVariant: boolean;
}

const products: Product[] = [
    {
        id: 1,
        name: "Đắc Nhân Tâm - Dale Carnegie",
        salePrice: 52000,
        originalPrice: 86000,
        image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=400&fit=crop",
        hasVariant: false,
    },
    {
        id: 2,
        name: "Nhà Giả Kim - Paulo Coelho",
        salePrice: 45000,
        originalPrice: 70000,
        image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=400&fit=crop",
        hasVariant: true,
    },
    {
        id: 3,
        name: "Sapiens: Lược Sử Loài Người",
        salePrice: 89000,
        originalPrice: 139000,
        image: "https://images.unsplash.com/photo-1589998059171-988d887df646?w=400&h=400&fit=crop",
        hasVariant: false,
    },
    {
        id: 4,
        name: "Tư Duy Nhanh Và Chậm - Daniel Kahneman",
        salePrice: 95000,
        originalPrice: 150000,
        image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=400&fit=crop",
        hasVariant: true,
    },
    {
        id: 5,
        name: "Cây Cam Ngọt Của Tôi - José Mauro",
        salePrice: 58000,
        originalPrice: 90000,
        image: "https://images.unsplash.com/photo-1495640388908-05fa85288e61?w=400&h=400&fit=crop",
        hasVariant: false,
    },
    {
        id: 6,
        name: "Bố Già - Mario Puzo",
        salePrice: 75000,
        originalPrice: 120000,
        image: "https://images.unsplash.com/photo-1476275466078-4007374efbbe?w=400&h=400&fit=crop",
        hasVariant: true,
    },
];

const formatPrice = (price: number): string =>
    price.toLocaleString("vi-VN") + "đ";

const GearIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

const CartIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
);

const ChevronLeft = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
    </svg>
);

const ChevronRight = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
);

export default function FlashSale() {
    const [activeIndex, setActiveIndex] = useState(0);
    const visibleCount = 4;

    const productRefs = useRef<(HTMLDivElement | null)[]>([]);

    const handlePrev = () => setActiveIndex((prev) => Math.max(0, prev - 1));
    const handleNext = () =>
        setActiveIndex((prev) => Math.min(products.length - visibleCount, prev + 1));

    const visibleProducts = products.slice(activeIndex, activeIndex + visibleCount);
    const canPrev = activeIndex > 0;
    const canNext = activeIndex < products.length - visibleCount;

    // Hiệu ứng hiện ra khi cuộn / thay đổi slide
    useEffect(() => {
        productRefs.current = productRefs.current.slice(0, visibleProducts.length);

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry, index) => {
                    if (entry.isIntersecting) {
                        setTimeout(() => {
                            entry.target.classList.add("opacity-100", "translate-y-0");
                        }, index * 80); // stagger effect
                    }
                });
            },
            { threshold: 0.3 }
        );

        productRefs.current.forEach((ref) => {
            if (ref) observer.observe(ref);
        });

        return () => observer.disconnect();
    }, [visibleProducts]);

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
            <div className="w-full max-w-7xl">

                {/* Flash Sale Banner */}
                <div className="text-center mb-10">
                    <h1 className="text-5xl font-extrabold tracking-wide">
                        <span className="text-cyan-600">FLASH </span>
                        <span className="text-yellow-400">⚡</span>
                        <span className="text-cyan-600"> SALE</span>
                    </h1>
                    <p className="text-gray-500 mt-3 text-lg">
                        Ưu đãi cực mạnh - Chỉ có trong thời gian giới hạn
                    </p>
                </div>

                <div className="flex items-center gap-4">

                    {/* Left Arrow */}
                    <button
                        onClick={handlePrev}
                        disabled={!canPrev}
                        className="flex-shrink-0 w-14 h-14 rounded-2xl bg-white border border-gray-200 flex items-center justify-center text-cyan-600 hover:bg-cyan-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all hover:scale-105 active:scale-95"
                    >
                        <ChevronLeft />
                    </button>

                    {/* Main Card - Không bóng */}
                    <div className="flex-1 border-4 border-cyan-500 rounded-3xl bg-white px-8 py-10">

                        {/* Progress bar */}
                        <div className="flex justify-center mb-10">
                            <div className="w-64 h-3 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-full transition-all duration-700"
                                    style={{
                                        width: `${Math.min(100, ((activeIndex + visibleCount) / products.length) * 100)}%`,
                                    }}
                                />
                            </div>
                        </div>

                        {/* Products Grid */}
                        <div className="grid grid-cols-4 gap-6">
                            {visibleProducts.map((product, index) => (
                                <div
                                    key={product.id}
                                    ref={(el) => {
                                        productRefs.current[index] = el;
                                    }}
                                    className="flex flex-col items-center opacity-0 translate-y-8 transition-all duration-700 ease-out"
                                >
                                    {/* Image */}
                                    <div className="w-full aspect-square rounded-2xl overflow-hidden bg-gray-100 mb-4">
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                    </div>

                                    {/* Product Name */}
                                    <p className="text-base font-medium text-gray-800 text-center leading-tight mb-3 h-14 line-clamp-2">
                                        {product.name}
                                    </p>

                                    {/* Prices */}
                                    <div className="flex items-baseline gap-2 mb-5">
                                        <span className="text-cyan-600 font-bold text-2xl">
                                            {formatPrice(product.salePrice)}
                                        </span>
                                        {product.originalPrice && (
                                            <span className="text-gray-400 text-lg line-through">
                                                {formatPrice(product.originalPrice)}
                                            </span>
                                        )}
                                    </div>

                                    {/* Button */}
                                    <button className="flex items-center justify-center gap-2 w-full bg-cyan-500 hover:bg-cyan-600 active:scale-[0.97] text-white font-semibold py-3.5 rounded-2xl transition-all duration-200">
                                        {product.hasVariant ? (
                                            <>
                                                <GearIcon />
                                                Tùy chọn
                                            </>
                                        ) : (
                                            <>
                                                <CartIcon />
                                                Thêm vào giỏ
                                            </>
                                        )}
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Arrow */}
                    <button
                        onClick={handleNext}
                        disabled={!canNext}
                        className="flex-shrink-0 w-14 h-14 rounded-2xl bg-white border border-gray-200 flex items-center justify-center text-cyan-600 hover:bg-cyan-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all hover:scale-105 active:scale-95"
                    >
                        <ChevronRight />
                    </button>
                </div>
            </div>
        </div>
    );
}