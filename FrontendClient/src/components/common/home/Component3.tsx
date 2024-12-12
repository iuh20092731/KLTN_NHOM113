import React, { useEffect, useState } from "react";
import Rating from "../Rating";
import { Phone } from "lucide-react";
import { Advertisement } from "@/types/Advertisement";
import { ENDPOINTS_V2 } from "@/constants/endpoints";
import { get } from "@/services/api.service";
import { useNavigate } from "react-router-dom";
import TextWithLineBreaks from "@/utils/formatDescription";

interface Component3Props {
  serviceId: number;
  serviceName: string;
}

const Component3: React.FC<Component3Props> = ({ serviceId, serviceName }) => {
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
        // console.error("Lỗi khi tải dữ liệu:", error);
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
    return <p className="text-center text-gray-500">Đang tải dữ liệu...</p>;
  }

  return (
    <div key={serviceId} className="py-6 bg-gray-50 rounded-lg shadow-lg">
      {/* Tiêu đề */}
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-primary-color text-center">{serviceName}</h2>
        <div className="w-24 h-1 bg-gradient-to-r from-primary-color to-secondary-color mx-auto mt-2"></div>
      </div>

      {/* Nội dung */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top 2 Large Cards */}
        {advertisement.slice(0, 2).map((item, index) => (
          <div
            key={index}
            className="relative rounded-lg overflow-hidden shadow-md transition-transform transform hover:scale-105 bg-white"
          >
            <img
              src={item.mediaList[0]?.url || ""}
              alt="Advertisement"
              className="w-full h-64 object-cover cursor-pointer"
              onClick={() => handleClicked(item.advertisementId)}
            />
            <div className="absolute bottom-0 bg-gradient-to-t from-black to-transparent text-white p-4">
              <h3
                className="text-lg font-bold cursor-pointer hover:text-secondary-color"
                onClick={() => handleClicked(item.advertisementId)}
              >
                {item.mainAdvertisementName}
              </h3>
              <p className="line-clamp-2">{TextWithLineBreaks(item?.detailedDescription ?? '')}</p>
              <Rating rating={item.averageRating ?? 0} reviews={item.reviewCount ?? 0} />
            </div>
          </div>
        ))}

        {/* Small Cards */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
          {advertisement.slice(2, 6).map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-4 border rounded-lg p-4 shadow-sm bg-white hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => handleClicked(item.advertisementId)}
            >
              <img
                src={item.mediaList[0]?.url || ""}
                alt="Advertisement"
                className="w-24 h-24 rounded-lg object-cover"
              />
              <div>
                <h4 className="text-lg font-bold text-gray-800 hover:text-primary-color">
                  {item.mainAdvertisementName}
                </h4>
                <Rating rating={item.averageRating ?? 0} reviews={item.reviewCount ?? 0} />
                <div className="mt-2 text-sm text-gray-600 flex items-center">
                  <Phone size={16} className="mr-2 text-blue-600" />
                  {item.phoneNumber}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Component3;
