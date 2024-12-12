import { useEffect, useState } from 'react';
import { Eye, Heart, MapPin, Phone, Star, Utensils } from 'lucide-react';
import 'swiper/css';
import 'swiper/css/navigation';
import './style/foodGrid.css';
import useWindowSize from '../../../hooks/useWindowsSize';
import CommonSlider from './CommonSlider';
import { AdvertisementFull } from '@/types/Advertisement';
// import { getTopRestaurant } from '@/redux/thunks/favoriteAdvertisements'; 
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import { SliderItem } from '@/types/Slider';
import { formatDistance } from '@/utils/formatDistance';
import { useNavigate } from 'react-router-dom';
import { getTopRestaurants } from '@/redux/thunks/favoriteAdvertisements';

const renderFoodStoreItem = (item: AdvertisementFull) => {
  const navigate = useNavigate();
  const handleAdvertisementClick = (categoryNameNoDiacritics: string, id: number) => {
    console.log("categoryNameNoDiacritics", id);
    navigate(`/${categoryNameNoDiacritics}/${id}`)
  }

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-lg border border-gray-100/50 
    animate-fade-in transform transition-all duration-500 
    hover:shadow-2xl hover:-translate-y-1 active:scale-98 cursor-pointer">
    <div className="h-56 bg-gradient-to-br from-emerald-50 to-green-100 relative overflow-hidden" onClick={() => handleAdvertisementClick(item.categoryNameNoDiacritics, item.advertisementId)}>
      {item.mediaList.length > 0 ? (
        <img 
          
          src={item.mediaList[0].url || ''} 
          alt={item.mainAdvertisementName} 
          className="w-full h-full object-cover animate-subtle-pulse 
            transition-transform duration-700 hover:scale-105" 
        />
      ) : (
        <div className="flex items-center justify-center h-full w-full 
          bg-gradient-to-br from-emerald-400 via-green-500 to-teal-600 animate-gradient">
          <Utensils className="text-white animate-bounce" size={48} />
        </div>
      )}
      {item.averageRating !== null && (
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md 
          text-green-600 px-3 py-1.5 rounded-full font-medium shadow-lg 
          flex items-center gap-1 animate-slide-in
          hover:bg-green-50 hover:scale-105 transition-all duration-300">
          <Star className="fill-yellow-400 stroke-yellow-400 animate-pulse" size={16} />
          {item.averageRating.toFixed(1)}
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent 
        opacity-50 transition-opacity duration-300 hover:opacity-70" />
    </div>
    <div className="p-5 relative bg-gradient-to-b from-white to-emerald-50/30">
      <h3 className="font-bold text-xl mb-3 text-gray-800 line-clamp-1
        transition-colors duration-300 hover:text-secondary-color" onClick={() => handleAdvertisementClick(item.categoryNameNoDiacritics, item.advertisementId)}>
        {item.mainAdvertisementName}
      </h3>
      <div className="space-y-3">
        {/* <p className="flex items-center text-blue-700 transition-all duration-300
          hover:text-blue-500 active:scale-98">
          <Facebook className="mr-2 animate-subtle-bounce 
            transition-transform duration-300 hover:rotate-12" size={18} /> 
          <span className="line-clamp-1">{item.facebookLink || 'Chưa có'}</span>
        </p> */}
        <p className="flex items-center text-gray-700 transition-all duration-300
          hover:text-blue-500 active:scale-98">
          <Phone className="mr-2 text-blue-700 animate-subtle-bounce 
            transition-transform duration-300 hover:rotate-12" size={18} /> 
          {/* <span className="line-clamp-1">{item.phoneNumber}</span> */}
          <a href={`tel:${item.phoneNumber}`}>{item.phoneNumber}</a>
        </p>
        <div className="flex items-center justify-between">
          <span className="flex items-center text-gray-600 text-sm group
            transition-colors duration-300 hover:text-green-500">
            <Eye className="mr-1.5 text-rose-500 animate-pulse 
              group-hover:scale-110 transition-transform" size={16} /> 
            {(item.clicks || 0).toLocaleString()} lượt xem
          </span>
          <span className="flex items-center text-gray-600 text-sm group
            transition-colors duration-300 hover:text-rose-500">
            <Heart className="mr-1.5 text-rose-500 animate-beat 
              group-hover:scale-110 transition-transform duration-300" size={16} /> 
            {(item.likes || 0).toLocaleString()} thích
          </span>
        </div>
        <p className="flex items-center text-gray-600 text-sm mt-2 group
          transition-colors duration-300 hover:text-green-600">
          <MapPin className="mr-1.5 text-green-500" 
            size={16} /> 
          {item.distance || item.distance == 0 ? `Cách ${formatDistance(item.distance)}` : item.address}
        </p>
      </div>
    </div>
  </div>
  )
};

const FoodStoreBanner = () => {
  const { isMobile } = useWindowSize();
  const dispatch = useDispatch<AppDispatch>();
const [topRestaurant, setTopRestaurant] = useState<AdvertisementFull[]>([]);

useEffect(() => {
  Promise.all([
    dispatch(getTopRestaurants({ serviceId: 5, limit: 5 })),
    dispatch(getTopRestaurants({ serviceId: 6, limit: 5 })),
    dispatch(getTopRestaurants({ serviceId: 7, limit: 5 }))
  ]).then((results) => {
    const combinedResults = results.map(result => result.payload).flat() as any;
    setTopRestaurant(combinedResults);
  });
}, [dispatch]);

  return (
    <div className="mt-8 relative foodGrid max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <div className="flex items-center gap-3 animate-fade-in">
          <div className="w-1.5 h-8 bg-gradient-to-b from-green-400 to-emerald-600 rounded-full animate-pulse"></div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent">
            Những shop nổi bật
          </h2>
        </div>
      </div>
      <CommonSlider 
        items={topRestaurant.map(item => ({
          id: item.advertisementId,
          name: item.mainAdvertisementName,
          imageUrl: item.mediaList[0]?.url || '',
          ...item
        }))}
        isMobile={isMobile} 
        renderItem={(item: SliderItem & AdvertisementFull) => renderFoodStoreItem(item)}
        loop={topRestaurant.length > 3}
        slidesPerGroup={1}
      />
    </div>
  );
};

export default FoodStoreBanner;
