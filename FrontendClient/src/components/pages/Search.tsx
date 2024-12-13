import React, { useEffect, useState }  from 'react';
import { InterestBanner } from '../common';
import {AppDispatch, RootState } from '@/redux/store';
import {useDispatch, useSelector } from 'react-redux';
import { MapPin, Phone } from 'lucide-react';
import Rating from '../common/Rating';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { fetchSearch } from '@/redux/thunks/search';

const SearchPage: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const key = searchParams.get('key');
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchSearch(key || ''));
  }
  , [dispatch, key]);

  const [visibleCount, setVisibleCount] = useState(6);
  const search = useSelector((state: RootState) => state.search) as {
    advertisements: any;
    services: { serviceId: string; serviceName: string; media: { mediaUrl: string }[] }[];
  };
  console.log(search);
  const handleLoadMore = () => {
    setVisibleCount(prevCount => prevCount + 6);
  };
  const [activeSort, setActiveSort] = useState<string>('Nổi bật');

  const options = [
    { label: 'Nổi bật', value: 'noibat' },
    { label: 'View', value: 'view' },
    { label: 'Đánh giá', value: 'danhgia' },
    { label: 'Mới', value: 'moi' },
  ];

  const handleSortChange = (value: string) => {
    setActiveSort(value);
  };
  return (
    <div className="grid grid-cols-1 md:grid-cols-6 gap-10 py-5">
      <div className="col-span-1 md:col-span-4">
        <div className="flex items-center space-x-4">
          <span className="text-gray-600">Sắp xếp theo:</span>
          {options.map(option => (
            <button
              key={option.value}
              className={`text-sm ${activeSort === option.label ? 'text-secondary-color' : 'text-gray-500'} hover:text-secondary-color`}
              onClick={() => handleSortChange(option.label)}
            >
              {option.label}
            </button>
          ))}
        </div>

        <div className="container mx-auto py-8">
          <h3 className="text-2xl font-semibold mb-6 text-black text-primary-color">Kết quả tìm kiếm</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {search.advertisements.slice(0, visibleCount).map((item: {
              clicks: number;
              reviewCount: number;
              averageRating: number; 
              advertisementId: React.Key | null | undefined; 
              mediaList: string | any[]; mainAdvertisementName: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; 
              detailedDescription: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; 
              phoneNumber: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; 
              address: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; 
              views: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; 
              likes: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; 
              category_name_no_diacritics: string | null;
}) => (
                <div 
                  className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer" 
                  key={item.advertisementId} 
                  onClick={()=> navigate(`/${item.category_name_no_diacritics}/${item.advertisementId}`)}
                >
                {item.mediaList.length > 0 && (
                  <img
                    src={item.mediaList[0].url || ''}
                    alt={item.mediaList[0].name || ''}
                    className="w-full h-40 object-cover"
                  />
                )}
                <div className="p-4">
                  <h3 className="text-lg font-bold text-gray-800 mb-2 cursor-pointer hover:text-secondary-color" >
                    {item.mainAdvertisementName}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2 line-clamp-3 text-justify">{item.detailedDescription}</p>
                  <p className="mt-2 text-gray-600 flex items-center">
                          <Phone size={16} className="flex-shrink-0 mr-2" />
                          {item.phoneNumber}
                        </p>
                  <p className="flex text-sm text-gray-600">
                    {" "}
                    <MapPin size={16} className="flex-shrink-0 mr-2" /> {item.address}
                  </p>
                  <Rating rating={item.averageRating ?? 0} reviews={item.reviewCount ?? 0} />
                  <div className="flex justify-between text-sm text-gray-500 mt-2">
                    <span>Views: {item.clicks}</span>
                    <span>Likes: {item.likes}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {visibleCount < search.advertisements.length && (
            <div className="flex justify-center mt-6">
              <button
                onClick={handleLoadMore}
                className="bg-secondary-color hover:bg-primary-color text-white font-bold py-2 px-4 rounded"
              >
                Xem thêm
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="hidden md:block row-span-4 col-start-1 md:col-start-5 col-span-2 md:row-start-1">
        <InterestBanner />
      </div>
    </div>
  );
};

export default SearchPage;