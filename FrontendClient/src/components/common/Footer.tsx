import { Mail, Phone, X } from "lucide-react";
import './styles/global.css'
import { facebook, youtube, zalo } from "../../assets/icons";
import { contact } from "../../constants";
import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import { getTotalVisit, incrementVisit } from "@/redux/thunks/visit";
import { useWindowSize } from "@/hooks";
import Donate from '../../assets/img/donate.png'
import ChatAIModal from "../pages/ChatAIModel";
import { motion } from "framer-motion";

export default function Footer({ className }: { className?: string }) {
  const dispatch: AppDispatch = useDispatch();
  const totalVisit = useSelector((state: RootState) => state.visit.totalVisit);
  const { isMobile } = useWindowSize();

  const [isChatModalOpen, setChatModalOpen] = useState(false); // Thêm state để quản lý modal
  
  const toggleChatModal = () => {
    setChatModalOpen(!isChatModalOpen); // Hàm để mở/đóng modal
  };


  useEffect(() => {
    dispatch(incrementVisit());
    dispatch(getTotalVisit());
  }, []);

  const [isContactVisible, setIsContactVisible] = useState(false);

  const toggleContactInfo = () => {
    if (isMobile) {
      setIsContactVisible(!isContactVisible);
    }
  };

  useEffect(() => {
    if (!isMobile) {
      setIsContactVisible(false);
    }
  }, [isMobile]);
  useEffect(() => {
    const handleScroll = () => {
      setIsContactVisible(false);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const chatRef = useRef<HTMLDivElement>(null);

  return (
    <footer className={`bg-gray-100 text-gray-600 py-8 ${className}`}>
      <div className="container mx-auto px-4 md:px-[50px]">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h2 className="text-red-500 font-bold text-lg mb-4">
              DỊCH VỤ HƯNG NGÂN
            </h2>
            <p className="text-sm">
              Khám phá ngay những dịch vụ tiện ích hàng đầu xung quanh Chung cư
              Hưng Ngân – Tận hưởng cuộc sống trọn vẹn với sự thuận tiện chỉ
              trong tầm tay!
            </p>
          </div>
          <div>
          <h2 className="text-red-500 font-bold text-lg mb-4">
              DONATE ỦNG HỘ
            </h2>
            <div className="flex justify-between space-x-4">
              <img src={Donate} className="mb-2 w-24 h-24 object-cover"/>
              <p className="ml-2 text-sm">Bà con ủng hộ Cà phê cho Team phát triển duy trì website. Xin cám ơn!</p>
            </div>
          </div>
          <div className=" flex-col items-center md:flex hidden">
            <h2 className="text-red-500 font-bold text-lg mb-4">
              KẾT NỐI VỚI CHÚNG TÔI
            </h2>
            <div className="flex space-x-4 mb-4">
              <a
                href={contact.facebook}
                className="border border-blue-600 rounded-lg p-2 hover:bg-blue-100 transition duration-200 transform hover:scale-110"
              >
                <img src={facebook} alt="Facebook" className="w-10 h-10" />
              </a>
              <a
                href={contact.youtube}
                className="border border-red-600 rounded-lg p-2 hover:bg-red-100 transition duration-200 transform hover:scale-110"
              >
                <img src={youtube} alt="YouTube" className="w-10 h-10" />
              </a>
              <a
                href={contact.zalo_link}
                className="border border-blue-500 rounded-lg p-2 hover:bg-blue-50 transition duration-200 transform hover:scale-110"
              >
                <img src={zalo} alt="Zalo" className="w-10 h-10" />
              </a>
            </div>

          </div>
          <div className="md:block hidden">
            <h2 className="text-red-500 font-bold text-lg mb-4 ">LIÊN HỆ</h2>
            <p className="text-sm mb-2">{contact.address}</p>
            <p className="text-sm mb-2">Zalo: {contact.zalo}</p>
            <p className="text-sm flex items-center">
              <Mail size={16} className="mr-2" />
              {contact.email}
            </p>
          </div>
        </div>
        <div className="mt-8 pt-4 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center text-gray-500 text-sm">
            <p>© 2024 Hưng Ngân. All Rights Reserved.</p>
            <p>Lượt truy cập website: {totalVisit?.toLocaleString()}</p>
          </div>
        </div>
      </div>

      <button
        className="fixed bottom-4 md:bottom-10 right-4 bg-red-500 text-white p-3 rounded-full shadow-lg hover:bg-red-600 duration-200 z-50 block md:hidden animate-[ring_1s_ease-out_infinite] hover:animate-none transform hover:scale-110 transition-transform z-[101]"
        onClick={toggleContactInfo}
      >
        {isContactVisible ? (
          <X
            size={24}
            className="transition-transform duration-300 hover:rotate-90"
          />
        ) : (
          <Phone
            size={24}
            className="animate-[shake_0.5s_ease-in-out_infinite]"
          />
        )}
      </button>

      <button
        className="fixed bottom-[80px] right-4 bg-green-600 text-white p-[10px] rounded-full shadow-lg duration-200 z-50 block animate-[ring_1s_ease-out_infinite] hover:animate-none transform hover:scale-110 transition-transform"
        onClick={toggleChatModal}
      >
        <img 
          src="https://res.cloudinary.com/tranquanghuyit09/image/upload/v1733843360/ApartmentServices/icon-category/itecsygn1iow8pbijtow.png"
          alt="Chat icon"
          className="w-7 h-7 animate-[shake_0.5s_ease-in-out_infinite]"
        />
      </button>
      

      {isContactVisible && isMobile && (
        <div className="fixed bottom-3 right-3 z-[100]">
          <div className="relative flex items-center justify-center">
            {/* Phone Icon */}
            <motion.div
              initial={{ scale: 1 }}
              animate={{ scale: isContactVisible ? 0.8 : 1}}
              transition={{ duration: 0.3 }}
              className="p-4 bg-gradient-to-r from-indigo-500 to-indigo-700 rounded-full shadow-lg"
            >
              <X size={24} className="transition-transform duration-300 hover:rotate-90"/>
            </motion.div>

            {/* Facebook */}
            <motion.div
              initial={{ opacity: 0, x: 0, y: 0 }}
              animate={isContactVisible ? { opacity: 1, x: 0, y: -64 } : { opacity: 0 }}
              transition={{ duration: 0.2, delay: 0.1 }}
              className="absolute p-2 bg-white border border-blue-500 rounded-full shadow-md"
            >
              <a
                href={contact.facebook}
                // target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src={facebook}
                  alt="Facebook"
                  className="w-10 h-10"
                />
              </a>
            </motion.div>

            {/* YouTube */}
            <motion.div
              initial={{ opacity: 0, x: 0, y: 0 }}
              animate={isContactVisible ? { opacity: 1, x: -68, y: -65 } : { opacity: 0 }}
              transition={{ duration: 0.2, delay: 0.2 }}
              className="absolute p-2 bg-white border border-red-500 rounded-full shadow-md"
            >
              <a
                href={contact.youtube}
                // target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src={youtube}
                  alt="YouTube"
                  className="w-10 h-10"
                />
              </a>
            </motion.div>

            {/* Zalo */}
            <motion.div
              initial={{ opacity: 0, x: 0, y: 0 }}
              animate={isContactVisible ? { opacity: 1, x:-68, y: 0 } : { opacity: 0 }}
              transition={{ duration: 0.2, delay: 0.3 }}
              className="absolute p-2 bg-white border border-blue-400 rounded-full shadow-md"
            >
              <a
                href={contact.zalo_link}
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src={zalo}
                  alt="Zalo"
                  className="w-10 h-10"
                />
              </a>
            </motion.div>
          </div>
        </div>
      )}
      <ChatAIModal
        isOpen={isChatModalOpen}
        onClose={toggleChatModal}
        chatRef={chatRef}
      />
    </footer>
  );
}
