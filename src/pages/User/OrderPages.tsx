import { useState } from "react";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { MapPin, CreditCard, Truck, Banknote, Ticket, Building2, ChevronDown, Check, Plus } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Address {
    id: number;
    recipientName: string;
    recipientPhone: string;
    province: string;
    ward: string;
    detailAddress: string;
    isDefault: boolean;
}

interface Voucher {
    id: number;
    code: string;
    description: string;
    discount: number;
    type: 'percent' | 'fixed';
    minOrder: number;
}

type PaymentMethod = "cod" | "momo" | "vnpay" | "bank";
type AddressMode = "select" | "new" | "edit";

// ─── Mock Data ────────────────────────────────────────────────────────────────
const MOCK_ADDRESSES: Address[] = [
    {
        id: 1,
        recipientName: "Nguyễn Văn An",
        recipientPhone: "0912345678",
        province: "TP. Hồ Chí Minh",
        ward: "Phường Bến Nghé, Quận 1",
        detailAddress: "123 Lê Lợi",
        isDefault: true,
    },
    {
        id: 2,
        recipientName: "Văn Phòng",
        recipientPhone: "0912345678",
        province: "TP. Hồ Chí Minh",
        ward: "Phường 6, Quận 3",
        detailAddress: "45 Võ Văn Tần, Tầng 3",
        isDefault: false,
    },
    {
        id: 3,
        recipientName: "Nhà Ba Mẹ",
        recipientPhone: "0901234567",
        province: "Thanh Hóa",
        ward: "Phường Lam Sơn, TP. Thanh Hóa",
        detailAddress: "88 Quang Trung",
        isDefault: false,
    },
];

const MOCK_VOUCHERS: Voucher[] = [
    { id: 1, code: "SALE20", description: "Giảm 20% cho đơn hàng từ 300.000đ", discount: 20, type: 'percent', minOrder: 300000 },
    { id: 2, code: "FREESHIP", description: "Miễn phí vận chuyển", discount: 30000, type: 'fixed', minOrder: 200000 },
    { id: 3, code: "VIP50", description: "Giảm 50.000đ cho thành viên VIP", discount: 50000, type: 'fixed', minOrder: 400000 },
];

const PROVINCES = ["Hà Nội", "TP. Hồ Chí Minh", "Đà Nẵng", "Thanh Hóa", "Hải Phòng", "Cần Thơ"];

const DISTRICTS: Record<string, string[]> = {
    "TP. Hồ Chí Minh": ["Quận 1", "Quận 3", "Quận Bình Thạnh", "Quận Gò Vấp"],
    "Hà Nội": ["Hoàn Kiếm", "Đống Đa", "Cầu Giấy", "Tây Hồ"],
    "Thanh Hóa": ["TP. Thanh Hóa", "Tĩnh Gia", "Hoằng Hóa"],
    default: ["Quận/Huyện 1", "Quận/Huyện 2"],
};

const WARDS: Record<string, string[]> = {
    "Quận 1": ["Phường Bến Nghé", "Phường Bến Thành", "Phường Cầu Kho"],
    "Quận 3": ["Phường 1", "Phường 6", "Phường Võ Thị Sáu"],
    "Hoàn Kiếm": ["Phường Tràng Tiền", "Phường Hàng Bạc"],
    "TP. Thanh Hóa": ["Phường Lam Sơn", "Phường Điện Biên", "Phường Ba Đình"],
    default: ["Phường/Xã 1", "Phường/Xã 2"],
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmt = (n: number) => n.toLocaleString("vi-VN") + "₫";

function getDistricts(province: string) {
    return DISTRICTS[province] ?? DISTRICTS["default"];
}

function getWards(district: string) {
    return WARDS[district] ?? WARDS["default"];
}

// ─── Address Form ─────────────────────────────────────────────────────────────
interface AddressFormData {
    recipientName: string;
    recipientPhone: string;
    province: string;
    district: string;
    ward: string;
    detailAddress: string;
    isDefault: boolean;
}

const emptyForm = (): AddressFormData => ({
    recipientName: "",
    recipientPhone: "",
    province: "",
    district: "",
    ward: "",
    detailAddress: "",
    isDefault: false,
});

function AddressForm({
    initial,
    onSave,
    onCancel,
    submitLabel = "Lưu địa chỉ",
}: {
    initial?: AddressFormData;
    onSave: (data: AddressFormData) => void;
    onCancel: () => void;
    submitLabel?: string;
}) {
    const [form, setForm] = useState<AddressFormData>(initial ?? emptyForm());

    const set = (k: keyof AddressFormData, v: string | boolean) =>
        setForm((prev) => ({ ...prev, [k]: v }));

    const districts = form.province ? getDistricts(form.province) : [];
    const wards = form.district ? getWards(form.district) : [];

    const SelectField = ({
        label,
        value,
        options,
        onChange,
        disabled,
        placeholder,
    }: {
        label: string;
        value: string;
        options: string[];
        onChange: (v: string) => void;
        disabled?: boolean;
        placeholder: string;
    }) => (
        <div className="relative">
            <label className="block text-xs font-semibold text-gray-500 mb-1">{label}</label>
            <div className="relative">
                <select
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    disabled={disabled}
                    className={`w-full border rounded-lg px-3 py-2.5 text-sm outline-none appearance-none transition-colors
            ${disabled ? "bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed" : "bg-white border-gray-300 text-gray-700 focus:border-blue-400 focus:ring-1 focus:ring-blue-100 cursor-pointer"}`}
                >
                    <option value="">{placeholder}</option>
                    {options.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
        </div>
    );

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Họ và tên *</label>
                    <input
                        type="text"
                        placeholder="Người nhận"
                        value={form.recipientName}
                        onChange={(e) => set("recipientName", e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 bg-white"
                    />
                </div>
                <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Số điện thoại *</label>
                    <div className="flex border border-gray-300 rounded-lg overflow-hidden bg-white focus-within:border-blue-400 focus-within:ring-1 focus-within:ring-blue-100">
                        <span className="flex items-center gap-1 px-2.5 border-r border-gray-200 text-sm bg-gray-50 text-gray-500 shrink-0">
                            🇻🇳 +84
                        </span>
                        <input
                            type="tel"
                            placeholder="09xxxxxxxx"
                            value={form.recipientPhone}
                            onChange={(e) => set("recipientPhone", e.target.value)}
                            className="flex-1 px-3 py-2.5 text-sm outline-none bg-white"
                        />
                    </div>
                </div>
            </div>

            <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Địa chỉ cụ thể *</label>
                <input
                    type="text"
                    placeholder="Số nhà, tên đường..."
                    value={form.detailAddress}
                    onChange={(e) => set("detailAddress", e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 bg-white"
                />
            </div>

            <div className="grid grid-cols-3 gap-3">
                <SelectField
                    label="Tỉnh / Thành phố *"
                    value={form.province}
                    options={PROVINCES}
                    placeholder="Chọn tỉnh/TP"
                    onChange={(v) => setForm((p) => ({ ...p, province: v, district: "", ward: "" }))}
                />
                <SelectField
                    label="Quận / Huyện"
                    value={form.district}
                    options={districts}
                    placeholder="Chọn quận/huyện"
                    disabled={!form.province}
                    onChange={(v) => setForm((p) => ({ ...p, district: v, ward: "" }))}
                />
                <SelectField
                    label="Phường / Xã"
                    value={form.ward}
                    options={wards}
                    placeholder="Chọn phường/xã"
                    disabled={!form.district}
                    onChange={(v) => set("ward", v)}
                />
            </div>

            <label className="flex items-center gap-2 cursor-pointer">
                <div
                    onClick={() => set("isDefault", !form.isDefault)}
                    className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors shrink-0
            ${form.isDefault ? "bg-blue-500 border-blue-500" : "border-gray-300 bg-white"}`}
                >
                    {form.isDefault && (
                        <Check className="w-3 h-3 text-white" />
                    )}
                </div>
                <span className="text-sm text-gray-600">Đặt làm địa chỉ mặc định</span>
            </label>

            <div className="flex gap-2 pt-1">
                <button
                    onClick={onCancel}
                    className="flex-1 py-2.5 rounded-lg border border-gray-300 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                >
                    Huỷ
                </button>
                <button
                    onClick={() => onSave(form)}
                    className="flex-1 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-colors"
                >
                    {submitLabel}
                </button>
            </div>
        </div>
    );
}

// ─── Address Modal ────────────────────────────────────────────────────────────
function AddressModal({
    addresses,
    selectedId,
    onSelect,
    onClose,
    onAdd,
    onEdit,
    onDelete,
    onSetDefault,
}: {
    addresses: Address[];
    selectedId: number | null;
    onSelect: (a: Address) => void;
    onClose: () => void;
    onAdd: (data: AddressFormData) => void;
    onEdit: (id: number, data: AddressFormData) => void;
    onDelete: (id: number) => void;
    onSetDefault: (id: number) => void;
}) {
    const [mode, setMode] = useState<AddressMode>("select");
    const [editTarget, setEditTarget] = useState<Address | null>(null);

    const handleEdit = (a: Address) => {
        setEditTarget(a);
        setMode("edit");
    };

    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white w-full max-w-lg rounded-t-2xl sm:rounded-2xl shadow-2xl max-h-[90vh] flex flex-col">
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                        {mode !== "select" && (
                            <button onClick={() => setMode("select")} className="text-gray-400 hover:text-gray-600 mr-1">
                                <MapPin className="w-4 h-4" />
                            </button>
                        )}
                        <h3 className="font-bold text-gray-800 text-base">
                            {mode === "select" ? "Chọn địa chỉ nhận hàng" : mode === "new" ? "Thêm địa chỉ mới" : "Chỉnh sửa địa chỉ"}
                        </h3>
                    </div>
                    <button onClick={onClose} className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 text-sm transition-colors">✕</button>
                </div>

                <div className="flex-1 overflow-y-auto px-5 py-4">
                    {mode === "select" && (
                        <div className="space-y-3">
                            {addresses.map((addr) => (
                                <div
                                    key={addr.id}
                                    onClick={() => onSelect(addr)}
                                    className={`relative border-2 rounded-xl p-4 cursor-pointer transition-all
                    ${selectedId === addr.id ? "border-blue-500 bg-blue-50/50" : "border-gray-200 hover:border-gray-300 bg-white"}`}
                                >
                                    <div className={`absolute top-4 right-4 w-5 h-5 rounded-full border-2 flex items-center justify-center
                    ${selectedId === addr.id ? "border-blue-500" : "border-gray-300"}`}>
                                        {selectedId === addr.id && <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />}
                                    </div>

                                    <div className="pr-8">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="font-semibold text-sm text-gray-800">{addr.recipientName}</span>
                                            <span className="text-gray-300">·</span>
                                            <span className="text-sm text-gray-500">{addr.recipientPhone}</span>
                                            {addr.isDefault && (
                                                <span className="text-[10px] font-bold px-1.5 py-0.5 bg-blue-100 text-blue-600 rounded-full border border-blue-200">
                                                    Mặc định
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-sm text-gray-500 leading-relaxed">
                                            {addr.detailAddress}, {addr.ward}, {addr.province}
                                        </p>
                                    </div>

                                    <div className="flex gap-3 mt-3 pt-3 border-t border-gray-100">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleEdit(addr); }}
                                            className="text-xs text-blue-500 font-medium hover:underline"
                                        >
                                            Chỉnh sửa
                                        </button>
                                        {!addr.isDefault && (
                                            <>
                                                <span className="text-gray-200">|</span>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); onSetDefault(addr.id); }}
                                                    className="text-xs text-gray-500 font-medium hover:text-blue-500 hover:underline"
                                                >
                                                    Đặt mặc định
                                                </button>
                                                <span className="text-gray-200">|</span>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); onDelete(addr.id); }}
                                                    className="text-xs text-red-400 font-medium hover:underline"
                                                >
                                                    Xoá
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            ))}

                            <button
                                onClick={() => setMode("new")}
                                className="w-full border-2 border-dashed border-gray-200 rounded-xl py-3.5 text-sm font-medium text-gray-400 hover:border-blue-300 hover:text-blue-500 transition-colors flex items-center justify-center gap-2"
                            >
                                <Plus className="w-4 h-4" />
                                Thêm địa chỉ mới
                            </button>
                        </div>
                    )}

                    {mode === "new" && (
                        <AddressForm
                            onSave={(data) => { onAdd(data); setMode("select"); }}
                            onCancel={() => setMode("select")}
                            submitLabel="Thêm địa chỉ"
                        />
                    )}

                    {mode === "edit" && editTarget && (
                        <AddressForm
                            initial={{
                                recipientName: editTarget.recipientName,
                                recipientPhone: editTarget.recipientPhone,
                                province: editTarget.province,
                                district: "",
                                ward: editTarget.ward,
                                detailAddress: editTarget.detailAddress,
                                isDefault: editTarget.isDefault,
                            }}
                            onSave={(data) => { onEdit(editTarget.id, data); setMode("select"); }}
                            onCancel={() => setMode("select")}
                            submitLabel="Lưu thay đổi"
                        />
                    )}
                </div>
            </div>
        </div>
    );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function OrderPage() {
    const [addresses, setAddresses] = useState<Address[]>(MOCK_ADDRESSES);
    const [selectedAddressId, setSelectedAddressId] = useState<number | null>(
        MOCK_ADDRESSES.find((a) => a.isDefault)?.id ?? null
    );
    const [showModal, setShowModal] = useState(false);
    const [payment, setPayment] = useState<PaymentMethod>("momo");
    const [note, setNote] = useState("");
    const [selectedVoucher, setSelectedVoucher] = useState<Voucher | null>(null);
    const [showVoucherModal, setShowVoucherModal] = useState(false);
    const [isOrdering, setIsOrdering] = useState(false);

    const selectedAddress = addresses.find((a) => a.id === selectedAddressId) ?? null;
    const subtotal = 466000;
    const shipping = 0;
    const discount = selectedVoucher
        ? selectedVoucher.type === 'percent'
            ? Math.floor(subtotal * selectedVoucher.discount / 100)
            : selectedVoucher.discount
        : 0;
    const total = subtotal + shipping - discount;

    const handleSelect = (addr: Address) => {
        setSelectedAddressId(addr.id);
        setShowModal(false);
    };

    const handleAdd = (data: AddressFormData) => {
        const newAddr: Address = {
            id: Date.now(),
            recipientName: data.recipientName,
            recipientPhone: data.recipientPhone,
            province: data.province,
            ward: data.ward || data.district,
            detailAddress: data.detailAddress,
            isDefault: data.isDefault,
        };
        setAddresses((prev) => {
            const list = data.isDefault ? prev.map((a) => ({ ...a, isDefault: false })) : prev;
            return [...list, newAddr];
        });
        setSelectedAddressId(newAddr.id);
    };

    const handleEdit = (id: number, data: AddressFormData) => {
        setAddresses((prev) =>
            prev.map((a) => {
                if (data.isDefault && a.id !== id) return { ...a, isDefault: false };
                if (a.id === id) {
                    return {
                        ...a,
                        recipientName: data.recipientName,
                        recipientPhone: data.recipientPhone,
                        province: data.province,
                        ward: data.ward || data.district,
                        detailAddress: data.detailAddress,
                        isDefault: data.isDefault,
                    };
                }
                return a;
            })
        );
    };

    const handleDelete = (id: number) => {
        setAddresses((prev) => prev.filter((a) => a.id !== id));
        if (selectedAddressId === id) {
            const remaining = addresses.filter((a) => a.id !== id);
            setSelectedAddressId(remaining.find((a) => a.isDefault)?.id ?? remaining[0]?.id ?? null);
        }
    };

    const handleSetDefault = (id: number) => {
        setAddresses((prev) => prev.map((a) => ({ ...a, isDefault: a.id === id })));
    };

    const applyVoucher = (voucher: Voucher) => {
        if (subtotal < voucher.minOrder) {
            toast.warning(`Đơn hàng tối thiểu ${fmt(voucher.minOrder)} mới áp dụng được voucher này`);
            return;
        }
        setSelectedVoucher(voucher);
        setShowVoucherModal(false);
        toast.success(`Áp dụng voucher ${voucher.code} thành công!`);
    };

    const removeVoucher = () => {
        setSelectedVoucher(null);
        toast.info("Đã bỏ voucher");
    };

    const handlePlaceOrder = async () => {
        if (!selectedAddress) {
            toast.error("Vui lòng chọn địa chỉ nhận hàng");
            return;
        }

        setIsOrdering(true);
        await new Promise(resolve => setTimeout(resolve, 1500));

        toast.success(`🎉 Đặt hàng thành công!${selectedVoucher ? ` (Đã áp dụng ${selectedVoucher.code})` : ''}`, {
            position: "top-center",
            autoClose: 5000,
        });

        setIsOrdering(false);
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans pt-24">
            <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left + Middle */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Địa chỉ nhận hàng */}
                    <section>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-bold text-gray-800">Địa chỉ nhận hàng</h2>
                            <button
                                onClick={() => setShowModal(true)}
                                className="flex items-center gap-1 text-blue-500 text-sm font-medium hover:underline"
                            >
                                <MapPin className="w-4 h-4" />
                                Thay đổi
                            </button>
                        </div>

                        {selectedAddress ? (
                            <div
                                onClick={() => setShowModal(true)}
                                className="border-2 border-blue-200 bg-blue-50/40 rounded-xl p-4 cursor-pointer hover:border-blue-300 transition-colors"
                            >
                                <div className="flex items-start justify-between">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="font-semibold text-sm text-gray-800">{selectedAddress.recipientName}</span>
                                            <span className="text-gray-300">·</span>
                                            <span className="text-sm text-gray-500">{selectedAddress.recipientPhone}</span>
                                            {selectedAddress.isDefault && (
                                                <span className="text-[10px] font-bold px-1.5 py-0.5 bg-blue-100 text-blue-600 rounded-full border border-blue-200">
                                                    Mặc định
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-sm text-gray-500">
                                            {selectedAddress.detailAddress}, {selectedAddress.ward}, {selectedAddress.province}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <button
                                onClick={() => setShowModal(true)}
                                className="w-full border-2 border-dashed border-gray-200 rounded-xl py-5 text-sm text-gray-400 font-medium hover:border-blue-300 hover:text-blue-500 transition-colors flex items-center justify-center gap-2"
                            >
                                Thêm địa chỉ nhận hàng
                            </button>
                        )}
                    </section>

                    {/* Vận chuyển */}
                    <section>
                        <h2 className="text-lg font-bold text-gray-800 mb-4">Vận chuyển</h2>

                        <div
                            className={`border rounded-xl px-4 py-3 text-sm transition-colors
        ${selectedAddress
                                    ? "bg-white border-gray-200 text-gray-700"
                                    : "bg-blue-50 border-blue-200 text-blue-600"
                                }`}
                        >
                            {selectedAddress ? (
                                <div className="flex items-center gap-2">
                                    <Truck className="w-4 h-4 text-green-500" />
                                    <span>Giao hàng tiêu chuẩn — Miễn phí (2–4 ngày)</span>
                                </div>
                            ) : (
                                <span>Vui lòng chọn địa chỉ nhận hàng</span>
                            )}
                        </div>
                    </section>

                    {/* Ghi chú */}
                    <section>
                        <h2 className="text-lg font-bold text-gray-800 mb-4">Ghi chú</h2>
                        <textarea
                            placeholder="Ghi chú cho người bán hoặc shipper (tùy chọn)"
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            rows={3}
                            className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 bg-white resize-none"
                        />
                    </section>

                    {/* Thanh toán */}
                    <section>
                        <h2 className="text-lg font-bold text-gray-800 mb-4">Phương thức thanh toán</h2>
                        <div className="border border-gray-200 rounded-xl overflow-hidden bg-white">

                            {/* COD */}
                            <label className="flex items-center justify-between px-4 py-4 cursor-pointer hover:bg-gray-50 border-b border-gray-100"
                                onClick={() => setPayment("cod")}>
                                <div className="flex items-center gap-3">
                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${payment === "cod" ? "border-blue-500" : "border-gray-300"}`}>
                                        {payment === "cod" && <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <Banknote className="w-5 h-5 text-gray-600" />
                                            <p className="font-medium">Thu hộ khi nhận hàng (COD)</p>
                                        </div>
                                        <p className="text-sm text-gray-500">Thanh toán bằng tiền mặt khi nhận hàng</p>
                                    </div>
                                </div>
                            </label>

                            {/* Thanh toán Online */}
                            <div className="px-4 py-4 border-b border-gray-100">
                                <label className="flex items-center gap-3 cursor-pointer mb-3"
                                    onClick={() => setPayment("momo")}>
                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${["momo", "vnpay", "bank"].includes(payment) ? "border-blue-500" : "border-gray-300"}`}>
                                        {["momo", "vnpay", "bank"].includes(payment) && <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <CreditCard className="w-5 h-5 text-blue-500" />
                                        <p className="font-medium">Thanh toán online</p>
                                    </div>
                                </label>

                                {["momo", "vnpay", "bank"].includes(payment) && (
                                    <div className="ml-8 grid grid-cols-3 gap-3 mt-2">
                                        <button
                                            onClick={() => setPayment("momo")}
                                            className={`p-4 border-2 rounded-xl flex flex-col items-center gap-2 transition-all
    ${payment === "momo"
                                                    ? "border-pink-500 bg-pink-50"
                                                    : "border-gray-200 hover:border-gray-300"
                                                }`}
                                        >
                                            <img
                                                src="https://images.openai.com/static-rsc-4/0AX-ONfutHf5qZC8XoK1emQxwjMQTmBCVoHje5lT1B2n9Z3mL2LqZceqCJI0WQKL8jFI6L0fy6cVCZpiSIR0NIQgSxrXdaRpHy7n2UkOW8BLa4WKa32AmseuJ460ZS67QgaLjR4G2tzlB6Zp2DrK6RjKg5nZ3G8vMkQGgusb3NjguOk5Gq0E15IzwgxYIAYd?purpose=fullsize"
                                                alt="Momo"
                                                className="h-8 object-contain"
                                            />

                                            <span className="text-sm font-medium text-gray-700">
                                                Ví Momo
                                            </span>
                                        </button>

                                        <button
                                            onClick={() => setPayment("vnpay")}
                                            className={`p-4 border-2 rounded-xl flex flex-col items-center gap-2 transition-all ${payment === "vnpay" ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"}`}
                                        >
                                            <CreditCard className="w-6 h-6 text-blue-600" />
                                            <span className="text-sm font-medium">VNPay</span>
                                        </button>

                                        <button
                                            onClick={() => setPayment("bank")}
                                            className={`p-4 border-2 rounded-xl flex flex-col items-center gap-2 transition-all ${payment === "bank" ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"}`}
                                        >
                                            <Building2 className="w-6 h-6 text-gray-600" />
                                            <span className="text-sm font-medium">Chuyển khoản</span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </section>
                </div>

                {/* Right Column - Order Summary */}
                <aside className="lg:col-span-1">
                    <div className="bg-white border border-gray-200 rounded-xl p-5 sticky top-8">
                        <h2 className="text-base font-bold text-gray-800 mb-4">Đơn hàng (2 sản phẩm)</h2>

                        {/* Product */}
                        <div className="flex items-start gap-3 mb-5">
                            <div className="relative shrink-0">
                                <div className="w-14 h-16 bg-red-100 rounded-lg overflow-hidden">
                                    <img
                                        src="https://cdn1.fahasa.com/media/catalog/product/h/a/harry_potter_va_bao_boi_tu_than___tap_7_tai_ban_2017__1_2018_07_05_14_18_35.JPG"
                                        alt="Harry Potter"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center font-bold">2</div>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm text-gray-700 leading-snug">Harry Potter Và Bảo Bối Tử Thần - Tập 7 (Tái Bản)</p>
                            </div>
                            <span className="text-sm font-medium text-gray-800 whitespace-nowrap">{fmt(subtotal)}</span>
                        </div>

                        {/* Voucher */}
                        <div className="mb-5">
                            <div className="flex justify-between items-center mb-2">
                                <span className="font-medium text-gray-700">Voucher / Mã giảm giá</span>
                                {selectedVoucher && (
                                    <button onClick={removeVoucher} className="text-red-500 text-sm hover:underline">
                                        Bỏ áp dụng
                                    </button>
                                )}
                            </div>

                            {selectedVoucher ? (
                                <div className="border border-green-200 bg-green-50 rounded-xl p-3 flex justify-between items-center">
                                    <div>
                                        <p className="font-semibold text-green-700">{selectedVoucher.code}</p>
                                        <p className="text-sm text-green-600">{selectedVoucher.description}</p>
                                    </div>
                                    <p className="font-bold text-green-600">-{fmt(discount)}</p>
                                </div>
                            ) : (
                                <button
                                    onClick={() => setShowVoucherModal(true)}
                                    className="w-full border-2 border-dashed border-gray-300 hover:border-blue-300 rounded-xl py-3 text-blue-600 font-medium flex items-center justify-center gap-2 transition"
                                >
                                    <Ticket className="w-4 h-4" />
                                    <span>Chọn voucher có sẵn</span>
                                </button>
                            )}
                        </div>

                        {/* Price Breakdown */}
                        <div className="space-y-2 border-t border-gray-100 pt-4 mb-4">
                            <div className="flex justify-between text-sm text-gray-600">
                                <span>Tạm tính</span><span>{fmt(subtotal)}</span>
                            </div>
                            <div className="flex justify-between text-sm text-gray-600">
                                <span>Phí vận chuyển</span><span className="text-emerald-500">Miễn phí</span>
                            </div>
                            {selectedVoucher && (
                                <div className="flex justify-between text-sm text-green-600">
                                    <span>Giảm giá</span><span>-{fmt(discount)}</span>
                                </div>
                            )}
                        </div>

                        <div className="flex justify-between items-center border-t border-gray-200 pt-4 mb-5">
                            <span className="font-semibold text-gray-800">Tổng cộng</span>
                            <span className="text-2xl font-bold text-blue-600">{fmt(total)}</span>
                        </div>

                        <button
                            disabled={!selectedAddress || isOrdering}
                            onClick={handlePlaceOrder}
                            className={`w-full font-bold py-3.5 rounded-xl transition-all text-base uppercase tracking-wider
                                ${selectedAddress && !isOrdering ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-gray-200 text-gray-400 cursor-not-allowed"}`}
                        >
                            {isOrdering ? "Đang xử lý..." : "HOÀN TẤT ĐẶT HÀNG"}
                        </button>
                    </div>
                </aside>
            </div>

            {/* Address Modal */}
            {showModal && (
                <AddressModal
                    addresses={addresses}
                    selectedId={selectedAddressId}
                    onSelect={handleSelect}
                    onClose={() => setShowModal(false)}
                    onAdd={handleAdd}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onSetDefault={handleSetDefault}
                />
            )}

            {/* Voucher Modal */}
            {showVoucherModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
                    <div className="bg-white rounded-2xl w-full max-w-md mx-4 overflow-hidden">
                        <div className="p-5 border-b">
                            <h3 className="font-bold text-xl">Chọn voucher</h3>
                        </div>
                        <div className="p-5 space-y-3 max-h-[60vh] overflow-y-auto">
                            {MOCK_VOUCHERS.map(v => (
                                <div
                                    key={v.id}
                                    onClick={() => applyVoucher(v)}
                                    className="border border-gray-200 hover:border-blue-400 rounded-xl p-4 cursor-pointer transition-all"
                                >
                                    <div className="flex justify-between">
                                        <div>
                                            <p className="font-bold text-lg">{v.code}</p>
                                            <p className="text-sm text-gray-600">{v.description}</p>
                                        </div>
                                        <div className="text-right">
                                            {v.type === 'percent' ? (
                                                <p className="text-xl font-bold text-red-500">-{v.discount}%</p>
                                            ) : (
                                                <p className="text-xl font-bold text-red-500">-{fmt(v.discount)}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="p-4 border-t">
                            <button
                                onClick={() => setShowVoucherModal(false)}
                                className="w-full py-3 text-gray-600 font-medium border border-gray-300 rounded-xl"
                            >
                                Đóng
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <ToastContainer position="top-center" autoClose={4000} hideProgressBar={false} />
        </div>
    );
}