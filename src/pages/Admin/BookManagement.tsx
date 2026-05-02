import React, { useState, useMemo, useCallback } from "react";

// ─── TYPES ───────────────────────────────────────────────────────────────────
interface Category { id: number; name: string; }
interface Publisher { id: number; name: string; }
interface BookAuthor { authorId: number; authorName: string; role: string; }
interface Book {
    id: number; isbn: string; title: string; slug: string; description: string;
    coverImage: string; price: number; costPrice: number; salePrice: number | null;
    saleFrom: string | null; saleTo: string | null; stockQuantity: number;
    reorderPoint: number; weightGram: number; pageCount: number; language: string;
    yearPublished: number; isActive: boolean; category: Category | null;
    publisher: Publisher | null; bookAuthors: BookAuthor[];
    onSale?: boolean; effectivePrice?: number;
}
interface SalePriceRequest { salePrice: number; saleFrom: string; saleTo: string; }

// ─── MOCK DATA ────────────────────────────────────────────────────────────────
const CATEGORIES: Category[] = [
    { id: 1, name: "Văn học" }, { id: 2, name: "Khoa học" }, { id: 3, name: "Lịch sử" },
    { id: 4, name: "Kỹ năng sống" }, { id: 5, name: "Thiếu nhi" }, { id: 6, name: "Tâm lý học" },
];
const PUBLISHERS: Publisher[] = [
    { id: 1, name: "NXB Kim Đồng" }, { id: 2, name: "NXB Trẻ" },
    { id: 3, name: "NXB Tổng hợp TP.HCM" }, { id: 4, name: "NXB Văn học" }, { id: 5, name: "Alphabooks" },
];
const INITIAL_BOOKS: Book[] = [
    { id: 1, isbn: "9786041182646", title: "Đắc Nhân Tâm", slug: "dac-nhan-tam", description: "Cuốn sách kỹ năng sống bán chạy nhất mọi thời đại của Dale Carnegie.", coverImage: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=200&h=280&fit=crop", price: 68000, costPrice: 40000, salePrice: 52000, saleFrom: "2025-05-01T00:00", saleTo: "2025-12-31T23:59", stockQuantity: 143, reorderPoint: 10, weightGram: 320, pageCount: 320, language: "vi", yearPublished: 2023, isActive: true, category: CATEGORIES[3], publisher: PUBLISHERS[4], bookAuthors: [{ authorId: 1, authorName: "Dale Carnegie", role: "author" }], onSale: true, effectivePrice: 52000 },
    { id: 2, isbn: "9786042069557", title: "Nhà Giả Kim", slug: "nha-gia-kim", description: "Tiểu thuyết triết lý nổi tiếng thế giới của Paulo Coelho.", coverImage: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=200&h=280&fit=crop", price: 79000, costPrice: 45000, salePrice: null, saleFrom: null, saleTo: null, stockQuantity: 4, reorderPoint: 10, weightGram: 220, pageCount: 228, language: "vi", yearPublished: 2022, isActive: true, category: CATEGORIES[0], publisher: PUBLISHERS[1], bookAuthors: [{ authorId: 2, authorName: "Paulo Coelho", role: "author" }], onSale: false, effectivePrice: 79000 },
    { id: 3, isbn: "9786041052543", title: "Sapiens: Lược Sử Loài Người", slug: "sapiens", description: "Hành trình 70,000 năm của loài người qua ngòi bút Yuval Noah Harari.", coverImage: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=200&h=280&fit=crop", price: 149000, costPrice: 90000, salePrice: 115000, saleFrom: "2025-04-01T00:00", saleTo: "2025-06-30T23:59", stockQuantity: 87, reorderPoint: 15, weightGram: 580, pageCount: 560, language: "vi", yearPublished: 2021, isActive: true, category: CATEGORIES[2], publisher: PUBLISHERS[1], bookAuthors: [{ authorId: 3, authorName: "Yuval Noah Harari", role: "author" }], onSale: true, effectivePrice: 115000 },
    { id: 4, isbn: "9786045602898", title: "Tư Duy Nhanh Và Chậm", slug: "tu-duy", description: "Khám phá cách tư duy của con người với Daniel Kahneman.", coverImage: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=200&h=280&fit=crop", price: 125000, costPrice: 72000, salePrice: null, saleFrom: null, saleTo: null, stockQuantity: 0, reorderPoint: 10, weightGram: 450, pageCount: 512, language: "vi", yearPublished: 2023, isActive: false, category: CATEGORIES[5], publisher: PUBLISHERS[4], bookAuthors: [{ authorId: 4, authorName: "Daniel Kahneman", role: "author" }], onSale: false, effectivePrice: 125000 },
    { id: 5, isbn: "9786043764895", title: "Dế Mèn Phiêu Lưu Ký", slug: "de-men", description: "Tác phẩm thiếu nhi kinh điển của nhà văn Tô Hoài.", coverImage: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=200&h=280&fit=crop", price: 45000, costPrice: 25000, salePrice: 38000, saleFrom: "2025-01-01T00:00", saleTo: "2025-12-31T23:59", stockQuantity: 250, reorderPoint: 20, weightGram: 180, pageCount: 248, language: "vi", yearPublished: 2024, isActive: true, category: CATEGORIES[4], publisher: PUBLISHERS[0], bookAuthors: [{ authorId: 5, authorName: "Tô Hoài", role: "author" }], onSale: true, effectivePrice: 38000 },
    { id: 6, isbn: "9786044027234", title: "Brief History of Time", slug: "brief-history", description: "Stephen Hawking giải thích vũ trụ cho mọi người.", coverImage: "https://images.unsplash.com/photo-1465101162946-4377e57745c3?w=200&h=280&fit=crop", price: 95000, costPrice: 55000, salePrice: null, saleFrom: null, saleTo: null, stockQuantity: 32, reorderPoint: 8, weightGram: 290, pageCount: 212, language: "en", yearPublished: 2020, isActive: true, category: CATEGORIES[1], publisher: PUBLISHERS[2], bookAuthors: [{ authorId: 6, authorName: "Stephen Hawking", role: "author" }], onSale: false, effectivePrice: 95000 },
];

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const vnd = (n: number) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(n);

const emptyBook = (): Book => ({
    id: 0, isbn: "", title: "", slug: "", description: "", coverImage: "",
    price: 0, costPrice: 0, salePrice: null, saleFrom: null, saleTo: null,
    stockQuantity: 0, reorderPoint: 5, weightGram: 0, pageCount: 0,
    language: "vi", yearPublished: new Date().getFullYear(),
    isActive: true, category: null, publisher: null, bookAuthors: [],
    onSale: false, effectivePrice: 0,
});

type StatusFilter = "all" | "active" | "inactive" | "onSale" | "lowStock";

// ─── SHARED STYLE TOKENS ─────────────────────────────────────────────────────
const tdStyle: React.CSSProperties = {
    padding: "13px 16px", borderBottom: "1px solid #f1f5f9", verticalAlign: "middle",
};
const inputStyle: React.CSSProperties = {
    padding: "8px 11px", border: "1px solid #e2e8f0", borderRadius: 7,
    fontSize: 13, color: "#0f172a", background: "#fff", outline: "none", width: "100%",
};

// ─── ATOMS ────────────────────────────────────────────────────────────────────
function Field({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: "#475569", textTransform: "uppercase", letterSpacing: ".05em" }}>
                {label}
            </label>
            {children}
        </div>
    );
}

type BtnVariant = "primary" | "secondary" | "danger";
const BTN_STYLES: Record<BtnVariant, React.CSSProperties> = {
    primary: { background: "#6366f1", color: "#fff", borderColor: "#6366f1" },
    secondary: { background: "#fff", color: "#475569", borderColor: "#e2e8f0" },
    danger: { background: "#ef4444", color: "#fff", borderColor: "#ef4444" },
};
function Btn({ variant, onClick, children }: { variant: BtnVariant; onClick: () => void; children: React.ReactNode }) {
    return (
        <button onClick={onClick} style={{ padding: "8px 16px", borderRadius: 8, border: "1px solid", fontSize: 13, fontWeight: 600, cursor: "pointer", ...BTN_STYLES[variant] }}>
            {children}
        </button>
    );
}

function CloseBtn({ onClick }: { onClick: () => void }) {
    return (
        <button onClick={onClick} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 16, color: "#94a3b8", width: 28, height: 28, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center" }}>
            ✕
        </button>
    );
}

function ActionBtn({ title, onClick, children, hoverBg = "#f1f5f9", hoverBorder = "#cbd5e1" }: {
    title: string; onClick: () => void; children: React.ReactNode;
    hoverBg?: string; hoverBorder?: string;
}) {
    const [hovered, setHovered] = useState(false);
    return (
        <button title={title} onClick={onClick}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                width: 30, height: 30, borderRadius: 6,
                border: `1px solid ${hovered ? hoverBorder : "#e2e8f0"}`,
                background: hovered ? hoverBg : "#fff",
                cursor: "pointer", fontSize: 14, marginRight: 4,
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                transition: "all .15s", transform: hovered ? "translateY(-1px)" : "none",
            }}>
            {children}
        </button>
    );
}

function StatusBadge({ book }: { book: Book }) {
    const configs = {
        inactive: { bg: "#f1f5f9", color: "#64748b", label: "Ngừng bán" },
        out: { bg: "#fee2e2", color: "#dc2626", label: "Hết hàng" },
        low: { bg: "#ffedd5", color: "#ea580c", label: "Sắp hết" },
        sale: { bg: "#fef3c7", color: "#d97706", label: "Đang sale" },
        active: { bg: "#dcfce7", color: "#16a34a", label: "Đang bán" },
    };
    const cfg = !book.isActive ? configs.inactive
        : book.stockQuantity === 0 ? configs.out
            : book.stockQuantity <= book.reorderPoint ? configs.low
                : book.onSale ? configs.sale
                    : configs.active;
    return (
        <span style={{ display: "inline-block", padding: "3px 9px", borderRadius: 20, fontSize: 11, fontWeight: 600, background: cfg.bg, color: cfg.color }}>
            {cfg.label}
        </span>
    );
}

// ─── STATS BAR ────────────────────────────────────────────────────────────────
function StatsBar({ books }: { books: Book[] }) {
    const s = useMemo(() => ({
        total: books.length,
        active: books.filter(b => b.isActive).length,
        onSale: books.filter(b => b.onSale).length,
        low: books.filter(b => b.stockQuantity > 0 && b.stockQuantity <= b.reorderPoint).length,
        out: books.filter(b => b.stockQuantity === 0).length,
    }), [books]);

    const items = [
        { label: "Tổng sách", value: s.total, accent: "#6366f1" },
        { label: "Đang bán", value: s.active, accent: "#22c55e" },
        { label: "Đang sale", value: s.onSale, accent: "#f59e0b" },
        { label: "Sắp hết", value: s.low, accent: "#f97316" },
        { label: "Hết hàng", value: s.out, accent: "#ef4444" },
    ];

    return (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 12, marginBottom: 20 }}>
            {items.map(({ label, value, accent }) => (
                <div key={label} style={{ background: "#fff", borderRadius: 10, padding: "14px 16px", border: "1px solid #e8eaf0", borderLeft: `3px solid ${accent}` }}>
                    <div style={{ fontSize: 26, fontWeight: 700, color: "#0f172a" }}>{value}</div>
                    <div style={{ fontSize: 12, color: "#94a3b8", fontWeight: 500, marginTop: 2 }}>{label}</div>
                </div>
            ))}
        </div>
    );
}

// ─── CONFIRM MODAL ────────────────────────────────────────────────────────────
function ConfirmModal({ message, danger, onConfirm, onClose }: {
    message: string; danger?: boolean; onConfirm: () => void; onClose: () => void;
}) {
    return (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }} onClick={onClose}>
            <div style={{ background: "#fff", borderRadius: 14, width: 440, maxWidth: "95vw", boxShadow: "0 20px 60px rgba(0,0,0,.2)", overflow: "hidden" }} onClick={e => e.stopPropagation()}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 20px", borderBottom: "1px solid #f1f5f9" }}>
                    <h2 style={{ fontSize: 15, fontWeight: 700, color: "#0f172a" }}>Xác nhận thao tác</h2>
                    <CloseBtn onClick={onClose} />
                </div>
                <div style={{ padding: 20 }}>
                    <p style={{ color: "#475569", lineHeight: 1.7 }}>{message}</p>
                </div>
                <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, padding: "16px 20px", borderTop: "1px solid #f1f5f9", background: "#fafbfc" }}>
                    <Btn variant="secondary" onClick={onClose}>Hủy</Btn>
                    <Btn variant={danger ? "danger" : "primary"} onClick={() => { onConfirm(); onClose(); }}>Xác nhận</Btn>
                </div>
            </div>
        </div>
    );
}

// ─── SALE MODAL ───────────────────────────────────────────────────────────────
function SaleModal({ book, onClose, onSave }: {
    book: Book; onClose: () => void; onSave: (req: SalePriceRequest) => void;
}) {
    const now = new Date().toISOString().slice(0, 16);
    const later = new Date(Date.now() + 86400000 * 30).toISOString().slice(0, 16);

    const [salePrice, setSalePrice] = useState(book.salePrice ?? Math.round(book.price * 0.8));
    const [saleFrom, setSaleFrom] = useState(book.saleFrom?.slice(0, 16) ?? now);
    const [saleTo, setSaleTo] = useState(book.saleTo?.slice(0, 16) ?? later);

    const discount = book.price > 0 ? Math.round((1 - salePrice / book.price) * 100) : 0;

    return (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }} onClick={onClose}>
            <div style={{ background: "#fff", borderRadius: 14, width: 460, maxWidth: "95vw", boxShadow: "0 20px 60px rgba(0,0,0,.2)", overflow: "hidden" }} onClick={e => e.stopPropagation()}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 20px", borderBottom: "1px solid #f1f5f9" }}>
                    <h2 style={{ fontSize: 15, fontWeight: 700, color: "#0f172a", maxWidth: 360, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        Thiết lập sale — {book.title}
                    </h2>
                    <CloseBtn onClick={onClose} />
                </div>
                <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 14 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", background: "#f8fafc", borderRadius: 8, fontSize: 13, color: "#475569" }}>
                        <span>Giá gốc:</span>
                        <strong style={{ color: "#0f172a" }}>{vnd(book.price)}</strong>
                    </div>
                    <Field label="Giá sale (₫)">
                        <input type="number" value={salePrice} onChange={e => setSalePrice(Number(e.target.value))} style={inputStyle} />
                        {discount > 0 && <span style={{ fontSize: 12, color: "#22c55e", fontWeight: 600, marginTop: 3 }}>Giảm {discount}%</span>}
                    </Field>
                    <Field label="Từ ngày">
                        <input type="datetime-local" value={saleFrom} onChange={e => setSaleFrom(e.target.value)} style={inputStyle} />
                    </Field>
                    <Field label="Đến ngày">
                        <input type="datetime-local" value={saleTo} onChange={e => setSaleTo(e.target.value)} style={inputStyle} />
                    </Field>
                </div>
                <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, padding: "16px 20px", borderTop: "1px solid #f1f5f9", background: "#fafbfc" }}>
                    <Btn variant="secondary" onClick={onClose}>Hủy</Btn>
                    <Btn variant="primary" onClick={() => { onSave({ salePrice, saleFrom, saleTo }); onClose(); }}>Áp dụng sale</Btn>
                </div>
            </div>
        </div>
    );
}

// ─── BOOK DRAWER ──────────────────────────────────────────────────────────────
function BookDrawer({ book, onClose, onSave }: {
    book: Book; onClose: () => void; onSave: (b: Book) => void;
}) {
    const isNew = book.id === 0;
    const [form, setForm] = useState<Book>({ ...book });

    const setStr = (field: keyof Book) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
        setForm(prev => ({ ...prev, [field]: e.target.value }));
    const setNum = (field: keyof Book) => (e: React.ChangeEvent<HTMLInputElement>) =>
        setForm(prev => ({ ...prev, [field]: Number(e.target.value) }));

    const handleSave = () => {
        if (!form.title.trim()) { alert("Vui lòng nhập tên sách!"); return; }
        onSave({
            ...form,
            id: isNew ? Date.now() : form.id,
            slug: form.title.toLowerCase().replace(/\s+/g, "-"),
            effectivePrice: form.onSale && form.salePrice ? form.salePrice : form.price,
        });
        onClose();
    };

    return (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.3)", zIndex: 100, display: "flex", justifyContent: "flex-end" }} onClick={onClose}>
            <div style={{ width: 520, maxWidth: "95vw", background: "#fff", height: "100vh", display: "flex", flexDirection: "column", boxShadow: "-8px 0 40px rgba(0,0,0,.15)" }} onClick={e => e.stopPropagation()}>

                {/* Header */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 24px", borderBottom: "1px solid #f1f5f9", flexShrink: 0 }}>
                    <h2 style={{ fontSize: 16, fontWeight: 700, color: "#0f172a" }}>{isNew ? "Thêm sách mới" : "Chỉnh sửa sách"}</h2>
                    <CloseBtn onClick={onClose} />
                </div>

                {/* Scrollable body */}
                <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>

                        <div style={{ gridColumn: "span 2" }}>
                            <Field label="Tên sách *">
                                <input value={form.title} onChange={setStr("title")} placeholder="Nhập tên sách..." style={inputStyle} />
                            </Field>
                        </div>

                        <Field label="ISBN">
                            <input value={form.isbn} onChange={setStr("isbn")} placeholder="9786..." style={inputStyle} />
                        </Field>

                        <Field label="Ngôn ngữ">
                            <select value={form.language} onChange={setStr("language")} style={inputStyle}>
                                <option value="vi">Tiếng Việt</option>
                                <option value="en">English</option>
                            </select>
                        </Field>

                        <Field label="Giá bán (₫) *">
                            <input type="number" value={form.price} onChange={setNum("price")} style={inputStyle} />
                        </Field>

                        <Field label="Giá vốn (₫)">
                            <input type="number" value={form.costPrice || ""} onChange={setNum("costPrice")} style={inputStyle} />
                        </Field>

                        <Field label="Tồn kho *">
                            <input type="number" value={form.stockQuantity} onChange={setNum("stockQuantity")} style={inputStyle} />
                        </Field>

                        <Field label="Điểm đặt hàng lại">
                            <input type="number" value={form.reorderPoint} onChange={setNum("reorderPoint")} style={inputStyle} />
                        </Field>

                        <Field label="Số trang">
                            <input type="number" value={form.pageCount || ""} onChange={setNum("pageCount")} style={inputStyle} />
                        </Field>

                        <Field label="Năm xuất bản">
                            <input type="number" value={form.yearPublished || ""} onChange={setNum("yearPublished")} style={inputStyle} />
                        </Field>

                        <Field label="Thể loại">
                            <select value={form.category?.id ?? ""} style={inputStyle}
                                onChange={e => setForm(prev => ({ ...prev, category: CATEGORIES.find(c => c.id === Number(e.target.value)) ?? null }))}>
                                <option value="">-- Chọn thể loại --</option>
                                {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                        </Field>

                        <Field label="Nhà xuất bản">
                            <select value={form.publisher?.id ?? ""} style={inputStyle}
                                onChange={e => setForm(prev => ({ ...prev, publisher: PUBLISHERS.find(p => p.id === Number(e.target.value)) ?? null }))}>
                                <option value="">-- Chọn NXB --</option>
                                {PUBLISHERS.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                            </select>
                        </Field>

                        <div style={{ gridColumn: "span 2" }}>
                            <Field label="Mô tả">
                                <textarea rows={4} value={form.description || ""} onChange={setStr("description")}
                                    placeholder="Mô tả ngắn về sách..." style={{ ...inputStyle, resize: "vertical", fontFamily: "inherit" }} />
                            </Field>
                        </div>

                    </div>
                </div>

                {/* Footer */}
                <div style={{ padding: "16px 24px", borderTop: "1px solid #f1f5f9", background: "#fafbfc", display: "flex", justifyContent: "flex-end", gap: 10, flexShrink: 0 }}>
                    <Btn variant="secondary" onClick={onClose}>Hủy</Btn>
                    <Btn variant="primary" onClick={handleSave}>{isNew ? "Tạo sách" : "Lưu thay đổi"}</Btn>
                </div>

            </div>
        </div>
    );
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
type ModalState =
    | { type: "confirm"; message: string; danger?: boolean; action: () => void }
    | { type: "sale"; book: Book }
    | null;

const STATUS_TABS: { value: StatusFilter; label: string }[] = [
    { value: "all", label: "Tất cả" },
    { value: "active", label: "Đang bán" },
    { value: "inactive", label: "Ngừng bán" },
    { value: "onSale", label: "Sale" },
    { value: "lowStock", label: "Sắp hết" },
];

export default function BookAdmin() {
    const [books, setBooks] = useState<Book[]>(INITIAL_BOOKS);
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState<StatusFilter>("all");
    const [categoryId, setCategoryId] = useState<number | null>(null);
    const [drawer, setDrawer] = useState<Book | null>(null);
    const [modal, setModal] = useState<ModalState>(null);

    const filtered = useMemo(() => books.filter(b => {
        const q = search.toLowerCase();
        if (q && !b.title.toLowerCase().includes(q) && !b.isbn.includes(q)) return false;
        if (status === "active" && !b.isActive) return false;
        if (status === "inactive" && b.isActive) return false;
        if (status === "onSale" && !b.onSale) return false;
        if (status === "lowStock" && !(b.stockQuantity > 0 && b.stockQuantity <= b.reorderPoint)) return false;
        if (categoryId && b.category?.id !== categoryId) return false;
        return true;
    }), [books, search, status, categoryId]);

    const updateBook = useCallback((updated: Book) =>
        setBooks(prev => prev.map(b => b.id === updated.id ? updated : b)), []);

    const saveBook = useCallback((book: Book) =>
        book.id === 0
            ? setBooks(prev => [book, ...prev])
            : updateBook(book),
        [updateBook]);

    const handleDelete = (book: Book) => setModal({
        type: "confirm", danger: true,
        message: `Xóa sách "${book.title}"? Thao tác này không thể hoàn tác.`,
        action: () => setBooks(prev => prev.filter(b => b.id !== book.id)),
    });

    const handleToggle = (book: Book) => setModal({
        type: "confirm",
        message: book.isActive ? `Ngừng bán "${book.title}"?` : `Kích hoạt lại "${book.title}"?`,
        action: () => updateBook({ ...book, isActive: !book.isActive }),
    });

    const handleRemoveSale = (book: Book) => setModal({
        type: "confirm",
        message: `Xóa giá sale của "${book.title}"?`,
        action: () => updateBook({ ...book, salePrice: null, saleFrom: null, saleTo: null, onSale: false, effectivePrice: book.price }),
    });

    const handleApplySale = (book: Book, req: SalePriceRequest) =>
        updateBook({ ...book, salePrice: req.salePrice, saleFrom: req.saleFrom, saleTo: req.saleTo, onSale: true, effectivePrice: req.salePrice });

    return (
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "28px 24px 48px", fontFamily: "'Inter','Segoe UI',system-ui,sans-serif", background: "#f4f5f7", minHeight: "100vh" }}>

            {/* ── Header ── */}
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 24 }}>
                <div>
                    <h1 style={{ fontSize: 22, fontWeight: 700, color: "#0f172a" }}>📚 Quản lý sách</h1>
                    <p style={{ fontSize: 13, color: "#64748b", marginTop: 2 }}>BookStore Admin — {books.length} đầu sách</p>
                </div>
                <button onClick={() => setDrawer(emptyBook())}
                    style={{ padding: "10px 20px", borderRadius: 8, border: "none", background: "#6366f1", color: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
                    + Thêm sách mới
                </button>
            </div>

            {/* ── Stats ── */}
            <StatsBar books={books} />

            {/* ── Toolbar ── */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
                <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
                    <span style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", color: "#94a3b8", fontSize: 16, pointerEvents: "none" }}>⌕</span>
                    <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Tìm theo tên, ISBN..."
                        style={{ width: "100%", height: 38, padding: "0 12px 0 34px", border: "1px solid #e2e8f0", borderRadius: 8, fontSize: 13, background: "#fff", outline: "none" }} />
                </div>

                <div style={{ display: "flex", gap: 4, background: "#fff", border: "1px solid #e2e8f0", borderRadius: 8, padding: 3 }}>
                    {STATUS_TABS.map(t => (
                        <button key={t.value} onClick={() => setStatus(t.value)}
                            style={{ padding: "5px 12px", borderRadius: 6, border: "none", background: status === t.value ? "#6366f1" : "transparent", color: status === t.value ? "#fff" : "#475569", fontSize: 13, fontWeight: 500, cursor: "pointer" }}>
                            {t.label}
                        </button>
                    ))}
                </div>

                <select value={categoryId ?? ""} onChange={e => setCategoryId(e.target.value ? Number(e.target.value) : null)}
                    style={{ height: 38, padding: "0 10px", border: "1px solid #e2e8f0", borderRadius: 8, fontSize: 13, background: "#fff", color: "#475569", outline: "none", cursor: "pointer" }}>
                    <option value="">Tất cả thể loại</option>
                    {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
            </div>

            {/* ── Table ── */}
            <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e8eaf0", overflow: "hidden" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                        <tr>
                            {["#", "Sách", "Thể loại", "Giá bán", "Tồn kho", "Trạng thái", "Thao tác"].map(h => (
                                <th key={h} style={{ padding: "11px 16px", textAlign: "left", fontSize: 12, fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: ".05em", background: "#f8fafc", borderBottom: "1px solid #e8eaf0" }}>
                                    {h}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.length === 0 ? (
                            <tr>
                                <td colSpan={7} style={{ textAlign: "center", color: "#94a3b8", padding: 40, fontSize: 14 }}>
                                    Không tìm thấy sách nào
                                </td>
                            </tr>
                        ) : filtered.map(book => (
                            <tr key={book.id} style={{ opacity: book.isActive ? 1 : 0.55 }}>

                                <td style={tdStyle}>
                                    <span style={{ fontSize: 12, color: "#94a3b8", fontFamily: "monospace" }}>{book.id}</span>
                                </td>

                                <td style={tdStyle}>
                                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                        <img src={book.coverImage} alt={book.title}
                                            style={{ width: 40, height: 56, borderRadius: 4, objectFit: "cover", border: "1px solid #e8eaf0", flexShrink: 0, background: "#f1f5f9" }}
                                            onError={e => { (e.target as HTMLImageElement).src = "https://via.placeholder.com/40x56?text=📖"; }} />
                                        <div>
                                            <p style={{ fontWeight: 600, color: "#0f172a", fontSize: 13.5, marginBottom: 2 }}>{book.title}</p>
                                            {book.isbn && <p style={{ fontSize: 11, color: "#94a3b8", fontFamily: "monospace" }}>ISBN: {book.isbn}</p>}
                                            {book.bookAuthors[0] && <p style={{ fontSize: 12, color: "#64748b", fontStyle: "italic", marginTop: 1 }}>{book.bookAuthors[0].authorName}</p>}
                                        </div>
                                    </div>
                                </td>

                                <td style={tdStyle}>
                                    {book.category
                                        ? <span style={{ background: "#ede9fe", color: "#7c3aed", borderRadius: 6, padding: "2px 8px", fontSize: 12, fontWeight: 500 }}>{book.category.name}</span>
                                        : <span style={{ color: "#cbd5e1" }}>—</span>}
                                </td>

                                <td style={{ ...tdStyle, whiteSpace: "nowrap" }}>
                                    {book.onSale ? (
                                        <>
                                            <span style={{ fontWeight: 700, color: "#ef4444", display: "block" }}>{vnd(book.effectivePrice!)}</span>
                                            <span style={{ fontSize: 11, color: "#94a3b8", textDecoration: "line-through" }}>{vnd(book.price)}</span>
                                        </>
                                    ) : (
                                        <span style={{ fontWeight: 600, color: "#0f172a" }}>{vnd(book.price)}</span>
                                    )}
                                </td>

                                <td style={tdStyle}>
                                    <span style={{
                                        fontWeight: 700, fontSize: 15,
                                        color: book.stockQuantity === 0 ? "#ef4444" : book.stockQuantity <= book.reorderPoint ? "#f59e0b" : "#22c55e",
                                    }}>
                                        {book.stockQuantity}
                                    </span>
                                </td>

                                <td style={tdStyle}>
                                    <StatusBadge book={book} />
                                </td>

                                <td style={{ ...tdStyle, whiteSpace: "nowrap" }}>
                                    <ActionBtn title="Sửa" onClick={() => setDrawer({ ...book })} hoverBg="#eef2ff" hoverBorder="#6366f1">✎</ActionBtn>
                                    <ActionBtn title={book.onSale ? "Xóa sale" : "Đặt sale"} hoverBg="#fef9ee" hoverBorder="#f59e0b"
                                        onClick={() => book.onSale ? handleRemoveSale(book) : setModal({ type: "sale", book })}>
                                        {book.onSale ? "✖" : "%"}
                                    </ActionBtn>
                                    <ActionBtn title={book.isActive ? "Ngừng bán" : "Kích hoạt"}
                                        hoverBg={book.isActive ? "#fff7ed" : "#f0fdf4"} hoverBorder={book.isActive ? "#f97316" : "#22c55e"}
                                        onClick={() => handleToggle(book)}>
                                        {book.isActive ? "⏸" : "▶"}
                                    </ActionBtn>
                                    <ActionBtn title="Xóa" onClick={() => handleDelete(book)} hoverBg="#fef2f2" hoverBorder="#ef4444">🗑</ActionBtn>
                                </td>

                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <p style={{ marginTop: 12, fontSize: 12, color: "#94a3b8", textAlign: "right" }}>
                {filtered.length} / {books.length} sách
            </p>

            {/* ── Portals ── */}
            {drawer && (
                <BookDrawer book={drawer} onClose={() => setDrawer(null)} onSave={saveBook} />
            )}
            {modal?.type === "sale" && (
                <SaleModal book={modal.book} onClose={() => setModal(null)} onSave={req => handleApplySale(modal.book, req)} />
            )}
            {modal?.type === "confirm" && (
                <ConfirmModal message={modal.message} danger={modal.danger} onConfirm={modal.action} onClose={() => setModal(null)} />
            )}
        </div>
    );
}