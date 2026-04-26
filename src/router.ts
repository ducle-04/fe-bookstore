import UserLayout from "./components/Layout/DefautLayout/UserLayout/UserLayout";
import Home from "./pages/User/Home";

const PublicPage = [
    { path: "/", component: Home, layout: UserLayout },

];

const PrivatePage: any[] = [];

export { PublicPage, PrivatePage };
