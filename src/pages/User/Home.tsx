import React from "react";
import ScrollToTop from "../../components/OtherComponent/ScrollToTop";


const Home: React.FC = () => {
    // Hàm cuộn về đầu trang
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <main className="w-full overflow-x-hidden">
            <ScrollToTop />
            <div className="text-center py-8">
                <div className="text-red-500 text-4xl font-bold">
                    Tailwind WORK?
                </div>
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