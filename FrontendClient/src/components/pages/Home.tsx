import React, { useEffect, useState } from 'react';
import { BannerComponent, FoodBanner, EducationBanner, FoodStoreBanner, InterestBanner } from '../common';
import { get } from '../../services/api.service';
import { ENDPOINTS } from '../../constants/endpoints';
import useWindowSize from '../../hooks/useWindowsSize';
import { getAllBanners } from '@/redux/thunks/banner';
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import InterestBanner1 from '../common/banner/InterestBanner1';
import About from '../common/About';
import GocHoiDap from './GocHoiDap';
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

const HomePage: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();

  const [banners, setBanners] = useState<Banner[]>([]);
  const [, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isMobile } = useWindowSize();
  useEffect(() => {
    dispatch(getAllBanners());
  }, []);

  useEffect(() => {
    const loadBanners = async () => {
      if (banners.length > 0) return;
      try {
        setIsLoading(true);
        const response = await get<Banner[]>(ENDPOINTS.BANNER);
        setBanners(response.data);
      } catch (err) {
        setError('Không thể tải banner');
        console.error('Lỗi khi tải banner:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadBanners();
  }, []);

  if (error) {
    return <div className="text-red-500 text-center h-[200px] flex items-center justify-center">{error}</div>;
  }

  return (
    <div className="w-full">
      {banners.length > 0 ? (
        <BannerComponent banners={banners} />
      ) : (
        <div className="h-[200px] flex items-center justify-center">
          Không có banner nào
        </div>
      )}

      <div className={`grid gap-6 py-4 ${isMobile ? 'grid-cols-1' : 'grid-cols-6'}`}>
        <div className={`h-fit ${isMobile ? 'col-span-1' : 'col-span-4'}`}>
          <FoodBanner />
        </div>
        <div className={`-mt-4 ${isMobile ? 'col-span-1' : 'col-span-4'}`}>
          <EducationBanner />
        </div>
        <div className={`-mt-6 ${isMobile ? 'col-span-1' : 'col-span-4'}`}>
          <FoodStoreBanner />
        </div>
        {!isMobile && (
          <div className="col-span-2 col-start-5 row-span-3 row-start-1">
            <InterestBanner />
            <InterestBanner1 />
          </div>
        )}
      </div>

      <About />
      <p className='py-3'></p>
      <GocHoiDap />
    </div>
  );
};

export default HomePage;
