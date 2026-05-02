import { useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

type OrderStatus =
    | "PENDING"
    | "CONFIRMED"
    | "PACKING"
    | "SHIPPED"
    | "DELIVERED"
    | "CANCELLED"
    | "REFUNDED";

interface OrderItem {
    id: number;
    bookTitle: string;
    quantity: number;
    unitPrice: number;
    subtotal: number;
}

interface Order {
    id: number;
    code: string;
    customerName: string;
    customerEmail: string;
    address: string;
    subtotal: number;
    shippingFee: number;
    discountAmount: number;
    totalAmount: number;
    pointsEarned: number;
    promotionCode?: string;
    status: OrderStatus;
    source: string;
    note?: string;
    orderedAt: string;
    deliveredAt?: string;
    orderItems: OrderItem[];
}

interface OrderStatistics {
    totalOrders: number;
    totalRevenue: number;
    pendingOrders: number;
    deliveredOrders: number;
    cancelledOrders: number;
    refundedOrders: number;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MOCK_STATISTICS: OrderStatistics = {
    totalOrders: 1248,
    totalRevenue: 284_500_000,
    pendingOrders: 43,
    deliveredOrders: 1102,
    cancelledOrders: 78,
    refundedOrders: 25,
};

const MOCK_ORDERS: Order[] = [
    {
        id: 1,
        code: "ORD-2024-000001",
        customerName: "Nguyễn Văn An",
        customerEmail: "an.nguyen@gmail.com",
        address: "123 Lê Lợi, Q.1, TP.HCM",
        subtotal: 450_000,
        shippingFee: 30_000,
        discountAmount: 50_000,
        totalAmount: 430_000,
        pointsEarned: 43,
        promotionCode: "SUMMER10",
        status: "PENDING",
        source: "web",
        note: "Giao trong giờ hành chính",
        orderedAt: "2024-06-01T09:23:00",
        orderItems: [
            { id: 1, bookTitle: "Đắc Nhân Tâm", quantity: 2, unitPrice: 150_000, subtotal: 300_000 },
            { id: 2, bookTitle: "Nhà Giả Kim", quantity: 1, unitPrice: 150_000, subtotal: 150_000 },
        ],
    },
    {
        id: 2,
        code: "ORD-2024-000002",
        customerName: "Trần Thị Bích",
        customerEmail: "bich.tran@yahoo.com",
        address: "45 Trần Phú, Q. Hải Châu, Đà Nẵng",
        subtotal: 210_000,
        shippingFee: 25_000,
        discountAmount: 0,
        totalAmount: 235_000,
        pointsEarned: 23,
        status: "CONFIRMED",
        source: "mobile",
        orderedAt: "2024-06-01T11:05:00",
        orderItems: [
            { id: 3, bookTitle: "Sapiens", quantity: 1, unitPrice: 210_000, subtotal: 210_000 },
        ],
    },
    {
        id: 3,
        code: "ORD-2024-000003",
        customerName: "Lê Hoàng Minh",
        customerEmail: "minh.le@outlook.com",
        address: "88 Nguyễn Huệ, Q. Hoàn Kiếm, Hà Nội",
        subtotal: 680_000,
        shippingFee: 30_000,
        discountAmount: 100_000,
        totalAmount: 610_000,
        pointsEarned: 61,
        promotionCode: "BOOK20",
        status: "SHIPPED",
        source: "web",
        orderedAt: "2024-05-30T14:40:00",
        orderItems: [
            { id: 4, bookTitle: "Tư Duy Nhanh Và Chậm", quantity: 1, unitPrice: 280_000, subtotal: 280_000 },
            { id: 5, bookTitle: "Atomic Habits", quantity: 1, unitPrice: 220_000, subtotal: 220_000 },
            { id: 6, bookTitle: "Deep Work", quantity: 1, unitPrice: 180_000, subtotal: 180_000 },
        ],
    },
    {
        id: 4,
        code: "ORD-2024-000004",
        customerName: "Phạm Thị Dung",
        customerEmail: "dung.pham@gmail.com",
        address: "12 Pasteur, Q.3, TP.HCM",
        subtotal: 320_000,
        shippingFee: 30_000,
        discountAmount: 0,
        totalAmount: 350_000,
        pointsEarned: 35,
        status: "DELIVERED",
        source: "web",
        orderedAt: "2024-05-28T08:15:00",
        deliveredAt: "2024-05-31T16:30:00",
        orderItems: [
            { id: 7, bookTitle: "Cà Phê Cùng Tony", quantity: 2, unitPrice: 160_000, subtotal: 320_000 },
        ],
    },
    {
        id: 5,
        code: "ORD-2024-000005",
        customerName: "Võ Thanh Hùng",
        customerEmail: "hung.vo@gmail.com",
        address: "67 Đinh Tiên Hoàng, Bình Thạnh, TP.HCM",
        subtotal: 540_000,
        shippingFee: 30_000,
        discountAmount: 54_000,
        totalAmount: 516_000,
        pointsEarned: 0,
        status: "CANCELLED",
        source: "mobile",
        note: "Khách hủy do đặt nhầm",
        orderedAt: "2024-05-27T20:10:00",
        orderItems: [
            { id: 8, bookTitle: "The Alchemist", quantity: 3, unitPrice: 180_000, subtotal: 540_000 },
        ],
    },
    {
        id: 6,
        code: "ORD-2024-000006",
        customerName: "Hoàng Kim Liên",
        customerEmail: "lien.hoang@gmail.com",
        address: "23 Lạc Long Quân, Tây Hồ, Hà Nội",
        subtotal: 190_000,
        shippingFee: 25_000,
        discountAmount: 0,
        totalAmount: 215_000,
        pointsEarned: 21,
        status: "PACKING",
        source: "web",
        orderedAt: "2024-06-01T15:30:00",
        orderItems: [
            { id: 9, bookTitle: "Muôn Kiếp Nhân Sinh", quantity: 1, unitPrice: 190_000, subtotal: 190_000 },
        ],
    },
];

// ─── Constants ────────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<OrderStatus, { label: string; color: string; bg: string; dot: string }> = {
    PENDING: { label: "Chờ xác nhận", color: "text-amber-700", bg: "bg-amber-50  border-amber-200", dot: "bg-amber-400" },
    CONFIRMED: { label: "Đã xác nhận", color: "text-blue-700", bg: "bg-blue-50   border-blue-200", dot: "bg-blue-400" },
    PACKING: { label: "Đang đóng gói", color: "text-violet-700", bg: "bg-violet-50 border-violet-200", dot: "bg-violet-400" },
    SHIPPED: { label: "Đang giao", color: "text-indigo-700", bg: "bg-indigo-50 border-indigo-200", dot: "bg-indigo-400" },
    DELIVERED: { label: "Đã giao", color: "text-emerald-700", bg: "bg-emerald-50 border-emerald-200", dot: "bg-emerald-400" },
    CANCELLED: { label: "Đã huỷ", color: "text-red-700", bg: "bg-red-50    border-red-200", dot: "bg-red-400" },
    REFUNDED: { label: "Đã hoàn tiền", color: "text-slate-700", bg: "bg-slate-100 border-slate-200", dot: "bg-slate-400" },
};

const ALL_STATUSES = Object.keys(STATUS_CONFIG) as OrderStatus[];

const STATUS_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
    PENDING: ["CONFIRMED", "CANCELLED"],
    CONFIRMED: ["PACKING", "CANCELLED"],
    PACKING: ["SHIPPED", "CANCELLED"],
    SHIPPED: ["DELIVERED"],
    DELIVERED: ["REFUNDED"],
    CANCELLED: [],
    REFUNDED: [],
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmt = (n: number) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(n);

const fmtDate = (s: string) =>
    new Date(s).toLocaleString("vi-VN", { dateStyle: "short", timeStyle: "short" });

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: OrderStatus }) {
    const c = STATUS_CONFIG[status];
    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${c.bg} ${c.color}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
            {c.label}
        </span>
    );
}

function StatCard({ label, value, sub, accent }: { label: string; value: string | number; sub?: string; accent: string }) {
    return (
        <div className={`bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex flex-col gap-1 border-l-4 ${accent}`}>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">{label}</p>
            <p className="text-2xl font-bold text-slate-800 tabular-nums">{value}</p>
            {sub && <p className="text-xs text-slate-400">{sub}</p>}
        </div>
    );
}

function OrderDetailPanel({ order, onClose, onStatusChange }: {
    order: Order;
    onClose: () => void;
    onStatusChange: (id: number, status: OrderStatus) => void;
}) {
    const nextStatuses = STATUS_TRANSITIONS[order.status];
    return (
        <div className="fixed inset-0 z-50 flex">
            {/* backdrop */}
            <div className="flex-1 bg-black/30 backdrop-blur-sm" onClick={onClose} />
            {/* panel */}
            <div className="w-full max-w-lg bg-white shadow-2xl flex flex-col overflow-hidden">
                {/* header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
                    <div>
                        <p className="text-xs text-slate-400 font-semibold tracking-widest uppercase">Chi tiết đơn hàng</p>
                        <h2 className="font-bold text-slate-800 font-mono">{order.code}</h2>
                    </div>
                    <button onClick={onClose} className="w-8 h-8 rounded-full bg-slate-200 hover:bg-slate-300 flex items-center justify-center text-slate-600 transition-colors">
                        ✕
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
                    {/* status + actions */}
                    <div className="flex items-center justify-between">
                        <StatusBadge status={order.status} />
                        {nextStatuses.length > 0 && (
                            <div className="flex gap-2">
                                {nextStatuses.map((s) => (
                                    <button
                                        key={s}
                                        onClick={() => onStatusChange(order.id, s)}
                                        className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all
                      ${s === "CANCELLED" || s === "REFUNDED"
                                                ? "border-red-200 text-red-600 hover:bg-red-50"
                                                : "border-indigo-200 text-indigo-600 hover:bg-indigo-50"}`}
                                    >
                                        → {STATUS_CONFIG[s].label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* customer */}
                    <Section title="Khách hàng">
                        <Row label="Tên" value={order.customerName} />
                        <Row label="Email" value={order.customerEmail} />
                        <Row label="Địa chỉ" value={order.address} />
                    </Section>

                    {/* meta */}
                    <Section title="Thông tin đơn">
                        <Row label="Ngày đặt" value={fmtDate(order.orderedAt)} />
                        {order.deliveredAt && <Row label="Ngày giao" value={fmtDate(order.deliveredAt)} />}
                        <Row label="Nguồn" value={order.source === "web" ? "🌐 Website" : "📱 Mobile"} />
                        {order.promotionCode && <Row label="Mã KM" value={order.promotionCode} />}
                        {order.note && <Row label="Ghi chú" value={order.note} />}
                    </Section>

                    {/* items */}
                    <Section title={`Sản phẩm (${order.orderItems.length})`}>
                        <div className="space-y-2">
                            {order.orderItems.map((item) => (
                                <div key={item.id} className="flex justify-between items-start text-sm">
                                    <div>
                                        <p className="font-medium text-slate-700">{item.bookTitle}</p>
                                        <p className="text-slate-400 text-xs">x{item.quantity} × {fmt(item.unitPrice)}</p>
                                    </div>
                                    <span className="font-semibold text-slate-700">{fmt(item.subtotal)}</span>
                                </div>
                            ))}
                        </div>
                    </Section>

                    {/* totals */}
                    <Section title="Thanh toán">
                        <Row label="Tạm tính" value={fmt(order.subtotal)} />
                        <Row label="Phí ship" value={fmt(order.shippingFee)} />
                        <Row label="Giảm giá" value={`-${fmt(order.discountAmount)}`} className="text-emerald-600" />
                        <div className="border-t border-slate-100 mt-2 pt-2 flex justify-between font-bold text-slate-800">
                            <span>Tổng cộng</span>
                            <span className="text-indigo-600">{fmt(order.totalAmount)}</span>
                        </div>
                        <Row label="Điểm tích luỹ" value={`+${order.pointsEarned} pts`} className="text-amber-600" />
                    </Section>
                </div>
            </div>
        </div>
    );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">{title}</p>
            <div className="bg-slate-50 rounded-xl p-4 space-y-2">{children}</div>
        </div>
    );
}

function Row({ label, value, className = "" }: { label: string; value: string; className?: string }) {
    return (
        <div className="flex justify-between text-sm">
            <span className="text-slate-400">{label}</span>
            <span className={`font-medium text-slate-700 text-right max-w-[60%] ${className}`}>{value}</span>
        </div>
    );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function OrderManagement() {
    const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [statusFilter, setStatusFilter] = useState<OrderStatus | "ALL">("ALL");
    const [search, setSearch] = useState("");
    const [view, setView] = useState<"orders" | "stats">("orders");

    const handleStatusChange = (id: number, status: OrderStatus) => {
        setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
        setSelectedOrder((prev) => (prev?.id === id ? { ...prev, status } : prev));
    };

    const filtered = orders.filter((o) => {
        const matchStatus = statusFilter === "ALL" || o.status === statusFilter;
        const q = search.toLowerCase();
        const matchSearch =
            !q ||
            o.code.toLowerCase().includes(q) ||
            o.customerName.toLowerCase().includes(q) ||
            o.customerEmail.toLowerCase().includes(q);
        return matchStatus && matchSearch;
    });

    return (
        <div className="min-h-screen bg-slate-50 font-sans">
            {/* ── Top bar ── */}
            <header className="bg-white border-b border-slate-100 px-6 py-3 flex items-center gap-1">
                {[
                    { key: "orders", icon: "📦", label: "Đơn hàng" },
                    { key: "stats", icon: "📊", label: "Thống kê" },
                ].map((item) => (
                    <button
                        key={item.key}
                        onClick={() => setView(item.key as "orders" | "stats")}
                        className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all
              ${view === item.key
                                ? "bg-indigo-50 text-indigo-700"
                                : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"}`}
                    >
                        <span>{item.icon}</span>
                        {item.label}
                    </button>
                ))}
            </header>

            {/* ── Content ── */}
            <main>
                {view === "stats" ? (
                    <StatsView stats={MOCK_STATISTICS} orders={orders} />
                ) : (
                    <OrdersView
                        orders={filtered}
                        allOrders={orders}
                        search={search}
                        setSearch={setSearch}
                        statusFilter={statusFilter}
                        setStatusFilter={setStatusFilter}
                        onSelect={setSelectedOrder}
                    />
                )}
            </main>

            {/* ── Detail Panel ── */}
            {selectedOrder && (
                <OrderDetailPanel
                    order={selectedOrder}
                    onClose={() => setSelectedOrder(null)}
                    onStatusChange={handleStatusChange}
                />
            )}
        </div>
    );
}

// ─── Orders View ──────────────────────────────────────────────────────────────

function OrdersView({ orders, allOrders, search, setSearch, statusFilter, setStatusFilter, onSelect }: {
    orders: Order[];
    allOrders: Order[];
    search: string;
    setSearch: (s: string) => void;
    statusFilter: OrderStatus | "ALL";
    setStatusFilter: (s: OrderStatus | "ALL") => void;
    onSelect: (o: Order) => void;
}) {
    const countByStatus = (s: OrderStatus) => allOrders.filter((o) => o.status === s).length;

    return (
        <div className="p-6 space-y-5">
            {/* header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-bold text-slate-800">Quản lý đơn hàng</h1>
                    <p className="text-sm text-slate-400 mt-0.5">{orders.length} kết quả</p>
                </div>
            </div>

            {/* quick stats row */}
            <div className="grid grid-cols-4 gap-3">
                <MiniStat label="Chờ xác nhận" count={countByStatus("PENDING")} color="text-amber-600" />
                <MiniStat label="Đang giao" count={countByStatus("SHIPPED")} color="text-indigo-600" />
                <MiniStat label="Đã giao" count={countByStatus("DELIVERED")} color="text-emerald-600" />
                <MiniStat label="Đã huỷ" count={countByStatus("CANCELLED")} color="text-red-500" />
            </div>

            {/* toolbar */}
            <div className="flex gap-3">
                <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">🔍</span>
                    <input
                        type="text"
                        placeholder="Tìm theo mã đơn, tên, email..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300 placeholder-slate-300"
                    />
                </div>
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as OrderStatus | "ALL")}
                    className="px-3 py-2.5 text-sm rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300 text-slate-700"
                >
                    <option value="ALL">Tất cả trạng thái</option>
                    {ALL_STATUSES.map((s) => (
                        <option key={s} value={s}>{STATUS_CONFIG[s].label}</option>
                    ))}
                </select>
            </div>

            {/* table */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-slate-100 bg-slate-50">
                            {["Mã đơn", "Khách hàng", "Sản phẩm", "Tổng tiền", "Trạng thái", "Ngày đặt", ""].map((h) => (
                                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-widest whitespace-nowrap">{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {orders.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="py-12 text-center text-slate-400 text-sm">Không tìm thấy đơn hàng nào</td>
                            </tr>
                        ) : (
                            orders.map((order) => (
                                <tr key={order.id} className="hover:bg-slate-50/80 transition-colors group">
                                    <td className="px-4 py-3">
                                        <span className="font-mono text-xs font-semibold text-indigo-600">{order.code}</span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <p className="font-medium text-slate-700">{order.customerName}</p>
                                        <p className="text-slate-400 text-xs">{order.customerEmail}</p>
                                    </td>
                                    <td className="px-4 py-3 text-slate-500">
                                        {order.orderItems.length} sản phẩm
                                    </td>
                                    <td className="px-4 py-3 font-semibold text-slate-800 tabular-nums">
                                        {fmt(order.totalAmount)}
                                    </td>
                                    <td className="px-4 py-3">
                                        <StatusBadge status={order.status} />
                                    </td>
                                    <td className="px-4 py-3 text-slate-400 text-xs whitespace-nowrap">
                                        {fmtDate(order.orderedAt)}
                                    </td>
                                    <td className="px-4 py-3">
                                        <button
                                            onClick={() => onSelect(order)}
                                            className="opacity-0 group-hover:opacity-100 text-xs font-semibold text-indigo-600 hover:underline transition-opacity"
                                        >
                                            Chi tiết →
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function MiniStat({ label, count, color }: { label: string; count: number; color: string }) {
    return (
        <div className="bg-white border border-slate-100 rounded-xl px-4 py-3 shadow-sm">
            <p className="text-xs text-slate-400">{label}</p>
            <p className={`text-lg font-bold tabular-nums ${color}`}>{count}</p>
        </div>
    );
}

// ─── Stats View ───────────────────────────────────────────────────────────────

function StatsView({ stats, orders }: { stats: OrderStatistics; orders: Order[] }) {
    const statusCounts = ALL_STATUSES.map((s) => ({
        status: s,
        count: orders.filter((o) => o.status === s).length,
        label: STATUS_CONFIG[s].label,
    }));
    const maxCount = Math.max(...statusCounts.map((s) => s.count), 1);

    return (
        <div className="p-6 space-y-5">
            <div>
                <h1 className="text-xl font-bold text-slate-800">Thống kê đơn hàng</h1>
                <p className="text-sm text-slate-400 mt-0.5">Tổng quan hiệu quả kinh doanh</p>
            </div>

            {/* KPI cards */}
            <div className="grid grid-cols-3 gap-4">
                <StatCard label="Tổng đơn hàng" value={stats.totalOrders.toLocaleString("vi-VN")} accent="border-l-indigo-500" />
                <StatCard label="Doanh thu" value={fmt(stats.totalRevenue)} accent="border-l-emerald-500" sub="Tổng từ đơn giao thành công" />
                <StatCard label="Chờ xử lý" value={stats.pendingOrders} accent="border-l-amber-400" sub="Cần xác nhận sớm" />
            </div>
            <div className="grid grid-cols-3 gap-4">
                <StatCard label="Giao thành công" value={stats.deliveredOrders.toLocaleString("vi-VN")} accent="border-l-emerald-400" />
                <StatCard label="Đã huỷ" value={stats.cancelledOrders} accent="border-l-red-400" />
                <StatCard label="Hoàn tiền" value={stats.refundedOrders} accent="border-l-slate-400" />
            </div>

            {/* bar chart by status */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                <p className="text-sm font-bold text-slate-600 mb-5">Phân bổ theo trạng thái</p>
                <div className="space-y-3">
                    {statusCounts.map(({ status, count, label }) => {
                        const cfg = STATUS_CONFIG[status];
                        const pct = Math.round((count / maxCount) * 100);
                        return (
                            <div key={status} className="flex items-center gap-3">
                                <span className="text-xs text-slate-400 w-28 shrink-0">{label}</span>
                                <div className="flex-1 bg-slate-100 rounded-full h-2.5 overflow-hidden">
                                    <div
                                        className={`h-full rounded-full ${cfg.dot}`}
                                        style={{ width: `${pct}%`, transition: "width 0.5s ease" }}
                                    />
                                </div>
                                <span className="text-xs font-bold text-slate-600 w-6 text-right">{count}</span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* recent orders */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                <p className="text-sm font-bold text-slate-600 mb-4">Đơn hàng gần đây</p>
                <div className="space-y-3">
                    {orders.slice(0, 5).map((o) => (
                        <div key={o.id} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-sm">📦</div>
                                <div>
                                    <p className="text-xs font-mono font-semibold text-indigo-600">{o.code}</p>
                                    <p className="text-xs text-slate-400">{o.customerName}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <StatusBadge status={o.status} />
                                <span className="text-sm font-bold text-slate-700 tabular-nums">{fmt(o.totalAmount)}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}