import UserLayout from "./components/Layout/DefautLayout/UserLayout/UserLayout";
import Home from "./pages/User/Home";
import ProductPage from "./pages/User/Product";
import BookDetails from "./pages/User/BookDetails";
import OrderPage from "./pages/User/OrderPages";
import RegisterPage from "./pages/Register/Register";
import LoginPage from "./pages/Login/Login";

const PublicPage = [
    { path: "/", component: Home, layout: UserLayout },
    { path: "/books", component: ProductPage, layout: UserLayout },
    { path: "/booksdeals", component: BookDetails, layout: UserLayout },
    { path: "/order", component: OrderPage, layout: UserLayout },
    { path: "/register", component: RegisterPage, layout: null },
    { path: "/login", component: LoginPage, layout: null },

];

const PrivatePage: any[] = [];

export { PublicPage, PrivatePage };
