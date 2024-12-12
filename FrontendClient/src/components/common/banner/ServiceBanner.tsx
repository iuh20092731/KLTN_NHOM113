import React, { useEffect } from 'react';
import 'swiper/css';
import 'swiper/css/navigation';
import './style/foodGrid.css';
import useWindowSize from '../../../hooks/useWindowsSize';
import CommonSlider from './CommonSlider';
import { Service } from '@/types/Service';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { getServiceByNameCategory } from '@/redux/thunks/service';
import { SliderItem } from '@/types/Slider';
import { trackClickThunk } from '@/redux/thunks/trackingClick';

interface ServiceGridProps {
  items?: Service[];
}

const renderFoodItem = (item: SliderItem, page: string, navigate: ReturnType<typeof useNavigate>,  dispatch: ReturnType<typeof useDispatch>) => (
  <div
    className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md hover:text-white cursor-pointer"
    onClick={() => {
      dispatch(trackClickThunk({ type: 2, valueId: item.id }) as any);
      navigate(`/${page}/service/${item.id}`, { state: { serviceName: item.name } });
    }}
  >
    <div className="h-48 bg-gray-200 flex items-center justify-center">
      <img
        src={item.imageUrl || ''}
        alt={item.name}
        className="object-cover h-full w-full"
      />
    </div>
    <div className="p-4 flex justify-center bg-primary-color hover:bg-secondary-color">
      <h3 className="font-medium text-xl text-white">{item.name}</h3>
    </div>
  </div>
);


const ServiceBanner: React.FC<ServiceGridProps> = () => {
  const { page } = useParams<{ page: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const service = useSelector((state: RootState) => state.service);
  
  useEffect(() => {
    dispatch(getServiceByNameCategory(page || ""));
  }, [dispatch, page]);
  
  const { isMobile } = useWindowSize();

  const sliderItems: SliderItem[] = (service.serviceCategory?.services || []).map(item => ({
    id: item.serviceId,
    name: item.serviceName || '',
    imageUrl: item.media && item.media[0]?.mediaUrl || '',
    serviceId: item.serviceId,
    media: item.media || []
  }));

  return (
    <div className="relative foodGrid">
      <h2 className="text-2xl font-semibold mb-4 text-secondary-color">
        Bạn cần gợi ý dịch vụ?
      </h2>
      <CommonSlider 
        items={sliderItems} 
        isMobile={isMobile} 
        renderItem={(item) => renderFoodItem(item, page || '', navigate, dispatch)}
        loop={sliderItems.length > 3}
        slidesPerGroup={1}
      />
    </div>
  );
};


export default ServiceBanner;
