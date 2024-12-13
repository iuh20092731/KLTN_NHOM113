import React, { useEffect, useState } from "react";
import Rating from "../Rating";
import { MapPin, Phone } from "lucide-react";
import { Advertisement } from "@/types/Advertisement";
import { ENDPOINTS_V2 } from "@/constants/endpoints";
import { get } from "@/services/api.service";
import { useNavigate } from "react-router-dom";
import { formatDistance } from "@/utils/formatDistance";
import TextWithLineBreaks from "@/utils/formatDescription";

interface Component1Props {
  serviceId: number;
  serviceName: string;
}

const Component1: React.FC<Component1Props> = ({ serviceId, serviceName }) => {
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
        // console.error("Lỗi khi tải dữ liệu advertiment component 1:", error);
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
    return <p></p>;
  }

  return (
    <div className="container mx-auto py-6">
      {/* Service name */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-primary-color">{serviceName}</h2>
        <div className="w-full md:w-[60%] h-[2px] bg-gradient-to-r from-primary-color to-secondary-color mt-2 md:mt-0"></div>
      </div>

      {/* First advertisement card */}
      <div className="flex flex-col md:flex-row gap-6 mb-8 border rounded-lg shadow-lg overflow-hidden bg-white">
        <img
          src={advertisement[0]?.mediaList[0]?.url || ""}
          className="w-full md:w-1/2 h-[300px] object-cover cursor-pointer hover:opacity-80 transition-all"
          onClick={() => handleClicked(advertisement[0]?.advertisementId)}
        />
        <div className="w-full md:w-1/2 p-6">
          <p
            className="text-xl font-semibold text-secondary-color cursor-pointer hover:text-primary-color mb-4"
            onClick={() => handleClicked(advertisement[0]?.advertisementId)}
          >
            {advertisement[0]?.mainAdvertisementName}
          </p>
          <p className="text-gray-700 text-sm mb-4 line-clamp-3">
            {TextWithLineBreaks(advertisement[0]?.detailedDescription ?? '')}
          </p>
          <div className="flex flex-col">
            <Rating rating={advertisement[0].averageRating ?? 0} reviews={advertisement[0].reviewCount ?? 0} />
            <div className="mt-4">
              <p className="flex items-center text-gray-600 mb-2">
                <Phone size={16} className="mr-2 text-blue-600" />
                {advertisement[0].phoneNumber}
              </p>
              <p className="flex items-center text-gray-600">
                <MapPin size={16} className="mr-2" />
                Cách {formatDistance(advertisement[0].distance ?? 0)}
              </p>
            </div>
            <button
              className="mt-6 bg-primary-color text-white py-2 px-6 rounded-lg hover:bg-secondary-color focus:outline-none focus:ring-2 focus:ring-primary-color transition-all"
              onClick={() => handleClicked(advertisement[0].advertisementId)}
            >
              CHI TIẾT
            </button>
          </div>
        </div>
      </div>

      {/* Other advertisement cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {advertisement.slice(1, 4).map((item, index) => (
          <div className="border rounded-lg overflow-hidden shadow-md bg-white hover:scale-105 transition-transform" key={index}>
            <img
              src={item.mediaList[0]?.url || ""}
              className="w-full h-48 object-cover cursor-pointer hover:opacity-80 transition-all"
              onClick={() => handleClicked(item.advertisementId)}
            />
            <div className="p-4">
              <span className="inline-block bg-primary-color text-white text-xs font-semibold px-2 py-1 rounded">
                {serviceName}
              </span>
              <h4
                className="mt-2 font-semibold text-lg text-gray-800 cursor-pointer hover:text-primary-color"
                onClick={() => handleClicked(item.advertisementId)}
              >
                {item.mainAdvertisementName}
              </h4>
              <Rating rating={item.averageRating ?? 0} reviews={item.reviewCount ?? 0} />
              <p className="mt-2 text-gray-600 flex items-center">
                <Phone size={16} className="mr-2 text-blue-600" />
                {item.phoneNumber}
              </p>
              <p className="mt-2 text-gray-600 flex items-center">
                <MapPin size={16} className="mr-2" />
                Cách {formatDistance(item.distance ?? 0)}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Load more button */}
      <div className="flex items-center justify-center my-8">
        <hr className="flex-grow border-t border-gray-300" />
        <button
          className="mx-4 px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-primary-color focus:outline-none focus:ring-2 focus:ring-primary-color transition"
          onClick={() => navigate(`service/${serviceId}`)}
        >
          XEM THÊM
        </button>
        <hr className="flex-grow border-t border-gray-300" />
      </div>
    </div>
  );
};

export default Component1;