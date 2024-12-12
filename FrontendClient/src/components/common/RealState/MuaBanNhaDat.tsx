import React, { useEffect, useState } from 'react';
import PropertyCard from './PropertyCard';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { EstateMedia, getRealEstateListings, postRealEstateListing } from '@/redux/thunks/realestate';
import { uploadImage } from '@/redux/thunks/uploadImage';
import { formatRelativeDate } from '@/utils/formatRelativeDate'; 
import { Link } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { ClipLoader } from 'react-spinners';

const MuaBanNhaDat: React.FC = () => {
  const isLoggedIn = useSelector((state: RootState) => state.user.isLogin)
  const userInfo = useSelector((state: RootState) => state.user.userInfo)
  const realEstateListings = useSelector((state: RootState) => state.realEstate.RealEstateListing)
  const dispatch = useDispatch<AppDispatch>();
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 5;
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    dispatch(getRealEstateListings({ realEstateType: "BUY", page: currentPage, size: itemsPerPage }));
  }, [currentPage]);

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    area: '',
    bedrooms: '',
    bathrooms: '',
    address: '',
    description: '',
    contactPhoneNumber: '',
  });

  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'price') {
      const numericValue = value.replace(/\D/g, '');
      const formattedValue = numericValue ? new Intl.NumberFormat('vi-VN').format(parseInt(numericValue, 10)) : '0';
      setFormData(prevState => ({
        ...prevState,
        [name]: formattedValue
      }));
    } else {
      setFormData(prevState => ({
        ...prevState,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const imageFormData = new FormData();
    selectedImages.forEach((file) => {
      imageFormData.append("files", file);
    });
    
    const uploadedUrl = await dispatch(uploadImage(imageFormData)).unwrap();
    const parsedUrl = JSON.parse(uploadedUrl);
    const mediaEstateList: EstateMedia[] = parsedUrl.map((url: string, index: number) => {
      return {
            mediaUrl: url,
            mediaType: "IMAGE",
            seq: index
          };
    });
    const formattedFormData = {
      ...formData,
      userId: userInfo?.userId,
      price: parseInt(formData.price.replace(/\D/g, ''), 10),
      area: parseInt(formData.area, 10),
      bedrooms: parseInt(formData.bedrooms, 10),
      bathrooms: parseInt(formData.bathrooms, 10),
      contactPhoneNumber: formData.contactPhoneNumber,
      pricePerSquareMeter: parseInt(formData.price.replace(/\D/g, ''), 10) / parseInt(formData.area, 10),
      detailedAddress: formData.address,
      mediaList: mediaEstateList,
      realEstateType: "BUY"
    };
    dispatch(postRealEstateListing(formattedFormData) as any);
    dispatch(getRealEstateListings({ realEstateType: "BUY", page: currentPage, size: itemsPerPage }))
    setShowForm(false);
    setIsSubmitting(false);
    
    // Reset form
    setFormData({
      title: '',
      price: '',
      area: '',
      bedrooms: '',
      bathrooms: '',
      address: '',
      description: '',
      contactPhoneNumber: '',
    });
    setSelectedImages([]);
    setPreviewUrls([]);
    toast({
      title: "Đăng tin thành công!",
      // description: "Bạn đã đăng tin thành công. Chúng tôi sẽ xem xét và duyệt tin của bạn ngay lập tức.",
      variant: "default",
      duration: 3000,
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      // Limit to maximum 5 images
      const newFiles = files.slice(0, 5);
      setSelectedImages(prevImages => [...prevImages, ...newFiles].slice(0, 5));
      
      // Create preview URLs
      const newPreviewUrls = newFiles.map(file => URL.createObjectURL(file));
      setPreviewUrls(prevUrls => [...prevUrls, ...newPreviewUrls].slice(0, 5));
    }
  };

  const removeImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
    setPreviewUrls(prev => {
      // Revoke the URL to prevent memory leaks
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  };

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const nextPage = () => {
    setCurrentPage(prevPage => prevPage + 1);
  };

  const prevPage = () => {
    setCurrentPage(prevPage => Math.max(prevPage - 1, 0));
  };

  const totalPages = Math.ceil(realEstateListings.length / itemsPerPage);

  const imageUploadSection = (
    <div className="md:col-span-2 mt-6">
      <label className="block text-gray-700 text-sm font-bold mb-2 flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary-color" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        Hình ảnh (Tối đa 5 hình) <span className="text-red-500">*</span>
      </label>
      
      <div className="mt-2">
        <div className="grid grid-cols-2 md:flex md:flex-wrap gap-4 mb-4">
          {previewUrls.map((url, index) => (
            <div key={index} className="relative">
              <img
                src={url}
                alt={`Preview ${index + 1}`}
                className="w-32 h-32 object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>

        {previewUrls.length < 5 && (
          <label className="cursor-pointer">
            <div className="flex items-center justify-center w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-color transition-colors">
              <div className="text-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span className="mt-2 block text-sm text-gray-600">Thêm ảnh</span>
              </div>
            </div>
            <input
              type="file"
              className="hidden"
              accept="image/*"
              multiple
              onChange={handleImageChange}
            />
          </label>
        )}
      </div>
      <p className="text-sm text-gray-500 mt-2">
        * Hình ảnh phải rõ ràng và liên quan đến bất động sản
      </p>
    </div>
  );

  return (
    <div className="container mx-auto md:px-4 py-8" key={realEstateListings.length}>
      {isSubmitting && (
        <div className="flex items-center justify-center">
          <ClipLoader color="#000" loading={isSubmitting} size={50} />
          <p className="ml-2 text-blue-500">Đang đăng tin...</p>
        </div>
      )}
      <button
        className="bg-gradient-to-r from-primary-color to-blue-500 hover:from-secondary-color hover:to-primary-color text-white font-bold py-4 px-8 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:scale-105 mb-8 flex items-center mx-auto"
        onClick={() => setShowForm(!showForm)}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        {showForm ? 'Ẩn form Đăng tin' : 'Đăng bán căn hộ'}
      </button>

      {showForm && (
        <div className="max-w-4xl mx-auto mb-4 lg:mb-8">
          {/* Pricing Info Card */}
          {/* <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg shadow-md mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-gray-800">Phí đăng tin</h3>
                <p className="text-gray-600 mt-2">Mỗi tin đăng có giá: <span className="font-bold text-primary-color">10,000 VNĐ</span></p>
              </div>
              <div className="bg-white p-4 rounded-full shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary-color" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div> */}

          {
            !isLoggedIn ? (
              <div className="flex flex-col items-center text-center bg-green-500 text-white p-6 rounded-lg shadow-lg">
                <h1 className="text-2xl font-bold mb-3">Đăng nhập để truy cập đầy đủ chức năng</h1>
                <p className="mb-4">Bạn cần đăng nhập để đăng tin và quản lý nội dung.</p>
                <Link
                  to="/login"
                  onClick={() => localStorage.setItem('redirectUrl', window.location.pathname)}
                  className="bg-white text-green-500 font-semibold py-2 px-4 rounded-full shadow-md hover:bg-gray-100 hover:text-green-600 transition duration-300"
                >
                  Đăng nhập ngay
                </Link>
              </div>
            ) : (<form onSubmit={handleSubmit} className="bg-white shadow-2xl rounded-2xl overflow-hidden p-4">
              {/* Form Header */}
              <div className="bg-gradient-to-r from-primary-color to-blue-500 p-6 text-white">
                <h2 className="text-3xl font-bold text-center">Đăng Bán Căn Hộ</h2>
                {/* <p className="text-center mt-2 text-gray-100">Điền đầy đủ thông tin để đăng tin của bạn</p> */}
              </div>
  
              <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Title input (span full width) */}
                  <div className="md:col-span-2">
                    <label className="block text-gray-700 text-sm font-bold mb-2 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary-color" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Tiêu đề <span className="text-red-500">*</span>
                    </label>
                    <input
                      className="shadow-sm appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-primary-color focus:border-transparent transition duration-300"
                      id="title"
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                      placeholder="Nhập tiêu đề bài đăng"
                    />
                  </div>
  
                  {/* Price and Area container */}
                  <div className="flex space-x-4 mb-6">
                    <div className="flex-1">
                      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="price">
                        Giá (VNĐ) <span className="text-red-500">*</span>
                      </label>
                      <input
                        className="shadow-sm appearance-none border rounded-md w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        id="price"
                        type="text"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        required
                        placeholder="Ví dụ: 3.000.000.000"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="area">
                        Diện tích (m²) <span className="text-red-500">*</span>
                      </label>
                      <input
                        className="shadow-sm appearance-none border rounded-md w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        id="area"
                        type="number"
                        name="area"
                        value={formData.area}
                        onChange={handleInputChange}
                        required
                        placeholder="Ví dụ: 100"
                      />
                    </div>
                  </div>
  
                  {/* Bedrooms and Bathrooms container */}
                  <div className="flex space-x-4 mb-6">
                    <div className="flex-1">
                      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="bedrooms">
                        Số phòng ngủ <span className="text-red-500">*</span>
                      </label>
                      <input
                        className="shadow-sm appearance-none border rounded-md w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        id="bedrooms"
                        type="number"
                        name="bedrooms"
                        value={formData.bedrooms}
                        onChange={handleInputChange}
                        required
                        placeholder="Ví dụ: 3"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="bathrooms">
                        Số phòng tắm <span className="text-red-500">*</span>
                      </label>
                      <input
                        className="shadow-sm appearance-none border rounded-md w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        id="bathrooms"
                        type="number"
                        name="bathrooms"
                        value={formData.bathrooms}
                        onChange={handleInputChange}
                        required
                        placeholder="Ví dụ: 2"
                      />
                    </div>
                  </div>
  
                  {/* Description column */}
                  <div className="space-y-6">
                    {/* address input */}
                    <div>
                      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="address">
                        Địa chỉ <span className="text-red-500">*</span>
                      </label>
                      <input
                        className="shadow-sm appearance-none border rounded-md w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        id="address"
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        required
                        // placeholder="Ví dụ: Quận 12"
                      />
                    </div>
  
                    {/* Contact number input */}
                    <div>
                      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="contactPhoneNumber">
                        Số điện thoại liên hệ <span className="text-red-500">*</span>
                      </label>
                      <input
                        className="shadow-sm appearance-none border rounded-md w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        id="contactPhoneNumber"
                        type="tel"
                        name="contactPhoneNumber"
                        value={formData.contactPhoneNumber}
                        onChange={handleInputChange}
                        // required
                        placeholder="Ví dụ: 0909090909"
                      />
                    </div>
                  </div>
  
                  {/* Description textarea */}
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
                      Mô tả
                    </label>
                    <textarea
                      className="shadow-sm appearance-none border rounded-md w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent h-[150px]"
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      // required
                      placeholder="Mô tả chi tiết về bất động sản của bạn"
                    />
                  </div>
                </div>
  
                {imageUploadSection}
  
                {/* Submit button with updated styling */}
                <div className="mt-8 flex items-center justify-center">
                  <button
                    className="bg-gradient-to-r from-primary-color to-secondary-color hover:from-secondary-color hover:to-primary-color text-white font-bold py-4 px-8 rounded-full focus:outline-none focus:shadow-outline transition duration-300 ease-in-out transform hover:scale-105 flex items-center"
                    type="submit"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                    Đăng tin ngay
                  </button>
                </div>
              </div>
            </form>)
          }
          
        </div>
      )}
      {
        Array.isArray(realEstateListings) &&
        [...realEstateListings] 
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .map((listing) => (
            <PropertyCard
              key={listing.listingId}
              imageGallery={Array.isArray(listing.mediaList) ? listing.mediaList : []} 
              title={listing.title}
              price={listing.price}
              area={listing.area}
              pricePerMeter={listing.pricePerSquareMeter}
              bedrooms={listing.bedrooms}
              bathrooms={listing.bathrooms}
              address={listing.address}
              description={listing.description}
              authorName={`${listing.user?.firstName || ''} ${listing.user?.lastName || ''}`}
              postDate={`${formatRelativeDate(listing.createdAt)}`}
              contactPhoneNumber={listing.contactPhoneNumber}
            />
          ))
      }
      <div className="flex justify-center mt-4">
        <button
          onClick={prevPage}
          disabled={currentPage === 0}
          className="mx-1 px-4 py-2 rounded bg-gray-200 disabled:opacity-50"
        >
          Previous
        </button>
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => paginate(index)}
            className={`mx-1 px-4 py-2 rounded ${currentPage === index ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            {index + 1}
          </button>
        ))}
        <button
          onClick={nextPage}
          disabled={currentPage >= totalPages - 1}
          className="mx-1 px-4 py-2 rounded bg-gray-200 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default MuaBanNhaDat;