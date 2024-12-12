import { AppDispatch, RootState } from "@/redux/store";
import { getCategories } from "@/redux/thunks/categories";
import { Category } from "@/types/Category";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

export default function About() {
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();
  const { userInfo } = useSelector((state: RootState) => state.user);
  const categories = useSelector(
    (state: RootState) => state.categories.items
  ) as Array<Category>;
  const handleSearchClick = () => {
    const searchInput = document.getElementById('main-search') as HTMLInputElement;
    if (searchInput) {
      searchInput.focus();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  useEffect(() => {
    if (categories.length === 0) {
      dispatch(getCategories());
    }
  }, [dispatch, categories.length]);

  // Mảng màu sắc
  const colors = [
    { bg: "bg-orange-100", text: "text-orange-500", hoverText: "group-hover:text-orange-500" },
    { bg: "bg-blue-100", text: "text-blue-500", hoverText: "group-hover:text-blue-500" },
    { bg: "bg-purple-100", text: "text-purple-500", hoverText: "group-hover:text-purple-500" },
    { bg: "bg-teal-100", text: "text-teal-500", hoverText: "group-hover:text-teal-500" },
    { bg: "bg-pink-100", text: "text-pink-500", hoverText: "group-hover:text-pink-500" },
    { bg: "bg-yellow-100", text: "text-yellow-500", hoverText: "group-hover:text-yellow-500" },
    { bg: "bg-green-100", text: "text-green-500", hoverText: "group-hover:text-green-500" },
  ];

  return (
    <div className="bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center py-12 md:py-20 px-4 md:px-8 relative overflow-hidden">
    <div className="absolute inset-0">
      <div className="absolute inset-0 bg-[url('/patterns/grid.svg')] opacity-5"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-100/20 via-teal-100/20 to-cyan-100/20 animate-pulse"></div>
    </div>
    <div className="max-w-7xl w-full space-y-8 md:space-y-12 relative z-10">
      <div className="text-center space-y-4 md:space-y-6">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold animate-gradient bg-gradient-to-r from-gray-800 via-emerald-00 to-gray-800 bg-300% bg-clip-text text-transparent leading-[1.2]">
          Cổng thông tin dịch vụ
          <span className="block bg-gradient-to-r from-green-500 via-emerald-400 to-green-700 bg-300% bg-clip-text text-transparent leading-[1.4]">
            Chung cư Hưng Ngân
          </span>
        </h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed px-4">
          Kết nối cư dân với mọi dịch vụ tiện ích xung quanh khu vực
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mt-8 md:mt-16 lg:px-4">
        {categories.slice(1).filter(category => category.isActive).map((category, index) => {
          const color = colors[index % colors.length]; // Chọn màu tương ứng
          return (
            <div
              key={category.categoryId}
              className={`bg-white/90 backdrop-blur-lg p-8 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-lg transition-all duration-500 group hover:-translate-y-2 cursor-pointer`}
              onClick={() => {
                navigate(`/${category.categoryNameNoDiacritics}`);
              }}
            >
              <div className="relative w-16 h-16 mb-6">
                <div
                  className={`absolute inset-0 rounded-2xl rotate-6 group-hover:rotate-12 transition-transform ${color.bg}`}
                ></div>
                <div
                  className={`absolute inset-0 flex items-center justify-center text-4xl ${color.text}`}
                >
                  <i className="fas fa-cogs"></i>
                </div>
              </div>
              <h3
                className={`text-2xl font-bold mb-3 text-gray-800 transition-colors ${color.hoverText}`}
              >
                {category.categoryName}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {`Dịch vụ ${category.categoryName} chuyên nghiệp và tin cậy.`}
              </p>
            </div>
          );
        })}
      </div>

      <div className="flex flex-col sm:flex-row gap-6 justify-center mt-12 md:mt-16 px-4">
        <button 
          onClick={handleSearchClick}
          className="group relative overflow-hidden bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold py-4 px-10 rounded-full shadow-lg hover:shadow-xl"
        >
          <div className="absolute inset-0 bg-white/20 group-hover:translate-y-full transition-transform duration-300"></div>
          <div className="relative flex items-center justify-center gap-3">
            <i className="fas fa-search group-hover:rotate-12 transition-transform duration-300"></i>
            <span>Tìm kiếm dịch vụ</span>
          </div>
        </button>
        <button className="group relative overflow-hidden bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold py-4 px-10 rounded-full shadow-lg hover:shadow-xl">
          <div className="absolute inset-0 bg-white/20 group-hover:translate-y-full transition-transform duration-300"></div>
          <div className="relative flex items-center justify-center gap-3" onClick={() => {window.scrollTo(0, 0); navigate(userInfo ? "/registeradvertisement" : "/login")}}>
            <i className="fas fa-plus group-hover:rotate-90 transition-transform duration-300"></i>
            <Link to={userInfo ? "/registeradvertisement" : "/login"} onClick={() => window.scrollTo(0, 0)} >Đăng ký quảng cáo ngay</Link>
          </div>
        </button>
      </div>

      <div className="text-center mt-12">
        <p className="text-gray-600">
          Bạn có dịch vụ cần quảng cáo? 
          <Link 
            to={userInfo ? "/registeradvertisement" : "/login"} 
            className="inline-flex items-center text-green-600 hover:text-green-700 ml-2 font-semibold group cursor-pointer"
            onClick={() => window.scrollTo(0, 0)}
          >
            Đăng ký làm đối tác
          </Link>
        </p>
      </div>
    </div>
</div>

  );
}