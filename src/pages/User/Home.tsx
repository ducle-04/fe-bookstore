import React from "react";
import ScrollToTop from "../../components/OtherComponent/ScrollToTop";
import Banner from "../../components/Layout/DefautLayout/UserLayout/Banner/Banner";
import LibroAbout from "../../components/Layout/DefautLayout/UserLayout/Home/LibroAbout";
import PopularGenres from "../../components/Layout/DefautLayout/UserLayout/Home/PopularGenres";
import FreshlyAdded from "../../components/Layout/DefautLayout/UserLayout/Home/FreshlyAdded ";
const Home: React.FC = () => {
    // Hàm cuộn về đầu trang
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <main className="w-full overflow-x-hidden">
            <ScrollToTop />
            <Banner />
            <LibroAbout />
            <PopularGenres />
            <FreshlyAdded />
            <div className="text-center py-8">
                <button
                    onClick={scrollToTop}
                    className="px-6 py-2 bg-cyan-600 text-white font-semibold rounded-lg hover:bg-cyan-700 transition duration-300"
                >
                    Quay Lại Đầu Trang
                </button>
            </div>
        </main>
    );
};

export default Home;