import React, { useState, useRef, useEffect } from "react";
import { FaBars } from "react-icons/fa";
import { Search, Bell, Moon, Camera, Trash2, Edit } from "lucide-react";

interface HeaderProps {
    onToggleSidebar: () => void;
    adminName?: string;
}

const Header: React.FC<HeaderProps> = ({ onToggleSidebar, adminName }) => {
    const [showMenu, setShowMenu] = useState(false);
    const [uploadingAvatar, setUploadingAvatar] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const menuRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Mock Profile - avatarUrl là optional
    const [profile, setProfile] = useState<{
        fullname: string;
        email: string;
        avatarUrl?: string;
    }>({
        fullname: "Nguyễn Văn Admin",
        email: "admin@example.com",
        avatarUrl: "https://i.pravatar.cc/150?img=68",
    });

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setShowMenu(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            setError('Ảnh không được vượt quá 5MB');
            return;
        }

        setUploadingAvatar(true);

        setTimeout(() => {
            const mockUrl = URL.createObjectURL(file);
            setProfile(prev => ({ ...prev, avatarUrl: mockUrl }));
            setUploadingAvatar(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }, 700);
    };

    const handleDeleteAvatar = () => {
        setProfile(prev => ({ ...prev, avatarUrl: undefined }));
    };

    return (
        <header className="w-full h-16 border-b bg-white flex items-center justify-between px-6 shadow-sm">

            <button onClick={onToggleSidebar}>
                <FaBars size={20} className="text-cyan-600" />
            </button>

            <div className="flex-1 flex justify-center max-w-md mx-auto">
                <div className="w-full relative">
                    <input
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                        placeholder="Tìm kiếm..."
                    />
                    <Search className="absolute right-3 top-2.5 w-5 h-5 text-gray-400" />
                </div>
            </div>

            <div className="flex items-center gap-5">
                <button className="p-2 rounded-lg hover:bg-gray-100">
                    <Moon className="w-5 h-5 text-gray-600" />
                </button>

                <button className="p-2 rounded-lg hover:bg-gray-100 relative">
                    <Bell className="w-5 h-5 text-gray-600" />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>

                <div className="relative" ref={menuRef}>
                    <button onClick={() => setShowMenu(!showMenu)} className="flex items-center gap-2">
                        {profile.avatarUrl ? (
                            <img
                                src={profile.avatarUrl}
                                alt="Avatar"
                                className="w-9 h-9 rounded-full object-cover border border-cyan-500"
                            />
                        ) : (
                            <div className="w-9 h-9 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center">
                                <span className="text-white font-bold">
                                    {profile.fullname?.[0]?.toUpperCase() || 'A'}
                                </span>
                            </div>
                        )}
                    </button>

                    {showMenu && (
                        <div className="absolute right-0 mt-2 w-60 py-2 bg-white rounded-lg border border-gray-200 shadow-sm">
                            <div className="px-4 py-3 border-b border-gray-100">
                                <div className="flex items-center gap-3">
                                    {profile.avatarUrl ? (
                                        <img src={profile.avatarUrl} alt="" className="w-10 h-10 rounded-full" />
                                    ) : (
                                        <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center">
                                            <span className="text-white font-bold text-lg">
                                                {profile.fullname?.[0]?.toUpperCase() || 'A'}
                                            </span>
                                        </div>
                                    )}
                                    <div>
                                        <p className="font-medium text-sm">{profile.fullname}</p>
                                        <p className="text-xs text-gray-500">{profile.email}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="py-1">
                                <button className="w-full text-left px-4 py-2.5 text-sm flex items-center gap-3 hover:bg-gray-100">
                                    <Edit className="w-4 h-4 text-gray-600" />
                                    <span>Chỉnh sửa hồ sơ</span>
                                </button>

                                <label className="w-full text-left px-4 py-2.5 text-sm flex items-center gap-3 hover:bg-gray-100 cursor-pointer">
                                    <Camera className="w-4 h-4 text-gray-600" />
                                    <span>Cập nhật ảnh đại diện</span>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={handleAvatarChange}
                                        className="hidden"
                                    />
                                </label>

                                {profile.avatarUrl && (
                                    <button
                                        onClick={handleDeleteAvatar}
                                        className="w-full text-left px-4 py-2.5 text-sm flex items-center gap-3 text-red-600 hover:bg-red-50"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        <span>Xóa ảnh đại diện</span>
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {error && (
                <div className="fixed top-4 right-4 px-4 py-3 bg-red-100 text-red-700 rounded-lg text-sm shadow">
                    {error}
                    <button onClick={() => setError(null)} className="ml-3 underline">×</button>
                </div>
            )}
        </header>
    );
};

export default Header;