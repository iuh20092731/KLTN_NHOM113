import React, { useEffect, useState } from "react";
import Rating from "../Rating";
import { MapPin, Phone } from "lucide-react";
import { Advertisement } from "@/types/Advertisement";
import { ENDPOINTS_V2 } from "@/constants/endpoints";
import { get } from "@/services/api.service";
import { useNavigate } from "react-router-dom";
import { formatDistance } from "@/utils/formatDistance";
import TextWithLineBreaks from "@/utils/formatDescription";

interface Component2Props {
  serviceId: number;
  serviceName: string;
}

const Component2: React.FC<Component2Props> = ({ serviceId, serviceName }) => {
  const navigate = useNavigate();
  const [advertisement, setAdvertisement] = useState<Advertisement[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAdvertisementByServiceId = async () => {
      try {
        const response = await get<{ result: Advertisement[] }>(
          ENDPOINTS_V2.ADVERTISEMENT_BY_SERVICE + "/" + serviceId
        );
        setAdvertisement(response.data.result);
      } catch (error) {
        // console.error("Lỗi khi tải dữ liệu advertiment component 2:", error);
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
    return <p className="text-center text-gray-500"></p>;
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <h2 className="text-2xl font-extrabold text-primary-color text-center md:text-left">
          {serviceName}
        </h2>
        <div className="block w-full max-w-sm h-1 bg-gradient-to-r from-primary-color via-secondary-color to-tertiary-color"></div>
      </div>

      {/* Main Content */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Featured Advertisement */}
        <div className="rounded-lg overflow-hidden shadow-lg transition-transform transform hover:scale-105 bg-white">
          <img
            src={advertisement[0]?.mediaList[0]?.url || ""}
            className="w-full h-64 object-cover cursor-pointer"
            onClick={() => handleClicked(advertisement[0]?.advertisementId)}
            alt="Featured Advertisement"
          />
          <div className="p-4">
            <h3
              className="text-lg font-bold text-gray-800 hover:text-primary-color cursor-pointer"
              onClick={() => handleClicked(advertisement[0]?.advertisementId)}
            >
              {advertisement[0]?.mainAdvertisementName}
            </h3>
            <p className="text-gray-600 mt-2 text-sm line-clamp-3">
              {TextWithLineBreaks(advertisement[0]?.detailedDescription ?? '')}
            </p>
            <Rating
              rating={advertisement[0]?.averageRating ?? 0}
              reviews={advertisement[0].reviewCount ?? 0}
            />
            <div className="flex items-center mt-2 text-sm text-gray-600">
              <Phone size={16} className="mr-2 text-blue-600" />
              {advertisement[0]?.phoneNumber}
            </div>
            <div className="flex items-center mt-1 text-sm text-gray-600">
              <MapPin size={16} className="mr-2 text-primary-color" />
              Cách {formatDistance(advertisement[0]?.distance ?? 0)}
            </div>
            <button
              className="mt-4 w-full bg-primary-color text-white py-2 rounded-lg hover:bg-secondary-color"
              onClick={() => handleClicked(advertisement[0]?.advertisementId)}
            >
              Xem chi tiết
            </button>
          </div>
        </div>

        {/* List of Advertisements */}
        <div className="flex flex-col gap-4">
          {advertisement.slice(1, 5).map((item, index) => (
            <div
              key={index}
              className="flex items-start bg-white rounded-lg shadow-md overflow-hidden transition-transform transform hover:scale-105"
            >
              <img
                src={item.mediaList[0]?.url || ""}
                className="w-36 h-28 object-cover cursor-pointer"
                onClick={() => handleClicked(item.advertisementId)}
                alt={`Advertisement ${index + 1}`}
              />
              <div className="p-4 flex flex-col justify-between">
                <h4
                  className="text-sm font-bold text-gray-800 hover:text-primary-color cursor-pointer"
                  onClick={() => handleClicked(item.advertisementId)}
                >
                  {item.mainAdvertisementName}
                </h4>
                <Rating
                  rating={item.averageRating ?? 0}
                  reviews={item.reviewCount ?? 0}
                />
                <div className="flex items-center mt-1 text-sm text-gray-600">
                  <Phone size={16} className="mr-2 text-blue-600" />
                  {item.phoneNumber}
                </div>
                <div className="flex items-center mt-1 text-sm text-gray-600">
                  <MapPin size={16} className="mr-2 text-primary-color" />
                  Cách {formatDistance(item.distance ?? 0)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Component2;
