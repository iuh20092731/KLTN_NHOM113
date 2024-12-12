import { AppDispatch, RootState } from '@/redux/store';
import { getAllBanners } from '@/redux/thunks/banner';
import { Image } from 'lucide-react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export default function InterestBanner() {

  const dispatch: AppDispatch = useDispatch();
  const banner2 = useSelector((state: RootState) => state.banner2);
  useEffect(() => {
    dispatch(getAllBanners());
  }, []);
  const mainBanner = banner2.banners?.length ? [...banner2.banners].reverse().find(banner => banner.seq === 1) : undefined;
  const mainImageUrl = mainBanner?.imageUrl;
  const mainLinkUrl = mainBanner?.linkUrl;

  const secondaryBanner = banner2.banners?.length ? [...banner2.banners].reverse().find(banner => banner.seq === 2) : undefined;
  const secondaryImageUrl = secondaryBanner?.imageUrl;
  const secondaryLinkUrl = secondaryBanner?.linkUrl;
  return (
    <div className="w-full max-w-lg mx-auto h-auto rounded-lg overflow-hidden shadow-md">
      <div className="p-8 h-full flex flex-col justify-between">
        <h2 className="text-2xl font-semibold mb-4 text-green-600">Có thể bạn quan tâm</h2>
        
        <div className="rounded-lg mb-6 overflow-hidden bg-gray-200 flex items-center justify-center hover:scale-110 transition-transform duration-300 cursor-pointer"
          onClick={() => {window.open(mainLinkUrl || '', '_blank')}}
        >
          {mainImageUrl ? (
            <img
              src={mainImageUrl}
              alt="Dịch vụ Hưng Ngân"
              className="max-w-full w-auto h-auto object-contain"
            />
          ) : (
            <Image className="w-16 h-16 text-gray-400" />
          )}
        </div>

        <div className="rounded-lg overflow-hidden bg-gray-200 flex items-center justify-center hover:scale-110 transition-transform duration-300 cursor-pointer"
          onClick={() => {window.open(secondaryLinkUrl || '', '_blank')}}
        >
          {secondaryImageUrl ? (
            <img
              src={secondaryImageUrl}
              alt="Dịch vụ Hưng Ngân"
              className="max-w-full w-auto h-auto object-contain"
            />
          ) : (
            <Image className="w-8 h-8 text-gray-400" />
          )}
        </div>
      </div>
    </div>
  );
}
