import { AppDispatch } from "@/redux/store";
import { getFavoriteAdvertisement } from "@/redux/thunks/favoriteAdvertisements";
import { Star, MapPin, Phone, Link2, Loader2 } from "lucide-react"
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react"
import { AdvertisementFull } from "@/types/Advertisement";
import { useNavigate } from "react-router-dom";

export default function EducationBanner() {
  const navigate = useNavigate();
  const [loadedImages, setLoadedImages] = useState<{ [key: number]: boolean }>({})
  const [favoriteAdvertisements, setFavoriteAdvertisements] = useState<AdvertisementFull[]>([]);
  const [visibleItems, setVisibleItems] = useState(3);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        setIsLoading(true);
        const result = await dispatch(getFavoriteAdvertisement({ page: 0, size: 3 })).unwrap();
        type PageResponse = {
          content: AdvertisementFull[];
        }
        const response = result as unknown as PageResponse;
        setFavoriteAdvertisements(response.content);
        setHasMore(response.content.length > 3);
      } catch (error) {
        console.error('Error fetching favorites:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchFavorites();
  }, [dispatch]);

  const loadMore = () => {
    setVisibleItems(prev => Math.min(prev + 5, favoriteAdvertisements.length));
    setHasMore(visibleItems + 5 < favoriteAdvertisements.length);
  };

  const handleImageLoad = (id: number) => {
    setLoadedImages(prev => ({ ...prev, [id]: true }))
  }
  const handleAdvertisementClick = (categoryNameNoDiacritics: string, id: number) => {
    navigate(`/${categoryNameNoDiacritics}/${id}`)
  }

  const truncateUrl = (url: string, maxLength: number = 30) => {
    if (url.length <= maxLength) return url;
    return url.substring(0, maxLength) + '...';
  };

  return (
    <div className="max-w-7xl mx-auto py-12 space-y-8 px-4 md:px-6">
      <div className="flex flex-col md:flex-row justify-center items-center gap-2 md:gap-5 mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-green-600 text-center md:text-left">
          Top cửa hàng yêu thích
        </h2>
        <div className="hidden md:block flex-grow h-1 bg-gradient-to-r from-green-500 to-green-300 rounded-full"></div>
      </div>

      <div className="grid gap-8">
        {Array.isArray(favoriteAdvertisements) && favoriteAdvertisements?.slice(0, visibleItems).map((item) => (
          <div key={item.advertisementId}
            className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden">
            <div className="flex flex-col md:flex-row">
              <div className="w-full md:w-72 h-48 md:h-64 relative">
                {!loadedImages[item.advertisementId] && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                    <Loader2 className="w-8 h-8 text-green-500 animate-spin" />
                  </div>
                )}
                <img
                  onClick={() => handleAdvertisementClick(item.categoryNameNoDiacritics, item.advertisementId)}
                  src={item.mediaList[0]?.url || ''}
                  alt={item.mainAdvertisementName || ''}
                  className={`w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 cursor-pointer ${loadedImages[item.advertisementId] ? 'opacity-100' : 'opacity-0'
                    }`}
                  onLoad={() => handleImageLoad(item.advertisementId)}
                />
              </div>

              <div className="flex-1 p-6">
                <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 cursor-pointer hover:text-secondary-color transition-colors" onClick={() => handleAdvertisementClick(item.categoryNameNoDiacritics, item.advertisementId)}>
                  {item.mainAdvertisementName || ''}
                </h2>

                <div className="space-y-3">


                  <p className="flex items-center text-gray-600 hover:text-green-600 transition-colors">
                    <Phone className="w-5 h-5 mr-3 text-blue-700 animate-subtle-bounce 
            transition-transform duration-300 hover:rotate-12"/>
                    {/* <span>{item.phoneNumber || ''}</span> */}
                    <a href={`tel:${item.phoneNumber || ''}`}>{item.phoneNumber || ''}</a>
                  </p>

                  {(item.websiteLink || item.zaloLink || item.facebookLink) && (
                    <a href={item.websiteLink || item.zaloLink || item.facebookLink || ''}
                      className="flex items-center text-blue-600 hover:text-secondary-color transition-colors" 
                      target="_blank"
                      rel="noopener noreferrer">
                      <Link2 className="w-5 h-5 mr-3" />
                      <span className="truncate">
                        {truncateUrl(item.websiteLink || item.zaloLink || item.facebookLink || '')}
                      </span>
                    </a>
                  )}

                  <p className="flex items-center text-gray-600 hover:text-green-600 transition-colors">
                    <MapPin className="w-5 h-5 mr-3 text-green-500" />
                    <span>{item.address || ''}</span>
                  </p>
                  <div className="flex items-center pt-2">
                    <span className="text-lg font-semibold mr-2">{item.averageRating}</span>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${i < Math.floor(item.averageRating)
                            ? "text-yellow-400 fill-current"
                            : "text-gray-200"
                            }`}
                        />
                      ))}
                    </div>
                    <span className="text-gray-500 ml-2">({item.reviewCount})</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {hasMore && (
        <button
          onClick={loadMore}
          disabled={isLoading}
          className="mt-8 bg-green-500 hover:bg-green-600 text-white font-semibold px-8 py-3 rounded-full 
                     shadow-md hover:shadow-lg transition-all duration-300 mx-auto block disabled:opacity-50"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin inline" />
          ) : (
            'Xem thêm'
          )}
        </button>
      )}
    </div>
  )
}