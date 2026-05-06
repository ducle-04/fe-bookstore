import { useState } from "react";
import { Trash2, Minus, Plus, ArrowRight, Ticket } from "lucide-react";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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

interface Voucher {
    id: number;
    code: string;
    description: string;
    discount: number;
    type: 'percent' | 'fixed';
    minOrder: number;
}

const MOCK_VOUCHERS: Voucher[] = [
    { id: 1, code: "SALE20", description: "Giảm 20% cho đơn hàng từ 300.000đ", discount: 20, type: 'percent', minOrder: 300000 },
    { id: 2, code: "FREESHIP", description: "Miễn phí vận chuyển", discount: 30000, type: 'fixed', minOrder: 200000 },
    { id: 3, code: "VIP50", description: "Giảm 50.000đ cho thành viên VIP", discount: 50000, type: 'fixed', minOrder: 400000 },
];

interface CartProps {
    isInModal?: boolean;
    onClose?: () => void;
}

export default function Cart({ isInModal = false, onClose }: CartProps) {
    const [cartItems, setCartItems] = useState(initialCart);
    const [voucherCodeInput, setVoucherCodeInput] = useState("");
    const [selectedVoucher, setSelectedVoucher] = useState<Voucher | null>(null);
    const [showVoucherModal, setShowVoucherModal] = useState(false);

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

    const discount = selectedVoucher
        ? selectedVoucher.type === 'percent'
            ? Math.floor(subtotal * selectedVoucher.discount / 100)
            : selectedVoucher.discount
        : 0;

    const total = subtotal - discount;
    const fmt = (n: number) => n.toLocaleString("vi-VN") + "₫";

    const applyVoucherByCode = () => {
        if (!voucherCodeInput.trim()) return;
        const found = MOCK_VOUCHERS.find(v => v.code.toUpperCase() === voucherCodeInput.trim().toUpperCase());
        if (found) {
            if (subtotal < found.minOrder) {
                toast.warning(`Đơn hàng tối thiểu ${fmt(found.minOrder)} mới áp dụng được`);
                return;
            }
            setSelectedVoucher(found);
            setVoucherCodeInput("");
            toast.success(`Áp dụng voucher ${found.code} thành công!`);
        } else {
            toast.error("Mã voucher không tồn tại hoặc đã hết hạn");
        }
    };

    const removeVoucher = () => {
        setSelectedVoucher(null);
        toast.info("Đã bỏ voucher");
    };

    const applyVoucherFromList = (voucher: Voucher) => {
        if (subtotal < voucher.minOrder) {
            toast.warning(`Đơn hàng tối thiểu ${fmt(voucher.minOrder)} mới áp dụng được`);
            return;
        }
        setSelectedVoucher(voucher);
        setShowVoucherModal(false);
        toast.success(`Áp dụng voucher ${voucher.code} thành công!`);
    };

    return (
        <div className={`bg-white ${isInModal ? 'h-full' : 'min-h-screen pt-20 pb-10'}`}>
            <div className={`max-w-4xl mx-auto px-4 ${isInModal ? 'h-full flex flex-col' : ''}`}>

                {!isInModal && (
                    <h1 className="text-2xl font-bold text-gray-900 mb-6">Giỏ hàng của bạn</h1>
                )}

                {cartItems.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="text-6xl mb-4">🛍️</div>
                        <h3 className="text-xl font-semibold text-gray-700">Giỏ hàng trống</h3>
                    </div>
                ) : (
                    <div className={`${isInModal ? 'flex-1 overflow-auto' : ''} space-y-5`}>

                        {/* Danh sách sản phẩm - Thu gọn */}
                        <div className="space-y-4">
                            {cartItems.map((item) => (
                                <div
                                    key={item.id}
                                    className="border border-gray-200 rounded-2xl p-4 flex gap-4 hover:border-cyan-200 transition-colors"
                                >
                                    <img
                                        src={item.img}
                                        alt={item.title}
                                        className="w-20 h-28 object-cover rounded-xl border border-gray-100 flex-shrink-0"
                                    />

                                    <div className="flex-1 min-w-0 flex flex-col">
                                        <h3 className="font-medium text-gray-800 text-[15px] leading-tight line-clamp-2">
                                            {item.title}
                                        </h3>

                                        <div className="mt-2 flex items-baseline gap-2">
                                            <span className="text-lg font-semibold text-cyan-600">
                                                {item.price.toLocaleString('vi-VN')}₫
                                            </span>
                                            {item.oldPrice && (
                                                <span className="text-sm text-gray-400 line-through">
                                                    {item.oldPrice.toLocaleString('vi-VN')}₫
                                                </span>
                                            )}
                                        </div>

                                        <div className="mt-auto pt-4 flex items-center justify-between">
                                            <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden text-sm">
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                    className="w-9 h-8 flex items-center justify-center hover:bg-gray-100"
                                                >
                                                    <Minus size={16} />
                                                </button>
                                                <span className="w-10 text-center font-semibold text-gray-700">
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    className="w-9 h-8 flex items-center justify-center hover:bg-gray-100"
                                                >
                                                    <Plus size={16} />
                                                </button>
                                            </div>

                                            <div className="text-right">
                                                <p className="text-xs text-gray-500">Thành tiền</p>
                                                <p className="font-bold text-base text-gray-900">
                                                    {(item.price * item.quantity).toLocaleString('vi-VN')}₫
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => removeItem(item.id)}
                                        className="text-gray-400 hover:text-red-500 self-start mt-1"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* Phần tóm tắt - Thu gọn */}
                        <div className="border border-gray-200 rounded-3xl p-5 bg-gray-50">
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Tạm tính</span>
                                    <span>{subtotal.toLocaleString('vi-VN')}₫</span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="text-gray-600">Phí vận chuyển</span>
                                    <span className="text-green-600">Miễn phí</span>
                                </div>

                                {selectedVoucher && (
                                    <div className="flex justify-between text-green-600">
                                        <span>Giảm giá</span>
                                        <span>-{discount.toLocaleString('vi-VN')}₫</span>
                                    </div>
                                )}

                                <div className="border-t border-gray-300 pt-3 flex justify-between text-lg font-bold">
                                    <span>Tổng cộng</span>
                                    <span className="text-cyan-600">
                                        {total.toLocaleString('vi-VN')}₫
                                    </span>
                                </div>
                            </div>

                            {/* Voucher Section */}
                            <div className="mt-5">
                                <div className="font-medium text-gray-700 mb-2 text-sm">Voucher / Mã giảm giá</div>

                                {selectedVoucher ? (
                                    <div className="border border-green-200 bg-green-50 rounded-2xl p-3.5 flex justify-between items-center">
                                        <div className="text-sm">
                                            <p className="font-semibold text-green-700">{selectedVoucher.code}</p>
                                            <p className="text-green-600 text-xs">{selectedVoucher.description}</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <p className="font-bold text-green-600 text-sm">-{discount.toLocaleString('vi-VN')}₫</p>
                                            <button onClick={removeVoucher} className="text-red-500 text-xs font-medium">Bỏ</button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                value={voucherCodeInput}
                                                onChange={(e) => setVoucherCodeInput(e.target.value.toUpperCase())}
                                                placeholder="Nhập mã voucher"
                                                className="flex-1 px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:border-cyan-400 text-sm"
                                                onKeyDown={(e) => e.key === 'Enter' && applyVoucherByCode()}
                                            />
                                            <button
                                                onClick={applyVoucherByCode}
                                                disabled={!voucherCodeInput.trim()}
                                                className="px-6 bg-cyan-500 hover:bg-cyan-600 disabled:bg-gray-300 text-white font-medium rounded-2xl transition text-sm"
                                            >
                                                Áp dụng
                                            </button>
                                        </div>

                                        <button
                                            onClick={() => setShowVoucherModal(true)}
                                            className="w-full border-2 border-dashed border-gray-300 hover:border-cyan-400 rounded-2xl py-3 text-cyan-600 font-medium flex items-center justify-center gap-2 text-sm"
                                        >
                                            <Ticket size={16} />
                                            Chọn voucher có sẵn
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Nút thanh toán */}
                            <button
                                onClick={() => {
                                    alert("Chuyển đến trang thanh toán");
                                    onClose?.();
                                }}
                                className="w-full mt-6 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-3.5 rounded-2xl text-base flex items-center justify-center gap-2 transition"
                            >
                                Tiến hành thanh toán
                                <ArrowRight size={20} />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Voucher Modal */}
            {showVoucherModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
                    <div className="bg-white rounded-2xl w-full max-w-md mx-4 overflow-hidden">
                        <div className="p-4 border-b">
                            <h3 className="font-bold text-lg">Chọn voucher</h3>
                        </div>
                        <div className="p-4 space-y-3 max-h-[55vh] overflow-y-auto">
                            {MOCK_VOUCHERS.map(v => (
                                <div
                                    key={v.id}
                                    onClick={() => applyVoucherFromList(v)}
                                    className="border border-gray-200 hover:border-cyan-400 rounded-2xl p-4 cursor-pointer transition-all"
                                >
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="font-bold">{v.code}</p>
                                            <p className="text-sm text-gray-600">{v.description}</p>
                                        </div>
                                        <div className="text-right">
                                            {v.type === 'percent' ? (
                                                <p className="font-bold text-red-500">-{v.discount}%</p>
                                            ) : (
                                                <p className="font-bold text-red-500">-{fmt(v.discount)}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="p-4 border-t">
                            <button
                                onClick={() => setShowVoucherModal(false)}
                                className="w-full py-3 text-gray-600 font-medium border border-gray-300 rounded-2xl text-sm"
                            >
                                Đóng
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <ToastContainer position="top-center" autoClose={3500} />
        </div>
    );
}