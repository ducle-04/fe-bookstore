import { useState } from "react";
import { Eye, X } from "lucide-react";
import Swal from "sweetalert2";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// ─── Types ─────────────────────────────────────────
interface OrderItem {
    id: number;
    name: string;
    quantity: number;
    price: number;
    image: string;
}

interface Order {
    id: number;
    code: string;
    date: string;
    status: "Chờ xác nhận" | "Đã xác nhận" | "Đang đóng gói" | "Đang giao" | "Đã giao" | "Đã huỷ" | "Đã hoàn tiền";
    total: number;
    address: string;
    phone: string;
    items: OrderItem[];
}

// ─── Mock Data ─────────────────────────────────────
const INITIAL_ORDERS: Order[] = [
    {
        id: 1,
        code: "ORD001",
        date: "01-05-2026",
        status: "Đã xác nhận",
        total: 250000,
        address: "123 Lê Lợi, Quận 1, TP.HCM",
        phone: "0912345678",
        items: [
            {
                id: 1,
                name: "Harry Potter tập 7",
                quantity: 2,
                price: 125000,
                image: "https://sachnoi.vip/wp-content/uploads/2023/01/harry-potter-7.jpg"
            },
            {
                id: 2,
                name: "Doraemon tập 1",
                quantity: 1,
                price: 60000,
                image: "https://cdn0.fahasa.com/media/flashmagazine/images/page_images/doi_quan_doraemon___tap_1_tai_ban_2022/2024_04_16_10_44_22_1-390x510.jpg"
            }
        ]
    },

    {
        id: 2,
        code: "ORD002",
        date: "28-04-2026",
        status: "Đã giao",
        total: 180000,
        address: "45 Võ Văn Tần, Quận 3, TP.HCM",
        phone: "0901234567",
        items: [
            {
                id: 3,
                name: "One Piece tập 100",
                quantity: 3,
                price: 60000,
                image: "https://nhasachquangloi.vn/pub/media/catalog/product/cache/3bd4b739bad1f096e12e3a82b40e551a/o/n/one_piece_t_p_100_th_ng_1.jpg"
            }
        ]
    },

    {
        id: 3,
        code: "ORD003",
        date: "25-04-2026",
        status: "Đã huỷ",
        total: 320000,
        address: "88 Quang Trung, Thanh Hóa",
        phone: "0987654321",
        items: [
            {
                id: 4,
                name: "Attack on Titan tập 30",
                quantity: 2,
                price: 160000,
                image: "https://cdn1.fahasa.com/media/catalog/product/a/t/attack_on_titan.jpg"
            }
        ]
    },

    {
        id: 4,
        code: "ORD004",
        date: "20-04-2026",
        status: "Đã hoàn tiền",
        total: 540000,
        address: "12 Nguyễn Huệ, Quận 1, TP.HCM",
        phone: "0911111111",
        items: [
            {
                id: 5,
                name: "Naruto tập 72",
                quantity: 4,
                price: 90000,
                image: "https://cdn1.fahasa.com/media/catalog/product/n/a/naruto.jpg"
            },
            {
                id: 6,
                name: "Conan tập 100",
                quantity: 1,
                price: 180000,
                image: "https://cdn1.fahasa.com/media/catalog/product/c/o/conan.jpg"
            }
        ]
    },

    {
        id: 5,
        code: "ORD005",
        date: "18-04-2026",
        status: "Đang giao",
        total: 150000,
        address: "Hà Nội, Hoàn Kiếm",
        phone: "0933333333",
        items: [
            {
                id: 7,
                name: "Dế Mèn Phiêu Lưu Ký",
                quantity: 1,
                price: 150000,
                image: "https://cdn1.fahasa.com/media/catalog/product/d/e/de_men.jpg"
            }
        ]
    },

    {
        id: 6,
        code: "ORD006",
        date: "15-04-2026",
        status: "Đã giao",
        total: 420000,
        address: "Đà Nẵng",
        phone: "0944444444",
        items: [
            {
                id: 8,
                name: "Clean Code",
                quantity: 2,
                price: 210000,
                image: "https://cdn1.fahasa.com/media/catalog/product/c/l/clean_code.jpg"
            }
        ]
    }
];

// ─── Helper ────────────────────────────────────────
const fmt = (n: number) => n.toLocaleString("vi-VN") + "₫";

// ─── Component ─────────────────────────────────────
export default function OrderHistoryPage() {
    const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

    const handleCancelOrder = (orderId: number) => {
        const order = orders.find(o => o.id === orderId);
        if (!order || order.status !== "Đang giao") return;

        Swal.fire({
            title: "Xác nhận huỷ đơn?",
            html: `Bạn có chắc muốn huỷ đơn hàng <strong>${order.code}</strong>?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Có, huỷ đơn",
            cancelButtonText: "Không, quay lại",
            confirmButtonColor: "#ef4444",
            cancelButtonColor: "#6b7280",
        }).then((result) => {
            if (result.isConfirmed) {
                setOrders(prev =>
                    prev.map(o =>
                        o.id === orderId ? { ...o, status: "Đã huỷ" } : o
                    )
                );

                toast.success(`Đơn hàng ${order.code} đã được huỷ thành công!`, {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                });
            }
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-24 px-4">
            <div className="max-w-5xl mx-auto">

                <h1 className="text-2xl font-bold mb-6 text-gray-800">
                    Danh sách đơn hàng
                </h1>

                {/* LIST */}
                <div className="space-y-5">
                    {orders.map(order => (
                        <div key={order.id} className="bg-white rounded-xl border shadow-sm overflow-hidden">

                            {/* Header */}
                            <div className="flex justify-between items-center px-4 py-3 border-b bg-gray-50">
                                <div className="flex items-center gap-2 text-sm">
                                    <span className="font-semibold text-gray-700">
                                        Mã: {order.code}
                                    </span>
                                    <span className="text-gray-400">|</span>
                                    <span className="text-gray-500">{order.date}</span>
                                </div>

                                <span className={`text-sm font-semibold ${order.status === "Đã giao"
                                    ? "text-green-600"
                                    : order.status === "Đang giao"
                                        ? "text-yellow-600"
                                        : "text-red-500"
                                    }`}>
                                    {order.status}
                                </span>
                            </div>

                            {/* Body */}
                            <div className="p-4">
                                <div className="flex gap-4">

                                    {/* Ảnh stack */}
                                    <div className="flex -space-x-3">
                                        {order.items.slice(0, 3).map(item => (
                                            <img
                                                key={item.id}
                                                src={item.image}
                                                className="w-16 h-20 object-cover rounded border"
                                                alt={item.name}
                                            />
                                        ))}
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1">
                                        <p className="font-medium text-gray-800 line-clamp-1">
                                            {order.items[0]?.name}
                                        </p>

                                        <p className="text-sm text-gray-500 mt-1">
                                            x{order.items[0]?.quantity}
                                        </p>

                                        {order.items.length > 1 && (
                                            <p className="text-xs text-gray-400 mt-1">
                                                +{order.items.length - 1} sản phẩm khác
                                            </p>
                                        )}
                                    </div>

                                    {/* Price */}
                                    <div className="text-right">
                                        <p className="text-lg font-bold text-red-500">
                                            {fmt(order.total)}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="flex justify-between items-center px-4 py-3 border-t bg-gray-50">

                                <span className="text-sm text-gray-500">
                                    Thành tiền:
                                    <span className="text-red-500 font-semibold ml-1">
                                        {fmt(order.total)}
                                    </span>
                                </span>

                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setSelectedOrder(order)}
                                        className="px-4 py-2 text-sm border rounded-lg hover:bg-gray-100 flex items-center gap-1"
                                    >
                                        <Eye className="w-4 h-4" />
                                        Xem chi tiết
                                    </button>

                                    {order.status === "Đã giao" && (
                                        <button className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                                            Mua lại
                                        </button>
                                    )}

                                    {order.status === "Đang giao" && (
                                        <button
                                            onClick={() => handleCancelOrder(order.id)}
                                            className="px-4 py-2 text-sm border text-red-500 border-red-400 rounded-lg hover:bg-red-50"
                                        >
                                            Huỷ đơn
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* MODAL CHI TIẾT */}
            {selectedOrder && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white w-full max-w-lg rounded-xl shadow-xl">

                        {/* Header */}
                        <div className="flex justify-between items-center p-4 border-b">
                            <h2 className="font-bold text-lg">Chi tiết đơn hàng</h2>
                            <button onClick={() => setSelectedOrder(null)}>
                                <X className="w-6 h-6 text-gray-600" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-4 space-y-4">

                            {/* Info */}
                            <div className="text-sm space-y-1">
                                <p><b>Mã đơn:</b> {selectedOrder.code}</p>
                                <p><b>Ngày:</b> {selectedOrder.date}</p>
                                <p><b>Trạng thái:</b> {selectedOrder.status}</p>
                            </div>

                            {/* Address */}
                            <div className="border rounded-lg p-3 bg-gray-50">
                                <p className="font-medium mb-1">Địa chỉ nhận hàng</p>
                                <p>{selectedOrder.address}</p>
                                <p className="text-gray-500 text-sm">{selectedOrder.phone}</p>
                            </div>

                            {/* Items */}
                            <div>
                                <p className="font-medium mb-2">Sản phẩm</p>
                                {selectedOrder.items.map(item => (
                                    <div key={item.id} className="flex gap-3 mb-3">
                                        <img
                                            src={item.image}
                                            className="w-14 h-16 object-cover rounded"
                                            alt={item.name}
                                        />
                                        <div className="flex-1">
                                            <p className="text-sm">{item.name}</p>
                                            <p className="text-xs text-gray-500">
                                                SL: {item.quantity}
                                            </p>
                                        </div>
                                        <p className="text-sm font-medium">
                                            {fmt(item.price)}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            {/* Total */}
                            <div className="flex justify-between border-t pt-3 font-bold">
                                <span>Tổng cộng</span>
                                <span className="text-red-500">
                                    {fmt(selectedOrder.total)}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <ToastContainer />
        </div>
    );
}