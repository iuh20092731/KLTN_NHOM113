import { AppDispatch, RootState } from '@/redux/store';
import { getAllBanners } from '@/redux/thunks/banner';
import { Image } from 'lucide-react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// interface InterestBannerProps {
//   mainImageUrl?: string;
//   secondaryImageUrl?: string;
// }

export default function InterestBanner1() {


  const dispatch: AppDispatch = useDispatch();
  const banner2 = useSelector((state: RootState) => state.banner2);
  useEffect(() => {
    dispatch(getAllBanners());
  }, []);
  const mainBanner = banner2.banners?.length ? [...banner2.banners].reverse().find(banner => banner.seq === 3) : undefined;
  const mainImageUrl = mainBanner?.imageUrl;
  const mainLinkUrl = mainBanner?.linkUrl;

  const secondaryBanner = banner2.banners?.length ? [...banner2.banners].reverse().find(banner => banner.seq === 4) : undefined;
  const secondaryImageUrl = secondaryBanner?.imageUrl;
  const secondaryLinkUrl = secondaryBanner?.linkUrl;

  return (
    <div className="max-w-lg mx-auto rounded-lg shadow-md h-auto mt-4">
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-2 text-green-600">Có thể bạn quan tâm</h2>
        
        <div className="rounded-lg mb-6 bg-gray-200 hover:scale-105 transition cursor-pointer"
          onClick={() => {window.open(mainLinkUrl || '', '_blank')}}
        >
          {mainImageUrl ? (
            <img
              src={mainImageUrl}
              alt="Hình ảnh chính"
              className="w-full h-auto"
            />
          ) : (
            <Image className="w-12 h-12 text-gray-400" />
          )}
        </div>

        <div className="rounded-lg bg-gray-200 hover:scale-105 transition cursor-pointer"
          onClick={() => {window.open(secondaryLinkUrl || '', '_blank')}}
        >
          {secondaryImageUrl ? (
            <img
              src={secondaryImageUrl}
              alt="Hình ảnh phụ"
              className="w-full h-auto"
            />
          ) : (
            <Image className="w-8 h-8 text-gray-400" />
          )}
        </div>
      </div>
    </div>
  );
}
