import React, { useState, useEffect } from "react";
import { Menu, X, ShoppingCart, User, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

import logoImg from "../../../../../assets/images/logo/logo.png";

// Import Cart Component
import Cart from "../Cart/Cart";

const Header: React.FC = () => {
    const navigate = useNavigate();

    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [search, setSearch] = useState("");
    const [isCartOpen, setIsCartOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleNavigate = (path: string) => {
        navigate(path);
        window.scrollTo({ top: 0, behavior: "smooth" });
        setIsOpen(false);
    };

    const handleLogoClick = () => {
        navigate("/");
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (search.trim()) {
            navigate(`/search?q=${encodeURIComponent(search)}`);
            setSearch("");
        }
    };

    // Xử lý click icon User → chuyển đến trang Đăng nhập
    const handleUserClick = () => {
        navigate("/login");
    };

    return (
        <>
            <header
                className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled
                    ? "bg-white/95 backdrop-blur-md shadow-md"
                    : "bg-transparent"
                    }`}
            >
                <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">

                        {/* Logo */}
                        <button onClick={handleLogoClick} className="flex items-center">
                            <img
                                src={logoImg}
                                alt="BookStore"
                                className="h-12 w-auto transition hover:scale-105"
                            />
                        </button>

                        {/* Desktop Menu */}
                        <div className="hidden md:flex space-x-8 items-center">
                            {[
                                { name: "Trang chủ", to: "/" },
                                { name: "Sách", to: "/books" },
                                { name: "Thể loại", to: "/categories" },
                                { name: "Giới thiệu", to: "/about" },
                                { name: "Liên hệ", to: "/contact" },
                            ].map((item) => (
                                <button
                                    key={item.name}
                                    onClick={() => handleNavigate(item.to)}
                                    className="text-gray-700 hover:text-cyan-600 font-medium transition"
                                >
                                    {item.name}
                                </button>
                            ))}

                            {/* Search Bar */}
                            <form onSubmit={handleSearch} className="relative ml-4">
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Tìm kiếm sách..."
                                    className="pl-9 pr-4 py-1.5 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm w-56"
                                />
                                <Search
                                    size={16}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                />
                            </form>
                        </div>

                        {/* Right Icons - Desktop */}
                        <div className="hidden md:flex items-center space-x-6">
                            {/* Cart Icon */}
                            <button
                                onClick={() => setIsCartOpen(true)}
                                className="relative text-gray-700 hover:text-cyan-600 transition p-1"
                            >
                                <ShoppingCart size={24} />
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-medium w-5 h-5 flex items-center justify-center rounded-full">
                                    2
                                </span>
                            </button>

                            {/* User Icon */}
                            <button
                                onClick={handleUserClick}
                                className="text-gray-700 hover:text-cyan-600 transition p-1"
                                title="Đăng nhập"
                            >
                                <User size={24} />
                            </button>
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            className="md:hidden text-gray-800 p-1"
                            onClick={() => setIsOpen(!isOpen)}
                        >
                            {isOpen ? <X size={26} /> : <Menu size={26} />}
                        </button>
                    </div>

                    {/* Mobile Menu */}
                    {isOpen && (
                        <div className="md:hidden bg-white border-t px-4 py-5 space-y-4">
                            {[
                                { name: "Trang chủ", to: "/" },
                                { name: "Sách", to: "/books" },
                                { name: "Thể loại", to: "/categories" },
                                { name: "Giới thiệu", to: "/about" },
                                { name: "Liên hệ", to: "/contact" },
                            ].map((item) => (
                                <button
                                    key={item.name}
                                    onClick={() => handleNavigate(item.to)}
                                    className="block w-full text-left py-2 text-gray-700 hover:text-cyan-600 font-medium"
                                >
                                    {item.name}
                                </button>
                            ))}

                            <div className="flex gap-6 pt-4 border-t">
                                <button
                                    onClick={() => setIsCartOpen(true)}
                                    className="flex items-center gap-2 text-gray-700 hover:text-cyan-600"
                                >
                                    <ShoppingCart size={22} /> Giỏ hàng (2)
                                </button>
                                <button
                                    onClick={handleUserClick}
                                    className="flex items-center gap-2 text-gray-700 hover:text-cyan-600"
                                >
                                    <User size={22} /> Đăng nhập
                                </button>
                            </div>
                        </div>
                    )}
                </nav>
            </header>

            {/* Cart Sidebar */}
            {isCartOpen && (
                <div className="fixed inset-0 z-[60] flex">
                    {/* Overlay */}
                    <div
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                        onClick={() => setIsCartOpen(false)}
                    />

                    {/* Cart Panel */}
                    <div className="relative ml-auto w-full max-w-md h-full bg-white shadow-2xl overflow-hidden flex flex-col">
                        <div className="flex items-center justify-between p-6 border-b">
                            <h2 className="text-2xl font-bold text-gray-900">Giỏ hàng</h2>
                            <button
                                onClick={() => setIsCartOpen(false)}
                                className="text-gray-500 hover:text-gray-800 transition"
                            >
                                <X size={28} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-auto">
                            <Cart isInModal={true} onClose={() => setIsCartOpen(false)} />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Header;