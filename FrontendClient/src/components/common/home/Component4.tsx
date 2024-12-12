import React, { useEffect, useState } from "react";
import { Advertisement } from "@/types/Advertisement";
import { ENDPOINTS_V2 } from "@/constants/endpoints";
import { get } from "@/services/api.service";
import { useNavigate } from "react-router-dom";

interface Component4Props {
  serviceId: number;
  serviceName: string;
}

const ServiceComponent: React.FC<Component4Props> = ({ serviceId, serviceName }) => {
  const navigate = useNavigate();
  const [advertisement, setAdvertisement] = useState<Advertisement[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAdvertisementByServiceId = async () => {
      try {
        const response = await get<{ result: Advertisement[] }>(
          `${ENDPOINTS_V2.ADVERTISEMENT_BY_SERVICE}/${serviceId}`
        );
        setAdvertisement(response.data.result);
      } catch (error) {
        // console.error("Error fetching advertisements:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAdvertisementByServiceId();
  }, [serviceId]);

  const handleClicked = (advertisementId: number) => {
    navigate(`${advertisementId}`);
  };

  if (isLoading || advertisement.length === 0) {
    return (
      <div className="text-center text-gray-500 py-10">
        Đang tải dữ liệu...
      </div>
    );
  }

  return (
    <div className="pt-8">
      {/* Header Section */}
      <div className="relative inline-block mb-8">
        <div className="bg-secondary-color text-white text-2xl md:text-3xl font-bold px-6 py-3 shadow-md relative z-10">
          {serviceName}
        </div>
        <div className="absolute top-1/2 left-0 transform -translate-y-1/2 w-full h-[50px] bg-secondary-color opacity-20"></div>
      </div>

      {/* Grid Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 group">
        {advertisement.slice(0, 4).map((item, index) => (
          <div
            key={index}
            className="rounded-lg shadow-md overflow-hidden transform transition-transform hover:scale-105 border border-gray-200 relative group-hover:opacity-50 hover:!opacity-100"
          >
            {/* Image */}
            <img
              src={item.mediaList[0]?.url || ""}
              alt={item.mainAdvertisementName || ""}
              className="w-full h-48 object-cover cursor-pointer"
              onClick={() => handleClicked(item.advertisementId)}
            />

            {/* Content */}
            <div className="p-4">
              <div className="bg-primary-color text-white text-sm font-semibold px-3 py-1 rounded inline-block mb-3">
                {serviceName}
              </div>
              <h4
                className="text-lg font-semibold text-gray-800 cursor-pointer hover:text-primary-color mb-2"
                onClick={() => handleClicked(item.advertisementId)}
              >
                {item.mainAdvertisementName}
              </h4>
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                {item.detailedDescription}
              </p>
              <button
                className="bg-primary-color text-white text-sm font-medium py-2 px-4 rounded hover:bg-secondary-color"
                onClick={() => handleClicked(item.advertisementId)}
              >
                Chi tiết
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>

  );
};

export default ServiceComponent;
