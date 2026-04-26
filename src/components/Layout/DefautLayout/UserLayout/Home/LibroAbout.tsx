import { useEffect, useState } from "react";
import { BookOpen, Home, Tag, Headphones } from "lucide-react";

const features = [
    {
        icon: BookOpen,
        title: "Đa dạng đầu sách",
        desc: "Cung cấp nhiều thể loại sách phong phú, luôn cập nhật các tựa sách mới phù hợp với mọi lứa tuổi.",
    },
    {
        icon: Home,
        title: "Không gian thân thiện",
        desc: "Không gian đọc sách yên tĩnh, ấm cúng, giúp bạn thư giãn và tận hưởng từng trang sách.",
    },
    {
        icon: Tag,
        title: "Khuyến mãi hấp dẫn",
        desc: "Thường xuyên có ưu đãi, giảm giá và sự kiện sách mới, giúp bạn mua sách với giá tốt.",
    },
    {
        icon: Headphones,
        title: "DVKH tận tâm",
        desc: "Tư vấn nhiệt tình, giúp bạn chọn được sách phù hợp và mang lại trải nghiệm mua sắm tốt nhất.",
    },
];

export default function LibroAbout() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <div
            className="relative w-full overflow-hidden flex items-center"
            style={{ minHeight: 560 }}
        >
            <div className="relative z-10 w-full max-w-7xl mx-auto px-8 md:px-16 py-14 flex flex-col md:flex-row items-center gap-12">

                {/* Left image */}
                <div
                    className={`flex-1 max-w-lg transition-all duration-700 ${mounted ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"
                        }`}
                >
                    <div className="rounded-2xl overflow-hidden">
                        <img
                            src="https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=700&q=80"
                            alt="Dino Book Store"
                            className="w-full h-full object-cover"
                            style={{ minHeight: 360 }}
                        />
                    </div>
                </div>

                {/* Right content */}
                <div
                    className={`flex-1 transition-all duration-700 delay-200 ${mounted ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
                        }`}
                >
                    <h2
                        className="text-4xl md:text-5xl font-extrabold"
                        style={{
                            fontFamily: "'Playfair Display', Georgia, serif",
                            color: "#00838f",
                        }}
                    >
                        Về Libro Book Store
                    </h2>

                    <div
                        className="mt-2 mb-5 rounded-full"
                        style={{
                            width: 80,
                            height: 4,
                            background: "linear-gradient(90deg, #00bcd4, #0097a7)",
                        }}
                    />

                    <p
                        className="text-base md:text-lg leading-relaxed mb-8"
                        style={{ fontFamily: "'Lora', Georgia, serif", color: "#00626e" }}
                    >
                        Điểm đến lý tưởng cho những người yêu sách, mang đến không gian đọc sách ấm cúng cùng kho sách phong phú. Chúng mình không chỉ là nơi mua sách mà còn là điểm hẹn của cộng đồng yêu sách.
                    </p>

                    {/* Features */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {features.map((f, i) => {
                            const Icon = f.icon;

                            return (
                                <div
                                    key={i}
                                    className="transition-all duration-500"
                                    style={{
                                        transitionDelay: `${300 + i * 100}ms`,
                                        opacity: mounted ? 1 : 0,
                                        transform: mounted
                                            ? "translateY(0)"
                                            : "translateY(16px)",
                                    }}
                                >
                                    {/* Icon */}
                                    <div
                                        className="w-14 h-14 rounded-2xl flex items-center justify-center mb-3"
                                        style={{
                                            background:
                                                "linear-gradient(135deg, #b2ebf2, #e0f7fa)",
                                            border: "2px solid #80deea",
                                        }}
                                    >
                                        <Icon size={28} color="#007c91" />
                                    </div>

                                    <h3
                                        className="text-lg font-bold mb-1"
                                        style={{
                                            fontFamily: "'Playfair Display', Georgia, serif",
                                            color: "#004d5a",
                                        }}
                                    >
                                        {f.title}
                                    </h3>

                                    <p
                                        className="text-sm leading-relaxed"
                                        style={{
                                            fontFamily: "'Lora', Georgia, serif",
                                            color: "#00626e",
                                        }}
                                    >
                                        {f.desc}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=Lora:wght@400;600&display=swap');
      `}</style>
        </div>
    );
}