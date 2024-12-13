import { useState, useCallback, useEffect } from "react";
import { Upload, X, Loader2 } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {Select, SelectTrigger, SelectValue, SelectContent, SelectItem,} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { AppDispatch, RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { getCategories } from "@/redux/thunks/categories";
import { getServiceByName } from "@/redux/thunks/service";
import { uploadImage } from "@/redux/thunks/uploadImage";
import { createAdvertisement, Media } from "@/redux/thunks/postAdvertisement";
import { jwtDecode } from "jwt-decode";
import { validateForm } from "@/utils/formValidationRegisterAdver";
import { useNavigate } from 'react-router-dom';
import { District } from "@/types/District";
import { DecodedToken } from "@/types/DecodedToken";

interface FileWithPreview extends File {
  preview: string;
}

export default function ServiceRegistrationForm() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string>("");
  const [selectedOption, setSelectedOption] = useState<string>("contact");
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded: DecodedToken = jwtDecode<DecodedToken>(token);
        setUserId(decoded.userId);
      } catch (error) {
        console.error("Token không hợp lệ:", error);
      }
    } else {
      console.log("Không tìm thấy token");
    }
  }, []);
  const dispatch: AppDispatch = useDispatch();
  const categories = useSelector((state: RootState) => state.categories.items);
  const service1 = useSelector((state: RootState) => state.service.service);

  const [districts, setDistricts] = useState<District[]>([]);
  const [selectedDistrict, setSelectedDistrict] = useState<string>("");
  const [wards, setWards] = useState<string[]>([]);
  const [banner, setBanner] = useState<FileWithPreview[]>([]);
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [operatingHours, setOperatingHours] = useState("24h");
  const [timeFrom, setTimeFrom] = useState("00:00"); // Thời gian bắt đầu mặc định cho 24h
  const [timeTo, setTimeTo] = useState("23:59");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedService, setSelectedService] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false); // Add this state
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [selectedWard, setSelectedWard] = useState<string>("");
  
  const handleServiceChange = (serviceId: number) => {
    console.log("Service ID:", selectedService);
    setSelectedService(serviceId);
  };
  useEffect(() => {
    dispatch(getCategories());
  }, [dispatch]);
  useEffect(() => {
    if (selectedCategory) {
      dispatch(getServiceByName(selectedCategory));
    }
  }, [dispatch, selectedCategory]);
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  useEffect(() => {
    const fetchDistricts = async () => {
      const response = await fetch("/data/AddressHCM.json");
      const data: District[] = await response.json();
      setDistricts(data);
    };
    fetchDistricts();
  }, []);

  const onDropBanner = useCallback((acceptedFiles: File[]) => {
    // Only use the first file if multiple files are dropped
    const newBanner = acceptedFiles[0];
    if (newBanner) {
      setBanner([
        Object.assign(newBanner, {
          preview: URL.createObjectURL(newBanner),
        }),
      ]);
    }
  }, []);

  const onDropImages = useCallback((acceptedFiles: File[]) => {
    setFiles((prevFiles) => [
      ...prevFiles,
      ...acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      ),
    ]);
  }, []);

  const {
    getRootProps: getBannerRootProps,
    getInputProps: getBannerInputProps,
    isDragActive: isBannerDragActive,
  } = useDropzone({
    onDrop: onDropBanner,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png"],
    }
    // ,
    // maxSize: 50 * 1024 * 1024, // 50MB
  });

  const {
    getRootProps: getImagesRootProps,
    getInputProps: getImagesInputProps,
    isDragActive: isImagesDragActive,
  } = useDropzone({
    onDrop: onDropImages,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png"],
    }
    // ,
    // maxSize: 50 * 1024 * 1024, // 50MB
  });

  const removeFile = (file: FileWithPreview) => {
    setFiles((prevFiles) => prevFiles.filter((f) => f !== file));
    URL.revokeObjectURL(file.preview);
  };

  const removeBanner = () => {
    setBanner([]);
  };

  const handleDistrictChange = (district: string) => {
    setSelectedDistrict(district);
    const selectedDistrictData = districts.find((d) => d.district === district);
    setWards(selectedDistrictData ? selectedDistrictData.wards : []);
  };

  const handleWardChange = (ward: string) => {
    setSelectedWard(ward);
  };

  const handleSubmit = async () => {
    const formData = {
      facebookLink: null,
      zaloLink: null,
      selectedCategory,
      selectedService,
      advertisementName: (document.getElementById("advertisement-name") as HTMLInputElement).value,
      selectedDistrict,
      selectedWard, // Use the state value instead of getting from HTML element
      address: (document.getElementById("address") as HTMLInputElement).value,
      phone: (document.getElementById("phone") as HTMLInputElement).value,
      // email: (document.getElementById("email") as HTMLInputElement).value,
      priceFrom: (document.getElementById("price-from") as HTMLInputElement).value,
      priceTo: (document.getElementById("price-to") as HTMLInputElement).value,
      description: (document.getElementById("description") as HTMLTextAreaElement).value,
      
    };

    const errors = validateForm(formData);
    setFormErrors(errors);

    if (Object.keys(errors).length > 0) {
      alert("Vui lòng điền đầy đủ thông tin bắt buộc.");
      return;
    }

    // if(banner.length < 1) {
    //   alert("Bạn cần đăng tải 1 banner");
    //   return;
    // }
    if (files.length < 3) {
      alert("Bạn cần đăng tải ít nhất 3 hình ảnh");
      return;
    }

    setIsLoading(true);
    // Upload hình ảnh trước
    const imageFormData = new FormData();
    banner.forEach((file) => {
      imageFormData.append("files", file);
    });
    files.forEach((file) => {
      imageFormData.append("files", file);
    });

    try {
      const uploadedUrl = await dispatch(uploadImage(imageFormData)).unwrap();
      const parsedUrl = JSON.parse(uploadedUrl);
    //   const mediaList: Media[] = parsedUrl.map((url: string, index: number) => {
    //     if(selectedOption === "contact") {
    //       return {
    //         name: "Hình ảnh",
    //         content: "Media content description",
    //         url: url,
    //         type:"IMAGE"
    //       };
    //     } 
    //     return {
    //       name: "Hình ảnh",
    //       content: "Media content description",
    //       url: url,
    //       type:index==0 ? "BANNER" : "IMAGE"
    // };
    //   }
    //   );
      const mediaList: Media[] = selectedOption === "contact"
      ? [
          {
            name: "Banner hình ảnh",
            content: "Banner mô tả",
            url: "https://vending-cdn.kootoro.com/torov-cms/upload/image/1669358914523-kh%C3%A1i%20ni%E1%BB%87m%20qu%E1%BA%A3ng%20c%C3%A1o%20banner%20tr%C3%AAn%20website.jpg",
            type: "BANNER",
          },
          ...parsedUrl.map((url: string) => ({
            name: "Hình ảnh",
            content: "Media content description",
            url: url,
            type: "IMAGE",
          })),
        ]
      : parsedUrl.map((url: string, index: number) => ({
          name: "Hình ảnh",
          content: "Media content description",
          url: url,
          type: index === 0 ? "BANNER" : "IMAGE",
        }));
    
      // Lấy giá trị từ các trường nhập liệu
      const advertisementName = (document.getElementById("advertisement-name") as HTMLInputElement).value;
      const address = (document.getElementById("address") as HTMLInputElement).value;
      const phoneNumber = (document.getElementById("phone") as HTMLInputElement).value;
      const priceRangeLow = (document.getElementById("price-from") as HTMLInputElement).value;
      const priceRangeHigh = (document.getElementById("price-to") as HTMLInputElement).value;
      const description = (document.getElementById("description") as HTMLInputElement).value;
      // Tạo đối tượng chứa dữ liệu của form
      const advertisementData = {
        mainAdvertisementName: advertisementName,
        serviceId: selectedService || 5,
        advertiserId: userId,
        // adminId: "11d53643-69e6-4b75-955a-fdf62444c719",
        adminId: userId,
        adStartDate: new Date().toISOString(),
        adEndDate: new Date(new Date().setMonth(new Date().getMonth() + 6)).toISOString(),
        reviewNotes: "",
        description: "Mô tả",
        detailedDescription: description,
        address: address,
        phoneNumber: phoneNumber,
        priceRangeLow: priceRangeLow,
        priceRangeHigh: priceRangeHigh,
        openingHourStart: timeFrom,
        openingHourEnd: timeTo,
        googleMapLink: "",
        websiteLink: "",
        adStatus: "Pending",
        mediaList: mediaList,
        deliveryAvailable: true,
        facebookLink: "null",
        zaloLink: "null",
      };
      // Gọi dispatch để đăng quảng cáo
      await dispatch(createAdvertisement(advertisementData)).unwrap();
      navigate('/advertisement-success')
    } catch (error) {
      console.error("Upload hoặc đăng quảng cáo thất bại:", error);
      alert("Đăng quảng cáo thất bại. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredCategories = categories.slice(1, categories.length - 1);
  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-secondary-color">Đăng ký dịch vụ của bạn</h1>

      <div>
      {/* Combobox lựa chọn tải banner hoặc liên lạc với admin */}
      <div className="mb-6">
        <Label htmlFor="banner-option" className="block mb-2">
          1. Chọn phương thức upload banner
        </Label>
        <select
          id="banner-option"
          value={selectedOption}
          onChange={(e) => setSelectedOption(e.target.value)}
          className="w-full px-4 py-2 border rounded-md"
        >
          <option value="contact">Thiết kế banner miễn phí</option>
          <option value="upload">Đăng tải Banner</option>
        </select>
      </div>

      {/* Hiển thị form tải banner nếu người dùng chọn "Tự tải banner" */}
      {selectedOption === "upload" && (
        <div className="mb-6">
          <Label htmlFor="banner-upload" className="block mb-2">
            Đăng tải 1 banner để dịch vụ của bạn được quảng cáo nổi bật hơn
          </Label>
          <div
            {...getBannerRootProps()}
            className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer"
          >
            <input {...getBannerInputProps()} />
            {isBannerDragActive ? (
              <p className="text-gray-500">Thả tệp vào đây...</p>
            ) : (
              <div>
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-sm text-gray-500">Kéo và thả hoặc</p>
                <Button className="mt-2 bg-green-500 hover:bg-green-600 text-white">
                  Upload banner
                </Button>
                <p className="mt-1 text-xs text-gray-500">
                  jpg/jpeg, png tối đa 50MB mỗi file
                </p>
              </div>
            )}
          </div>
        </div>
      )}
     

      {/* Hiển thị banner đã tải lên */}
      {banner.length > 0 && (
        <div className="mt-4 grid grid-cols-1 gap-4 mb-6">
          {banner.map((bannerFile) => (
            <div key={bannerFile.name} className="relative">
              {bannerFile.type.startsWith("image/") ? (
                <img src={URL.createObjectURL(bannerFile)} alt={bannerFile.name} className="w-full h-40 object-cover rounded-lg" />
              ) : (
                <video
                  src={URL.createObjectURL(bannerFile)}
                  className="w-full h-40 object-cover rounded-lg"
                />
              )}
              <button
                onClick={() => removeBanner()}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
              >
                <X className="h-4 w-4" />
              </button>
              <p className="mt-1 text-xs text-center truncate">
                {bannerFile.name}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>

      {/* Phần tải lên hình ảnh khác */}
      <div className="mdivb-6">
        <Label htmlFor="image-upload" className="block mb-2"> 2. Đăng tải ít nhất 3 hình ảnh về dịch vụ của bạn </Label>
        <div
          {...getImagesRootProps()}
          className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer"
        >
          <input {...getImagesInputProps()} />
          {isImagesDragActive ? (
            <p className="text-gray-500">Thả tệp vào đây...</p>
          ) : (
            <div>
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-sm text-gray-500">Kéo và thả hoặc</p>
              <Button className="mt-2 bg-green-500 hover:bg-green-600 text-white"> Upload hình ảnh</Button>
              <p className="mt-1 text-xs text-gray-500"> jpg/jpeg, png tối đa 50MB mỗi file </p>
            </div>
          )}
        </div>
      </div>

      {/* Hiển thị hình ảnh đã tải lên */}
      {files.length > 0 && (
        <div className="mt-4 grid grid-cols-2 gap-4 mb-6">
          {files.map((file) => (
            <div key={file.name} className="relative">
              {file.type.startsWith("image/") ? (
                <img src={file.preview} alt={file.name} className="w-full h-40 object-cover rounded-lg"/>
              ) : (
                <video src={file.preview} className="w-full h-40 object-cover rounded-lg" />
              )}
              <button onClick={() => removeFile(file)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1">
                <X className="h-4 w-4" />
              </button>
              <p className="mt-1 text-xs text-center truncate">{file.name}</p>
            </div>
          ))}
        </div>
      )}
      <div className="space-y-4">
        <div className="flex justify-between sm:block">
          <div>
            <Label htmlFor="service-type">Loại dịch vụ?</Label>
            <Select onValueChange={handleCategoryChange}>
              <SelectTrigger> <SelectValue placeholder="Vui lòng chọn" /> </SelectTrigger>
              <SelectContent
              >
                {filteredCategories.map((item) => (
                  <SelectItem key={item.categoryNameNoDiacritics} value={item.categoryNameNoDiacritics}> {item.categoryName}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {formErrors.category && <p className="text-red-500 text-sm mt-1">{formErrors.category}</p>}
          </div>
          <div>
            <Label htmlFor="service">Dịch vụ?</Label>
            <Select
              onValueChange={(value) => {
                const id = Number(value);
                handleServiceChange(id);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Vui lòng chọn" />
              </SelectTrigger>
              <SelectContent>
                {service1.map(
                  (item) => item.serviceName && ( <SelectItem key={item.serviceId} value={item.serviceId.toString()}> {item.serviceName} </SelectItem> )
                )}
              </SelectContent>
            </Select>
            {formErrors.service && <p className="text-red-500 text-sm mt-1">{formErrors.service}</p>}
          </div>
        </div>

        <div>
          <Label htmlFor="advertisement-name"> Tên cửa hàng, dịch vụ của bạn? </Label>
          <Input id="advertisement-name" placeholder="Ví dụ: Sân bóng Minigood" />
          {formErrors.advertisementName && <p className="text-red-500 text-sm mt-1">{formErrors.advertisementName}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="district"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Quận, huyện
            </label>
            <Select onValueChange={handleDistrictChange}>
              <SelectTrigger id="district">
                <SelectValue placeholder="Chọn quận, huyện" />
              </SelectTrigger>
              <SelectContent>
                {districts.map(({ district }) => (
                  <SelectItem key={district} value={district}>
                    {district}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {formErrors.district && <p className="text-red-500 text-sm mt-1">{formErrors.district}</p>}
          </div>

          <div>
            <label htmlFor="ward" className="block mb-2 text-sm font-medium text-gray-900"> Phường </label>
            <Select onValueChange={handleWardChange} disabled={!selectedDistrict}>
              <SelectTrigger id="ward"> <SelectValue placeholder="Chọn phường" /> </SelectTrigger>
              <SelectContent>
                {wards.map((ward) => (
                  <SelectItem key={ward} value={ward}> {ward} </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {formErrors.ward && <p className="text-red-500 text-sm mt-1">{formErrors.ward}</p>}
          </div>
        </div>

        <div>
          <Label htmlFor="address">Địa chỉ</Label>
          <Input id="address" placeholder="Ví dụ: 18 Nguyễn Văn Bảo" />
          {formErrors.address && <p className="text-red-500 text-sm mt-1">{formErrors.address}</p>}
        </div>

        <div>
          <Label htmlFor="landmark"> Ghi chú <span className="font-thin">(có thể bỏ trống)</span> </Label>
          <Input id="landmark" placeholder="Ví dụ: đối diện Bách hóa xanh" />
        </div>

        {/* <div className="grid grid-cols-2 gap-4"> */}
        <div>
          <div>
            <Label htmlFor="phone">Số điện thoại</Label>
            <Input id="phone" type="tel" />
            {formErrors.phone && <p className="text-red-500 text-sm mt-1">{formErrors.phone}</p>}
          </div>
          {/* <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" />
            {formErrors.email && <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>}
          </div> */}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="price-from">Mức giá từ</Label>
            <Input id="price-from" placeholder="Ví dụ: 30000" />
            {formErrors.priceFrom && <p className="text-red-500 text-sm mt-1">{formErrors.priceFrom}</p>}
          </div>
          <div>
            <Label htmlFor="price-to">Đến</Label>
            <Input id="price-to" placeholder="Ví dụ: 900000" />
            {formErrors.priceTo && <p className="text-red-500 text-sm mt-1">{formErrors.priceTo}</p>}
          </div>
        </div>

        <div>
          <Label className="mb-4">Giờ hoạt động</Label>
          <RadioGroup value={operatingHours} onValueChange={setOperatingHours}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="24h" id="24h" />
              <Label htmlFor="24h" className="font-normal"> Hoạt động 24/24 </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="custom" id="custom" />
              <Label htmlFor="custom" className="font-normal"> Chọn giờ hoạt động </Label>
            </div>
          </RadioGroup>
          {operatingHours === "custom" && (
            <div className="flex flex-row space-x-4 mt-4">
              <div className="flex flex-col">
                <Label htmlFor="time-from">Từ:</Label>
                <Input
                  id="time-from"
                  type="time"
                  className="mt-1"
                  value={timeFrom}
                  onChange={(e) => setTimeFrom(e.target.value)} // Cập nhật thời gian bắt đầu
                />
              </div>
              <div className="flex flex-col">
                <Label htmlFor="time-to">Đến:</Label>
                <Input
                  id="time-to"
                  type="time"
                  className="mt-1"
                  value={timeTo}
                  onChange={(e) => setTimeTo(e.target.value)} // Cập nhật thời gian kết thúc
                />
              </div>
            </div>
          )}
        </div>

        <div>
          <Label htmlFor="description">Giới thiệu dịch vụ của bạn</Label>
          <Textarea id="description" placeholder="Nhập giới thiệu..." rows={4} />
          {formErrors.description && <p className="text-red-500 text-sm mt-1">{formErrors.description}</p>}
        </div>

        <Button className="w-full bg-green-500 hover:bg-green-600 text-white" onClick={handleSubmit} disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Đang xử lý...
            </>
          ) : (
            "Đăng ký quảng cáo"
          )}
        </Button>
        <div className="mt-4 p-4 bg-rose-100 border-l-4 border-rose-500 text-rose-700 rounded-lg">
          <p className="text-center font-semibold">
            Nếu thấy khó khăn khi điền form, hãy gởi thông tin trực tiếp qua Zalo: 
            <a href="https://zalo.me/0909260517" target="_blank" className="text-rose-600 underline"> 0909260517</a>
          </p>
        </div>
      </div>
    </div>
  );
}
