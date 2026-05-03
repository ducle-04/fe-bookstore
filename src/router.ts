import UserLayout from "./components/Layout/DefautLayout/UserLayout/UserLayout";
import Home from "./pages/User/Home";
import ProductPage from "./pages/User/Product";
import BookDetails from "./pages/User/BookDetails";
import OrderPage from "./pages/User/OrderPages";
import RegisterPage from "./pages/Register/Register";
import LoginPage from "./pages/Login/Login";
import AdminLayout from "./components/Layout/DefautLayout/AdminLayout/AdminLayout";
import Dashboard from "./pages/Admin/Dashboard";
import BookManagement from "./pages/Admin/BookManagement";
import AdminUserManagement from "./pages/Admin/AdminUserManagement";
import AdminCategoryManagement from "./pages/Admin/CategoryManagement";
import OrderManagement from "./pages/Admin/Ordermanagement";
import AddressManagement from "./pages/Admin/AddressManagement";

import ProfilePage from "./pages/User/Profilepage";
import AuthorManagement from "./pages/Admin/AuthorManagement"

const PublicPage = [
    { path: "/", component: Home, layout: UserLayout },
    { path: "/books", component: ProductPage, layout: UserLayout },
    { path: "/booksdeals", component: BookDetails, layout: UserLayout },
    { path: "/order", component: OrderPage, layout: UserLayout },
    { path: "/register", component: RegisterPage, layout: null },
    { path: "/login", component: LoginPage, layout: null },
    { path: "/profile", component: ProfilePage, layout: UserLayout },

    { path: "/admin", component: Dashboard, layout: AdminLayout },
    { path: "/admin/books", component: BookManagement, layout: AdminLayout },
    { path: "/admin/users", component: AdminUserManagement, layout: AdminLayout },
    { path: "/admin/categories", component: AdminCategoryManagement, layout: AdminLayout },
    { path: "/admin/orders", component: OrderManagement, layout: AdminLayout },
    { path: "/admin/addresses", component: AddressManagement, layout: AdminLayout },
    { path: "/admin/authors", component: AuthorManagement, layout: AdminLayout },
];

const PrivatePage: any[] = [];

export { PublicPage, PrivatePage };
