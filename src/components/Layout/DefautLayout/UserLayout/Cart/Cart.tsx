import { useState } from "react";
import { Trash2, Minus, Plus, ArrowRight } from "lucide-react";

const initialCart = [
    {
        id: 1,
        title: "Harry Potter Và Bảo Bối Tử Thần - Tập 7 (Tái Bản)",
        price: 233000,
        oldPrice: 285000,
        quantity: 1,
        img: "https://isach.info/images/story/cover/harry_potter_va_bao_boi_tu_than__j_k_rowling.jpg",
    },
    {
        id: 2,
        title: "Beloved Oxford (Tái Bản 2018)",
        price: 92000,
        oldPrice: 110000,
        quantity: 2,
        img: "https://cdn0.fahasa.com/media/flashmagazine/images/page_images/beloved_oxford_tai_ban_2018/2022_11_21_17_04_21_1-390x510.jpg",
    },
];

interface CartProps {
    isInModal?: boolean;
    onClose?: () => void;
}

export default function Cart({ isInModal = false, onClose }: CartProps) {
    const [cartItems, setCartItems] = useState(initialCart);
    const [couponCode, setCouponCode] = useState("");
    const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);

    const updateQuantity = (id: number, newQty: number) => {
        if (newQty < 1) return;
        setCartItems(prev =>
            prev.map(item =>
                item.id === id ? { ...item, quantity: newQty } : item
            )
        );
    };

    const removeItem = (id: number) => {
        setCartItems(prev => prev.filter(item => item.id !== id));
    };

    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const discount = appliedCoupon ? 50000 : 0;
    const total = subtotal - discount;

    return (
        <div className={`bg-white ${isInModal ? 'h-full' : 'min-h-screen pt-24 pb-12'}`}>
            <div className={`max-w-4xl mx-auto px-4 ${isInModal ? 'h-full flex flex-col' : ''}`}>

                {/* Header */}
                {!isInModal && (
                    <h1 className="text-3xl font-bold text-gray-900 mb-8">Giỏ hàng của bạn</h1>
                )}

                {cartItems.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="text-7xl mb-6">🛍️</div>
                        <h3 className="text-2xl font-semibold text-gray-700">Giỏ hàng trống</h3>
                        <p className="text-gray-500 mt-3">Bạn chưa có sản phẩm nào trong giỏ hàng.</p>
                    </div>
                ) : (
                    <div className={`${isInModal ? 'flex-1 overflow-auto' : ''} space-y-6`}>

                        {/* Danh sách sản phẩm - Chữ nhật dọc (không bóng) */}
                        <div className="space-y-5">
                            {cartItems.map((item) => (
                                <div
                                    key={item.id}
                                    className="border border-gray-200 rounded-2xl p-5 flex gap-5 hover:border-cyan-200 transition-colors"
                                >
                                    {/* Ảnh sách */}
                                    <img
                                        src={item.img}
                                        alt={item.title}
                                        className="w-24 h-32 object-cover rounded-xl border border-gray-100 flex-shrink-0"
                                    />

                                    {/* Thông tin */}
                                    <div className="flex-1 min-w-0 flex flex-col">
                                        <h3 className="font-medium text-gray-800 leading-tight line-clamp-2">
                                            {item.title}
                                        </h3>

                                        <div className="mt-3 flex items-baseline gap-3">
                                            <span className="text-xl font-semibold text-cyan-600">
                                                {item.price.toLocaleString('vi-VN')}₫
                                            </span>
                                            {item.oldPrice && (
                                                <span className="text-sm text-gray-400 line-through">
                                                    {item.oldPrice.toLocaleString('vi-VN')}₫
                                                </span>
                                            )}
                                        </div>

                                        {/* Số lượng + Thành tiền */}
                                        <div className="mt-auto pt-6 flex items-center justify-between">
                                            <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden">
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                    className="w-10 h-9 flex items-center justify-center hover:bg-gray-100 active:bg-gray-200 text-gray-600"
                                                >
                                                    <Minus size={18} />
                                                </button>
                                                <span className="w-12 text-center font-semibold text-gray-700">
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    className="w-10 h-9 flex items-center justify-center hover:bg-gray-100 active:bg-gray-200 text-gray-600"
                                                >
                                                    <Plus size={18} />
                                                </button>
                                            </div>

                                            <div className="text-right">
                                                <p className="text-xs text-gray-500">Thành tiền</p>
                                                <p className="font-bold text-lg text-gray-900">
                                                    {(item.price * item.quantity).toLocaleString('vi-VN')}₫
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Nút xóa */}
                                    <button
                                        onClick={() => removeItem(item.id)}
                                        className="text-gray-400 hover:text-red-500 transition self-start mt-1"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* Phần tóm tắt thanh toán */}
                        <div className="border border-gray-200 rounded-3xl p-6 bg-gray-50">
                            <div className="space-y-4">
                                <div className="flex justify-between text-gray-600">
                                    <span>Tạm tính</span>
                                    <span>{subtotal.toLocaleString('vi-VN')}₫</span>
                                </div>

                                <div className="flex justify-between text-gray-600">
                                    <span>Phí vận chuyển</span>
                                    <span className="text-green-600">Miễn phí</span>
                                </div>

                                {discount > 0 && (
                                    <div className="flex justify-between text-green-600">
                                        <span>Giảm giá</span>
                                        <span>-{discount.toLocaleString('vi-VN')}₫</span>
                                    </div>
                                )}

                                <div className="border-t border-gray-300 pt-4 flex justify-between text-xl font-bold">
                                    <span>Tổng cộng</span>
                                    <span className="text-cyan-600">
                                        {total.toLocaleString('vi-VN')}₫
                                    </span>
                                </div>
                            </div>

                            {/* Mã giảm giá */}
                            <div className="mt-6">
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={couponCode}
                                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                        placeholder="Nhập mã giảm giá"
                                        className="flex-1 px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:border-cyan-400 text-sm"
                                    />
                                    <button
                                        onClick={() => couponCode && setAppliedCoupon(couponCode)}
                                        className="px-7 bg-cyan-500 hover:bg-cyan-600 text-white font-medium rounded-2xl transition"
                                    >
                                        Áp dụng
                                    </button>
                                </div>
                                {appliedCoupon && (
                                    <p className="text-green-600 text-sm mt-2">✓ Mã {appliedCoupon} đã áp dụng</p>
                                )}
                            </div>

                            {/* Nút thanh toán */}
                            <button
                                onClick={() => {
                                    alert("Chuyển đến trang thanh toán");
                                    onClose?.();
                                }}
                                className="w-full mt-8 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-4 rounded-2xl text-lg flex items-center justify-center gap-2 transition"
                            >
                                Tiến hành thanh toán
                                <ArrowRight size={22} />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}