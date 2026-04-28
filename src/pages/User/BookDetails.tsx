import { useState } from "react";

const mockRelated = [
    {
        title: "Beloved Oxford (Tái Bản 2018)",
        price: "92.000₫",
        oldPrice: "110.000₫",
        img: "https://cdn0.fahasa.com/media/flashmagazine/images/page_images/beloved_oxford_tai_ban_2018/2022_11_21_17_04_21_1-390x510.jpg",
    },
    {
        title: "Cung Đường Vàng Nắng",
        price: "65.000₫",
        oldPrice: "80.000₫",
        img: "https://cdn0.fahasa.com/media/flashmagazine/images/page_images/cung_duong_vang_nang/2020_06_01_10_38_25_1-390x510.JPG",
    },
    {
        title: "Búp Bê Nhỏ Xíu Và Chàng Khổng Lồ",
        price: "42.000₫",
        oldPrice: "52.000₫",
        img: "https://newshop.vn/public/uploads/products/49485/sach-the-little-doll-and-the-big-giant-bup-be-nho-xiu-va-chang-khong-lo.jpg",
    },
    {
        title: "Yêu Em Bằng Mắt, Giữ Em Bằng Tim",
        price: "143.000₫",
        oldPrice: "175.000₫",
        img: "https://product.hstatic.net/200000696663/product/nxbtre_doc-yeu-em-bang-mat-giu-em-bang-tim-page-001_956dd43553554bb0adf6e4053262fa7d_grande.jpg",
    },
];

const coupons = [
    { code: "DINO200", desc: "Giảm 200k giá trị đơn hàng", exp: "12/12/2024", color: "bg-cyan-100 text-cyan-700" },
    { code: "DINO100", desc: "Giảm 100k cho đơn từ 500k", exp: "24/12/2024", color: "bg-emerald-100 text-emerald-700" },
];

export default function BookDetails() {
    const [qty, setQty] = useState(1);
    const [tab, setTab] = useState<"mo-ta" | "danh-gia">("mo-ta");
    const [saved, setSaved] = useState<string | null>(null);

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-800 pt-24">

            <main className="max-w-7xl mx-auto px-4 py-8">
                {/* TOP SECTION */}
                <div className="flex flex-col lg:flex-row gap-10">

                    {/* Book Cover */}
                    <div className="flex flex-col items-center gap-3 min-w-[220px]">
                        <img
                            src="https://isach.info/images/story/cover/harry_potter_va_bao_boi_tu_than__j_k_rowling.jpg"
                            alt="Harry Potter Và Bảo Bối Tử Thần"
                            className="rounded-lg shadow-md border border-gray-200 w-[220px] h-[300px] object-cover"
                        />
                        <div className="flex gap-2">
                            <img
                                src="https://isach.info/images/story/cover/harry_potter_va_bao_boi_tu_than__j_k_rowling.jpg"
                                alt="thumb"
                                className="rounded border-2 border-cyan-400 w-14 h-[76px] object-cover cursor-pointer"
                            />
                        </div>
                    </div>

                    {/* Main Info */}
                    <div className="flex-1 min-w-0">
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">
                            Harry Potter Và Bảo Bối Tử Thần - Tập 7 (Tái Bản)
                        </h1>
                        <div className="text-sm text-gray-500 space-y-1 mb-4">
                            <p>Thể loại: <span className="text-gray-700">Tiểu thuyết</span></p>
                            <p>Hình thức bìa: <span className="font-semibold text-gray-800">Bìa mềm</span></p>
                            <p>Mã: <span className="text-cyan-500">Đang cập nhật</span></p>
                            <p>Tình trạng: <span className="text-green-600 font-semibold">Còn hàng</span></p>
                        </div>

                        {/* Promo box */}
                        <div className="border-2 border-dashed border-cyan-300 rounded-xl p-4 mb-5 bg-cyan-50">
                            <p className="font-bold text-gray-800 mb-3">CTKM Đầu Năm Mới Tại Dino Book Store</p>
                            <ul className="space-y-2 text-sm text-gray-700">
                                <li className="flex gap-2">
                                    <span className="text-cyan-500 mt-0.5">✅</span>
                                    <span><strong>Freeship Đầu Năm – Đơn Hàng Từ 200K.</strong></span>
                                </li>
                                <li className="flex gap-2">
                                    <span className="text-cyan-500 mt-0.5">✅</span>
                                    <span><strong>Giảm giá 20%</strong> cho sách mới phát hành trong 3 tháng gần nhất</span>
                                </li>
                                <li className="flex gap-2">
                                    <span className="text-cyan-500 mt-0.5">✅</span>
                                    <span><strong>Giảm Giá Theo Số Tuổi</strong> (tối đa 30%)</span>
                                </li>
                            </ul>
                        </div>

                        {/* Coupons */}
                        <div className="flex gap-3 flex-wrap mb-5">
                            {coupons.map((c) => (
                                <div key={c.code} className="flex items-center gap-3 bg-white border border-gray-200 rounded-lg px-3 py-2 shadow-sm text-sm">
                                    <div className={`rounded px-2 py-1 font-bold text-xs ${c.color}`}>{c.code}</div>
                                    <div>
                                        <p className="font-medium text-gray-700">{c.desc}</p>
                                        <p className="text-gray-400 text-xs">HSD: {c.exp}</p>
                                    </div>
                                    <button
                                        className="text-cyan-500 border border-cyan-400 rounded px-2 py-0.5 text-xs hover:bg-cyan-50"
                                        onClick={() => setSaved(c.code)}
                                    >
                                        {saved === c.code ? "Đã lưu ✓" : "Lưu mã"}
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Panel */}
                    <div className="w-[200px] flex-shrink-0">
                        <div className="flex items-start gap-3 bg-white border border-gray-200 rounded-xl p-3 shadow-sm">
                            <img
                                src="https://www.jkrowling.com/wp-content/uploads/2025/07/JKRPortrait_2025.jpg"
                                alt="JK Rowling"
                                className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                            />
                            <div className="text-sm">
                                <p className="text-cyan-500 font-semibold">J.K. Rowling</p>
                                <p className="text-gray-500 line-clamp-4 text-xs leading-relaxed mt-1">
                                    J.K. Rowling là tác giả nổi tiếng với bộ tiểu thuyết Harry Potter, một trong những series sách bán chạy nhất mọi thời đại.
                                </p>
                            </div>
                        </div>

                        {/* Price & Actions */}
                        <div className="mt-6 space-y-4">
                            <div>
                                <div className="flex items-center gap-2">
                                    <span className="text-2xl font-bold text-cyan-500">233.000₫</span>
                                    <span className="text-gray-400 line-through text-sm">285.000₫</span>
                                </div>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-gray-500 text-sm">Giảm giá:</span>
                                    <span className="bg-cyan-500 text-white text-xs font-bold px-2 py-0.5 rounded">-18%</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <span className="text-sm text-gray-600">Số lượng:</span>
                                <div className="flex items-center border border-gray-300 rounded overflow-hidden">
                                    <button
                                        className="px-3 py-1 text-gray-600 hover:bg-gray-100 text-lg"
                                        onClick={() => setQty((q) => Math.max(1, q - 1))}
                                    >−</button>
                                    <span className="px-4 py-1 text-sm border-x border-gray-300">{qty}</span>
                                    <button
                                        className="px-3 py-1 text-gray-600 hover:bg-gray-100 text-lg"
                                        onClick={() => setQty((q) => q + 1)}
                                    >+</button>
                                </div>
                            </div>

                            <button className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-3 rounded-lg transition">
                                Mua ngay
                            </button>
                            <button className="w-full border-2 border-gray-300 hover:border-cyan-400 text-gray-700 font-semibold py-3 rounded-lg transition">
                                Thêm vào giỏ
                            </button>
                        </div>
                    </div>
                </div>

                {/* BOTTOM SECTION */}
                <div className="flex flex-col lg:flex-row gap-10 mt-10">
                    {/* Description & Reviews */}
                    <div className="flex-1">
                        <div className="flex border-b border-gray-200 mb-5">
                            {(["mo-ta", "danh-gia"] as const).map((t) => (
                                <button
                                    key={t}
                                    onClick={() => setTab(t)}
                                    className={`px-5 py-2 text-sm font-semibold border-b-2 transition ${tab === t
                                        ? "border-cyan-500 text-cyan-500"
                                        : "border-transparent text-gray-500 hover:text-gray-700"
                                        }`}
                                >
                                    {t === "mo-ta" ? "Mô tả" : "Đánh giá"}
                                </button>
                            ))}
                        </div>

                        {tab === "mo-ta" && (
                            <>
                                <p className="text-sm text-gray-700 leading-relaxed mb-4">
                                    Harry Potter đang chuẩn bị rời khỏi nhà Dursley và đường Privet Drive trong thời khắc cuối cùng.
                                    Tuy nhiên, tương lai Harry đầy rẫy hiểm nguy...
                                </p>
                                <p className="text-sm text-gray-700 leading-relaxed mb-6">
                                    Ở phần kết đầy kịch tính của loạt truyện Harry Potter này, Harry phải dấn thân vào cuộc hành trình nguy hiểm cuối cùng.
                                </p>

                                <table className="w-full border border-gray-200 rounded-xl overflow-hidden text-sm">
                                    <tbody>
                                        {[
                                            ["Tác giả", "J.K.Rowling, Lý Lan"],
                                            ["NXB", "Trẻ"],
                                            ["Năm XB", "2022"],
                                            ["Trọng lượng (gr)", "700"],
                                            ["Kích Thước Bao Bì", "20 x 14 cm"],
                                            ["Số trang", "846"],
                                            ["Hình thức", "Bìa Mềm"],
                                        ].map(([label, value], i) => (
                                            <tr key={label} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                                                <td className="px-5 py-3 text-gray-500 font-medium border border-gray-200 w-1/3">{label}</td>
                                                <td className="px-5 py-3 text-gray-800 border border-gray-200">{value}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </>
                        )}

                        {tab === "danh-gia" && (
                            <p className="text-sm text-gray-500 italic">Chưa có đánh giá nào.</p>
                        )}
                    </div>

                    {/* Related Books */}
                    <div className="min-w-[240px] max-w-[280px]">
                        <h3 className="font-bold text-gray-800 mb-4 text-base">Có Thể Bạn Thích</h3>
                        <div className="space-y-4">
                            {mockRelated.map((book) => (
                                <div key={book.title} className="flex gap-3 cursor-pointer hover:opacity-80 transition">
                                    <img
                                        src={book.img}
                                        alt={book.title}
                                        className="w-14 h-[76px] rounded object-cover border border-gray-200 flex-shrink-0"
                                    />
                                    <div>
                                        <p className="text-sm text-gray-800 font-medium line-clamp-2">{book.title}</p>
                                        <p className="text-cyan-500 font-bold text-sm mt-1">{book.price}</p>
                                        <p className="text-gray-400 line-through text-xs">{book.oldPrice}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}