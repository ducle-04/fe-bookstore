import React from 'react';
import {
    Search,
    Download,
    TrendingUp,
    Users,
    FileText,
    DollarSign,
} from 'lucide-react';
import {
    BarChart,
    Bar,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
} from 'recharts';

// ==================== MOCK DATA ====================
const stats = {
    totalBooks: 1248,
    activeBooks: 987,
    totalOrders: 3421,
    totalRevenue: 125680000,
    totalUsers: 8750,
};

const bookByMonth = [
    { month: 'Th1', count: 45 }, { month: 'Th2', count: 52 }, { month: 'Th3', count: 48 },
    { month: 'Th4', count: 67 }, { month: 'Th5', count: 89 }, { month: 'Th6', count: 95 },
    { month: 'Th7', count: 120 }, { month: 'Th8', count: 135 }, { month: 'Th9', count: 98 },
    { month: 'Th10', count: 76 }, { month: 'Th11', count: 82 }, { month: 'Th12', count: 110 },
];

const orderByMonth = [
    { month: 'Th1', count: 210 }, { month: 'Th2', count: 340 }, { month: 'Th3', count: 420 },
    { month: 'Th4', count: 580 }, { month: 'Th5', count: 720 }, { month: 'Th6', count: 890 },
    { month: 'Th7', count: 1050 }, { month: 'Th8', count: 980 }, { month: 'Th9', count: 850 },
    { month: 'Th10', count: 760 }, { month: 'Th11', count: 680 }, { month: 'Th12', count: 920 },
];

const revenueData = [
    { month: 'Th1', revenue: 45, last: 38 },
    { month: 'Th2', revenue: 68, last: 52 },
    { month: 'Th3', revenue: 75, last: 60 },
    { month: 'Th4', revenue: 92, last: 71 },
    { month: 'Th5', revenue: 110, last: 85 },
    { month: 'Th6', revenue: 125, last: 98 },
];

const orderStatusData = [
    { name: 'Chờ xác nhận', value: 45, color: '#f59e0b' },
    { name: 'Đang giao', value: 68, color: '#3b82f6' },
    { name: 'Đã giao', value: 285, color: '#10b981' },
    { name: 'Đã huỷ', value: 18, color: '#ef4444' },
    { name: 'Hoàn tiền', value: 12, color: '#8b5cf6' },
];

const topSellingBooks = [
    { rank: 1, name: "Đắc Nhân Tâm", author: "Dale Carnegie", sold: 1240 },
    { rank: 2, name: "Atomic Habits", author: "James Clear", sold: 980 },
    { rank: 3, name: "Nhà Giả Kim", author: "Paulo Coelho", sold: 875 },
    { rank: 4, name: "Tôi Thấy Hoa Vàng...", author: "Nguyễn Nhật Ánh", sold: 720 },
    { rank: 5, name: "Kẻ Ăn Hồn", author: "Huyền Chip", sold: 650 },
];

const lowStockBooks = [
    { name: "Kẻ Ăn Hồn", stock: 8 },
    { name: "Doraemon Tập 45", stock: 5 },
    { name: "Tôi Là Beto", stock: 9 },
];

const hotCategories = [
    { name: "Văn học", count: 245 },
    { name: "Kỹ năng sống", count: 198 },
    { name: "Manga - Comic", count: 156 },
    { name: "Kinh tế", count: 98 },
];

const Dashboard: React.FC = () => {
    const currentMonthRevenue = 125;
    const lastMonthRevenue = 98;
    const growth = ((currentMonthRevenue - lastMonthRevenue) / lastMonthRevenue * 100).toFixed(1);

    const handleExportExcel = () => alert("Đang xuất báo cáo Excel...");

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b">
                <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
                    <h1 className="text-2xl font-bold">Dashboard Quản Trị</h1>
                    <div className="flex items-center gap-4">
                        <button onClick={handleExportExcel} className="flex items-center gap-3 px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700">
                            <Download size={22} /> Xuất báo cáo Excel
                        </button>
                        <div className="relative w-80">
                            <Search className="absolute left-3 top-3 text-gray-400" size={18} />
                            <input type="text" placeholder="Tìm sách, khách hàng..." className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:border-blue-500" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">

                {/* KPI */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                    {[
                        {
                            label: 'Tổng Sách',
                            value: stats.totalBooks.toLocaleString(),
                            bg: 'bg-blue-600 text-white'
                        },
                        {
                            label: 'Sách Đang Bán',
                            value: stats.activeBooks.toLocaleString(),
                            bg: 'bg-green-500 text-white'
                        },
                        {
                            label: 'Tổng Đơn Hàng',
                            value: stats.totalOrders.toLocaleString(),
                            bg: 'bg-purple-500 text-white'
                        },
                        {
                            label: 'Doanh Thu',
                            value: stats.totalRevenue.toLocaleString() + '₫',
                            bg: 'bg-orange-500 text-white'
                        },
                        {
                            label: 'Khách Hàng',
                            value: stats.totalUsers.toLocaleString(),
                            bg: 'bg-pink-500 text-white'
                        },
                    ].map((item, i) => (
                        <div
                            key={i}
                            className={`${item.bg} p-6 rounded-2xl shadow border`}
                        >
                            <p className="text-3xl font-bold">{item.value}</p>
                            <p className="mt-1 opacity-90">{item.label}</p>
                        </div>
                    ))}
                </div>

                {/* ==================== THỐNG KÊ DOANH THU ==================== */}
                <div className="bg-white rounded-2xl p-6 border border-gray-200">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h3 className="text-xl font-semibold">Thống kê Doanh thu</h3>
                            <p className="text-sm text-gray-500">So sánh với tháng trước</p>
                        </div>
                        <div className="text-right">
                            <p className="text-3xl font-bold text-green-600">{currentMonthRevenue} triệu</p>
                            <p className="text-sm text-gray-500">Tháng này</p>
                            <p className={`text-sm font-medium ${Number(growth) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {Number(growth) >= 0 ? '↑' : '↓'} {growth}% so với tháng trước ({lastMonthRevenue} triệu)
                            </p>
                        </div>
                    </div>

                    <ResponsiveContainer width="100%" height={380}>
                        <LineChart data={revenueData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis tickFormatter={(v) => v + 'tr'} />
                            <Tooltip formatter={(v) => [`${v} triệu`, 'Doanh thu']} />
                            <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={4} name="Tháng này" />
                            <Line type="monotone" dataKey="last" stroke="#94a3b8" strokeWidth={2} strokeDasharray="5 5" name="Tháng trước" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Biểu đồ  */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-white p-6 rounded-2xl border">
                        <h3 className="font-semibold mb-4">Sách được thêm theo tháng</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={bookByMonth}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="count" fill="#3b82f6" radius={8} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border">
                        <h3 className="font-semibold mb-4">Đơn hàng theo tháng</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={orderByMonth}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip />
                                <Line type="monotone" dataKey="count" stroke="#10b981" strokeWidth={3} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Thống kê trạng thái đơn hàng */}
                <div className="bg-white rounded-2xl p-6 border">
                    <h3 className="text-lg font-semibold mb-6">Thống kê trạng thái đơn hàng</h3>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie data={orderStatusData} cx="50%" cy="50%" innerRadius={80} outerRadius={120} dataKey="value">
                                    {orderStatusData.map((entry, index) => (
                                        <Cell key={index} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>

                        <div className="space-y-6">
                            {orderStatusData.map(item => (
                                <div key={item.name}>
                                    <div className="flex justify-between mb-1 text-sm">
                                        <span>{item.name}</span>
                                        <span className="font-bold">{item.value} đơn</span>
                                    </div>
                                    <div className="h-2.5 bg-gray-100 rounded-full">
                                        <div className="h-full rounded-full" style={{ width: `${(item.value / 428) * 100}%`, backgroundColor: item.color }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Top sách + Sách sắp hết + Danh mục hot */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 bg-white rounded-2xl p-6 border">
                        <h3 className="font-semibold mb-5">Top 5 sách bán chạy nhất</h3>
                        <div className="space-y-4">
                            {topSellingBooks.map(book => (
                                <div key={book.rank} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                    <div className="flex items-center gap-4">
                                        <span className="text-xl font-bold text-gray-400">#{book.rank}</span>
                                        <div>
                                            <p className="font-medium">{book.name}</p>
                                            <p className="text-sm text-gray-500">{book.author}</p>
                                        </div>
                                    </div>
                                    <p className="font-bold text-green-600">{book.sold.toLocaleString()} cuốn</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-8">
                        <div className="bg-white rounded-2xl p-6 border">
                            <h3 className="font-semibold mb-4 text-orange-600">Sách sắp hết hàng</h3>
                            {lowStockBooks.map((b, i) => (
                                <div key={i} className="py-3 border-b last:border-0 flex justify-between">
                                    <span>{b.name}</span>
                                    <span className="text-red-600 font-medium">Còn {b.stock}</span>
                                </div>
                            ))}
                        </div>

                        <div className="bg-white rounded-2xl p-6 border">
                            <h3 className="font-semibold mb-4">Thể loại hot</h3>
                            {hotCategories.map(cat => (
                                <div key={cat.name} className="flex justify-between py-3 border-b last:border-0">
                                    <span>{cat.name}</span>
                                    <span className="font-medium">{cat.count} sách</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Dashboard;