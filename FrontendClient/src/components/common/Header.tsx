import { useToast } from "@/hooks/use-toast";
import useWindowSize from "@/hooks/useWindowsSize";
import { fetchSearch } from "@/redux/thunks/search";
import { trackClickThunk } from "@/redux/thunks/trackingClick";
import {
  Key,
  LogOut,
  Megaphone,
  Menu,
  Phone,
  Search,
  User,
  UserRound,
  X,
  ReceiptText,
  CircleHelp,
  PilcrowLeft,
  House,
  ArrowRight,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { facebook, youtube, zalo } from "../../assets/icons";
import { contact } from "../../constants";
import { logout } from "../../redux/slices/auth";
import { clearUserInfo } from "../../redux/slices/user";
import { AppDispatch, RootState } from "../../redux/store";
import { getCategories } from "../../redux/thunks/categories";
import type { Category } from "../../types/Category";
import ChangePasswordModal from "./ChangePasswordModal";
import "./styles/global.css"

const Logo = "/img/logo.jpg"

export default function Header({
  className,
  openUserInfo,
}: {
  className?: string;
  openUserInfo: () => void;
}) {
  const dispatch: AppDispatch = useDispatch();
  const categories = useSelector(
    (state: RootState) => state.categories.items
  ) as Array<Category>;
  const search = useSelector((state: RootState) => state.search);
  const { isLogin } = useSelector((state: RootState) => state.user);
  const { userInfo } = useSelector((state: RootState) => state.user);
  const location = useLocation();
  const navigate = useNavigate();
  const [_, setSelectedCategory] = useState<number | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);
  const [isSearchVisible, setIsSearchVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [, setIsCategoryVisible] = useState(true);
  const [showArrow, setShowArrow] = useState(false);

  const userMenuRef = useRef<HTMLDivElement>(null);
  const { isMobile } = useWindowSize();
  const { toast } = useToast();

  // Thêm ref mới cho desktop search
  const desktopModalRef = useRef<HTMLDivElement>(null);
  const mobileModalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (categories.length === 0) {
      dispatch(getCategories());
    }
  }, [dispatch, categories.length]);

  useEffect(() => {
    const currentPath = location.pathname.slice(1);
    const categoryIndex = categories.findIndex(
      (cat) => cat.categoryNameNoDiacritics === currentPath
    );
    setSelectedCategory(categoryIndex !== -1 ? categoryIndex : 0);
  }, [location, categories]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY) {
        setIsSearchVisible(false);
      } else {
        setIsSearchVisible(true);
      }

      setLastScrollY(currentScrollY);
      setIsMobileMenuOpen(false);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY]);

  useEffect(() => {
    const navElement = document.querySelector('nav');
    const checkOverflow = () => {
      if (navElement) {
        setShowArrow(navElement.scrollWidth > navElement.clientWidth);
      }
    };

    checkOverflow(); // Kiểm tra ngay khi component mount

    window.addEventListener('resize', checkOverflow); // Kiểm tra khi resize
    return () => {
      window.removeEventListener('resize', checkOverflow); // Dọn dẹp listener
    };
  }, [categories]);

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearUserInfo());
    setIsUserMenuOpen(false);
    navigate("/");
    toast({
      variant: "default",
      description: "Đăng xuất thành công.",
    });
  };

  const handleCategoryClick = (categoryId: number) => {
    dispatch(trackClickThunk({ type: 1, valueId: categoryId }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);

    if (value.trim()) {
      setIsModalOpen(true);
      dispatch(fetchSearch(value));
    } else {
      setIsModalOpen(false);
    }
  };

  // Cập nhật useEffect để handle cả hai ref
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        (desktopModalRef.current && !desktopModalRef.current.contains(event.target as Node)) &&
        (mobileModalRef.current && !mobileModalRef.current.contains(event.target as Node))
      ) {
        setIsModalOpen(false);
      }
    };
    
    if (isModalOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isModalOpen]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      navigate(`/dvhn/search?key=${searchQuery}`);
      setIsModalOpen(false);
      setIsMobileMenuOpen(false);
      setSearchQuery("");
    }
  };

  const handleSearchClick = () => {
    setIsModalOpen(false);
    setIsMobileMenuOpen(false);
    setSearchQuery("");
  };

  const handleMenuClick = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    setIsSearchVisible(false);
    setIsCategoryVisible(false);

    // Nếu đang đóng menu thì hiện lại search và category
    if (isMobileMenuOpen) {
      setIsSearchVisible(true);
      setIsCategoryVisible(true);
    }
  };

  return (
    <header
      className={`bg-green-500 text-white shadow-lg px-4 md:px-[50px] transition-all duration-300 ${className} ${
        isMobile ? "fixed top-0 left-0 right-0 z-50" : ""
      } ${
        isMobile 
          ? isSearchVisible 
            ? "pb-3" 
            : "pb-3"  // Thu nhỏ padding bottom khi ẩn search
          : "pb-3"
      }`}
    >
      <div className="container mx-auto">
        <div className="flex justify-between items-center py-3 border-b border-green-400">
          <div
            className={`${
              isMobile ? "hidden" : "flex"
            } items-center space-x-4 text-sm`}
          >
            <span className="font-medium">Liên hệ:</span>
            <a
              href={`tel:${contact.phone}`}
              className="flex items-center hover:text-green-100 transition"
            >
              <Phone className="w-4 h-4 mr-2" />
              {contact.phone}
            </a>
            <div className={`flex space-x-0 ${isMobile ? "hidden" : "flex"}`}>
              <a href={contact.facebook} className="group relative p-2 transition duration-300 ease-in-out overflow-hidden">
                <img src={facebook} alt="Facebook"
                  className="w-8 h-8 relative z-10 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110"
                />
              </a>
              <a href={contact.youtube} className="group relative p-2 transition duration-300 ease-in-out overflow-hidden">
                <img src={youtube} alt="YouTube"
                  className="w-8 h-8 relative z-10 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110"
                />
              </a>
              <a href={contact.zalo_link} className="group relative p-2 transition duration-300 ease-in-out overflow-hidden">
                <img src={zalo} alt="Zalo"
                  className="w-8 h-8 relative z-10 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110"
                />
              </a>
            </div>
            <span>|</span>
            <Link to={"/socialgroups"} className="hover:text-rose-500">Link nhóm Zalo, Facebook</Link>
            <span>|</span>
            <Link to={"/gochoidap"} className="hover:text-rose-500">Góc hỏi đáp</Link>
            <span>|</span>
            <Link to={"/realestate"} className="hover:text-rose-500">Mua-Bán-Cho Thuê Căn Hộ</Link>
          </div>
          

          <button
            className={`${
              isMobile ? "block" : "hidden"
            } text-lg font-bold uppercase flex items-center gap-2`}
            onClick={() => {
              navigate("/");
              setIsMobileMenuOpen(false);
            }}
          >
            <img src={Logo} alt="Logo" className="w-8 h-8 rounded-full" />
            Dịch vụ Hưng Ngân
          </button>
          
          <div className="flex items-center space-x-3">
            {!isMobile && (
              <Link
                to={userInfo ? "/registeradvertisement" : "/login"}
                onClick={()=>localStorage.setItem("redirectUrl", "/registeradvertisement" )}
                className="flex items-center w-full p-3  rounded-lg hover:bg-white/20 transition-all duration-200"
              >
                Đăng ký quảng cáo
              </Link>
            )}

            {isLogin ? (
              <div className="relative lg:w-16" ref={userMenuRef}>
                <button
                  className="bg-white/10 hover:bg-white/30 p-1 rounded-full transition duration-200"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                >
                  <img
                    src={
                      userInfo?.avatar ??
                      "https://i.pinimg.com/736x/0d/64/98/0d64989794b1a4c9d89bff571d3d5842.jpg"
                    }
                    alt="user"
                    className="w-7 h-7 rounded-full object-cover aspect-square border border-white"
                  />
                </button>

                <div
                  className={`absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 overflow-hidden transition-all duration-200 ease-out ${
                    isUserMenuOpen
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 -translate-y-1 pointer-events-none"
                  }`}
                >
                  <button
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-150"
                    onClick={() => {
                      navigate('/quanlytaikhoan');
                      setIsUserMenuOpen(false);
                      setIsMobileMenuOpen(false)
                    }}
                  >
                    <ReceiptText className="inline-block w-4 h-4 mr-2" />
                    Quản lý tài khoản
                  </button>
                  <button
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-150"
                    onClick={() => {
                      openUserInfo();
                      setIsUserMenuOpen(false);
                    }}
                  >
                    <User className="inline-block w-4 h-4 mr-2" />
                    Xem thông tin
                  </button>
                  <button
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-150"
                    onClick={() => {
                      setIsChangePasswordModalOpen(true);
                      setIsUserMenuOpen(false);
                    }}
                  >
                    <Key className="inline-block w-4 h-4 mr-2" />
                    Đổi mật khẩu
                  </button>
                  <button
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-150"
                    onClick={handleLogout}
                  >
                    <LogOut className="inline-block w-4 h-4 mr-2" />
                    Đăng xuất
                  </button>
                </div>
              </div>
            ) : (
              <Link
                to="/login"
                onClick={() => localStorage.setItem('redirectUrl', window.location.pathname)}
                className="bg-white/10 hover:bg-white/30 p-2 rounded-full transition duration-200"
                title="Đăng ký / Đăng nhập"
              >
                <UserRound className="w-5 h-5" />
              </Link>
            )}
            {isMobile && (
              <button
                className="bg-white/10 p-2 rounded-full transition-all duration-300 ease-in-out"
                onClick={handleMenuClick}
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            )}
          </div>
        </div>
        
        <div className={`transition-all duration-300 ease-in-out ${
          isMobile 
            ? isMobileMenuOpen 
              ? 'opacity-100 max-h-[500px]'
              : 'opacity-0 max-h-0 overflow-hidden' 
            : 'opacity-100 max-h-[1000px]'
        }`}>
          {
            !isMobile && (
              <div className="py-4 md:py-6 flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8">
            <button 
              className={`${
                isMobile ? 'hidden' : 'block'
              } text-2xl font-bold whitespace-nowrap uppercase flex items-center gap-2`} 
              onClick={() => navigate('/')}
            >
              <img src={Logo} alt="Logo" className="w-24 h-24 rounded-full" />
              Dịch vụ Hưng Ngân
            </button>
            {!isMobile && (
              <div ref={desktopModalRef} className="relative flex-1 w-full">
                <input
                  id="main-search"
                  type="text"
                  value={searchQuery}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  placeholder="Tìm kiếm dịch vụ..."
                  className="w-full py-3 px-6 pr-12 rounded-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-600 transition"
                />
                <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />

                {isModalOpen && searchQuery.trim() && (
                  <div className="absolute w-full bg-white shadow-lg rounded-lg mt-2 z-10">
                    <div className="p-4">
                      <p className="text-gray-700 mb-2">Có phải bạn muốn tìm dịch vụ</p>
                      <ul>
                        {
                          search.services.map((item: any) => (
                            <li className="py-2 hover:bg-gray-100 flex items-center">
                              <img src={item.media[0]?.mediaUrl} alt={item.mainAdvertisementName} className="w-12 h-12 object-cover rounded-md mr-4" />
                              <Link to={`/${item.categoryNameNoDiacritics}/service/${item.serviceId}`} className="text-blue-600 hover:text-secondary-color" onClick={()=>handleSearchClick()}>{item.serviceName}</Link>
                            </li>
                          ))
                        }
                      </ul>
                    </div>
                    <div className="border-t p-4">
                      <h4 className="text-gray-800 mb-2">Tiệm gợi ý</h4>
                      <ul>
                        {search.advertisements.map((item: any) => (
                          <li key={item.id} className="flex items-center py-2 hover:bg-gray-100">
                            <img src={item.mediaList[0]?.url} alt={item.mainAdvertisementName} className="w-12 h-12 object-cover rounded-md mr-4" />
                            <div>
                              <Link to={`/${item.categoryNameNoDiacritics}/${item.advertisementId}`} className="text-primary-color hover:text-secondary-color" onClick={()=>handleSearchClick()}>{item.mainAdvertisementName}</Link>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
            )
          }
        </div>

        {isMobile && (
          <div 
            ref={mobileModalRef} 
            className={`relative w-full transition-all duration-300 ${
              isSearchVisible 
                ? 'opacity-100 translate-y-0 h-[48px] my-3'
                : 'opacity-0 -translate-y-full h-0 my-0 overflow-hidden'
            }`}
          >
            <input
              id="main-search"
              type="text"
              value={searchQuery}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Tìm kiếm dịch vụ..."
              className="w-full py-3 px-6 pr-12 rounded-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-600 transition"
            />
            <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />

            {isModalOpen && searchQuery.trim() && (
              <div className="absolute w-full bg-white shadow-lg rounded-lg mt-2 z-10">
                <div className="p-4">
                  <p className="text-gray-700 mb-2">Có phải bạn muốn tìm dịch vụ</p>
                  <ul>
                    {
                      search.services.map((item: any) => (
                        <li className="py-2 hover:bg-gray-100 flex items-center">
                          <img src={item.media[0]?.mediaUrl} alt={item.mainAdvertisementName} className="w-12 h-12 object-cover rounded-md mr-4" />
                          <Link to={`/${item.categoryNameNoDiacritics}/service/${item.serviceId}`} className="text-blue-600 hover:text-secondary-color" onClick={()=>handleSearchClick()}>{item.serviceName}</Link>
                        </li>
                      ))
                    }
                  </ul>
                </div>
                <div className="border-t p-4">
                  <h4 className="text-gray-800 mb-2">Tiệm gợi ý</h4>
                  <ul>
                    {search.advertisements.map((item: any) => (
                      <li key={item.id} className="flex items-center py-2 hover:bg-gray-100">
                        <img src={item.mediaList[0]?.url} alt={item.mainAdvertisementName} className="w-12 h-12 object-cover rounded-md mr-4" />
                        <div>
                          <Link to={`/${item.categoryNameNoDiacritics}/${item.advertisementId}`} className="text-primary-color hover:text-secondary-color" onClick={()=>handleSearchClick()}>{item.mainAdvertisementName}</Link>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        )}

        <div
          className={`transition-all duration-300 ease-in-out ${
            isMobile
              ? isMobileMenuOpen
                ? "opacity-100 max-h-[400px] mb-2"
                : "opacity-0 max-h-0 overflow-hidden"
              : "opacity-100 max-h-[800px]"
          }`}
        >
          {isMobile && (
            <div className="space-y-2 mt-4 transition-all duration-300 ease-in-out">
              <a
                href={`tel:${contact.phone}`}
                className="flex items-center p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-all duration-200"
              >
                <Phone className="w-4 h-4 mr-2" />
                {contact.phone}
              </a>
              {/* <a
                href={`mailto:${contact.email}`}
                className="flex items-center p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-all duration-200"
              >
                <Mail className="w-4 h-4 mr-2" />
                {contact.email}
              </a> */}
              <Link
                to={userInfo ? "/registeradvertisement" : "/login"}
                className="flex items-center w-full p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-all duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Megaphone className="w-4 h-4 mr-2" />
                Đăng ký quảng cáo
              </Link>
              <Link
                to={"/socialgroups"}
                className="flex items-center w-full p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-all duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <PilcrowLeft className="w-4 h-4 mr-2" />
                Link nhóm Zalo, Facebook
              </Link>
              <Link
                to={"/gochoidap"}
                className="flex items-center w-full p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-all duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <CircleHelp className="w-4 h-4 mr-2" />
                Góc hỏi đáp
              </Link>
              <Link
                to={"/realestate"}
                className="flex items-center w-full p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-all duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <House className="w-4 h-4 mr-2" />
                Mua-Bán-Cho Thuê Căn Hộ
              </Link>
            </div>
          )}
        </div>
      </div>

      <nav className={`flex scrollbar-hide overflow-x-auto px-1 ${isSearchVisible ? "mt-1" : "mt-2"} md:py-2 items-center`}>
{categories.map((category, index) => (
  category.isActive == true && (
    <NavLink
      key={index}
      to={category.categoryNameNoDiacritics === "all" ? "/" : category.categoryNameNoDiacritics}
      state={{ categoryId: category.categoryId }}
      className={({ isActive }) =>
        `flex items-center px-3 py-2 rounded-full transition-all whitespace-nowrap mr-2 border border-[#7ccd7c] ${
          isActive
            ? "bg-white text-green-500 shadow-md"
            : "hover:bg-white/20 md:hover:bg-white/10"
        }`
      }
      onClick={() => {
        setSelectedCategory(index);
        setIsMobileMenuOpen(false);
        handleCategoryClick(category.categoryId);
      }}
    >
      {({ isActive }) => (
        <>
          <div
            className={`w-7 h-7 flex items-center justify-center rounded-full ${
              isActive ? "bg-green-500" : "bg-white/10"
            }`}
          >
            <img
              src={category.imageLink}
              alt={category.categoryName}
              className="w-5 h-5 object-contain"
            />
          </div>
          <span className="ml-2 text-sm md:text-base">
            {category.categoryName}
          </span>
        </>
      )}
    </NavLink>
  )
))}
        {showArrow && !isMobile && (
         <>
         <button
            className="absolute left-3 p-2 bg-green-500 text-white rounded transition hover:bg-green-600"
            onClick={() => {
              const navElement = document.querySelector('nav');
              if (navElement) {
                navElement.scrollBy({
                  left: -200, // Số pixel để cuộn sang trái
                  behavior: 'smooth'
                });
              }
            }}
          >
            <ArrowRight className="w-4 h-4 transform rotate-180" /> {/* Biểu tượng mũi tên */}
          </button>
           <button
            className="absolute right-3 p-2 bg-green-500 text-white rounded transition hover:bg-green-600"
            onClick={() => {
              const navElement = document.querySelector('nav');
              if (navElement) {
                navElement.scrollBy({
                  left: 200, // Số pixel để cuộn sang bên phải
                  behavior: 'smooth'
                });
              }
            }}
          >
            <ArrowRight className="w-4 h-4" /> {/* Biểu tượng mũi tên */}
          </button>
         </>
        )}
      </nav>

      {/* Change Password Modal */}
      <ChangePasswordModal
        isOpen={isChangePasswordModalOpen}
        onClose={() => setIsChangePasswordModalOpen(false)}
      />
    </header>
  );
}