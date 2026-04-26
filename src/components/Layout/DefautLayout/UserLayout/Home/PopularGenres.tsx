import { useRef, useState } from "react";

const genres = [
    {
        label: "TIỂU THUYẾT",
        cover: "https://down-vn.img.susercontent.com/file/vn-11134207-7qukw-lfgebc23iq9h5a",
    },
    {
        label: "TRUYỆN NGẮN",
        cover: "https://cdn0.fahasa.com/media/flashmagazine/images/page_images/danh_tac_van_hoc_viet_nam___truyen_ngan_khai_hung/2023_01_07_10_25_14_1-390x510.jpg",
    },
    {
        label: "THIẾU NHI",
        cover: "https://cf.shopee.vn/file/5e958c8b7354ee8e341137dfb69b0aea",
    },
    {
        label: "TÂM LÝ HỌC",
        cover: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1442726934i/4865.jpg",
    },
    {
        label: "NGHỆ THUẬT SỐNG",
        cover: "https://cdn0.fahasa.com/media/catalog/product/8/9/8935086856772.jpg",
    },
    {
        label: "KHOA HỌC VIỄN TƯỞNG",
        cover: "https://mtg.1cdn.vn/2020/09/25/www-motthegioi-vn_dgftlxrozs10awv1lxrodxlldc1rag9hlwhvyy1nawetdhvvbmctagf5lw5oyxqtzte1nja2ntqzodi4nja-.jpg",
    },
    {
        label: "LỊCH SỬ",
        cover: "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lnryx38vuu3xe8",
    },
    {
        label: "KỸ NĂNG SỐNG",
        cover: "https://cdn0.fahasa.com/media/catalog/product/8/9/8934974186120.jpg",
    },
];

const VISIBLE = 6;

export default function PopularGenres() {
    const [startIndex, setStartIndex] = useState(0);

    const canPrev = startIndex > 0;
    const canNext = startIndex + VISIBLE < genres.length;

    const prev = () => { if (canPrev) setStartIndex((s) => s - 1); };
    const next = () => { if (canNext) setStartIndex((s) => s + 1); };

    const visible = genres.slice(startIndex, startIndex + VISIBLE);

    return (
        <div className="w-full px-8 md:px-16 py-10" style={{ fontFamily: "'Lora', Georgia, serif" }}>
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h2
                    className="text-3xl md:text-4xl font-extrabold"
                    style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "#00838f" }}
                >
                    Thể Loại Nổi Bật
                </h2>
                <button
                    className="text-sm font-semibold flex items-center gap-1 hover:underline transition"
                    style={{ color: "#004d5a" }}
                >
                    Xem tất cả <span>→</span>
                </button>
            </div>

            {/* Carousel */}
            <div className="relative flex items-center">
                {/* Prev */}
                <button
                    onClick={prev}
                    disabled={!canPrev}
                    className="absolute -left-5 z-10 w-9 h-9 rounded-full border border-gray-300 bg-white flex items-center justify-center text-gray-500 hover:bg-gray-50 transition disabled:opacity-30"
                >
                    ‹
                </button>

                {/* Books grid */}
                <div className="grid gap-5 w-full" style={{ gridTemplateColumns: `repeat(${VISIBLE}, minmax(0, 1fr))` }}>
                    {visible.map((genre, i) => (
                        <div key={genre.label + startIndex + i} className="flex flex-col items-center group cursor-pointer">
                            <div className="w-full aspect-[2/3] overflow-hidden rounded-md bg-gray-100">
                                <img
                                    src={genre.cover}
                                    alt={genre.label}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                            </div>
                            <p
                                className="mt-3 text-xs font-bold tracking-wider text-center"
                                style={{ color: "#00838f" }}
                            >
                                {genre.label}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Next */}
                <button
                    onClick={next}
                    disabled={!canNext}
                    className="absolute -right-5 z-10 w-9 h-9 rounded-full border border-gray-300 bg-white flex items-center justify-center text-gray-500 hover:bg-gray-50 transition disabled:opacity-30"
                >
                    ›
                </button>
            </div>

            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=Lora:wght@400;600&display=swap');
      `}</style>
        </div>
    );
}