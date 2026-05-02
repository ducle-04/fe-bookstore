import { useState } from "react";

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

type PaymentMethod = "transfer" | "cod";
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
                <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
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
                        <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
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

// ─── Address Selector Modal ───────────────────────────────────────────────────

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
                {/* header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                        {mode !== "select" && (
                            <button onClick={() => setMode("select")} className="text-gray-400 hover:text-gray-600 mr-1">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
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
                                    {/* radio */}
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

                                    {/* actions */}
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

                            {/* add new */}
                            <button
                                onClick={() => setMode("new")}
                                className="w-full border-2 border-dashed border-gray-200 rounded-xl py-3.5 text-sm font-medium text-gray-400 hover:border-blue-300 hover:text-blue-500 transition-colors flex items-center justify-center gap-2"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
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

// ─── Main OrderPage ───────────────────────────────────────────────────────────

export default function OrderPage() {
    const [addresses, setAddresses] = useState<Address[]>(MOCK_ADDRESSES);
    const [selectedAddressId, setSelectedAddressId] = useState<number | null>(
        MOCK_ADDRESSES.find((a) => a.isDefault)?.id ?? MOCK_ADDRESSES[0]?.id ?? null
    );
    const [showModal, setShowModal] = useState(false);
    const [payment, setPayment] = useState<PaymentMethod>("transfer");
    const [note, setNote] = useState("");
    const [coupon, setCoupon] = useState("");

    const selectedAddress = addresses.find((a) => a.id === selectedAddressId) ?? null;
    const subtotal = 466_000;
    const shipping = 0;
    const total = subtotal + shipping;

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
                if (a.id === id)
                    return {
                        ...a,
                        recipientName: data.recipientName,
                        recipientPhone: data.recipientPhone,
                        province: data.province,
                        ward: data.ward || data.district,
                        detailAddress: data.detailAddress,
                        isDefault: data.isDefault,
                    };
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

    return (
        <div className="min-h-screen bg-gray-50 font-sans pt-24">
            <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* ── Left + Middle ── */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Address Section */}
                    <section>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-bold text-gray-800">Địa chỉ nhận hàng</h2>
                            <button
                                onClick={() => setShowModal(true)}
                                className="flex items-center gap-1 text-blue-500 text-sm font-medium hover:underline"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
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
                                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0 ml-3">
                                        <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <button
                                onClick={() => setShowModal(true)}
                                className="w-full border-2 border-dashed border-gray-200 rounded-xl py-5 text-sm text-gray-400 font-medium hover:border-blue-300 hover:text-blue-500 transition-colors flex items-center justify-center gap-2"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                Thêm địa chỉ nhận hàng
                            </button>
                        )}
                    </section>

                    {/* Shipping */}
                    <section>
                        <h2 className="text-lg font-bold text-gray-800 mb-4">Vận chuyển</h2>
                        <div className={`border rounded-xl px-4 py-3 text-sm transition-colors
              ${selectedAddress ? "bg-white border-gray-200 text-gray-700" : "bg-blue-50 border-blue-200 text-blue-600"}`}>
                            {selectedAddress
                                ? "✅ Giao hàng tiêu chuẩn — Miễn phí (2–4 ngày)"
                                : "Vui lòng chọn địa chỉ nhận hàng"}
                        </div>
                    </section>

                    {/* Note */}
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

                    {/* Payment */}
                    <section>
                        <h2 className="text-lg font-bold text-gray-800 mb-4">Thanh toán</h2>
                        <div className="border border-gray-200 rounded-xl overflow-hidden bg-white">
                            {[
                                { key: "transfer", label: "Chuyển khoản ngân hàng", desc: "Thanh toán qua QR hoặc STK" },
                                { key: "cod", label: "Thu hộ (COD)", desc: "Thanh toán khi nhận hàng" },
                            ].map((opt, i) => (
                                <label
                                    key={opt.key}
                                    className={`flex items-center justify-between px-4 py-3.5 cursor-pointer hover:bg-gray-50 transition-colors ${i > 0 ? "border-t border-gray-100" : ""}`}
                                    onClick={() => setPayment(opt.key as PaymentMethod)}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors
                      ${payment === opt.key ? "border-blue-500" : "border-gray-300"}`}>
                                            {payment === opt.key && <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />}
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-700">{opt.label}</p>
                                            <p className="text-xs text-gray-400">{opt.desc}</p>
                                        </div>
                                    </div>
                                    <div className="w-8 h-8 bg-teal-50 rounded-lg flex items-center justify-center text-teal-500">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                                        </svg>
                                    </div>
                                </label>
                            ))}
                        </div>
                    </section>
                </div>

                {/* ── Right: Order Summary ── */}
                <aside className="lg:col-span-1">
                    <div className="bg-white border border-gray-200 rounded-xl p-5 sticky top-8">
                        <h2 className="text-base font-bold text-gray-800 mb-4">Đơn hàng (2 sản phẩm)</h2>

                        {/* Product */}
                        <div className="flex items-start gap-3 mb-5">
                            <div className="relative shrink-0">
                                <div className="w-14 h-16 bg-red-100 rounded-lg overflow-hidden">
                                    <img
                                        src="https://isach.info/images/story/cover/harry_potter_va_bao_boi_tu_than__j_k_rowling.jpg"
                                        alt="Harry Potter"
                                        className="w-full h-full object-cover"
                                        onError={(e) => { (e.target as HTMLImageElement).src = ""; }}
                                    />
                                </div>
                                <div className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center font-bold">2</div>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm text-gray-700 leading-snug">Harry Potter Và Bảo Bối Tử Thần - Tập 7 (Tái Bản)</p>
                            </div>
                            <span className="text-sm font-medium text-gray-800 whitespace-nowrap">{fmt(466_000)}</span>
                        </div>

                        {/* Coupon */}
                        <div className="flex gap-2 mb-5">
                            <input
                                type="text"
                                placeholder="Mã giảm giá"
                                value={coupon}
                                onChange={(e) => setCoupon(e.target.value)}
                                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100"
                            />
                            <button className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors whitespace-nowrap">
                                Áp dụng
                            </button>
                        </div>

                        {/* Price */}
                        <div className="space-y-2 border-t border-gray-100 pt-4 mb-4">
                            <div className="flex justify-between text-sm text-gray-600">
                                <span>Tạm tính</span><span>{fmt(subtotal)}</span>
                            </div>
                            <div className="flex justify-between text-sm text-gray-600">
                                <span>Phí vận chuyển</span>
                                <span className={shipping === 0 ? "text-emerald-500 font-medium" : ""}>{shipping === 0 ? "Miễn phí" : fmt(shipping)}</span>
                            </div>
                        </div>

                        <div className="flex justify-between items-center border-t border-gray-200 pt-4 mb-5">
                            <span className="font-semibold text-gray-800">Tổng cộng</span>
                            <span className="text-xl font-bold text-blue-500">{fmt(total)}</span>
                        </div>

                        <button
                            disabled={!selectedAddress}
                            className={`w-full font-bold py-3 rounded-lg transition-colors tracking-wide text-sm uppercase
                ${selectedAddress ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-gray-100 text-gray-400 cursor-not-allowed"}`}
                        >
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

            {/* ── Modal ── */}
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
        </div>
    );
}