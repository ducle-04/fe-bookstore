import { Link, useLocation } from 'react-router-dom';

function Header() {
    const location = useLocation();

    const handleScroll = (id: string) => {
        if (location.pathname !== '/') {
            window.location.href = '/#' + id;
        } else {
            const element = document.getElementById(id);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        }
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top py-2">
            <div className="container">
                {/* Logo */}
                <Link
                    className="navbar-brand"
                    to="/"
                    style={{
                        fontWeight: 900,
                        fontSize: 28,
                        color: '#1a2233',
                    }}
                >
                    BookStore
                </Link>

                {/* Toggle */}
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#mainNavbar"
                >
                    <span className="navbar-toggler-icon" />
                </button>

                {/* Menu */}
                <div className="collapse navbar-collapse" id="mainNavbar">
                    <ul className="navbar-nav ms-auto align-items-lg-center">
                        <li className="nav-item">
                            <Link className="nav-link px-3" to="/">Trang chủ</Link>
                        </li>

                        <li className="nav-item">
                            <Link className={`nav-link px-3 ${location.pathname === '/books' ? 'active' : ''}`} to="/books">
                                Sách
                            </Link>
                        </li>

                        <li className="nav-item">
                            <Link className={`nav-link px-3 ${location.pathname === '/categories' ? 'active' : ''}`} to="/categories">
                                Thể loại
                            </Link>
                        </li>

                        <li className="nav-item">
                            <Link className={`nav-link px-3 ${location.pathname === '/blog' ? 'active' : ''}`} to="/blog">
                                Blog
                            </Link>
                        </li>

                        <li className="nav-item">
                            <Link className={`nav-link px-3 ${location.pathname === '/contact' ? 'active' : ''}`} to="/contact">
                                Liên hệ
                            </Link>
                        </li>
                    </ul>

                    {/* Auth buttons (UI only) */}
                    <div className="d-flex ms-lg-3 mt-3 mt-lg-0">
                        <Link
                            to="/login"
                            className="btn btn-outline-dark me-2"
                            style={{ borderRadius: 24 }}
                        >
                            Đăng nhập
                        </Link>

                        <Link
                            to="/register"
                            className="btn btn-dark"
                            style={{ borderRadius: 24 }}
                        >
                            Đăng ký
                        </Link>
                    </div>
                </div>
            </div>

            {/* CSS */}
            <style>
                {`
          .navbar-nav .nav-link {
            border-radius: 18px;
            transition: 0.2s;
          }

          .navbar-nav .nav-link:hover,
          .navbar-nav .nav-link.active {
            background: #222;
            color: #fff !important;
          }

          .btn-dark:hover,
          .btn-outline-dark:hover {
            background: #0e5d90 !important;
            color: white !important;
          }
        `}
            </style>
        </nav>
    );
}

export default Header;