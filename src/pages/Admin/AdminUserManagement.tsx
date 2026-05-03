import React, { useState, useMemo, useCallback } from "react";
import { Pencil, Repeat, Trash2 } from "lucide-react";

// ─── TYPES ───────────────────────────────────────────────────────────────────
type UserStatus = "ACTIVE" | "INACTIVE" | "BANNED" | "PENDING";

interface User {
    id: number;
    email: string;
    userName: string;
    fullName: string;
    phone: string;
    dob: string;
    lastLoginAt: string;
    isEmailVerified: boolean;
    isPhoneVerified: boolean;
    status: UserStatus;
    isDeleted: boolean;
    roles: string[];
}

// ─── MOCK DATA ────────────────────────────────────────────────────────────────
const INITIAL_USERS: User[] = [
    { id: 1, email: "nguyen.van.an@gmail.com", userName: "nguyenvanan", fullName: "Nguyễn Văn An", phone: "0912345678", dob: "1995-03-15", lastLoginAt: "2025-05-01T08:30:00", isEmailVerified: true, isPhoneVerified: true, status: "ACTIVE", isDeleted: false, roles: ["USER"] },
    { id: 2, email: "tran.thi.bich@gmail.com", userName: "tranbich", fullName: "Trần Thị Bích", phone: "0987654321", dob: "1998-07-22", lastLoginAt: "2025-04-28T14:15:00", isEmailVerified: true, isPhoneVerified: false, status: "ACTIVE", isDeleted: false, roles: ["ADMIN"] },
    { id: 3, email: "le.minh.cuong@gmail.com", userName: "leminhcuong", fullName: "Lê Minh Cường", phone: "0911111111", dob: "1990-11-08", lastLoginAt: "2025-03-10T09:00:00", isEmailVerified: false, isPhoneVerified: false, status: "BANNED", isDeleted: false, roles: ["USER"] },
    { id: 4, email: "pham.thu.dung@gmail.com", userName: "phamtdung", fullName: "Phạm Thu Dung", phone: "0922222222", dob: "2000-01-30", lastLoginAt: "2025-04-15T16:45:00", isEmailVerified: true, isPhoneVerified: true, status: "INACTIVE", isDeleted: false, roles: ["USER"] },
    { id: 5, email: "hoang.van.em@gmail.com", userName: "hoanganem", fullName: "Hoàng Văn Em", phone: "0933333333", dob: "1993-05-18", lastLoginAt: "2025-02-20T11:20:00", isEmailVerified: true, isPhoneVerified: false, status: "ACTIVE", isDeleted: true, roles: ["USER"] },
    { id: 6, email: "do.thi.phuong@gmail.com", userName: "dtphuong", fullName: "Đỗ Thị Phương", phone: "0944444444", dob: "1996-09-25", lastLoginAt: "2025-05-01T17:00:00", isEmailVerified: false, isPhoneVerified: true, status: "PENDING", isDeleted: false, roles: ["USER"] },
];

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const AVATAR_COLORS = [
    { bg: "#ede9fe", color: "#7c3aed" }, { bg: "#d1fae5", color: "#059669" },
    { bg: "#fee2e2", color: "#dc2626" }, { bg: "#dbeafe", color: "#2563eb" },
    { bg: "#fef3c7", color: "#d97706" }, { bg: "#fce7f3", color: "#db2777" },
];
function getInitials(name: string) { return name.split(" ").slice(-2).map(w => w[0]).join("").toUpperCase(); }
function formatDateTime(s: string) {
    return new Date(s).toLocaleString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
}
const emptyUser = (): User => ({
    id: 0, email: "", userName: "", fullName: "", phone: "", dob: "",
    lastLoginAt: new Date().toISOString(), isEmailVerified: false, isPhoneVerified: false,
    status: "PENDING", isDeleted: false, roles: ["USER"],
});

// ─── STYLE TOKENS ─────────────────────────────────────────────────────────────
const tdStyle: React.CSSProperties = { padding: "13px 16px", borderBottom: "1px solid #f1f5f9", verticalAlign: "middle" };
const inputStyle: React.CSSProperties = { padding: "8px 11px", border: "1px solid #e2e8f0", borderRadius: 7, fontSize: 13, color: "#0f172a", background: "#fff", outline: "none", width: "100%" };

// ─── ATOMS ────────────────────────────────────────────────────────────────────
function Field({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: "#475569", textTransform: "uppercase", letterSpacing: ".05em" }}>{label}</label>
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
    return <button onClick={onClick} style={{ padding: "8px 16px", borderRadius: 8, border: "1px solid", fontSize: 13, fontWeight: 600, cursor: "pointer", ...BTN_STYLES[variant] }}>{children}</button>;
}
function CloseBtn({ onClick }: { onClick: () => void }) {
    return <button onClick={onClick} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 16, color: "#94a3b8", width: 28, height: 28, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>;
}
function ActionBtn({ title, onClick, children, hoverBg = "#f1f5f9", hoverBorder = "#cbd5e1" }: { title: string; onClick: () => void; children: React.ReactNode; hoverBg?: string; hoverBorder?: string }) {
    const [hov, setHov] = useState(false);
    return (
        <button title={title} onClick={onClick} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
            style={{ width: 30, height: 30, borderRadius: 6, border: `1px solid ${hov ? hoverBorder : "#e2e8f0"}`, background: hov ? hoverBg : "#fff", cursor: "pointer", fontSize: 14, marginRight: 4, display: "inline-flex", alignItems: "center", justifyContent: "center", transition: "all .15s", transform: hov ? "translateY(-1px)" : "none" }}>
            {children}
        </button>
    );
}

// ─── STATUS BADGE ─────────────────────────────────────────────────────────────
const STATUS_CFG: Record<UserStatus, { bg: string; color: string; label: string }> = {
    ACTIVE: { bg: "#dcfce7", color: "#16a34a", label: "Hoạt động" },
    INACTIVE: { bg: "#ffedd5", color: "#ea580c", label: "Tạm dừng" },
    BANNED: { bg: "#fee2e2", color: "#dc2626", label: "Cấm" },
    PENDING: { bg: "#dbeafe", color: "#2563eb", label: "Chờ duyệt" },
};
function StatusBadge({ status }: { status: UserStatus }) {
    const c = STATUS_CFG[status];
    return <span style={{ display: "inline-block", padding: "3px 9px", borderRadius: 20, fontSize: 11, fontWeight: 600, background: c.bg, color: c.color }}>{c.label}</span>;
}
function VerifyDot({ verified }: { verified: boolean }) {
    return (
        <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 12, color: verified ? "#16a34a" : "#94a3b8" }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: verified ? "#22c55e" : "#cbd5e1", display: "inline-block" }} />
            {verified ? "Đã xác thực" : "Chưa"}
        </span>
    );
}

// ─── STATS BAR ────────────────────────────────────────────────────────────────
function StatsBar({ users }: { users: User[] }) {
    const s = useMemo(() => ({
        total: users.filter(u => !u.isDeleted).length,
        active: users.filter(u => u.status === "ACTIVE" && !u.isDeleted).length,
        banned: users.filter(u => u.status === "BANNED").length,
        pending: users.filter(u => u.status === "PENDING").length,
        deleted: users.filter(u => u.isDeleted).length,
    }), [users]);
    const items = [
        { label: "Tổng người dùng", value: s.total, accent: "#6366f1" },
        { label: "Đang hoạt động", value: s.active, accent: "#22c55e" },
        { label: "Bị cấm", value: s.banned, accent: "#ef4444" },
        { label: "Chờ duyệt", value: s.pending, accent: "#3b82f6" },
        { label: "Đã xóa", value: s.deleted, accent: "#94a3b8" },
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
function ConfirmModal({ message, danger, onConfirm, onClose }: { message: string; danger?: boolean; onConfirm: () => void; onClose: () => void }) {
    return (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }} onClick={onClose}>
            <div style={{ background: "#fff", borderRadius: 14, width: 440, maxWidth: "95vw", boxShadow: "0 20px 60px rgba(0,0,0,.2)", overflow: "hidden" }} onClick={e => e.stopPropagation()}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 20px", borderBottom: "1px solid #f1f5f9" }}>
                    <h2 style={{ fontSize: 15, fontWeight: 700, color: "#0f172a" }}>Xác nhận thao tác</h2><CloseBtn onClick={onClose} />
                </div>
                <div style={{ padding: 20 }}><p style={{ color: "#475569", lineHeight: 1.7 }}>{message}</p></div>
                <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, padding: "16px 20px", borderTop: "1px solid #f1f5f9", background: "#fafbfc" }}>
                    <Btn variant="secondary" onClick={onClose}>Hủy</Btn>
                    <Btn variant={danger ? "danger" : "primary"} onClick={() => { onConfirm(); onClose(); }}>Xác nhận</Btn>
                </div>
            </div>
        </div>
    );
}

// ─── CHANGE STATUS MODAL ──────────────────────────────────────────────────────
function ChangeStatusModal({ user, onClose, onSave }: { user: User; onClose: () => void; onSave: (s: UserStatus) => void }) {
    const [status, setStatus] = useState<UserStatus>(user.status);
    const all: UserStatus[] = ["ACTIVE", "INACTIVE", "BANNED", "PENDING"];
    return (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }} onClick={onClose}>
            <div style={{ background: "#fff", borderRadius: 14, width: 420, maxWidth: "95vw", boxShadow: "0 20px 60px rgba(0,0,0,.2)", overflow: "hidden" }} onClick={e => e.stopPropagation()}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 20px", borderBottom: "1px solid #f1f5f9" }}>
                    <h2 style={{ fontSize: 15, fontWeight: 700, color: "#0f172a" }}>Đổi trạng thái — {user.userName}</h2><CloseBtn onClick={onClose} />
                </div>
                <div style={{ padding: 20, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                    {all.map(s => {
                        const c = STATUS_CFG[s]; const active = status === s;
                        return (
                            <button key={s} onClick={() => setStatus(s)}
                                style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 14px", borderRadius: 10, cursor: "pointer", transition: "all .15s", border: active ? "2px solid #6366f1" : "1px solid #e2e8f0", background: active ? "#eef2ff" : "#fff" }}>
                                <span style={{ display: "inline-block", padding: "2px 8px", borderRadius: 20, fontSize: 11, fontWeight: 600, background: c.bg, color: c.color }}>{c.label}</span>
                            </button>
                        );
                    })}
                </div>
                <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, padding: "16px 20px", borderTop: "1px solid #f1f5f9", background: "#fafbfc" }}>
                    <Btn variant="secondary" onClick={onClose}>Hủy</Btn>
                    <Btn variant="primary" onClick={() => { onSave(status); onClose(); }}>Áp dụng</Btn>
                </div>
            </div>
        </div>
    );
}

// ─── USER DRAWER ──────────────────────────────────────────────────────────────
function UserDrawer({ user, onClose, onSave }: { user: User; onClose: () => void; onSave: (u: User) => void }) {
    const isNew = user.id === 0;
    const [form, setForm] = useState<User>({ ...user });
    const [password, setPassword] = useState("");
    const setStr = (field: keyof User) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setForm(prev => ({ ...prev, [field]: e.target.value }));
    const handleSave = () => {
        if (!form.fullName.trim() || !form.email.trim() || !form.userName.trim()) { alert("Vui lòng nhập đầy đủ thông tin bắt buộc!"); return; }
        onSave({ ...form, id: isNew ? Date.now() : form.id });
        onClose();
    };
    return (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.3)", zIndex: 100, display: "flex", justifyContent: "flex-end" }} onClick={onClose}>
            <div style={{ width: 500, maxWidth: "95vw", background: "#fff", height: "100vh", display: "flex", flexDirection: "column", boxShadow: "-8px 0 40px rgba(0,0,0,.15)" }} onClick={e => e.stopPropagation()}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 24px", borderBottom: "1px solid #f1f5f9", flexShrink: 0 }}>
                    <h2 style={{ fontSize: 16, fontWeight: 700, color: "#0f172a" }}>{isNew ? "Thêm người dùng" : "Chỉnh sửa người dùng"}</h2>
                    <CloseBtn onClick={onClose} />
                </div>
                <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                        <div style={{ gridColumn: "span 2" }}>
                            <Field label="Họ và tên *"><input value={form.fullName} onChange={setStr("fullName")} placeholder="Nguyễn Văn An" style={inputStyle} /></Field>
                        </div>
                        <Field label="Tên đăng nhập *"><input value={form.userName} onChange={setStr("userName")} placeholder="nguyenvanan" style={inputStyle} /></Field>
                        <Field label="Email *"><input type="email" value={form.email} onChange={setStr("email")} placeholder="user@email.com" style={inputStyle} /></Field>
                        <Field label="Số điện thoại"><input value={form.phone} onChange={setStr("phone")} placeholder="0912345678" style={inputStyle} /></Field>
                        <Field label="Ngày sinh"><input type="date" value={form.dob} onChange={setStr("dob")} style={inputStyle} /></Field>
                        {isNew && (
                            <div style={{ gridColumn: "span 2" }}>
                                <Field label="Mật khẩu *"><input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" style={inputStyle} /></Field>
                            </div>
                        )}
                        <div style={{ gridColumn: "span 2" }}>
                            <Field label="Vai trò">
                                <div style={{ display: "flex", gap: 8 }}>
                                    {["USER", "ADMIN", "STAFF"].map(role => {
                                        const active = form.roles.includes(role);
                                        return (
                                            <button key={role} onClick={() => setForm(prev => ({ ...prev, roles: active ? prev.roles.filter(r => r !== role) : [...prev.roles, role] }))}
                                                style={{ padding: "5px 14px", borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: "pointer", border: active ? "1px solid #6366f1" : "1px solid #e2e8f0", background: active ? "#eef2ff" : "#fff", color: active ? "#6366f1" : "#475569" }}>
                                                {role}
                                            </button>
                                        );
                                    })}
                                </div>
                            </Field>
                        </div>
                    </div>
                </div>
                <div style={{ padding: "16px 24px", borderTop: "1px solid #f1f5f9", background: "#fafbfc", display: "flex", justifyContent: "flex-end", gap: 10, flexShrink: 0 }}>
                    <Btn variant="secondary" onClick={onClose}>Hủy</Btn>
                    <Btn variant="primary" onClick={handleSave}>{isNew ? "Tạo người dùng" : "Lưu thay đổi"}</Btn>
                </div>
            </div>
        </div>
    );
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
type StatusFilter = "all" | "active" | "inactive" | "banned" | "pending" | "deleted";
type ModalState =
    | { type: "confirm"; message: string; danger?: boolean; action: () => void }
    | { type: "changeStatus"; user: User }
    | null;

const STATUS_TABS: { value: StatusFilter; label: string }[] = [
    { value: "all", label: "Tất cả" }, { value: "active", label: "Hoạt động" },
    { value: "inactive", label: "Tạm dừng" }, { value: "banned", label: "Bị cấm" },
    { value: "pending", label: "Chờ duyệt" }, { value: "deleted", label: "Đã xóa" },
];
const PAGE_SIZE = 7;

export default function AdminUserManagement() {
    const [users, setUsers] = useState<User[]>(INITIAL_USERS);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
    const [page, setPage] = useState(0);
    const [drawer, setDrawer] = useState<User | null>(null);
    const [modal, setModal] = useState<ModalState>(null);
    const [toast, setToast] = useState<string | null>(null);

    function showToast(msg: string) { setToast(msg); setTimeout(() => setToast(null), 2800); }

    const filtered = useMemo(() => users.filter(u => {
        const q = search.toLowerCase();
        if (q && !u.fullName.toLowerCase().includes(q) && !u.email.toLowerCase().includes(q) && !u.userName.toLowerCase().includes(q)) return false;
        if (statusFilter === "deleted") return u.isDeleted;
        if (statusFilter === "active") return u.status === "ACTIVE" && !u.isDeleted;
        if (statusFilter === "inactive") return u.status === "INACTIVE" && !u.isDeleted;
        if (statusFilter === "banned") return u.status === "BANNED" && !u.isDeleted;
        if (statusFilter === "pending") return u.status === "PENDING" && !u.isDeleted;
        return true;
    }), [users, search, statusFilter]);

    const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
    const paged = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

    const updateUser = useCallback((u: User) => setUsers(prev => prev.map(x => x.id === u.id ? u : x)), []);
    const saveUser = useCallback((u: User) => {
        if (u.id === 0) setUsers(prev => [{ ...u, id: Date.now() }, ...prev]);
        else updateUser(u);
    }, [updateUser]);

    const handleDelete = (u: User) => setModal({
        type: "confirm", danger: true,
        message: `Xóa người dùng "${u.fullName}" (@${u.userName})? Thao tác này không thể hoàn tác.`,
        action: () => { setUsers(prev => prev.map(x => x.id === u.id ? { ...x, isDeleted: true } : x)); showToast("Đã xóa người dùng"); },
    });

    const handleRestore = (u: User) => setModal({
        type: "confirm",
        message: `Khôi phục tài khoản "${u.fullName}"?`,
        action: () => { updateUser({ ...u, isDeleted: false }); showToast("Đã khôi phục người dùng"); },
    });

    return (
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "28px 24px 48px", fontFamily: "'Inter','Segoe UI',system-ui,sans-serif", background: "#f4f5f7", minHeight: "100vh" }}>

            {/* Header */}
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 24 }}>
                <div>
                    <h1 style={{ fontSize: 22, fontWeight: 700, color: "#0f172a" }}> Quản lý người dùng</h1>
                    <p style={{ fontSize: 13, color: "#64748b", marginTop: 2 }}>BookStore Admin — {users.length} tài khoản</p>
                </div>
                <button onClick={() => setDrawer(emptyUser())}
                    style={{ padding: "10px 20px", borderRadius: 8, border: "none", background: "#6366f1", color: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
                    + Thêm người dùng
                </button>
            </div>

            {/* Stats */}
            <StatsBar users={users} />

            {/* Toolbar */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
                <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
                    <span style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", color: "#94a3b8", fontSize: 16, pointerEvents: "none" }}>⌕</span>
                    <input value={search} onChange={e => { setSearch(e.target.value); setPage(0); }} placeholder="Tìm theo tên, email, username..."
                        style={{ width: "100%", height: 38, padding: "0 12px 0 34px", border: "1px solid #e2e8f0", borderRadius: 8, fontSize: 13, background: "#fff", outline: "none" }} />
                </div>
                <div style={{ display: "flex", gap: 4, background: "#fff", border: "1px solid #e2e8f0", borderRadius: 8, padding: 3 }}>
                    {STATUS_TABS.map(t => (
                        <button key={t.value} onClick={() => { setStatusFilter(t.value); setPage(0); }}
                            style={{ padding: "5px 12px", borderRadius: 6, border: "none", background: statusFilter === t.value ? "#6366f1" : "transparent", color: statusFilter === t.value ? "#fff" : "#475569", fontSize: 13, fontWeight: 500, cursor: "pointer" }}>
                            {t.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Table */}
            <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e8eaf0", overflow: "hidden" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                        <tr>
                            {["#", "Người dùng", "Liên hệ", "Xác thực", "Vai trò", "Trạng thái", "Đăng nhập cuối", "Thao tác"].map(h => (
                                <th key={h} style={{ padding: "11px 16px", textAlign: "left", fontSize: 12, fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: ".05em", background: "#f8fafc", borderBottom: "1px solid #e8eaf0" }}>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {paged.length === 0 ? (
                            <tr><td colSpan={8} style={{ textAlign: "center", color: "#94a3b8", padding: 40, fontSize: 14 }}>Không tìm thấy người dùng nào</td></tr>
                        ) : paged.map((user, idx) => {
                            const ac = AVATAR_COLORS[user.id % AVATAR_COLORS.length];
                            return (
                                <tr key={user.id} style={{ opacity: user.isDeleted ? 0.55 : 1 }}>
                                    <td style={tdStyle}><span style={{ fontSize: 12, color: "#94a3b8", fontFamily: "monospace" }}>{page * PAGE_SIZE + idx + 1}</span></td>
                                    <td style={tdStyle}>
                                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                            <div style={{ width: 36, height: 36, borderRadius: 9, background: ac.bg, color: ac.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, flexShrink: 0 }}>{getInitials(user.fullName)}</div>
                                            <div>
                                                <p style={{ fontWeight: 600, color: "#0f172a", fontSize: 13.5, marginBottom: 1, textDecoration: user.isDeleted ? "line-through" : "none" }}>{user.fullName}</p>
                                                <p style={{ fontSize: 12, color: "#94a3b8" }}>@{user.userName}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td style={tdStyle}>
                                        <p style={{ fontSize: 13, color: "#475569" }}>{user.email}</p>
                                        <p style={{ fontSize: 12, color: "#94a3b8" }}>{user.phone || "—"}</p>
                                    </td>
                                    <td style={tdStyle}>
                                        <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                                            <VerifyDot verified={user.isEmailVerified} />
                                            <VerifyDot verified={user.isPhoneVerified} />
                                        </div>
                                    </td>
                                    <td style={tdStyle}>
                                        <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                                            {user.roles.map(r => (
                                                <span key={r} style={{ padding: "2px 8px", borderRadius: 6, fontSize: 11, fontWeight: 600, background: r === "ADMIN" ? "#ede9fe" : "#f1f5f9", color: r === "ADMIN" ? "#7c3aed" : "#475569" }}>{r}</span>
                                            ))}
                                        </div>
                                    </td>
                                    <td style={tdStyle}>
                                        <StatusBadge status={user.status} />
                                        {user.isDeleted && <span style={{ display: "block", marginTop: 4, fontSize: 11, color: "#ef4444", fontWeight: 500 }}>Đã xóa</span>}
                                    </td>
                                    <td style={{ ...tdStyle, fontSize: 12, color: "#64748b", whiteSpace: "nowrap" }}>{formatDateTime(user.lastLoginAt)}</td>
                                    <td style={{ ...tdStyle, whiteSpace: "nowrap" }}>
                                        {!user.isDeleted && (
                                            <>
                                                <ActionBtn
                                                    title="Chỉnh sửa"
                                                    onClick={() => setDrawer({ ...user })}
                                                    hoverBg="#eef2ff"
                                                    hoverBorder="#6366f1"
                                                >
                                                    <Pencil className="w-4 h-4" />
                                                </ActionBtn>

                                                <ActionBtn
                                                    title="Đổi trạng thái"
                                                    onClick={() => setModal({ type: "changeStatus", user })}
                                                    hoverBg="#fef9ee"
                                                    hoverBorder="#f59e0b"
                                                >
                                                    <Repeat className="w-4 h-4" />
                                                </ActionBtn>

                                                <ActionBtn
                                                    title="Xóa"
                                                    onClick={() => handleDelete(user)}
                                                    hoverBg="#fef2f2"
                                                    hoverBorder="#ef4444"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </ActionBtn>
                                            </>
                                        )}
                                        {user.isDeleted && <ActionBtn title="Khôi phục" onClick={() => handleRestore(user)} hoverBg="#f0fdf4" hoverBorder="#22c55e">↺</ActionBtn>}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 12 }}>
                    <span style={{ fontSize: 12, color: "#94a3b8" }}>{page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, filtered.length)} / {filtered.length} người dùng</span>
                    <div style={{ display: "flex", gap: 4 }}>
                        <button disabled={page === 0} onClick={() => setPage(p => p - 1)}
                            style={{ padding: "5px 12px", borderRadius: 6, border: "1px solid #e2e8f0", background: "#fff", fontSize: 12, cursor: page === 0 ? "default" : "pointer", opacity: page === 0 ? 0.4 : 1 }}>← Trước</button>
                        {Array.from({ length: totalPages }).map((_, i) => (
                            <button key={i} onClick={() => setPage(i)}
                                style={{ width: 30, height: 30, borderRadius: 6, border: "1px solid #e2e8f0", background: i === page ? "#6366f1" : "#fff", color: i === page ? "#fff" : "#475569", fontSize: 13, cursor: "pointer", fontWeight: 500 }}>{i + 1}</button>
                        ))}
                        <button disabled={page === totalPages - 1} onClick={() => setPage(p => p + 1)}
                            style={{ padding: "5px 12px", borderRadius: 6, border: "1px solid #e2e8f0", background: "#fff", fontSize: 12, cursor: page === totalPages - 1 ? "default" : "pointer", opacity: page === totalPages - 1 ? 0.4 : 1 }}>Sau →</button>
                    </div>
                </div>
            )}
            <p style={{ marginTop: 12, fontSize: 12, color: "#94a3b8", textAlign: "right" }}>{filtered.length} / {users.length} người dùng</p>

            {/* Portals */}
            {drawer && <UserDrawer user={drawer} onClose={() => setDrawer(null)} onSave={saveUser} />}
            {modal?.type === "changeStatus" && (
                <ChangeStatusModal user={modal.user} onClose={() => setModal(null)}
                    onSave={s => { updateUser({ ...modal.user, status: s }); showToast("Đã cập nhật trạng thái"); }} />
            )}
            {modal?.type === "confirm" && (
                <ConfirmModal message={modal.message} danger={modal.danger} onConfirm={modal.action} onClose={() => setModal(null)} />
            )}
            {toast && (
                <div style={{ position: "fixed", bottom: 24, right: 24, background: "#0f172a", color: "#fff", padding: "12px 18px", borderRadius: 10, fontSize: 13, fontWeight: 500, boxShadow: "0 8px 30px rgba(0,0,0,.2)", display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ color: "#22c55e" }}>✓</span> {toast}
                </div>
            )}
        </div>
    );
}