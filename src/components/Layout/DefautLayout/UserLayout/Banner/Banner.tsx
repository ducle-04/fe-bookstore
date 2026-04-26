import { useEffect, useState } from "react";

const books = [
    {
        id: 1,
        url: "https://tuvanmuasam.com/wp-content/uploads/2021/05/cuon-sach-tam-ly-hoc-hay-nhat-1.jpg",
    },
    {
        id: 2,
        url: "https://www.elleman.vn/app/uploads/2020/05/08/177837/The-Children-of-Men_sach-khoa-hoc-vien-tuong_elle-man_0520.jpg",
    },
    {
        id: 3,
        url: "https://cdn0.fahasa.com/media/flashmagazine/images/page_images/nghe_thuat_song_vung_vang/2023_08_16_15_42_04_2-390x510.png",
    },
];

export default function Banner() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <div className="relative w-full min-h-[600px] overflow-hidden flex items-center" style={{ background: "#e0f7fa" }}>
            {/* Gradient background blobs */}
            <div className="absolute inset-0 pointer-events-none select-none">
                <div className="absolute -top-20 -left-20 w-96 h-96 rounded-full opacity-30" style={{ background: "radial-gradient(circle, #00bcd4, transparent)" }} />
                <div className="absolute -bottom-20 -right-20 w-96 h-96 rounded-full opacity-20" style={{ background: "radial-gradient(circle, #0097a7, transparent)" }} />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full opacity-10" style={{ background: "radial-gradient(ellipse, #00e5ff, transparent)" }} />
            </div>

            {/* Decorative botanical SVG background */}
            <div className="absolute inset-0 pointer-events-none select-none opacity-10">
                <svg width="100%" height="100%" viewBox="0 0 1440 540" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <ellipse cx="60" cy="270" rx="80" ry="200" fill="#006064" transform="rotate(-30 60 270)" />
                    <ellipse cx="30" cy="320" rx="60" ry="160" fill="#006064" transform="rotate(-50 30 320)" />
                    <ellipse cx="110" cy="180" rx="50" ry="130" fill="#006064" transform="rotate(-15 110 180)" />
                    <ellipse cx="1380" cy="270" rx="80" ry="200" fill="#006064" transform="rotate(30 1380 270)" />
                    <ellipse cx="1410" cy="320" rx="60" ry="160" fill="#006064" transform="rotate(50 1410 320)" />
                    <ellipse cx="1330" cy="180" rx="50" ry="130" fill="#006064" transform="rotate(15 1330 180)" />
                    <path d="M700 0 Q740 80 700 160 Q660 240 700 320" stroke="#006064" strokeWidth="2" fill="none" />
                    <path d="M740 0 Q780 60 740 120 Q700 180 740 240" stroke="#006064" strokeWidth="1.5" fill="none" />
                </svg>
            </div>

            {/* Content */}
            <div className="relative z-20 flex flex-col md:flex-row items-center justify-between w-full max-w-7xl mx-auto px-8 md:px-16 py-12 gap-10">
                {/* Left: Text */}
                <div
                    className={`flex-1 max-w-xl transition-all duration-700 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                        }`}
                >
                    <h1
                        className="text-4xl md:text-5xl font-extrabold leading-tight mb-2"
                        style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "#004d5a" }}
                    >
                        Cùng LIBRO Book Store
                    </h1>
                    <h1
                        className="text-4xl md:text-5xl font-extrabold leading-tight mb-5"
                        style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "#004d5a" }}
                    >
                        Khám Phá{" "}
                        <span
                            className="underline decoration-wavy"
                            style={{ color: "#00838f", textDecorationColor: "#00838f" }}
                        >
                            Thế Giới Sách
                        </span>
                    </h1>
                    <p
                        className="text-base md:text-lg mb-8"
                        style={{ fontFamily: "'Lora', Georgia, serif", color: "#00626e" }}
                    >
                        Nơi Mỗi Trang Sách Là Một Cuộc Phiêu Lưu
                    </p>
                    <button
                        className="inline-flex items-center gap-2 px-7 py-3 rounded-full text-white font-semibold text-base shadow-lg hover:shadow-xl active:scale-95 transition-all duration-200"
                        style={{
                            background: "linear-gradient(135deg, #00bcd4 0%, #0097a7 100%)",
                            fontFamily: "'Lora', Georgia, serif",
                        }}
                    >
                        Xem thêm <span className="text-lg">→</span>
                    </button>
                </div>

                {/* Right: Books */}
                <div
                    className={`relative flex items-end justify-center flex-1 min-h-[320px] transition-all duration-700 delay-200 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                        }`}
                >
                    <div className="relative flex items-end justify-center w-full max-w-md h-80">
                        {books.map((book, i) => (
                            <div
                                key={book.id}
                                className="absolute bottom-0 transition-all duration-300 hover:scale-105 hover:-translate-y-3 cursor-pointer"
                                style={{
                                    left: `${i * 30}%`,
                                    zIndex: i === 1 ? 20 : 10,
                                    transform: `rotate(${i === 0 ? -8 : i === 1 ? 2 : 8}deg) scale(${i === 1 ? 1 : 0.88}) translateY(${i === 1 ? 0 : 16}px)`,
                                }}
                            >
                                <img
                                    src={book.url}
                                    alt={`Book ${book.id}`}
                                    className="w-36 md:w-44 h-52 md:h-64 object-cover rounded-lg"
                                    style={{
                                        boxShadow:
                                            i === 1
                                                ? "0 20px 50px rgba(0,150,180,0.35)"
                                                : "0 10px 30px rgba(0,100,140,0.2)",
                                    }}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Google Fonts */}
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=Lora:wght@400;600&display=swap');
      `}</style>
        </div>
    );
}