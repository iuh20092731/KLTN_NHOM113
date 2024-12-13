import React, { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "./styles/style.css";
import { ENDPOINTS_V2 } from "@/constants/endpoints";
import { Advertisement } from "@/types/Advertisement";
import { get } from "@/services/api.service";
import { useNavigate } from "react-router-dom";

interface Component5Props {
  serviceId: number;
}

const Component5: React.FC<Component5Props> = ({serviceId}) => {
  const [advertisement, setAdvertisement] = useState<Advertisement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAdvertisementByServiceId = async () => {
      try {
        const response = await get<{ result: Advertisement[] }>(
          ENDPOINTS_V2.ADVERTISEMENT_BY_SERVICE + "/" + serviceId
        );
        setAdvertisement(response.data.result);
      } catch (error) {
        // console.error("Lỗi khi tải dữ liệu advertiment component 5:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAdvertisementByServiceId();
  }, [serviceId]);

  const sliderRef = useRef<HTMLDivElement>(null);
  const scroll = (direction: "left" | "right") => {
    if (sliderRef.current) {
      const scrollAmount = 300;
      sliderRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const handleClicked = (advertisementId: number) => {
    navigate(`${advertisementId}`);
  };


  if (isLoading || advertisement.length === 0) {
    return <p></p>;
  }
  
  return (
    <div className="relative w-full bg-primary-color p-4 sm:p-6 rounded-lg">
      <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-white flex items-center">
        <span className="text-yellow-400 mr-2">★</span>
        QUAN TÂM NHIỀU NHẤT
      </h2>
      <div className="flex items-center">
        {/* Nút cuộn bên trái, ẩn trên mobile */}
        <button
          onClick={() => scroll("left")}
          className="hidden sm:block p-2 bg-gray-700 rounded-full text-white mr-2"
        >
          <ChevronLeft size={24} />
        </button>

        {/* Slider */}
        <div
          ref={sliderRef}
          className="flex overflow-x-auto scrollbar-hide space-x-4 py-4 flex-nowrap"
        >
          {advertisement.map((item) => (
            <div
              key={item.advertisementId}
              className="flex-shrink-0 w-48 sm:w-64 md:w-72 bg-green-700 rounded-lg overflow-hidden cursor-pointer hover:bg-secondary-color transition duration-300"
              onClick={()=>handleClicked(item.advertisementId)}
            >
              <img
                src={item.mediaList[0]?.url ?? ''}
                className="w-full h-32 sm:h-40 object-cover"
              />
              <div className="p-3 sm:p-4">
                <h3 className="text-sm font-semibold text-white">
                  {item.mainAdvertisementName}
                </h3>
              </div>
            </div>
          ))}
        </div>

        {/* Nút cuộn bên phải, ẩn trên mobile */}
        <button
          onClick={() => scroll("right")}
          className="hidden sm:block p-2 bg-gray-700 rounded-full text-white ml-2"
        >
          <ChevronRight size={24} />
        </button>
      </div>
    </div>
  );
};

export default Component5;
