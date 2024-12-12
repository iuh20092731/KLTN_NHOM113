import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Keyboard, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import './style/banner.css';
import { useNavigate } from 'react-router-dom';
interface Banner {
  bannerId: number;
  title: string | null;
  description: string | null;
  imageUrl: string;
  linkUrl: string;
  type: 'TOP' | 'RIGHT' | 'BOTTOM' | 'LEFT';
  isActive: boolean;
  startDate: Date;
  endDate: Date;
  seq: number;
  serial: number;
}

interface BannerProps {
  banners: Banner[];
}

const BannerComponent: React.FC<BannerProps> = ({ banners }) => {
  const navigate = useNavigate();
  // Lọc và sắp xếp banners
  const activeBanners = banners
    .filter(banner => banner.isActive)
    .sort((a, b) => a.serial - b.serial);

  const handleSlideClick = (linkurl: string) => {
    navigate(linkurl);
  };

  return (
    <div className="h-[200px] md:h-[500px]">
      <Swiper
        slidesPerView={1}
        spaceBetween={30}
        speed={800}
        navigation={true}
        pagination={{
          clickable: true,
        }}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        mousewheel={false}
        keyboard={true}
        modules={[Navigation, Pagination, Keyboard, Autoplay]}
        className="w-full h-[200px] md:h-[500px] rounded-lg"
      >
        {activeBanners.map((banner) => (
          <SwiperSlide key={banner.bannerId}>
            <div 
              className="w-full h-[200px] md:h-[500px] relative rounded-lg overflow-hidden cursor-pointer"
              onClick={() =>handleSlideClick(banner.linkUrl)}
            >
              <img
                src={banner.imageUrl}
                alt={banner.title || 'Dịch vụ Hưng Ngân'}
                className="w-full h-full object-cover flex"
                loading="lazy"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default BannerComponent;