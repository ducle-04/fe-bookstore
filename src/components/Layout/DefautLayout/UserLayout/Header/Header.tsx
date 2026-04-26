import React, { useState, useEffect } from "react";
import { Menu, X, ShoppingCart, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import logoImg from "../../../../../assets/images/logo/logo.png";

const Header: React.FC = () => {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

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

    return (
        <header
            className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled
                ? "bg-white/90 backdrop-blur-md shadow-md"
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

                    {/* Desktop menu */}
                    <div className="hidden md:flex space-x-8">
                        {[
                            { name: "Trang chủ", to: "/" },
                            { name: "Sách", to: "/books" },
                            { name: "Thể loại", to: "/categories" },
                            { name: "Tác giả", to: "/authors" },
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
                    </div>

                    {/* Right icons */}
                    <div className="hidden md:flex items-center space-x-5">

                        {/* Cart */}
                        <button
                            onClick={() => handleNavigate("/cart")}
                            className="relative text-gray-700 hover:text-cyan-600 transition"
                        >
                            <ShoppingCart size={24} />
                            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                                2
                            </span>
                        </button>

                        {/* User */}
                        <button
                            onClick={() => handleNavigate("/login")}
                            className="text-gray-700 hover:text-cyan-600 transition"
                        >
                            <User size={24} />
                        </button>
                    </div>

                    {/* Mobile button */}
                    <button
                        className="md:hidden text-gray-800"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        {isOpen ? <X size={26} /> : <Menu size={26} />}
                    </button>
                </div>

                {/* Mobile menu */}
                {isOpen && (
                    <div className="md:hidden bg-white border-t px-4 py-4 space-y-3">
                        {[
                            { name: "Trang chủ", to: "/" },
                            { name: "Sách", to: "/books" },
                            { name: "Thể loại", to: "/categories" },
                            { name: "Tác giả", to: "/authors" },
                            { name: "Giới thiệu", to: "/about" },
                            { name: "Liên hệ", to: "/contact" },
                        ].map((item) => (
                            <button
                                key={item.name}
                                onClick={() => handleNavigate(item.to)}
                                className="block w-full text-left text-gray-700 hover:text-cyan-600"
                            >
                                {item.name}
                            </button>
                        ))}

                        <div className="flex gap-4 pt-3 border-t">
                            <button
                                onClick={() => handleNavigate("/cart")}
                                className="flex items-center gap-2 text-gray-700"
                            >
                                <ShoppingCart size={20} /> Giỏ hàng
                            </button>

                            <button
                                onClick={() => handleNavigate("/login")}
                                className="flex items-center gap-2 text-gray-700"
                            >
                                <User size={20} /> Đăng nhập
                            </button>
                        </div>
                    </div>
                )}
            </nav>
        </header>
    );
};

export default Header;