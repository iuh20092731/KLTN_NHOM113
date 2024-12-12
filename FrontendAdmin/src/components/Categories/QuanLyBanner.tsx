import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import { useState, useRef, useEffect } from 'react';
import { AppDispatch } from '../../redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { uploadImage } from '../../redux/thunks/cloudDinary';
import { postBanner, updateBanner, updateBanners, getBannersByType, deleteBanner } from '../../redux/thunks/banner';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BsArrowUp, BsArrowDown } from 'react-icons/bs';

function dataURLToBlob(dataURL: string): Blob {
  const byteString = atob(dataURL.split(',')[1]);
  const mimeString = dataURL.split(',')[0].split(':')[1].split(';')[0];
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ab], { type: mimeString });
}

interface Banner {
  bannerId: number;
  imageUrl: string;
  title: string | null;
  isActive: boolean;
  seq: number;
  linkUrl: string | null;
  description: string;
  serial: number;
}

interface BannerCreationRequest {
  imageUrl: string | null;
  linkUrl: string | null;
  title: string | null;
  description: string | null;
  type: string;
  seq: number | null;
}

// Sample banner data for testing
const initialBanners = [
  { bannerId: 1, title: 'Banner 1', imageUrl: 'https://via.placeholder.com/150', isActive: true },
  { bannerId: 2, title: 'Banner 2', imageUrl: 'https://via.placeholder.com/150', isActive: true },
  { bannerId: 3, title: 'Banner 3', imageUrl: 'https://via.placeholder.com/150', isActive: true },
];

const QuanLyBanner = () => {
  const dispatch: AppDispatch = useDispatch();

  // Thêm state để quản lý modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  // Thêm state mi
  const [bannerCount, setBannerCount] = useState(1);
  const [selectedBanners, setSelectedBanners] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activePosition, setActivePosition] = useState<number | null>(null);

  // Add new state for loading
  const [isUploading, setIsUploading] = useState(false);

  // Thêm states cho modal top banner
  const [bannerImages, setBannerImages] = useState(initialBanners);
  const [isLoading, setIsLoading] = useState(false);

  const apiUrl = (import.meta as any).env.VITE_API_URL;

  // Hàm fetch images từ API
  const fetchBannerImages = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${apiUrl}/api/v1/banners/type/TOP/seq/1`);
      const data = await response.json();
      setBannerImages(data);
    } catch (error) {
      console.error('Failed to fetch images:', error);
      toast.error('Không thể tải danh sách hình ảnh');
    } finally {
      setIsLoading(false);
    }
  };

  // Add state for selected banner indexes
  const [selectedBannerIndexes, setSelectedBannerIndexes] = useState<number[]>([]);
  const [selectedCount, setSelectedCount] = useState(0);

  // Gọi API khi mở modal
  useEffect(() => {
    if (isModalOpen) {
      fetchBannerImages().then(() => {
        // Sort all banners by serial first
        const sortedBanners = [...bannerImages].sort((a, b) => a.serial - b.serial);

        // Then filter active ones
        const activeBanners = sortedBanners.filter(banner => banner.isActive);

        // Get the indexes based on the original bannerImages array
        const selectedIndexes = activeBanners
          .map(activeBanner => bannerImages.findIndex(img => img.bannerId === activeBanner.bannerId));

        setSelectedCount(activeBanners.length);
        setSelectedBannerIndexes(selectedIndexes);
      });
    }
  }, [isModalOpen]);

  // Hàm xử lý chọn banner
  const handleBannerSelect = (bannerId: number) => {
    if (selectedBanners.includes(String(bannerId))) {
      // Nếu banner đã đưc chọn, loại bỏ nó  
      setSelectedBanners(prev => prev.filter(id => id !== String(bannerId)));
    } else if (selectedBanners.length < bannerCount) {
      // Nếu chưa đạt đến số lượng banner cần chọn, thêm vào
      setSelectedBanners(prev => [...prev, String(bannerId)]);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && activePosition !== null) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // Update preview images state
        setPreviewImages(prev => ({
          ...prev,
          [activePosition]: reader.result as string
        }));

        // Update selected banners as before
        const newSelectedBanners = [...selectedBanners];
        newSelectedBanners[activePosition - 1] = reader.result as string;
        setSelectedBanners(newSelectedBanners);
      };
      reader.readAsDataURL(file);
    }
  };

  // Updated upload function
  const handleUploadBanners = async () => {
    setIsFullScreenLoading(true);
    const formData = new FormData();
    const imageDataUrls = selectedBanners.filter(banner => banner && banner.startsWith('data:image'));

    if (!imageDataUrls.length) {
      toast.warning('Vui lòng chọn ít nhất một ảnh để upload!');
      setIsFullScreenLoading(false);
      return;
    }

    imageDataUrls.forEach((banner, index) => {
      const blob = dataURLToBlob(banner);
      formData.append('files', blob, `banner${index + 1}.jpg`);
    });

    if (formData.has('files')) {
      try {
        const uploadResult = await dispatch(uploadImage(formData)).unwrap();
        const uploadUrls = JSON.parse(uploadResult);

        await Promise.all(uploadUrls.map((imageUrl: string, index: number) => {
          const originalPosition = selectedBanners.findIndex((banner, pos) =>
            banner === imageDataUrls[index]
          );

          if (originalPosition !== -1) {
            return dispatch(postBanner({
              imageUrl,
              linkUrl: '',
              title: `Right Banner ${originalPosition + 1}`,
              description: `Description for banner ${originalPosition + 1}`,
              type: 'RIGHT',
              seq: originalPosition + 1
            }));
          }
        }));

        // Reload right banners after successful upload
        const result = await dispatch(getBannersByType('RIGHT')).unwrap();
        setRightBanners(result);

        // Clear preview images
        setPreviewImages({});

        toast.success('Upload banner thành công!');
      } catch (error) {
        console.error('Upload failed:', error);
        toast.error('Upload thất bại! Vui lòng thử lại.');
      } finally {
        setIsFullScreenLoading(false);
      }
    }
  };

  // Hàm xử lý chọn ảnh từ modal
  const handleSelectImage = (imageUrl: string) => {
    setSelectedTopBanner(imageUrl);
    setIsModalOpen(false);
  };

  const handleSelectTopBanner = (imageUrl: string) => {
    setSelectedTopBanner(imageUrl);
    setIsModalOpen(false);
  };

  // Hàm xử lý lưu thứ tự và trạng thái banner
  const handleSaveOrderAndStatus = async () => {
    try {
      await dispatch(updateBanners(bannerImages)).unwrap();

      // Fetch và lọc lại danh sách top banners sau khi cập nhật thành công
      const result = await dispatch(getBannersByType('TOP')).unwrap();
      const activeBanners = result.filter(banner => banner.isActive === true);
      setTopBanners(activeBanners);

      // Reset slide về vị trí đầu tiên
      setCurrentSlide(0);

      toast.success('Cập nhật thứ tự và trạng thái banner thành công!');
      setIsModalOpen(false);
    } catch (error) {
      console.error('Failed to update banners:', error);
      toast.error('Cập nhật thất bại! Vui lòng thử lại.');
    }
  };

  // console.log(bannerImages);

  const moveBanner = (index: number, direction: 'up' | 'down') => {
    const newBanners = [...bannerImages];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;

    // Check if the target index is valid
    if (targetIndex < 0 || targetIndex >= newBanners.length) return;

    // Swap the banners
    const temp = newBanners[index];
    newBanners[index] = newBanners[targetIndex];
    newBanners[targetIndex] = temp;

    // Update serial numbers to match their new positions
    newBanners.forEach((banner, idx) => {
      banner.serial = idx + 1;
    });

    setBannerImages(newBanners);
  };

  const [topBanners, setTopBanners] = useState<Banner[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const fetchTopBanners = async () => {
      try {
        const result = await dispatch(getBannersByType('TOP')).unwrap();
        const activeBanners = result.filter(banner => banner.isActive === true);
        setTopBanners(activeBanners);
      } catch (error) {
        console.error('Failed to fetch top banners:', error);
        toast.error('Không thể tải banner');
      }
    };

    fetchTopBanners();
  }, [dispatch]);

  useEffect(() => {
    if (topBanners.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % topBanners.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [topBanners.length]);

  // Thêm state để quản lý modal thêm banner mới
  const [isAddBannerModalOpen, setIsAddBannerModalOpen] = useState(false);
  const [isUploadingTop, setIsUploadingTop] = useState(false);
  const topBannerFileInputRef = useRef<HTMLInputElement>(null);
  const [newBannerData, setNewBannerData] = useState<BannerCreationRequest>({
    imageUrl: null,
    linkUrl: null,
    title: null,
    description: null,
    type: 'TOP',
    seq: 1
  });

  // Hàm xử lý khi chọn ảnh trong modal thêm mới
  const handleNewBannerImageSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsUploadingTop(true);
      try {
        const formData = new FormData();
        formData.append('files', file);

        const uploadResult = await dispatch(uploadImage(formData)).unwrap();
        const [imageUrl] = JSON.parse(uploadResult);

        setNewBannerData(prev => ({
          ...prev,
          imageUrl
        }));

        toast.success('Upload ảnh thành công!');
      } catch (error) {
        console.error('Upload failed:', error);
        toast.error('Upload ảnh thất bại!');
      } finally {
        setIsUploadingTop(false);
      }
    }
  };

  // Hàm xử lý thêm banner mới
  const handleAddNewBanner = async () => {
    if (!newBannerData.imageUrl) {
      toast.warning('Vui lòng chọn ảnh banner!');
      return;
    }

    try {
      await dispatch(postBanner(newBannerData)).unwrap();

      // Fetch lại danh sách banner sau khi thêm thành công
      const result = await dispatch(getBannersByType('TOP')).unwrap();
      const activeBanners = result.filter(banner => banner.isActive === true);
      setTopBanners(activeBanners);

      // Reset form và đóng modal
      setNewBannerData({
        imageUrl: null,
        linkUrl: null,
        title: null,
        description: null,
        type: 'TOP',
        seq: 1
      });
      setIsAddBannerModalOpen(false);

      toast.success('Thêm banner thành công!');
    } catch (error) {
      console.error('Add banner failed:', error);
      toast.error('Thêm banner thất bại!');
    }
  };

  const [rightBanners, setRightBanners] = useState<Banner[]>([]);

  // Add useEffect to fetch right banners
  useEffect(() => {
    const fetchRightBanners = async () => {
      try {
        const result = await dispatch(getBannersByType('RIGHT')).unwrap();
        setRightBanners(result);
        // Update selectedBanners with existing right banners
        const bannerUrls = result.map(banner => banner.imageUrl);
        setSelectedBanners(bannerUrls);
      } catch (error) {
        console.error('Failed to fetch right banners:', error);
        toast.error('Không thể tải right banners');
      }
    };

    fetchRightBanners();
  }, [dispatch]);

  // Add state for preview images
  const [previewImages, setPreviewImages] = useState<{ [key: number]: string }>({});

  const [isFullScreenLoading, setIsFullScreenLoading] = useState(false);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [bannerToDelete, setBannerToDelete] = useState<number | null>(null);
  const [deleteProgress, setDeleteProgress] = useState(0);

  // Thêm state để theo dõi trạng thái loading của nút xóa
  const [isDeletingButton, setIsDeletingButton] = useState(false);

  // Cập nhật hàm handleDeleteBanner
  const handleDeleteBanner = async () => {
    if (bannerToDelete !== null) {
      try {
        // Bật loading cho nút
        setIsDeletingButton(true);

        // Hiển thị loading ngay lập tức
        setIsFullScreenLoading(true);
        setDeleteProgress(0);

        // Bắt đầu progress animation ngay lập tức
        const interval = setInterval(() => {
          setDeleteProgress((prev) => {
            if (prev >= 90) { // Chỉ tăng đến 90% trong quá trình xử lý
              clearInterval(interval);
              return 90;
            }
            return prev + 5;
          });
        }, 100);

        // Thực hiện xóa banner
        await dispatch(deleteBanner(bannerToDelete)).unwrap();

        // Sau khi xóa thành công, set progress lên 100%
        setDeleteProgress(100);

        // Cập nhật lại danh sách banner
        const result = await dispatch(getBannersByType('TOP')).unwrap();
        setBannerImages(result);

        // Đợi một chút để người dùng thấy 100% trước khi đóng
        await new Promise(resolve => setTimeout(resolve, 500));

        toast.success('Xóa banner thành công!');
      } catch (error) {
        console.error('Delete banner failed:', error);
        toast.error('Xóa banner thất bại! Vui lòng thử lại.');
      } finally {
        clearInterval(); // Đảm bảo clear interval nếu có lỗi
        setIsFullScreenLoading(false);
        setIsDeleteModalOpen(false);
        setBannerToDelete(null);
        setDeleteProgress(0);
        setIsDeletingButton(false); // Tắt loading cho nút
      }
    }
  };

  // Thêm component LoadingProgress
  const LoadingProgress: React.FC<{ progress: number; message: string }> = ({ progress, message }) => {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-8 flex flex-col items-center max-w-sm w-full mx-4">
          <div className="w-full mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">{message}</span>
              <span className="text-sm font-medium text-gray-700">{progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500" />
        </div>
      </div>
    );
  };

  return (
    <>
      {isFullScreenLoading && (
        <LoadingProgress
          progress={deleteProgress}
          message={`Đang xóa banner ${deleteProgress === 100 ? 'hoàn tất' : '...'}`}
        />
      )}

      <Breadcrumb pageName="Quản Lý Banner" />
      <ToastContainer />
      <div className="container mx-auto p-4">
        {/* Top Banner */}
        <div className="top-banner mb-4 relative h-[290px]">
          {/* Slider */}
          <div className="relative w-full h-full overflow-hidden rounded-lg">
            {topBanners.map((banner, index) => (
              <div
                key={banner.bannerId}
                className={`absolute w-full h-full transition-transform duration-500 ease-in-out`}
                style={{
                  transform: `translateX(${100 * (index - currentSlide)}%)`,
                }}
              >
                <img
                  src={banner.imageUrl}
                  alt={banner.title || `Slide ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}

            {/* Slide indicators */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {topBanners.map((_, index) => (
                <button
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all ${currentSlide === index ? 'bg-white w-4' : 'bg-white/50'
                    }`}
                  onClick={() => setCurrentSlide(index)}
                />
              ))}
            </div>

            {/* Navigation arrows */}
            <button
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full pt-[2px] pb-1"
              onClick={() => setCurrentSlide((prev) => (prev - 1 + topBanners.length) % topBanners.length)}
            >
              ←
            </button>
            <button
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full pt-[2px] pb-1"
              onClick={() => setCurrentSlide((prev) => (prev + 1) % topBanners.length)}
            >
              →
            </button>
          </div>

          {/* Control buttons */}
          <div className="absolute bottom-2 right-2 space-x-2">
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600"
            >
              Chỉnh sửa Banner
            </button>
            <button
              onClick={() => setIsAddBannerModalOpen(true)}
              className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600"
            >
              Thêm Banner
            </button>
          </div>
        </div>

        {/* Modal chọn ảnh */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 lg:pl-60">
            <div className="bg-white rounded-xl shadow-2xl w-11/12 lg:w-3/4 max-h-[85vh] flex flex-col">
              {/* Modal Header */}
              <div className="p-6 border-b flex items-center justify-between">
                <h2 className="text-2xl font-semibold text-gray-800">Quản lý Banner</h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <svg
                    className="w-6 h-6 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {/* Modal Body */}
              <div className="overflow-y-auto flex-1 p-6">
                {bannerImages.map((banner, index) => (
                  <div
                    key={banner.bannerId}
                    className="flex items-center gap-6 p-6 rounded-xl mb-4
                    bg-white shadow-lg hover:shadow-xl transition-all duration-300
                    border border-[#EAECF0]"
                  >

                    {/* Navigation Buttons */}
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => moveBanner(index, 'up')}
                        disabled={index === 0}
                        className={`p-2 rounded-full transition-all duration-200 ${index === 0
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                          }`}
                        title="Di chuyển lên"
                      >
                        <BsArrowUp className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => moveBanner(index, 'down')}
                        disabled={index === bannerImages.length - 1}
                        className={`p-2 rounded-full transition-all duration-200 ${index === bannerImages.length - 1
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                          }`}
                        title="Di chuyển xuống"
                      >
                        <BsArrowDown className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Banner Image */}
                    <div className="flex-1">
                      <img
                        src={banner.imageUrl}
                        alt={banner.title}
                        className="max-w-[450px] max-h-[250px] object-contain rounded-lg shadow-sm"
                      />
                    </div>

                    {/* Banner Controls */}
                    <div className="flex flex-col items-end gap-3">
                      <span className="text-sm font-medium text-gray-500">
                        Vị trí: {index + 1}
                      </span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={banner.isActive}
                          onChange={() => {
                            const newBanners = [...bannerImages];
                            newBanners[index] = { ...banner, isActive: !banner.isActive };
                            setBannerImages(newBanners);
                          }}
                        />
                        <div className="w-11 h-6 bg-gray-200 border border-[#E0E0E0] rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-[#E0E0E0] after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        <span className="ml-3 text-sm font-medium text-gray-600 whitespace-nowrap">
                          {banner.isActive ? 'Hiển thị' : 'Ẩn'}
                        </span>
                      </label>
                      {/* Thêm nút Delete cho banner có linkUrl không bắt đầu bằng '/' hoặc là null */}
                      {/* {(banner.linkUrl === null || !banner.linkUrl?.startsWith('/')) && (
                        <button
                          onClick={() => {
                            setBannerToDelete(banner.bannerId);
                            setIsDeleteModalOpen(true);
                          }}
                          className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm mt-2"
                        >
                          Xóa Banner
                        </button>
                      )} */}
                      <button
                        onClick={() => {
                          setBannerToDelete(banner.bannerId);
                          setIsDeleteModalOpen(true);
                        }}
                        className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm mt-2"
                      >
                        Xóa Banner
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Modal Footer */}
              <div className="p-6 border-t bg-gray-50 rounded-b-xl">
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Đóng
                  </button>
                  <button
                    onClick={handleSaveOrderAndStatus}
                    className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Lưu thay đổi
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Content and Right Banners */}
        <div className="flex">
          {/* Main Content Placeholder */}
          <div className="flex-1 pr-4">
            <div className="bg-slate-200 p-6 rounded-lg shadow h-full flex justify-center items-center">
              <h2 className="text-2xl font-bold mb-4">Nội Dung Chính</h2>
            </div>
          </div>

          {/* Update the right banners section */}
          <div className="w-72 flex flex-col space-y-4">
            {[
              { position: 1, aspectRatio: '2/1' },   // width = 2 × height
              { position: 2, aspectRatio: '2' },   // width = 1/2 × height
              { position: 3, aspectRatio: '1/1' },   // width = height
              { position: 4, aspectRatio: '3/2' },   // width = 2/3 × height (3/2 inverted)
            ].map(({ position, aspectRatio }) => {
              const banner = rightBanners[position - 1];
              const previewImage = previewImages[position];
              return (
                <div
                  key={position}
                  className="right-banner bg-gray-200 relative w-full"
                  style={{
                    aspectRatio: aspectRatio,
                  }}
                >
                  <img
                    src={previewImage || banner?.imageUrl || 'https://placehold.co/300x150/png?text=Empty+Banner'}
                    alt={`Right Banner ${position}`}
                    className="w-full h-full object-cover"
                  />
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    accept="image/*"
                    className="hidden"
                  />
                  <div className="absolute bottom-2 right-2 flex gap-2">
                    {previewImage && (
                      <button
                        onClick={() => {
                          // Remove preview image
                          setPreviewImages(prev => {
                            const newPreviews = { ...prev };
                            delete newPreviews[position];
                            return newPreviews;
                          });
                          // Remove from selected banners
                          const newSelectedBanners = [...selectedBanners];
                          newSelectedBanners[position - 1] = banner?.imageUrl || '';
                          setSelectedBanners(newSelectedBanners);
                        }}
                        className="bg-red-500 text-white px-2 py-1 rounded text-sm hover:bg-red-600"
                      >
                        Hủy
                      </button>
                    )}
                    <button
                      onClick={() => {
                        setActivePosition(position);
                        fileInputRef.current?.click();
                      }}
                      className="bg-blue-500 text-white px-2 py-1 rounded text-sm hover:bg-blue-600"
                    >
                      Chọn ảnh
                    </button>
                  </div>
                </div>
              );
            })}
            <button
              onClick={handleUploadBanners}
              disabled={isUploading}
              className={`${isUploading ? 'bg-green-400' : 'bg-green-500 hover:bg-green-600'
                } text-white px-4 py-2 rounded-lg mt-4`}
            >
              {isUploading ? 'Đang tải lên...' : 'Cập nhật Banner bên phải'}
            </button>
          </div>
        </div>
      </div>

      {isAddBannerModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 lg:pl-60">
          <div className="bg-white rounded-xl shadow-2xl w-11/12 max-w-2xl max-h-[85vh] flex flex-col">
            {/* Modal Header */}
            <div className="p-6 border-b flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-gray-800">Thêm Banner Mới</h2>
              <button
                onClick={() => setIsAddBannerModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <svg
                  className="w-6 h-6 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto flex-1">
              <div className="space-y-6">
                {/* Image Upload Section */}
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Ảnh Banner <span className="text-red-500">*</span>
                  </label>
                  <div className="flex flex-col items-center space-y-4">
                    {newBannerData.imageUrl ? (
                      <div className="relative group">
                        <img
                          src={newBannerData.imageUrl}
                          alt="Preview"
                          className="max-w-md max-h-48 object-contain rounded-lg shadow-sm"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                          <button
                            onClick={() => setNewBannerData(prev => ({ ...prev, imageUrl: null }))}
                            className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition-colors"
                          >
                            Xóa ảnh
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="w-full h-48 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center">
                        <svg
                          className="w-12 h-12 text-gray-400 mb-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                          />
                        </svg>
                        <span className="text-gray-500">Chưa có ảnh</span>
                      </div>
                    )}
                    <input
                      type="file"
                      onChange={handleNewBannerImageSelect}
                      accept="image/*"
                      className="hidden"
                      ref={topBannerFileInputRef}
                    />
                    <button
                      onClick={() => topBannerFileInputRef.current?.click()}
                      className={`px-4 py-2 rounded-lg transition-colors ${isUploadingTop
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-blue-500 hover:bg-blue-600 text-white'
                        }`}
                      disabled={isUploadingTop}
                    >
                      {isUploadingTop ? (
                        <div className="flex items-center space-x-2">
                          <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          <span>Đang tải lên...</span>
                        </div>
                      ) : 'Chọn ảnh'}
                    </button>
                  </div>
                </div>

                {/* Banner Information */}
                <div className="grid grid-cols-1 gap-6">
                  {/* Title */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tiêu đề
                    </label>
                    <input
                      type="text"
                      value={newBannerData.title || ''}
                      onChange={(e) => setNewBannerData(prev => ({
                        ...prev,
                        title: e.target.value
                      }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      placeholder="Nhập tiêu đề banner"
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mô tả
                    </label>
                    <textarea
                      value={newBannerData.description || ''}
                      onChange={(e) => setNewBannerData(prev => ({
                        ...prev,
                        description: e.target.value
                      }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
                      rows={4}
                      placeholder="Nhập mô tả cho banner"
                    />
                  </div>

                  {/* Link URL */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Link URL
                    </label>
                    <input
                      type="text"
                      value={newBannerData.linkUrl || ''}
                      onChange={(e) => setNewBannerData(prev => ({
                        ...prev,
                        linkUrl: e.target.value
                      }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      placeholder="https://example.com"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t bg-gray-50 rounded-b-xl">
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setIsAddBannerModalOpen(false)}
                  className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Hủy
                </button>
                <button
                  onClick={handleAddNewBanner}
                  disabled={!newBannerData.imageUrl || isUploadingTop}
                  className={`px-4 py-2 text-white rounded-lg transition-colors ${!newBannerData.imageUrl || isUploadingTop
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                >
                  Thêm Banner
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl w-11/12 max-w-md p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Xác nhận xóa</h2>
            <p className="text-gray-600 mb-6">Bạn có chắc chắn muốn xóa banner này không?</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                disabled={isDeletingButton}
                className={`px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg 
                  ${isDeletingButton ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'} 
                  transition-colors`}
              >
                Hủy
              </button>
              <button
                onClick={handleDeleteBanner}
                disabled={isDeletingButton}
                className={`px-4 py-2 text-white bg-red-600 rounded-lg 
                  ${isDeletingButton ? 'opacity-75 cursor-not-allowed' : 'hover:bg-red-700'} 
                  transition-colors flex items-center gap-2`}
              >
                {isDeletingButton ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                    <span>Đang xóa...</span>
                  </>
                ) : (
                  <span>Xóa</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default QuanLyBanner;
