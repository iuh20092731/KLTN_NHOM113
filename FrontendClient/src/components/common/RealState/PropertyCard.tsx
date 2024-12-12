import React, { useState } from "react";
import { Bath, BedDouble, MapPinHouse, Phone, X, ChevronLeft, ChevronRight, Home } from "lucide-react";
import { convertCurrency } from "@/utils/convertCurrency";
import { EstateMedia } from "@/redux/thunks/realestate";

interface PropertyCardProps {
  imageGallery: EstateMedia[];
  title: string;
  price: number;
  area: number;
  pricePerMeter: number;
  bedrooms: number;
  bathrooms: number;
  address: string;
  description: string;
  authorName: string;
  postDate: string;
  contactPhoneNumber: string;
}

const PropertyCard: React.FC<PropertyCardProps> = ({
  imageGallery,
  title,
  price,
  area,
  pricePerMeter,
  bedrooms,
  bathrooms,
  address,
  description,
  authorName,
  postDate,
  contactPhoneNumber,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleImageClick = (index: number) => {
    setCurrentImageIndex(index);
    setIsModalOpen(true);
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? imageGallery.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === imageGallery.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <>
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden mb-8">
        {/* Image Section */}
        <div className="relative group">
          {/* Main Image */}
          <img
            src={imageGallery[0]?.mediaUrl}
            alt={title}
            className="w-full h-[300px] object-cover transition-transform duration-300 group-hover:scale-105"
            onClick={() => handleImageClick(0)}
          />

          {/* Image Gallery Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/70 to-transparent">
            <div className="flex gap-2">
              {imageGallery.slice(1, 4).map((image, index) => (
                <img
                  key={index}
                  src={image.mediaUrl}
                  alt={`Gallery Image ${index + 1}`}
                  className="w-16 h-16 object-cover rounded-md cursor-pointer hover:opacity-90 transition"
                  onClick={() => handleImageClick(index + 1)}
                />
              ))}
              {imageGallery.length > 4 && (
                <div 
                  className="w-16 h-16 rounded-md cursor-pointer relative overflow-hidden"
                  onClick={() => handleImageClick(4)}
                >
                  <img
                    src={imageGallery[4]?.mediaUrl}
                    alt="More images"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      +{imageGallery.length - 4}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-5">
          <h2 className="text-xl font-semibold text-gray-800 mb-3 line-clamp-2">
            {title}
          </h2>

          {/* Price and Stats */}
          <div className="flex flex-wrap gap-4 mb-4">
            <div className="flex-1">
              <p className="text-2xl font-bold text-rose-500">
                {convertCurrency(price)}
              </p>
              <p className="text-sm text-gray-500">
                {convertCurrency(pricePerMeter)}/m²
              </p>
            </div>
            <div className="flex gap-4">
              <div className="flex items-center gap-1">
                <BedDouble className="w-5 h-5 text-gray-400" />
                <span className="text-gray-600">{bedrooms}</span>
              </div>
              <div className="flex items-center gap-1">
                <Bath className="w-5 h-5 text-gray-400" />
                <span className="text-gray-600">{bathrooms}</span>
              </div>
              <div className="flex items-center gap-1">
                <Home className="w-5 h-5 text-gray-400" />
                <span className="text-gray-600">{area} m²</span>
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="flex items-center gap-2 mb-3">
            <MapPinHouse className="w-4 h-4 text-gray-400" />
            <p className="text-gray-600 text-sm"> {address}</p>
          </div>

          {/* Description */}
          <p className="text-gray-600 text-sm mb-4 text-justify">
            {description}
          </p>

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div>
              <p className="font-medium text-gray-800">{authorName}</p>
              <p className="text-sm text-gray-500">{postDate}</p>
            </div>
            <button className="flex items-center gap-2 bg-secondary-color hover:bg-primary-color/90 text-white px-4 py-2 rounded-lg transition-colors">
              <Phone className="w-4 h-4" />
              <span className="font-medium">{contactPhoneNumber}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Modal remains the same but with updated styles */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center">
          <button
            onClick={() => setIsModalOpen(false)}
            className="absolute top-4 right-4 text-white/80 hover:text-white p-2 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          
          <button
            onClick={handlePrevImage}
            className="absolute left-4 text-white/80 hover:text-white p-2 transition-colors"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>

          <img
            src={imageGallery[currentImageIndex]?.mediaUrl}
            alt={`Image ${currentImageIndex + 1}`}
            className="max-h-[90vh] max-w-[90vw] object-contain"
          />

          <button
            onClick={handleNextImage}
            className="absolute right-4 text-white/80 hover:text-white p-2 transition-colors"
          >
            <ChevronRight className="w-8 h-8" />
          </button>
        </div>
      )}
    </>
  );
};

export default PropertyCard;
