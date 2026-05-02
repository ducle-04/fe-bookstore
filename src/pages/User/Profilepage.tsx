import { useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────
type Tab = "profile" | "password";

interface ProfileForm {
    fullName: string;
    userName: string;
    phone: string;
    dob: string;
}

interface PasswordForm {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

// ─── Mock current user ────────────────────────────────────────────────────────
const MOCK_USER = {
    email: "an.nguyen@gmail.com",
    userName: "nguyenvanan",
    fullName: "Nguyễn Văn An",
    phone: "0912345678",
    dob: "1998-04-15",
    isEmailVerified: true,
    isPhoneVerified: false,
    status: "ACTIVE",
    lastLoginAt: "2024-06-01T09:23:00",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmtDate = (s: string) =>
    new Date(s).toLocaleString("vi-VN", { dateStyle: "short", timeStyle: "short" });

// ─── Input Field ──────────────────────────────────────────────────────────────
function Field({
    label,
    type = "text",
    value,
    onChange,
    placeholder,
    disabled,
    hint,
    suffix,
}: {
    label: string;
    type?: string;
    value: string;
    onChange?: (v: string) => void;
    placeholder?: string;
    disabled?: boolean;
    hint?: React.ReactNode;
    suffix?: React.ReactNode;
}) {
    const [show, setShow] = useState(false);
    const inputType = type === "password" ? (show ? "text" : "password") : type;

    return (
        <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">
                {label}
            </label>
            <div className="relative">
                <input
                    type={inputType}
                    value={value}
                    onChange={(e) => onChange?.(e.target.value)}
                    placeholder={placeholder}
                    disabled={disabled}
                    className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-all outline-none
            ${disabled
                            ? "bg-slate-50 border-slate-200 text-slate-400 cursor-not-allowed"
                            : "bg-white border-slate-200 text-slate-700 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                        }
            ${suffix || type === "password" ? "pr-12" : ""}
          `}
                />
                {type === "password" && (
                    <button
                        type="button"
                        onClick={() => setShow((s) => !s)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
                    >
                        {show ? "Ẩn" : "Hiện"}
                    </button>
                )}
                {suffix && type !== "password" && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">{suffix}</div>
                )}
            </div>
            {hint && <p className="mt-1.5 text-xs text-slate-400">{hint}</p>}
        </div>
    );
}

// ─── Toast ────────────────────────────────────────────────────────────────────
function Toast({ message, type }: { message: string; type: "success" | "error" }) {
    return (
        <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg text-sm font-medium
      ${type === "success" ? "bg-emerald-50 border border-emerald-200 text-emerald-700" : "bg-red-50 border border-red-200 text-red-600"}`}>
            <span>{type === "success" ? "✅" : "❌"}</span>
            {message}
        </div>
    );
}

// ─── Avatar ───────────────────────────────────────────────────────────────────
function Avatar({ name }: { name: string }) {
    const initials = name.trim().split(" ").slice(-2).map((w) => w[0]).join("").toUpperCase();
    return (
        <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
            {initials}
            <button className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-white border-2 border-white shadow flex items-center justify-center text-slate-500 hover:text-indigo-600 transition-colors">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a4 4 0 01-2.828 1.172H7v-2a4 4 0 011.172-2.828z" />
                </svg>
            </button>
        </div>
    );
}

// ─── Profile Tab ──────────────────────────────────────────────────────────────
function ProfileTab() {
    const [form, setForm] = useState<ProfileForm>({
        fullName: MOCK_USER.fullName,
        userName: MOCK_USER.userName,
        phone: MOCK_USER.phone,
        dob: MOCK_USER.dob,
    });
    const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
    const [loading, setLoading] = useState(false);

    const set = (k: keyof ProfileForm) => (v: string) => setForm((p) => ({ ...p, [k]: v }));

    const handleSubmit = async () => {
        setLoading(true);
        await new Promise((r) => setTimeout(r, 800));
        setLoading(false);
        setToast({ message: "Cập nhật thông tin thành công!", type: "success" });
        setTimeout(() => setToast(null), 3000);
    };

    return (
        <>
            <div className="space-y-5">
                {/* Email - readonly */}
                <Field
                    label="Email"
                    value={MOCK_USER.email}
                    disabled
                    suffix={
                        MOCK_USER.isEmailVerified ? (
                            <span className="text-xs font-semibold text-emerald-500 flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                                Đã xác thực
                            </span>
                        ) : (
                            <span className="text-xs font-semibold text-amber-500">Chưa xác thực</span>
                        )
                    }
                    hint="Email không thể thay đổi sau khi đăng ký."
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <Field label="Họ và tên" value={form.fullName} onChange={set("fullName")} placeholder="Nhập họ và tên" />
                    <Field
                        label="Tên người dùng"
                        value={form.userName}
                        onChange={set("userName")}
                        placeholder="username"
                        hint="Chỉ dùng chữ thường, số và dấu gạch dưới."
                    />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <Field
                        label="Số điện thoại"
                        value={form.phone}
                        onChange={set("phone")}
                        placeholder="09xxxxxxxx"
                        suffix={
                            MOCK_USER.isPhoneVerified ? (
                                <span className="text-xs font-semibold text-emerald-500">✓</span>
                            ) : (
                                <button className="text-xs font-semibold text-indigo-500 hover:underline whitespace-nowrap">
                                    Xác thực
                                </button>
                            )
                        }
                    />
                    <Field
                        label="Ngày sinh"
                        type="date"
                        value={form.dob}
                        onChange={set("dob")}
                    />
                </div>

                {/* Account info */}
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <p className="text-xs text-slate-400 mb-0.5">Trạng thái tài khoản</p>
                        <span className="inline-flex items-center gap-1.5 font-semibold text-emerald-600">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                            Hoạt động
                        </span>
                    </div>
                    <div>
                        <p className="text-xs text-slate-400 mb-0.5">Đăng nhập gần nhất</p>
                        <p className="font-medium text-slate-600">{fmtDate(MOCK_USER.lastLoginAt)}</p>
                    </div>
                </div>

                <div className="flex justify-end pt-2">
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white text-sm font-semibold rounded-xl transition-colors"
                    >
                        {loading ? (
                            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                            </svg>
                        ) : null}
                        {loading ? "Đang lưu..." : "Lưu thay đổi"}
                    </button>
                </div>
            </div>

            {toast && <Toast {...toast} />}
        </>
    );
}

// ─── Password Tab ─────────────────────────────────────────────────────────────
function PasswordTab() {
    const [form, setForm] = useState<PasswordForm>({ currentPassword: "", newPassword: "", confirmPassword: "" });
    const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
    const [loading, setLoading] = useState(false);

    const set = (k: keyof PasswordForm) => (v: string) => setForm((p) => ({ ...p, [k]: v }));

    const strength = (pw: string) => {
        let s = 0;
        if (pw.length >= 8) s++;
        if (/[A-Z]/.test(pw)) s++;
        if (/[0-9]/.test(pw)) s++;
        if (/[^A-Za-z0-9]/.test(pw)) s++;
        return s;
    };

    const pw = form.newPassword;
    const str = strength(pw);
    const strLabel = ["", "Yếu", "Trung bình", "Khá", "Mạnh"][str];
    const strColor = ["", "bg-red-400", "bg-amber-400", "bg-blue-400", "bg-emerald-400"][str];

    const handleSubmit = async () => {
        if (form.newPassword !== form.confirmPassword) {
            setToast({ message: "Mật khẩu xác nhận không khớp!", type: "error" });
            setTimeout(() => setToast(null), 3000);
            return;
        }
        if (str < 2) {
            setToast({ message: "Mật khẩu quá yếu, vui lòng chọn mật khẩu mạnh hơn.", type: "error" });
            setTimeout(() => setToast(null), 3000);
            return;
        }
        setLoading(true);
        await new Promise((r) => setTimeout(r, 800));
        setLoading(false);
        setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
        setToast({ message: "Đổi mật khẩu thành công!", type: "success" });
        setTimeout(() => setToast(null), 3000);
    };

    return (
        <>
            <div className="space-y-5">
                <Field
                    label="Mật khẩu hiện tại"
                    type="password"
                    value={form.currentPassword}
                    onChange={set("currentPassword")}
                    placeholder="Nhập mật khẩu hiện tại"
                />

                <div>
                    <Field
                        label="Mật khẩu mới"
                        type="password"
                        value={form.newPassword}
                        onChange={set("newPassword")}
                        placeholder="Tối thiểu 8 ký tự"
                    />
                    {pw.length > 0 && (
                        <div className="mt-2 space-y-1">
                            <div className="flex gap-1">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className={`h-1.5 flex-1 rounded-full transition-colors ${i <= str ? strColor : "bg-slate-100"}`} />
                                ))}
                            </div>
                            <p className="text-xs text-slate-400">
                                Độ mạnh: <span className="font-semibold text-slate-600">{strLabel}</span>
                            </p>
                        </div>
                    )}
                </div>

                <Field
                    label="Xác nhận mật khẩu mới"
                    type="password"
                    value={form.confirmPassword}
                    onChange={set("confirmPassword")}
                    placeholder="Nhập lại mật khẩu mới"
                    hint={
                        form.confirmPassword.length > 0 && form.confirmPassword !== form.newPassword
                            ? <span className="text-red-500">Mật khẩu không khớp</span>
                            : undefined
                    }
                />

                <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 text-sm text-amber-700 space-y-1">
                    <p className="font-semibold">Lưu ý khi đặt mật khẩu:</p>
                    <ul className="list-disc list-inside space-y-0.5 text-amber-600 text-xs">
                        <li>Tối thiểu 8 ký tự</li>
                        <li>Nên có chữ hoa, chữ thường, số và ký tự đặc biệt</li>
                        <li>Không dùng thông tin cá nhân dễ đoán</li>
                    </ul>
                </div>

                <div className="flex justify-end pt-2">
                    <button
                        onClick={handleSubmit}
                        disabled={loading || !form.currentPassword || !form.newPassword || !form.confirmPassword}
                        className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white text-sm font-semibold rounded-xl transition-colors"
                    >
                        {loading ? (
                            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                            </svg>
                        ) : null}
                        {loading ? "Đang lưu..." : "Đổi mật khẩu"}
                    </button>
                </div>
            </div>

            {toast && <Toast {...toast} />}
        </>
    );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function ProfilePage() {
    const [tab, setTab] = useState<Tab>("profile");

    const tabs: { key: Tab; label: string; icon: string }[] = [
        { key: "profile", label: "Thông tin cá nhân", icon: "👤" },
        { key: "password", label: "Đổi mật khẩu", icon: "🔒" },
    ];

    return (
        <div className="min-h-screen bg-slate-50 font-sans pt-24 pb-16">
            <div className="max-w-2xl mx-auto px-4">

                {/* Header card */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mb-5 flex items-center gap-5">
                    <Avatar name={MOCK_USER.fullName} />
                    <div>
                        <h1 className="text-lg font-bold text-slate-800">{MOCK_USER.fullName}</h1>
                        <p className="text-sm text-slate-400">{MOCK_USER.email}</p>
                        <p className="text-xs text-slate-300 mt-0.5">@{MOCK_USER.userName}</p>
                    </div>
                </div>

                {/* Tab bar */}
                <div className="flex gap-1 bg-white border border-slate-100 rounded-2xl p-1 shadow-sm mb-5">
                    {tabs.map((t) => (
                        <button
                            key={t.key}
                            onClick={() => setTab(t.key)}
                            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all
                ${tab === t.key
                                    ? "bg-indigo-50 text-indigo-700 shadow-sm"
                                    : "text-slate-500 hover:text-slate-700"}`}
                        >
                            <span>{t.icon}</span>
                            {t.label}
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                    {tab === "profile" && <ProfileTab />}
                    {tab === "password" && <PasswordTab />}
                </div>
            </div>
        </div>
    );
}