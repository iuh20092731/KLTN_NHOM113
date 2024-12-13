import React, { useEffect, useState } from "react";
import { Advertisement } from "@/types/Advertisement";
import { get } from "@/services/api.service";
import { ENDPOINTS_V2 } from "@/constants/endpoints";
import { useNavigate } from "react-router-dom";

interface Component6Props {
  serviceId: number;
  serviceName: string;
}

const Component6: React.FC<Component6Props> = ({ serviceId, serviceName }) => {
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
        // console.error("Lỗi khi tải dữ liệu advertiment component 6:", error);
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
    <div className="w-full">
      <div className="flex flex-col md:flex-row justify-center items-center gap-2 md:gap-5 mb-4">
        <h2 className="text-2xl font-bold mb-4 text-secondary-color uppercase whitespace-nowrap">
          {serviceName}
        </h2>
        <div className="hidden md:block flex-grow h-[3px] bg-secondary-color"></div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {advertisement.slice(0, 4).map((item) => (
          <div
            key={item.advertisementId}
            className="relative overflow-hidden rounded-lg shadow-md w-full sm:w-full cursor-pointer hover:shadow-xl transition duration-300 ease-in-out"
            onClick={()=>handleClicked(item.advertisementId)}
          >
            <img
              src={item.mediaList[0]?.url ?? ""}
              className="w-full h-60 object-cover"
            />
            <div className="absolute top-2 left-2 bg-primary-color text-white px-2 py-1 text-xs font-semibold rounded">
              {serviceName}
            </div>
            <div className="p-4 bg-white">
              <h3 className="text-sm font-semibold text-gray-800 line-clamp-2">
                {item.mainAdvertisementName}
              </h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Component6;
