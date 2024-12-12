import React, { useEffect, useState } from "react";
import { Home, MapPin, MessageCircle, Phone } from "lucide-react";
import Rating from "./Rating";
import { Link, useLocation, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import { getAdvertimentByService } from "@/redux/thunks/advertisement";
import { Advertisement } from "@/types/Advertisement";
import { useNavigate } from "react-router-dom";
import { resetAdvertisementsByService } from "@/redux/slices/advertisement";
import { getServiceById } from "@/redux/thunks/service";
import TextWithLineBreaks from "@/utils/formatDescription";

const AdvertisementCard: React.FC<{ ad: Advertisement }> = ({ ad }) => {
  const {page} = useParams();
  const navigate = useNavigate();
  const handleClick = (advertisementId:number) => {
    navigate(`/${page}/${advertisementId}`);
  }
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {ad.mediaList.length > 0 && (
        <img
          src={ad.mediaList[0].url || ''}
          alt={ad.mediaList[0].name || ''}
          className="w-full h-40 object-cover cursor-pointer"
          onClick={() => handleClick(ad.advertisementId)}
        />
      )}
      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-800 mb-2 cursor-pointer hover:text-secondary-color" onClick={() => handleClick(ad.advertisementId)} >
          {ad.mainAdvertisementName}
        </h3>
        <p className="text-sm text-gray-600 mb-2 line-clamp-3 text-justify">{TextWithLineBreaks(ad.detailedDescription??"")}</p>
        <a className="mt-2 text-blue-600 flex items-center" href={`tel:${ad.phoneNumber}`}>
                <Phone size={16} className="flex-shrink-0 mr-2 text-blue-600" />
                {ad.phoneNumber}
        </a> 
        <a
                        href={ad.zaloLink ?? ""}
                        target="_blank"
                        className="flex items-center"
                      >
                        <MessageCircle className="mr-2 h-4 w-4 text-blue-600 hover:none" />
                        <span className="text-blue-600">Zalo</span>
                      </a>
        
        <p className="flex text-sm text-gray-600 items-center">
          {" "}
          <MapPin size={16} className="flex-shrink-0 mr-2 text-green-600" /> {ad.address}
        </p>
        {/* <Rating rating={ad.averageRating ?? 0} reviews={ad.reviewCount ?? 0} /> */}
        <div className="flex justify-between text-sm text-gray-500 mt-2">
          <span>Views: {ad.clicks}</span>
          <Rating rating={ad.averageRating ?? 0} reviews={ad.reviewCount ?? 0} />
          <span>Likes: {ad.likes}</span>
        </div>
      </div>
    </div>
  );
};

const AdvertisementList: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { serviceId } = useParams<{ serviceId: string }>();
  const advertisement = useSelector((state: RootState) => state.advertisement.advertisementsByService);
  const service = useSelector((state: RootState) => state.service.serviceById);

  useEffect(() => {
    if (serviceId) {
      dispatch(getServiceById(Number(serviceId)));
      dispatch(resetAdvertisementsByService());
      dispatch(getAdvertimentByService(Number(serviceId)));
    }
  }, [dispatch, serviceId]);

  const location = useLocation();
  const { serviceName } = location.state || {};
  const [visibleCount, setVisibleCount] = useState(6);
  const handleLoadMore = () => {
    setVisibleCount(prevCount => prevCount + 6);
  };
  return (
    <>
      <nav className="flex items-center text-sm text-gray-500 mb-4">
          <Link to="/" className="flex items-center hover:text-gray-700">
            <Home className="w-4 h-4 mr-1" />
            Trang chủ
          </Link>
          <span className="mx-2">/</span>
          <Link to={`/${service?.categoryNameNoDiacritics}`} className="flex items-center hover:text-gray-700">
            {service?.categoryName}
          </Link>
          <span className="mx-2">/</span>
          <span className="hover:text-gray-700 cursor-pointer">
            {serviceName}
          </span>
        </nav>
      <div className="container mx-auto py-8">
        <h2 className="text-3xl font-semibold mb-6 text-black text-secondary-color">{serviceName}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {advertisement.slice(0, visibleCount).map((ad) => (
              <AdvertisementCard key={ad.advertisementId} ad={ad} />
          ))}
        </div>
        {visibleCount < advertisement.length && (
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
    </>
  );
};

export default AdvertisementList;
