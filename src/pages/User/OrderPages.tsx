import { useState } from "react";

const provinces = ["Hà Nội", "TP. Hồ Chí Minh", "Đà Nẵng", "Thanh Hóa", "Hải Phòng", "Cần Thơ"];
const districts = ["Quận 1", "Quận 2", "Quận 3", "Quận Bình Thạnh"];
const wards = ["Phường 1", "Phường 2", "Phường 3", "Phường Bến Nghé"];

type PaymentMethod = "transfer" | "cod";

export default function OrderPage() {
    const [email, setEmail] = useState("");
    const [fullName, setFullName] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [province, setProvince] = useState("");
    const [district, setDistrict] = useState("");
    const [ward, setWard] = useState("");
    const [note, setNote] = useState("");
    const [payment, setPayment] = useState<PaymentMethod>("transfer");
    const [coupon, setCoupon] = useState("");

    const subtotal = 466000;
    const shipping = 0;
    const total = subtotal + shipping;

    const fmt = (n: number) =>
        n.toLocaleString("vi-VN") + "₫";

    return (
        <div className="min-h-screen bg-gray-50 font-sans pt-24">

            <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left + Middle */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Shipping Info */}
                    <section>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-bold text-gray-800">Thông tin nhận hàng</h2>
                            <button className="flex items-center gap-1 text-blue-500 text-sm font-medium hover:underline">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                Đăng nhập
                            </button>
                        </div>

                        <div className="space-y-3">
                            <input
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                className="w-full border border-gray-300 rounded-md px-4 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-200 bg-white"
                            />
                            <input
                                type="text"
                                placeholder="Họ và tên"
                                value={fullName}
                                onChange={e => setFullName(e.target.value)}
                                className="w-full border border-gray-300 rounded-md px-4 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-200 bg-white"
                            />
                            {/* Phone with flag */}
                            <div className="flex border border-gray-300 rounded-md overflow-hidden bg-white focus-within:border-blue-400 focus-within:ring-1 focus-within:ring-blue-200">
                                <div className="flex items-center gap-1 px-3 border-r border-gray-300 bg-white min-w-[64px]">
                                    <span className="text-lg">🇻🇳</span>
                                    <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                                <input
                                    type="tel"
                                    placeholder="Số điện thoại (tùy chọn)"
                                    value={phone}
                                    onChange={e => setPhone(e.target.value)}
                                    className="flex-1 px-4 py-2.5 text-sm outline-none bg-white"
                                />
                            </div>
                            <input
                                type="text"
                                placeholder="Địa chỉ (tùy chọn)"
                                value={address}
                                onChange={e => setAddress(e.target.value)}
                                className="w-full border border-gray-300 rounded-md px-4 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-200 bg-white"
                            />
                            {/* Province */}
                            <div className="relative">
                                <select
                                    value={province}
                                    onChange={e => setProvince(e.target.value)}
                                    className="w-full border border-gray-300 rounded-md px-4 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-200 bg-white appearance-none text-gray-500"
                                >
                                    <option value="">Tỉnh thành</option>
                                    {provinces.map(p => <option key={p} value={p}>{p}</option>)}
                                </select>
                                <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                            {/* District */}
                            <div className="relative">
                                <select
                                    value={district}
                                    onChange={e => setDistrict(e.target.value)}
                                    className="w-full border border-gray-300 rounded-md px-4 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-200 bg-gray-100 appearance-none text-gray-400"
                                    disabled={!province}
                                >
                                    <option value="">Quận huyện (tùy chọn)</option>
                                    {districts.map(d => <option key={d} value={d}>{d}</option>)}
                                </select>
                                <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                            {/* Ward */}
                            <div className="relative">
                                <select
                                    value={ward}
                                    onChange={e => setWard(e.target.value)}
                                    className="w-full border border-gray-300 rounded-md px-4 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-200 bg-gray-100 appearance-none text-gray-400"
                                    disabled={!district}
                                >
                                    <option value="">Phường xã (tùy chọn)</option>
                                    {wards.map(w => <option key={w} value={w}>{w}</option>)}
                                </select>
                                <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                            <textarea
                                placeholder="Ghi chú (tùy chọn)"
                                value={note}
                                onChange={e => setNote(e.target.value)}
                                rows={3}
                                className="w-full border border-gray-300 rounded-md px-4 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-200 bg-white resize-y"
                            />
                        </div>
                    </section>

                    {/* Shipping Method */}
                    <section>
                        <h2 className="text-lg font-bold text-gray-800 mb-4">Vận chuyển</h2>
                        <div className="bg-blue-50 border border-blue-200 rounded-md px-4 py-3 text-sm text-blue-600">
                            Vui lòng nhập thông tin giao hàng
                        </div>
                    </section>

                    {/* Payment */}
                    <section>
                        <h2 className="text-lg font-bold text-gray-800 mb-4">Thanh toán</h2>
                        <div className="border border-gray-200 rounded-md overflow-hidden bg-white">
                            {/* Transfer */}
                            <label className="flex items-center justify-between px-4 py-3.5 cursor-pointer hover:bg-gray-50 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${payment === "transfer" ? "border-blue-500" : "border-gray-300"}`}>
                                        {payment === "transfer" && <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />}
                                    </div>
                                    <span className="text-sm font-medium text-gray-700">Chuyển khoản</span>
                                </div>
                                <div className="w-8 h-8 bg-teal-100 rounded flex items-center justify-center text-teal-600">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                </div>
                            </label>
                            <div className="border-t border-gray-200" />
                            {/* COD */}
                            <label
                                className="flex items-center justify-between px-4 py-3.5 cursor-pointer hover:bg-gray-50 transition-colors"
                                onClick={() => setPayment("cod")}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${payment === "cod" ? "border-blue-500" : "border-gray-300"}`}>
                                        {payment === "cod" && <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />}
                                    </div>
                                    <span className="text-sm font-medium text-gray-700">Thu hộ (COD)</span>
                                </div>
                                <div className="w-8 h-8 bg-teal-100 rounded flex items-center justify-center text-teal-600">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                </div>
                            </label>
                        </div>
                    </section>
                </div>

                {/* Right - Order Summary */}
                <aside className="lg:col-span-1">
                    <div className="bg-white border border-gray-200 rounded-lg p-5 sticky top-8">
                        <h2 className="text-base font-bold text-gray-800 mb-4">Đơn hàng (2 sản phẩm)</h2>

                        {/* Product */}
                        <div className="flex items-start gap-3 mb-5">
                            <div className="relative flex-shrink-0">
                                <div className="w-14 h-16 bg-red-100 rounded overflow-hidden">
                                    <img
                                        src="https://isach.info/images/story/cover/harry_potter_va_bao_boi_tu_than__j_k_rowling.jpg"
                                        alt="Harry Potter"
                                        className="w-full h-full object-cover"
                                        onError={e => {
                                            (e.target as HTMLImageElement).src = "";
                                        }}
                                    />
                                </div>
                                <div className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center font-bold">
                                    2
                                </div>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm text-gray-700 leading-snug">Harry Potter Và Bảo Bối Tử Thần - Tập 7 (Tái Bản)</p>
                            </div>
                            <div className="text-sm font-medium text-gray-800 whitespace-nowrap">
                                {fmt(466000)}
                            </div>
                        </div>

                        {/* Coupon */}
                        <div className="flex gap-2 mb-5">
                            <input
                                type="text"
                                placeholder="Nhập mã giảm giá"
                                value={coupon}
                                onChange={e => setCoupon(e.target.value)}
                                className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-200"
                            />
                            <button className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-md transition-colors whitespace-nowrap">
                                Áp dụng
                            </button>
                        </div>

                        {/* Price breakdown */}
                        <div className="space-y-2 border-t border-gray-100 pt-4 mb-4">
                            <div className="flex justify-between text-sm text-gray-600">
                                <span>Tạm tính</span>
                                <span>{fmt(subtotal)}</span>
                            </div>
                            <div className="flex justify-between text-sm text-gray-600">
                                <span>Phí vận chuyển</span>
                                <span className="text-gray-400">-</span>
                            </div>
                        </div>

                        {/* Total */}
                        <div className="flex justify-between items-center border-t border-gray-200 pt-4 mb-5">
                            <span className="font-semibold text-gray-800">Tổng cộng</span>
                            <span className="text-xl font-bold text-blue-500">{fmt(total)}</span>
                        </div>

                        {/* Actions */}
                        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-md transition-colors tracking-wide text-sm uppercase">
                            ĐẶT HÀNG
                        </button>
                        <button className="w-full mt-3 text-blue-500 text-sm hover:underline flex items-center justify-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            Quay về giỏ hàng
                        </button>
                    </div>
                </aside>
            </div>
        </div>
    );
}