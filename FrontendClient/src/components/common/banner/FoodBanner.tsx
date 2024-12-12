import React, { useEffect } from 'react';
import 'swiper/css';
import 'swiper/css/navigation';
import './style/foodGrid.css';
import useWindowSize from '../../../hooks/useWindowsSize';
import CommonSlider from './CommonSlider';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../redux/store';
import { getTopFoodsThunk } from '../../../redux/thunks/food';
import { FoodItem } from '../../../types/Food';
import { SliderItem } from '../../../types/Slider';
import { Star, Phone, MapPin, Utensils, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { formatCurrency } from '@/utils/convertCurrency';

interface FoodGridProps {
  items?: FoodItem[];
}

const mapTopFoodToSliderItem = (item: FoodItem): SliderItem => ({
  id: item.advertisementId,
  name: item.mainAdvertisementName,
  imageUrl: item.mediaList[0]?.url || '',
  description: item.description,
  phoneNumber: item.phoneNumber,
  priceRange: `${formatCurrency(item.priceRangeLow)} - ${formatCurrency(item.priceRangeHigh)} VNĐ`,
  address: item.address,
  rating: item.averageRating,
});

const renderFoodItem = (item: SliderItem, navigate: (path: string) => void) => (
  <div 
    className="relative animate-fade-in bg-gradient-to-b from-white to-green-50 
      rounded-xl shadow-lg overflow-hidden active:scale-98 transition-transform duration-300"
  >
    <div className="h-52 relative overflow-hidden cursor-pointer" onClick={() => navigate(`/food/${item.id}`)}>
      {item.imageUrl ? (
        <div className="relative h-full">
          <img 
            src={item.imageUrl} 
            alt={item.name} 
            className="h-full w-full object-cover animate-subtle-pulse" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        </div>
      ) : (
        <div className="flex items-center justify-center h-full w-full 
          bg-gradient-to-br from-green-400 via-emerald-500 to-teal-500 animate-gradient">
          <Utensils className="text-white/90 animate-bounce" size={48} />
        </div>
      )}
      
      {item.rating !== null && (
        <div className="absolute top-3 right-3 flex items-center gap-1 
          bg-white/90 backdrop-blur-sm text-green-600 px-3 py-1.5 rounded-full 
          font-medium shadow-lg animate-slide-in">
          <Star className="fill-yellow-400 stroke-yellow-400 animate-spin-slow" size={16} />
          <span className="font-bold">{item.rating.toFixed(1)}</span>
        </div>
      )}
    </div>

    <div className="p-4 space-y-3">
      <h3 className="font-bold text-xl text-gray-800 line-clamp-1 
        bg-gradient-to-r from-green-700 to-emerald-600 bg-clip-text text-transparent cursor-pointer hover:text-secondary-color" 
        onClick={() => navigate(`/food/${item.id}`)}>
        {item.name}
      </h3>

      <div className="space-y-2.5">
        <div className="flex items-center text-gray-600 animate-slide-in" style={{animationDelay: '0.1s'}}>
          <Phone className="mr-2 text-blue-700 animate-subtle-bounce 
            transition-transform duration-300 hover:rotate-12" size={16} />
            <a className="text-sm font-medium" href={`tel:${item.phoneNumber}`}>{item.phoneNumber}</a>
        </div>

        <div className="flex items-center text-gray-600 animate-slide-in" style={{animationDelay: '0.2s'}}>
          <MapPin className="mr-2 text-secondary-color animate-subtle-bounce" size={16} />
          <span className="text-sm font-medium line-clamp-1">{item.address}</span>
        </div>

        <div className="flex items-center justify-between mt-3 border-t border-green-100">
          <div className="animate-slide-in" style={{animationDelay: '0.3s'}}>
            <span className="text-xs text-gray-500">Giá từ</span>
            <div className="font-bold text-green-600 mt-0.5">
              {item.priceRange}
            </div>
          </div>
          
          <button className="flex items-center gap-1 bg-green-500 text-white px-3 py-1.5 
            rounded-full text-sm font-medium shadow-md animate-pulse" onClick={() => navigate(`/food/${item.id}`)}>
            <ArrowRight size={16} />
            Chi tiết
          </button>
        </div>
      </div>
    </div>
  </div>
);

const FoodBanner: React.FC<FoodGridProps> = () => {
  const { isMobile } = useWindowSize();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { topFoods, status, error } = useSelector((state: RootState) => state.topFood);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(getTopFoodsThunk());
    }
  }, [status, dispatch]);

  if (status === 'loading') {
    return <div className="text-center text-2xl text-green-600">Đang tải...</div>;
  }

  if (status === 'failed') {
    return <div className="text-center text-2xl text-red-600">Lỗi: {error}</div>;
  }

  const sliderItems = topFoods.map(mapTopFoodToSliderItem);

  return (
    <div className="relative foodGrid py-8 pb-0 bg-gradient-to-b from-white via-green-50/30 to-white">
      <div className="flex flex-col items-center gap-2 mb-8 animate-fade-in">
        <div className="w-16 h-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full" />
        <h2 className="text-2xl font-bold text-center">
          <span className="bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent">
            Bạn cần gợi ý shop?
          </span>
        </h2>
      </div>
      {status === 'succeeded' && (
        <CommonSlider 
          items={sliderItems} 
          isMobile={isMobile} 
          renderItem={(item) => renderFoodItem(item, navigate)} 
          loop={sliderItems.length > 3}
          slidesPerGroup={1}
        />
      )}
    </div>
  );
};

export default FoodBanner;