import { useParams } from "react-router-dom";
import { get } from "@/services/api.service";
import { useEffect, useState, useMemo } from "react";
import { ENDPOINTS_V2 } from "@/constants/endpoints";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ExternalLink, MapPin, Phone,Clock,
  DollarSign,
  ChevronDown,
  ChevronUp,
  Star,
  Home,
  FacebookIcon,
  MessageCircle,
  Heart,
} from "lucide-react";
import { FoodItem } from "@/types/Food";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Link } from "react-router-dom";
import Review from "@/components/common/Review";
import FAQs from "@/components/common/FAQs";

import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { updateClickCount } from "@/redux/thunks/updateClickCount";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import TextWithLineBreaks from "@/utils/formatDescription";
import { likeAdvertisement } from "@/redux/thunks/advertisement";

const FoodDetail = () => {
  const dispatch: AppDispatch = useDispatch();

  const { id } = useParams<{ id: string }>();
  const [foodData, setFoodData] = useState<FoodItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDescriptionOpen, setIsDescriptionOpen] = useState(true);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const [isLiked, setIsLiked] = useState(false);
  const toggleLike = (id: number) => {
    setIsLiked((prev) => {
      const newLikedState = !prev;
      if (newLikedState) {
        dispatch(likeAdvertisement(id));
      }
      return newLikedState;
    });
  };

  useEffect(() => {
    if (id) {
      dispatch(updateClickCount(Number(id)));
    }
  }, [dispatch, id]);
  useEffect(() => {
    const isMobile = window.innerWidth <= 1024;
    const scrollPosition = isMobile ? 20 : 250;
    window.scrollTo(0, scrollPosition);
  }, []);
  useEffect(() => {
    const fetchFoodData = async () => {
      try {
        const response = await get<{ result: FoodItem }>(
          ENDPOINTS_V2.ADVERTISEMENT + "/" + id
        );
        setFoodData(response.data.result);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu món ăn:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFoodData();
  }, [id]);

  useEffect(() => {
    const heartIcon = document.querySelector('.heart-icon') as HTMLElement;
    if (heartIcon) {
      heartIcon.style.color = 'white';
    }
  }, []);

  useEffect(() => {
    const heartIcon = document.querySelector('.heart-icon') as HTMLElement;
    if (heartIcon) {
      heartIcon.style.color = isLiked ? 'rgb(220, 38, 38)' : 'white';
      heartIcon.style.fill = isLiked ? 'rgb(220, 38, 38)' : 'white';
    }
  }, [isLiked]);

  const renderLoading = () => (
    <div className="container mx-auto p-4">
      <Skeleton className="w-full h-64 mb-4 rounded-lg" />
      <Skeleton className="w-full h-96 rounded-lg" />
    </div>
  );

  const renderError = () => (
    <div className="container mx-auto p-4">
      <Card className="bg-red-50 border-red-200">
        <CardContent className="pt-6">
          <p className="text-red-600 text-center">
            Không tìm thấy thông tin chi tiết về quán ăn này.
          </p>
        </CardContent>
      </Card>
    </div>
  );

  const renderContent = useMemo(() => {
    if (!foodData) return null;
    const allImages = foodData.mediaList?.map(media => ({ src: media.url })) || [];
    return (
      <>
        <nav className="flex text-sm text-gray-500 mb-4 flex-wrap">
          <Link to="/" className="hover:text-gray-700 flex items-center">
            <Home className="w-4 h-4 mr-1" />
            <span >Trang chủ</span>
          </Link>
          <span className="mx-2">/</span>
          <Link to={`/${foodData?.categoryNameNoDiacritics}`} className="hover:text-gray-700">
          {foodData?.categoryName}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900 break-words whitespace-normal">
            {foodData.mainAdvertisementName}
          </span>
        </nav>
        <Card className="overflow-hidden">
          <div className="relative h-64 bg-gradient-to-r from-green-400 to-blue-500">
            {foodData.mediaList?.[0] && (
              <img
                src={foodData.mediaList[0].url}
                alt={foodData.mainAdvertisementName}
                className="w-full h-full object-cover"
              />
            )}
              
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent">
              <h1 className="text-3xl font-bold text-white mb-1">
                {foodData.mainAdvertisementName}
              </h1>
              <div className="flex items-center mt-1">
                <span className="flex items-center">
                  <span className="text-white text-sm mr-1">
                    {foodData.averageRating?.toFixed(1) || "0.0"}
                  </span>
                  <Star className="text-yellow-400 fill-current w-4 h-4" />
                </span>
                <span className="text-white text-sm ml-2">
                  ({foodData.reviewCount || 0} đánh giá)
                </span>
                <Heart 
                  className="absolute bottom-3 right-4 heart-icon text-white cursor-pointer" 
                  onClick={() => toggleLike(foodData?.advertisementId)}
                  fill={isLiked ? 'rgb(220, 38, 38)' : 'white'} 
                />
              </div>
            </div>
          </div>
          
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Collapsible
                  open={isDescriptionOpen}
                  onOpenChange={setIsDescriptionOpen}
                >
                  <CollapsibleTrigger asChild>
                    <Button
                      variant="ghost"
                      className="flex items-center justify-between w-full mb-3 pl-0"
                    >
                      <h2 className="text-xl font-semibold">
                        Thông tin chi tiết
                      </h2>
                      {isDescriptionOpen ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <p className="text-gray-700 mb-4 text-base leading-relaxed text-justify">
                      {TextWithLineBreaks(foodData.detailedDescription)}
                    </p>
                  </CollapsibleContent>
                </Collapsible>
                <div className="space-y-3 mt-4">
                  {[
                    {
                      icon: MapPin,
                      text: foodData.address,
                      href: foodData.googleMapLink,
                      color: "text-green-500",
                      hoverColor: "hover:text-green-500",
                    },
                    {
                      icon: Phone,
                      text: foodData.phoneNumber,
                      href: `tel:${foodData.phoneNumber}`,
                      color: "text-blue-500",
                      hoverColor: "hover:text-blue-500",
                    },
                    {
                      icon: Clock,
                      text: `Giờ mở cửa: ${foodData.openingHourStart} - ${foodData.openingHourEnd}`,
                      color: "text-orange-500",
                      hoverColor: "hover:text-orange-500",
                    },
                    {
                      icon: DollarSign,
                      text: `Giá: ${foodData.priceRangeLow.toLocaleString()} - ${foodData.priceRangeHigh.toLocaleString()} VNĐ`,
                      color: "text-yellow-500",
                      hoverColor: "hover:text-yellow-500",
                    },
                  ].map(({ icon: Icon, text, href, color, hoverColor }, index) => (
                    <div
                      key={index}
                      className={`flex items-center text-base transition-colors`}
                    >
                      <Icon className={`mr-2 min-h-5 min-w-5 ${color}`} />
                      {href ? (
                        <a
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`transition-colors ${hoverColor}`}
                        >
                          {text}
                        </a>
                      ) : (
                        <span className={`transition-colors ${hoverColor}`}>{text}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h2 className="text-xl font-semibold mb-4">Liên kết</h2>
                <div className="space-y-3">
                  {foodData.googleMapLink && (
                    <Button
                      variant="outline"
                      size="default"
                      className="w-full justify-start text-base h-12"
                      asChild
                    >
                      <a
                        href={foodData.googleMapLink}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <MapPin className="mr-2 h-5 w-5 text-green-500" />
                        Xem trên Google Maps
                      </a>
                    </Button>
                  )}
                  {foodData.websiteLink && (
                    <Button
                      variant="outline"
                      size="default"
                      className="w-full justify-start text-base h-12"
                      asChild
                    >
                      <a
                        href={foodData.websiteLink}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="mr-2 h-5 w-5 text-blue-500" />
                        {foodData.websiteLink}
                      </a>
                    </Button>
                  )}
                  {foodData.facebookLink && (
                    <Button
                      variant="outline"
                      size="default"
                      className="w-full justify-start text-base h-12"
                      asChild
                    >
                      <a
                        href={foodData.facebookLink}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <FacebookIcon className="mr-2 h-5 w-5 text-blue-500" />
                        Facebook
                      </a>
                    </Button>
                  )}
                  {foodData.zaloLink && (
                    <Button
                      variant="outline"
                      size="default"
                      className="w-full justify-start text-base h-12"
                      asChild
                    >
                      <a
                        href={foodData.zaloLink}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <MessageCircle className="mr-2 h-5 w-5 text-blue-500" />
                        Zalo
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {foodData.mediaList && foodData.mediaList.length > 1 && (
              <div className="mt-8">
                <h2 className="text-xl font-semibold mb-4">Hình ảnh</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {foodData.mediaList.slice(1).map((media, index) => (
                    <img
                      key={media.id}
                      src={media.url}
                      alt={media.name}
                      className="w-full h-48 rounded-lg object-cover shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer"
                      onClick={() => {
                        setCurrentImageIndex(index + 1); // +1 because we sliced the first image
                        setIsGalleryOpen(true);
                      }}
                    />
                  ))}
                </div>
                <Lightbox
                  open={isGalleryOpen}
                  close={() => setIsGalleryOpen(false)}
                  slides={allImages}
                  index={currentImageIndex}
                />
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex flex-col items-start space-y-4 mt-4">
          <Review advertisementId={Number(id)} />
        </div>
        <div className="flex flex-col items-start space-y-4 mt-4">
          <FAQs advertisementId={Number(id)}/>
        </div>
      </>
    );
  }, [foodData, isDescriptionOpen, isGalleryOpen, currentImageIndex]);

  if (isLoading) return renderLoading();
  if (!foodData) return renderError();

  return <div className="container mx-auto py-2 md:p-4">{renderContent}</div>;
};

export default FoodDetail;
