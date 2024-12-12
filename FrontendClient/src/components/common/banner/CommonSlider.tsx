import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Keyboard, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import './style/foodGrid.css';
import { SliderItem } from '../../../types/Slider';


interface CommonSliderProps<T extends SliderItem> {
  items: T[];
  isMobile: boolean;
  renderItem: (item: T) => React.ReactNode;
  loop?: boolean;
  slidesPerView?: number;
  slidesPerGroup?: number;
}

const CommonSlider = <T extends SliderItem>({
  items,
  isMobile,
  renderItem,
  loop = true,
  slidesPerView = isMobile ? 1 : 3,
  slidesPerGroup = 1
}: CommonSliderProps<T>) => {
  return (
    <Swiper
      slidesPerView={slidesPerView}
      slidesPerGroup={slidesPerGroup}
      spaceBetween={isMobile ? 10 : 20}
      speed={800}
      navigation={true}
      autoplay={{
        delay: 3000,
        disableOnInteraction: false,
      }}
      mousewheel={false}
      keyboard={true}
      modules={[Navigation, Pagination, Keyboard, Autoplay]}
      className={`rounded-lg pb-4`}
      loop={loop}
      effect="slide"
    >
      {items.map((item) => (
        <SwiperSlide key={`${item.id}-${Math.random()}`} className="rounded-lg">
          {renderItem(item)}
        </SwiperSlide>
      ))}
    </Swiper>
  );
}

export default CommonSlider;
