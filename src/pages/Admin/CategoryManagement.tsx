import { useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Category {
    id: number;
    name: string;
    slug: string;
    path: string;
    parentId: number | null;
    parentName?: string;
    isActive: boolean;
    isDeleted: boolean;
    createdAt: string;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────
const mockCategories: Category[] = [
    { id: 1, name: "Văn học", slug: "van-hoc", path: "/van-hoc", parentId: null, isActive: true, isDeleted: false, createdAt: "2024-01-10" },
    { id: 2, name: "Khoa học", slug: "khoa-hoc", path: "/khoa-hoc", parentId: null, isActive: true, isDeleted: false, createdAt: "2024-01-11" },
    { id: 3, name: "Kinh tế", slug: "kinh-te", path: "/kinh-te", parentId: null, isActive: true, isDeleted: false, createdAt: "2024-01-12" },
    { id: 4, name: "Tiểu thuyết", slug: "tieu-thuyet", path: "/van-hoc/tieu-thuyet", parentId: 1, parentName: "Văn học", isActive: true, isDeleted: false, createdAt: "2024-01-15" },
    { id: 5, name: "Truyện ngắn", slug: "truyen-ngan", path: "/van-hoc/truyen-ngan", parentId: 1, parentName: "Văn học", isActive: false, isDeleted: false, createdAt: "2024-01-16" },
    { id: 6, name: "Thiên văn học", slug: "thien-van-hoc", path: "/khoa-hoc/thien-van-hoc", parentId: 2, parentName: "Khoa học", isActive: true, isDeleted: false, createdAt: "2024-01-18" },
    { id: 7, name: "Marketing", slug: "marketing", path: "/kinh-te/marketing", parentId: 3, parentName: "Kinh tế", isActive: true, isDeleted: false, createdAt: "2024-01-20" },
    { id: 8, name: "Khởi nghiệp", slug: "khoi-nghiep", path: "/kinh-te/khoi-nghiep", parentId: 3, parentName: "Kinh tế", isActive: true, isDeleted: true, createdAt: "2024-01-22" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function toSlug(str: string) {
    return str
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        .replace(/đ/g, "d").replace(/Đ/g, "D")
        .toLowerCase().trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-");
}

// ─── Toast ────────────────────────────────────────────────────────────────────
interface ToastProps { message: string }
function Toast({ message }: ToastProps) {
    return (
        <div className="fixed bottom-6 right-6 z-50 bg-gray-900 text-white text-sm px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2">
            <span className="text-emerald-400 text-xs">✓</span> {message}
        </div>
    );
}

// ─── Modal Shell ──────────────────────────────────────────────────────────────
function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <h3 className="text-base font-semibold text-gray-800">{title}</h3>
                    <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">✕</button>
                </div>
                <div className="px-6 py-5">{children}</div>
            </div>
        </div>
    );
}

// ─── Category Form Modal ──────────────────────────────────────────────────────
interface FormModalProps {
    initial?: Category;
    categories: Category[];
    onClose: () => void;
    onSave: (data: { name: string; slug: string; parentId: number | null }) => void;
}
function CategoryFormModal({ initial, categories, onClose, onSave }: FormModalProps) {
    const [name, setName] = useState(initial?.name ?? "");
    const [slug, setSlug] = useState(initial?.slug ?? "");
    const [parentId, setParentId] = useState<number | null>(initial?.parentId ?? null);
    const [autoSlug, setAutoSlug] = useState(!initial);

    function handleNameChange(v: string) {
        setName(v);
        if (autoSlug) setSlug(toSlug(v));
    }

    const roots = categories.filter(c => !c.isDeleted && c.id !== initial?.id);
    const input = "w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-300 transition";

    return (
        <Modal title={initial ? "Chỉnh sửa danh mục" : "Tạo danh mục mới"} onClose={onClose}>
            <div className="space-y-4">
                <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1.5">Tên danh mục <span className="text-red-400">*</span></label>
                    <input type="text" value={name} onChange={e => handleNameChange(e.target.value)} placeholder="VD: Văn học" className={input} />
                </div>
                <div>
                    <div className="flex items-center justify-between mb-1.5">
                        <label className="text-xs font-medium text-gray-500">Slug <span className="text-red-400">*</span></label>
                        <button
                            onClick={() => { setAutoSlug(a => !a); if (!autoSlug) setSlug(toSlug(name)); }}
                            className={`text-xs px-2 py-0.5 rounded-lg transition ${autoSlug ? "bg-violet-50 text-violet-600" : "bg-gray-100 text-gray-400"}`}
                        >{autoSlug ? "Tự động ✓" : "Tự động"}</button>
                    </div>
                    <input
                        type="text"
                        value={slug}
                        onChange={e => { setSlug(e.target.value); setAutoSlug(false); }}
                        placeholder="vd-van-hoc"
                        className={input}
                    />
                    <p className="text-xs text-gray-300 mt-1">Dùng cho URL: /category/<span className="text-violet-400">{slug || "..."}</span></p>
                </div>
                <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1.5">Danh mục cha</label>
                    <select
                        value={parentId ?? ""}
                        onChange={e => setParentId(e.target.value ? Number(e.target.value) : null)}
                        className={input + " bg-white"}
                    >
                        <option value="">— Không có (danh mục gốc) —</option>
                        {roots.map(c => (
                            <option key={c.id} value={c.id}>{c.parentId ? `  ↳ ${c.name}` : c.name}</option>
                        ))}
                    </select>
                </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
                <button onClick={onClose} className="px-4 py-2 text-sm text-gray-500 hover:bg-gray-100 rounded-xl transition">Hủy</button>
                <button
                    onClick={() => { if (!name || !slug) return; onSave({ name, slug, parentId }); onClose(); }}
                    className="px-4 py-2 text-sm font-medium text-white bg-violet-600 hover:bg-violet-700 rounded-xl transition"
                >{initial ? "Lưu thay đổi" : "Tạo danh mục"}</button>
            </div>
        </Modal>
    );
}

// ─── Detail Modal ─────────────────────────────────────────────────────────────
function DetailModal({ cat, onClose }: { cat: Category; onClose: () => void }) {
    return (
        <Modal title="Chi tiết danh mục" onClose={onClose}>
            <div className="space-y-4">
                <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                    <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center text-violet-600 font-bold text-base">
                        {cat.name[0]}
                    </div>
                    <div>
                        <p className="font-semibold text-gray-800">{cat.name}</p>
                        <p className="text-xs text-gray-400">#{cat.id}</p>
                    </div>
                    <div className="ml-auto flex gap-1.5">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${cat.isActive ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200" : "bg-gray-100 text-gray-400 ring-1 ring-gray-200"}`}>
                            {cat.isActive ? "Đang hiển thị" : "Ẩn"}
                        </span>
                        {cat.isDeleted && <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-red-50 text-red-500 ring-1 ring-red-200">Đã xóa</span>}
                    </div>
                </div>
                {[
                    { label: "Slug", value: <code className="text-xs bg-gray-50 px-2 py-0.5 rounded text-violet-600 font-mono">{cat.slug}</code> },
                    { label: "Đường dẫn (path)", value: <code className="text-xs bg-gray-50 px-2 py-0.5 rounded text-gray-600 font-mono">{cat.path}</code> },
                    { label: "Danh mục cha", value: cat.parentName ? <span className="text-sm text-gray-700">{cat.parentName}</span> : <span className="text-sm text-gray-300">Không có (gốc)</span> },
                    { label: "Ngày tạo", value: <span className="text-sm text-gray-700">{new Date(cat.createdAt).toLocaleDateString("vi-VN")}</span> },
                ].map(({ label, value }) => (
                    <div key={label} className="flex items-center justify-between">
                        <p className="text-xs text-gray-400 font-medium">{label}</p>
                        {value}
                    </div>
                ))}
            </div>
        </Modal>
    );
}

// ─── Tree Node ────────────────────────────────────────────────────────────────
interface TreeNodeProps {
    cat: Category;
    children: Category[];
    onEdit: (c: Category) => void;
    onDetail: (c: Category) => void;
    onDelete: (id: number) => void;
    onRestore: (id: number) => void;
    onToggle: (id: number) => void;
}
function TreeNode({ cat, children, onEdit, onDetail, onDelete, onRestore, onToggle }: TreeNodeProps) {
    const [open, setOpen] = useState(true);
    const hasChildren = children.length > 0;

    return (
        <div>
            <div className={`flex items-center gap-3 px-4 py-3 border-b border-gray-50 hover:bg-gray-50/70 transition-colors group ${cat.isDeleted ? "opacity-50" : ""}`}>
                {/* Expand toggle */}
                <button
                    onClick={() => setOpen(o => !o)}
                    className={`w-5 h-5 flex items-center justify-center text-gray-300 hover:text-gray-500 transition text-xs shrink-0 ${!hasChildren ? "invisible" : ""}`}
                >{open ? "▾" : "▸"}</button>

                {/* Icon */}
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0
          ${cat.parentId ? "bg-slate-100 text-slate-500" : "bg-violet-100 text-violet-600"}`}>
                    {cat.name[0]}
                </div>

                {/* Name + path */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                        <span className={`text-sm font-medium ${cat.isDeleted ? "line-through text-gray-400" : "text-gray-800"}`}>{cat.name}</span>
                        {!cat.parentId && <span className="text-xs px-1.5 py-0.5 rounded bg-violet-50 text-violet-500 font-medium">gốc</span>}
                        {hasChildren && <span className="text-xs text-gray-300">{children.length} con</span>}
                    </div>
                    <p className="text-xs text-gray-400 font-mono truncate">{cat.path}</p>
                </div>

                {/* Slug */}
                <code className="hidden md:block text-xs text-gray-400 font-mono bg-gray-50 px-2 py-0.5 rounded max-w-[140px] truncate">{cat.slug}</code>

                {/* Active badge */}
                <button
                    onClick={() => !cat.isDeleted && onToggle(cat.id)}
                    title="Bật/tắt hiển thị"
                    className={`hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium transition
            ${cat.isActive
                            ? "bg-emerald-50 text-emerald-600 ring-1 ring-emerald-200 hover:bg-emerald-100"
                            : "bg-gray-100 text-gray-400 ring-1 ring-gray-200 hover:bg-gray-200"
                        } ${cat.isDeleted ? "pointer-events-none" : ""}`}
                >
                    <span className={`w-1.5 h-1.5 rounded-full ${cat.isActive ? "bg-emerald-500" : "bg-gray-300"}`} />
                    {cat.isActive ? "Hiển thị" : "Ẩn"}
                </button>

                {/* Actions */}
                <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => onDetail(cat)} title="Chi tiết" className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-300 hover:text-violet-600 hover:bg-violet-50 transition text-xs">◉</button>
                    {!cat.isDeleted && (
                        <>
                            <button onClick={() => onEdit(cat)} title="Chỉnh sửa" className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-300 hover:text-sky-600 hover:bg-sky-50 transition text-xs">✎</button>
                            <button onClick={() => onDelete(cat.id)} title="Xóa" className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 transition text-xs">✕</button>
                        </>
                    )}
                    {cat.isDeleted && (
                        <button onClick={() => onRestore(cat.id)} title="Khôi phục" className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-300 hover:text-emerald-600 hover:bg-emerald-50 transition text-xs">↺</button>
                    )}
                </div>
            </div>

            {/* Children */}
            {hasChildren && open && (
                <div className="ml-8 border-l border-gray-100">
                    {children.map(child => (
                        <TreeNode
                            key={child.id}
                            cat={child}
                            children={[]}
                            onEdit={onEdit}
                            onDetail={onDetail}
                            onDelete={onDelete}
                            onRestore={onRestore}
                            onToggle={onToggle}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
type ModalType = "create" | "edit" | "detail" | null;

export default function AdminCategoryManagement() {
    const [categories, setCategories] = useState<Category[]>(mockCategories);
    const [modal, setModal] = useState<ModalType>(null);
    const [selected, setSelected] = useState<Category | null>(null);
    const [search, setSearch] = useState("");
    const [filterDeleted, setFilterDeleted] = useState<"active" | "deleted" | "all">("active");
    const [viewMode, setViewMode] = useState<"tree" | "flat">("tree");
    const [toast, setToast] = useState<string | null>(null);

    function showToast(msg: string) {
        setToast(msg);
        setTimeout(() => setToast(null), 2800);
    }
    function openModal(type: ModalType, cat?: Category) { setSelected(cat ?? null); setModal(type); }

    // Mutations
    function handleCreate(data: { name: string; slug: string; parentId: number | null }) {
        const parent = data.parentId ? categories.find(c => c.id === data.parentId) : null;
        const path = parent ? `${parent.path}/${data.slug}` : `/${data.slug}`;
        const parentName = parent?.name;
        setCategories(prev => [...prev, {
            id: Date.now(), ...data, path, parentName,
            isActive: true, isDeleted: false,
            createdAt: new Date().toISOString().split("T")[0],
        }]);
        showToast("Tạo danh mục thành công");
    }
    function handleEdit(data: { name: string; slug: string; parentId: number | null }) {
        if (!selected) return;
        const parent = data.parentId ? categories.find(c => c.id === data.parentId) : null;
        const path = parent ? `${parent.path}/${data.slug}` : `/${data.slug}`;
        setCategories(prev => prev.map(c => c.id === selected.id ? { ...c, ...data, path, parentName: parent?.name } : c));
        showToast("Cập nhật danh mục thành công");
    }
    function handleDelete(id: number) { setCategories(prev => prev.map(c => c.id === id ? { ...c, isDeleted: true } : c)); showToast("Đã xóa danh mục"); }
    function handleRestore(id: number) { setCategories(prev => prev.map(c => c.id === id ? { ...c, isDeleted: false } : c)); showToast("Đã khôi phục danh mục"); }
    function handleToggle(id: number) { setCategories(prev => prev.map(c => c.id === id ? { ...c, isActive: !c.isActive } : c)); showToast("Đã cập nhật trạng thái hiển thị"); }

    // Filter
    const filtered = categories.filter(c => {
        const q = search.toLowerCase();
        const matchQ = !q || c.name.toLowerCase().includes(q) || c.slug.includes(q);
        const matchDel = filterDeleted === "all" || (filterDeleted === "active" ? !c.isDeleted : c.isDeleted);
        return matchQ && matchDel;
    });

    // Stats
    const roots = categories.filter(c => !c.parentId && !c.isDeleted);
    const stats = [
        { label: "Tổng danh mục", value: categories.filter(c => !c.isDeleted).length, color: "text-violet-600", bg: "bg-violet-50" },
        { label: "Danh mục gốc", value: roots.length, color: "text-sky-600", bg: "bg-sky-50" },
        { label: "Đang hiển thị", value: categories.filter(c => c.isActive && !c.isDeleted).length, color: "text-emerald-600", bg: "bg-emerald-50" },
        { label: "Đã xóa", value: categories.filter(c => c.isDeleted).length, color: "text-gray-400", bg: "bg-gray-50" },
    ];

    // Tree builder
    const rootCats = filtered.filter(c => !c.parentId);
    const childMap: Record<number, Category[]> = {};
    filtered.filter(c => c.parentId).forEach(c => {
        if (!childMap[c.parentId!]) childMap[c.parentId!] = [];
        childMap[c.parentId!].push(c);
    });

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            <main className="px-6 py-6 max-w-full overflow-x-hidden">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-xl font-semibold text-gray-900">Quản lý danh mục</h1>
                        <p className="text-sm text-gray-400 mt-0.5">Tổ chức cây danh mục sách</p>
                    </div>
                    <button
                        onClick={() => openModal("create")}
                        className="flex items-center gap-2 px-4 py-2.5 bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium rounded-xl transition shadow-sm shadow-violet-200"
                    >
                        <span className="text-base leading-none">+</span> Tạo danh mục
                    </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
                    {stats.map(({ label, value, color, bg }) => (
                        <div key={label} className="bg-white rounded-2xl border border-gray-100 px-4 py-4">
                            <div className={`w-8 h-8 rounded-lg ${bg} flex items-center justify-center mb-2`}>
                                <span className={`text-sm font-bold ${color}`}>{value}</span>
                            </div>
                            <p className="text-xs text-gray-400 font-medium">{label}</p>
                        </div>
                    ))}
                </div>

                {/* Filters + View toggle */}
                <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-4">
                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className="relative flex-1">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 text-sm">⌕</span>
                            <input
                                type="text"
                                placeholder="Tìm theo tên hoặc slug…"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                className="w-full pl-8 pr-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-300 transition"
                            />
                        </div>
                        <select
                            value={filterDeleted}
                            onChange={e => setFilterDeleted(e.target.value as typeof filterDeleted)}
                            className="px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-200 bg-white text-gray-600"
                        >
                            <option value="active">Đang hoạt động</option>
                            <option value="deleted">Đã xóa</option>
                            <option value="all">Tất cả</option>
                        </select>
                        {/* View mode */}
                        <div className="flex bg-gray-100 rounded-xl p-0.5 gap-0.5">
                            {(["tree", "flat"] as const).map(m => (
                                <button
                                    key={m}
                                    onClick={() => setViewMode(m)}
                                    className={`px-3 py-1.5 text-xs font-medium rounded-lg transition ${viewMode === m ? "bg-white text-gray-700 shadow-sm" : "text-gray-400 hover:text-gray-600"}`}
                                >{m === "tree" ? "🌿 Cây" : "☰ Phẳng"}</button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                    {/* Table header — flat view */}
                    {viewMode === "flat" && (
                        <div className="grid grid-cols-[2fr_1.5fr_1fr_auto] gap-4 px-4 py-3 border-b border-gray-100">
                            {["Tên danh mục", "Slug / Đường dẫn", "Trạng thái", ""].map(h => (
                                <p key={h} className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{h}</p>
                            ))}
                        </div>
                    )}

                    {/* Tree header */}
                    {viewMode === "tree" && (
                        <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100">
                            <div className="w-5 shrink-0" />
                            <div className="w-7 shrink-0" />
                            <p className="flex-1 text-xs font-semibold text-gray-400 uppercase tracking-wide">Danh mục</p>
                            <p className="hidden md:block text-xs font-semibold text-gray-400 uppercase tracking-wide w-[140px]">Slug</p>
                            <p className="hidden sm:block text-xs font-semibold text-gray-400 uppercase tracking-wide w-[90px]">Hiển thị</p>
                            <div className="w-[88px]" />
                        </div>
                    )}

                    {filtered.length === 0 ? (
                        <div className="py-16 text-center text-sm text-gray-300">Không có danh mục nào</div>
                    ) : viewMode === "tree" ? (
                        <div>
                            {rootCats.map(cat => (
                                <TreeNode
                                    key={cat.id}
                                    cat={cat}
                                    children={childMap[cat.id] ?? []}
                                    onEdit={c => openModal("edit", c)}
                                    onDetail={c => openModal("detail", c)}
                                    onDelete={handleDelete}
                                    onRestore={handleRestore}
                                    onToggle={handleToggle}
                                />
                            ))}
                            {/* Orphan children if parent filtered out */}
                            {filtered.filter(c => c.parentId && !rootCats.find(r => r.id === c.parentId)).map(cat => (
                                <TreeNode
                                    key={cat.id}
                                    cat={cat}
                                    children={[]}
                                    onEdit={c => openModal("edit", c)}
                                    onDetail={c => openModal("detail", c)}
                                    onDelete={handleDelete}
                                    onRestore={handleRestore}
                                    onToggle={handleToggle}
                                />
                            ))}
                        </div>
                    ) : (
                        // Flat table view
                        <div className="divide-y divide-gray-50">
                            {filtered.map(cat => (
                                <div
                                    key={cat.id}
                                    className={`grid grid-cols-[2fr_1.5fr_1fr_auto] gap-4 items-center px-4 py-3.5 hover:bg-gray-50/70 transition-colors group ${cat.isDeleted ? "opacity-50" : ""}`}
                                >
                                    <div className="flex items-center gap-2.5 min-w-0">
                                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0
                      ${cat.parentId ? "bg-slate-100 text-slate-500" : "bg-violet-100 text-violet-600"}`}>
                                            {cat.name[0]}
                                        </div>
                                        <div className="min-w-0">
                                            <p className={`text-sm font-medium truncate ${cat.isDeleted ? "line-through text-gray-400" : "text-gray-800"}`}>{cat.name}</p>
                                            <p className="text-xs text-gray-400">{cat.parentName ? `↳ ${cat.parentName}` : "Danh mục gốc"}</p>
                                        </div>
                                    </div>
                                    <div className="min-w-0">
                                        <code className="text-xs text-violet-500 font-mono block truncate">{cat.slug}</code>
                                        <code className="text-xs text-gray-400 font-mono block truncate">{cat.path}</code>
                                    </div>
                                    <div>
                                        <button
                                            onClick={() => !cat.isDeleted && handleToggle(cat.id)}
                                            className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium transition
                        ${cat.isActive ? "bg-emerald-50 text-emerald-600 ring-1 ring-emerald-200 hover:bg-emerald-100" : "bg-gray-100 text-gray-400 ring-1 ring-gray-200 hover:bg-gray-200"}
                        ${cat.isDeleted ? "pointer-events-none" : ""}`}
                                        >
                                            <span className={`w-1.5 h-1.5 rounded-full ${cat.isActive ? "bg-emerald-500" : "bg-gray-300"}`} />
                                            {cat.isActive ? "Hiển thị" : "Ẩn"}
                                        </button>
                                        {cat.isDeleted && <span className="block mt-1 text-xs text-red-400">Đã xóa</span>}
                                    </div>
                                    <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => openModal("detail", cat)} title="Chi tiết" className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-300 hover:text-violet-600 hover:bg-violet-50 transition text-xs">◉</button>
                                        {!cat.isDeleted && (
                                            <>
                                                <button onClick={() => openModal("edit", cat)} title="Chỉnh sửa" className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-300 hover:text-sky-600 hover:bg-sky-50 transition text-xs">✎</button>
                                                <button onClick={() => handleDelete(cat.id)} title="Xóa" className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 transition text-xs">✕</button>
                                            </>
                                        )}
                                        {cat.isDeleted && (
                                            <button onClick={() => handleRestore(cat.id)} title="Khôi phục" className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-300 hover:text-emerald-600 hover:bg-emerald-50 transition text-xs">↺</button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>

            {/* Modals */}
            {modal === "create" && (
                <CategoryFormModal categories={categories} onClose={() => setModal(null)} onSave={handleCreate} />
            )}
            {modal === "edit" && selected && (
                <CategoryFormModal initial={selected} categories={categories} onClose={() => setModal(null)} onSave={handleEdit} />
            )}
            {modal === "detail" && selected && (
                <DetailModal cat={selected} onClose={() => setModal(null)} />
            )}

            {toast && <Toast message={toast} />}
        </div>
    );
}