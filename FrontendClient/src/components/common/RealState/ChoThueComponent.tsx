import React, { useState } from "react";
import {
  Bath,
  BedDouble,
  MapPinHouse,
  Phone,
  Grid2X2,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface ChoThueProps {
  images: string[];
  title: string;
  price: string;
  area: number;
  bedrooms: number;
  bathrooms: number;
  address: string;
  description: string;
  authorName: string;
  postDate: string;
  contactPhoneNumber: string;
}

const ChoThueComponent: React.FC<ChoThueProps> = ({
  price,
  area,
  bedrooms,
  bathrooms,
  address,
  postDate,
  description,
  authorName,
  contactPhoneNumber,
  images,
  title,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleImageClick = (index: number) => {
    setCurrentImageIndex(index);
    setShowModal(true);
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <>
      <div className="max-w-4xl mx-auto border rounded-lg shadow-md overflow-hidden">
        <div className="grid grid-cols-3 gap-2 p-4">
          <div className="col-span-2">
            <img
              src={images[0]}
              alt="Main"
              className="w-full h-[350px] object-cover rounded-lg cursor-pointer"
              onClick={() => handleImageClick(0)}
            />
          </div>
          <div className="grid grid-rows-3 gap-2">
            {images.slice(1, 3).map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Apartment ${index}`}
                className="w-full h-[115px] object-cover rounded-lg cursor-pointer"
                onClick={() => handleImageClick(index + 1)}
              />
            ))}

            {images.length > 4 && (
              <div className="relative">
                <img
                  src={images[3]}
                  alt="More Images"
                  className="w-full h-[115px] object-cover rounded-lg"
                />
                <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center rounded-lg">
                  <span className="text-white text-lg font-semibold">
                    +{images.length - 4} ảnh
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="p-4">
          <h2 className="text-lg font-bold text-red-600">{title}</h2>
          <p className="text-2xl text-blue-500 font-semibold">{price}/tháng</p>
          <div className="text-gray-600 my-2 flex flex-wrap break-all">
            <span className="mr-2">
              <Grid2X2 />
            </span>
            <span>{area} m²</span>
            <span className="ml-10 mr-2">
              <BedDouble />
            </span>
            <span>{bedrooms}</span> ·{" "}
            <span className="ml-10 mr-2">
              <Bath />
            </span>
            <span>{bathrooms}</span>
          </div>

          <p className="text-gray-700 flex items-center">
            {" "}
            <MapPinHouse />
            {address}
          </p>
          <p className="mt-2 text-sm text-gray-600">{description}</p>
          <div className="flex items-center mt-4">
            <div className="text-gray-800 font-semibold">
              {authorName}
              <p className="font-thin text-gray-800">{postDate}</p>
            </div>
            <a
              href={`tel:${contactPhoneNumber}`}
              className="ml-auto bg-secondary-color text-white py-2 px-4 rounded-full flex items-center hover:bg-primary-color"
            >
              <Phone size={16} className="mr-2" />
              {contactPhoneNumber}
            </a>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center">
          <button
            className="absolute top-4 right-4 text-white p-2 hover:bg-gray-800 rounded-full"
            onClick={() => setShowModal(false)}
          >
            <X size={24} />
          </button>
          
          <button
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white p-2 hover:bg-gray-800 rounded-full"
            onClick={handlePrevImage}
          >
            <ChevronLeft size={24} />
          </button>
          
          <img
            src={images[currentImageIndex]}
            alt={`Full size ${currentImageIndex}`}
            className="max-h-[90vh] max-w-[90vw] object-contain"
          />
          
          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white p-2 hover:bg-gray-800 rounded-full"
            onClick={handleNextImage}
          >
            <ChevronRight size={24} />
          </button>
        </div>
      )}
    </>
  );
};

export default ChoThueComponent;
