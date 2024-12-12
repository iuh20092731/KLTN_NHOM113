import React, { useEffect, useState } from 'react';
import DatePickerOne from '../Forms/DatePicker/DatePickerOne';
import SelectGroupTwo from '../Forms/SelectGroup/SelectGroupTwo';
import { useAppSelector, useAppDispatch } from '../../hooks/reduxHooks';
import { RootState } from '../../redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { Button, message, Space, Tooltip } from 'antd';
import Breadcrumb from '../Breadcrumbs/Breadcrumb';
import AdvertiserSearchModal from '../AdvertiserSearchModal';
import { getCategories } from '../../redux/thunks/categories';
import { AppDispatch } from '../../redux/store';
import { Category } from '../../interfaces/Category';
import { Service } from '../../interfaces/Service';
import { getServiceByName } from '../../redux/thunks/service';
import { createAdvertisement, uploadMedia } from '../../services/advertisementService';
import { uploadOneImage } from '../../redux/thunks/cloudDinary';
import LoadingProgress from '../LoadingProgress/LoadingProgress';
import { useNavigate } from 'react-router-dom';
import { handleAuthError } from '../../utils/auth';

interface OpeningHour {
    hour: number;
    minute: number;
    second: number;
    nano: number;
}

interface Media {
    name: string;
    content: string;
    url: string;
    type: 'BANNER' | 'VIDEO' | 'IMAGE';
    preview?: string;
    file?: File;
}

interface Advertisement {
    mainAdvertisementName: string;
    serviceId: number;
    advertiserId: string;
    adminId: string;
    adStartDate: Date;
    adEndDate: Date;
    reviewNotes: string;
    description: string;
    detailedDescription: string;
    customDescriptions: string[];
    address: string;
    phoneNumber: string;
    priceRangeLow: string;
    priceRangeHigh: string;
    openingHourStart: OpeningHour;
    openingHourEnd: OpeningHour;
    googleMapLink: string;
    websiteLink: string;
    adStatus: 'Active' | 'Inactive';
    mediaList: Media[];
    deliveryAvailable: boolean;
    zaloLink: string;
    facebookLink: string;
}

const AdvertisementForm: React.FC = () => {
    const dispatch: AppDispatch = useDispatch();
    const token = useSelector((state: RootState) => state.user.token);
    const user = useSelector((state: RootState) => state.user.user);
    const [isLoading, setIsLoading] = useState(true);

    // Move all state declarations to the top
    const [selectedCategory, setSelectedCategory] = useState<string>("");
    const [categories, setCategories] = useState<Category[]>([]);
    const [services, setServices] = useState<Service[]>([]);
    const [messageApi, contextHolder] = message.useMessage();
    const [showAdvertiserModal, setShowAdvertiserModal] = useState(false);
    const [priceRangeError, setPriceRangeError] = useState<string>('');
    const [serviceError, setServiceError] = useState<string>('');
    const [showCustomDescriptions, setShowCustomDescriptions] = useState(false);
    const [errors, setErrors] = useState({
        mainAdvertisementName: '',
        category: '',
        advertiserId: '',
        serviceId: '',
        address: ''
    });

    const [advertisement, setAdvertisement] = useState<Advertisement>({
        mainAdvertisementName: '',
        serviceId: 5,
        advertiserId: '',
        adminId: '',
        adStartDate: new Date(),
        adEndDate: new Date(),
        reviewNotes: '',
        description: '',
        detailedDescription: '',
        customDescriptions: [''],
        address: '',
        phoneNumber: '',
        priceRangeLow: '',
        priceRangeHigh: '',
        openingHourStart: { hour: 0, minute: 0, second: 0, nano: 0 },
        openingHourEnd: { hour: 0, minute: 0, second: 0, nano: 0 },
        googleMapLink: '',
        websiteLink: '',
        adStatus: 'Inactive',
        mediaList: [
            { name: '', content: '', url: '', type: 'BANNER', preview: undefined },
            { name: '', content: '', url: '', type: 'IMAGE', preview: undefined }
        ],
        deliveryAvailable: true,
        zaloLink: '',
        facebookLink: '',
    });

    // Thêm state mới để lu tên advertiser
    const [advertiserFullName, setAdvertiserFullName] = useState<string>('');

    // Thêm state để lưu adminId
    const [adminId, setAdminId] = useState('');
    const [adminFullName, setAdminFullName] = useState('');

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [showProgress, setShowProgress] = useState(false);

    const navigate = useNavigate();

    // Now we can use useEffect
    useEffect(() => {
        if (user) {
            console.log('Setting adminId from user:', user.userId);
            setAdvertisement(prev => ({
                ...prev,
                adminId: user.userId
            }));
            setAdminFullName(`${user.firstName} ${user.lastName}` || user.fullName || user.username || 'Unknown Admin');
            setIsLoading(false);
        }
    }, [user]);

    useEffect(() => {
        dispatch(getCategories()).then((data) => {
            return setCategories(data.payload as Category[]);
        });
    }, [dispatch]);

    //Lấy service theo category
    useEffect(() => {
        if (selectedCategory) {
            dispatch(getServiceByName(selectedCategory)).then((data) => {
                setServices(data.payload as Service[]);
            });
        }
    }, [dispatch, selectedCategory]);

    // Add cleanup function for preview URLs
    useEffect(() => {
        return () => {
            // Cleanup preview URLs when component unmounts
            advertisement.mediaList.forEach(media => {
                if (media.preview) {
                    URL.revokeObjectURL(media.preview);
                }
            });
        };
    }, []);

    // Show loading state or redirect if no user
    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!user) {
        return <div>Please log in to continue</div>;
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setAdvertisement(prev => ({ ...prev, [name]: value }));
    };

    // Update handleNumberChange function
    const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setAdvertisement(prev => ({ ...prev, [name]: value }));

        // Validate price range
        if (name === 'priceRangeLow' || name === 'priceRangeHigh') {
            const low = name === 'priceRangeLow' ? Number(value) : Number(advertisement.priceRangeLow);
            const high = name === 'priceRangeHigh' ? Number(value) : Number(advertisement.priceRangeHigh);

            if (high && low && high <= low) {
                setPriceRangeError('Giá cao nhất phải lớn hơn giá thấp nhất');
            } else {
                setPriceRangeError('');
            }
        }
    };

    const handleTimeChange = (field: 'openingHourStart' | 'openingHourEnd', e: React.ChangeEvent<HTMLInputElement>) => {
        const [hours, minutes] = e.target.value.split(':').map(Number);
        setAdvertisement(prev => ({
            ...prev,
            [field]: { ...prev[field], hour: hours, minute: minutes },
        }));
    };

    const handleMediaChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        const updatedMediaList = [...advertisement.mediaList];
        updatedMediaList[index] = { ...updatedMediaList[index], [name]: value };
        setAdvertisement(prev => ({ ...prev, mediaList: updatedMediaList }));
    };

    const addMedia = () => {
        setAdvertisement(prev => ({
            ...prev,
            mediaList: [...prev.mediaList, { name: '', content: '', url: '', type: 'IMAGE', preview: undefined }],
        }));
    };

    // Add new function to handle file selection
    const handleFileSelect = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Create preview URL
            const previewUrl = URL.createObjectURL(file);
            
            // Update media list with file and preview
            const updatedMediaList = [...advertisement.mediaList];
            updatedMediaList[index] = {
                ...updatedMediaList[index],
                name: file.name,
                content: '',
                url: '',
                preview: previewUrl,
                file: file
            };
            
            setAdvertisement(prev => ({
                ...prev,
                mediaList: updatedMediaList
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        setShowProgress(true);
        setUploadProgress(0);
        
        try {
            // Kiểm tra user đã đăng nhập
            if (!user || !token) {
                messageApi.error({
                    content: 'Vui lòng đăng nhập để thực hiện chức năng này',
                    key: 'createAd',
                    duration: 3
                });
                return;
            }

            // Reset errors
            setErrors({
                mainAdvertisementName: '',
                category: '',
                advertiserId: '',
                serviceId: '',
                address: ''
            });

            // Validate required fields
            let hasErrors = false;
            const newErrors = { ...errors };

            if (!advertisement.mainAdvertisementName.trim()) {
                newErrors.mainAdvertisementName = 'Tên Quảng Cáo là bắt buộc';
                hasErrors = true;
            }

            if (!selectedCategory) {
                newErrors.category = 'Danh Mục là bắt buộc';
                hasErrors = true;
            }

            if (!advertisement.advertiserId) {
                newErrors.advertiserId = 'Nhà Quảng Cáo ID là bắt buộc';
                hasErrors = true;
            }

            if (!advertisement.serviceId) {
                newErrors.serviceId = 'Dịch Vụ là bắt buộc';
                hasErrors = true;
            }

            if (!advertisement.address.trim()) {
                newErrors.address = 'Địa Chỉ là bắt buộc';
                hasErrors = true;
            }

            if (hasErrors) {
                setErrors(newErrors);
                messageApi.error('Vui lòng điền đầy đủ các trường bắt buộc');
                setIsSubmitting(false);
                return;
            }

            // Upload all media files first
            const totalFiles = advertisement.mediaList.filter(m => m.file).length;
            let completedFiles = 0;

            const updatedMediaList = await Promise.all(
                advertisement.mediaList.map(async (media, index) => {
                    if (media.file) {
                        try {
                            const formData = new FormData();
                            formData.append('file', media.file);
                            
                            const uploadResult = await dispatch(uploadOneImage({
                                formData,
                                onProgress: (progress) => {
                                    setUploadProgress(progress);
                                }
                            })).unwrap();
                            
                            if (uploadResult === 'AUTH_ERROR') {
                                throw new Error('AUTH_ERROR');
                            }

                            completedFiles++;
                            setUploadProgress(Math.round((completedFiles / totalFiles) * 100));

                            return {
                                name: media.name,
                                content: uploadResult,
                                url: uploadResult,
                                type: media.type
                            };
                        } catch (error) {
                            if (error.message === 'AUTH_ERROR') {
                                throw error;
                            }
                            console.error('Error uploading media:', error);
                            throw new Error(`Failed to upload ${media.name}`);
                        }
                    }
                    return media;
                })
            );

            // Update advertisement data with uploaded media URLs and ensure adminId is set
            const adData = {
                ...advertisement,
                mediaList: updatedMediaList.filter(media => media !== null),
                adminId: user.userId
            };

            console.log('Submitting advertisement data:', adData);

            // Call API to create advertisement
            const response = await createAdvertisement(adData);

            messageApi.success({
                content: 'Advertisement created successfully!',
                key: 'createAd',
                duration: 3
            });

            // Reset form after successful submission
            setAdvertisement({
                mainAdvertisementName: '',
                serviceId: 5,
                advertiserId: '',
                adminId: '',
                adStartDate: new Date(),
                adEndDate: new Date(),
                reviewNotes: '',
                description: '',
                detailedDescription: '',
                customDescriptions: [''],
                address: '',
                phoneNumber: '',
                priceRangeLow: '',
                priceRangeHigh: '',
                openingHourStart: { hour: 0, minute: 0, second: 0, nano: 0 },
                openingHourEnd: { hour: 0, minute: 0, second: 0, nano: 0 },
                googleMapLink: '',
                websiteLink: '',
                adStatus: 'Inactive',
                mediaList: [
                    { name: '', content: '', url: '', type: 'BANNER', preview: undefined },
                    { name: '', content: '', url: '', type: 'IMAGE', preview: undefined }
                ],
                deliveryAvailable: true,
                zaloLink: '',
                facebookLink: '',
            });

            // Reset other states
            setSelectedCategory("");
            setAdvertiserFullName('');
            setShowCustomDescriptions(false);
            setPriceRangeError('');
            setServiceError('');
            setErrors({
                mainAdvertisementName: '',
                category: '',
                advertiserId: '',
                serviceId: '',
                address: ''
            });

            // Sử dụng nhiều cách scroll để đảm bảo hoạt động trên mọi trình duyệt
            // Cách 1: scrollIntoView
            document.getElementById('form-header')?.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
            
            // Cách 2: setTimeout với scrollTo
            setTimeout(() => {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            }, 100);

            // Cách 3: Scroll legacy (phòng trường hợp 2 cách trên không hoạt động)
            setTimeout(() => {
                document.body.scrollTop = 0; // For Safari
                document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
            }, 200);

        } catch (error: any) {
            if (error.message === 'AUTH_ERROR') {
                handleAuthError(error, navigate);
            } else {
                messageApi.error({
                    content: error.message || 'Failed to create advertisement. Please try again.',
                    key: 'createAd',
                    duration: 4
                });
            }
            console.error('Error creating advertisement:', error);
        } finally {
            setIsSubmitting(false);
            setShowProgress(false);
        }
    };

    // Update the service select handler
    const handleServiceSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        if (!selectedCategory) {
            setServiceError('Vui lòng chọn danh mục trước');
            return;
        }
        setServiceError('');
        setAdvertisement(prev => ({ ...prev, serviceId: Number(e.target.value) }));
    };

    // Update the common input class to include the border styling
    const commonInputClass = "border-[1.5px] border-slate-400 w-full rounded-md p-2.5 bg-white shadow-sm hover:shadow focus:shadow-md outline-none transition-all duration-300";

    const handleCustomDescriptionChange = (index: number, value: string) => {
        const newCustomDescriptions = [...advertisement.customDescriptions];
        newCustomDescriptions[index] = value;
        setAdvertisement(prev => ({
            ...prev,
            customDescriptions: newCustomDescriptions,
            detailedDescription: newCustomDescriptions.join('$')  // Thay đổi từ '\n\n' thành '$'
        }));
    };

    const addCustomDescription = () => {
        setAdvertisement(prev => ({
            ...prev,
            customDescriptions: [...prev.customDescriptions, '']
        }));
    };

    const removeCustomDescription = (index: number) => {
        const newCustomDescriptions = advertisement.customDescriptions.filter((_, i) => i !== index);
        setAdvertisement(prev => ({
            ...prev,
            customDescriptions: newCustomDescriptions,
            detailedDescription: newCustomDescriptions.join('$')  // Thay đổi từ '\n\n' thành '$'
        }));
    };

    const removeMedia = (index: number) => {
        const updatedMediaList = advertisement.mediaList.filter((_, i) => i !== index);
        setAdvertisement(prev => ({
            ...prev,
            mediaList: updatedMediaList
        }));
    };

    return (
        <>  
            <div className="md:px-4" id="form-header"></div>
            {contextHolder}
            <Breadcrumb pageName="Form tạo mới quảng cáo" />

            <form id="" onSubmit={handleSubmit} className="space-y-6 md:p-8 p-4 bg-white rounded-xl shadow-xl">
                <div className="grid grid-cols-1 md:grid-cols-2 md:gap-8 gap-4">
                    <div className="bg-gray-50/50 md:p-5 p-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-[#EAECF0]">
                        <label className="block mb-2 text-gray-700 font-medium">
                            Tên Quảng Cáo <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="mainAdvertisementName"
                            value={advertisement.mainAdvertisementName}
                            onChange={handleChange}
                            className={`border-[1.5px] border-slate-400 w-full rounded-md p-2.5 bg-white shadow-sm hover:shadow focus:shadow-md outline-none transition-all duration-300 ${
                                errors.mainAdvertisementName ? 'ring-2 ring-red-500' : 'focus:ring-2 focus:ring-blue-300'
                            }`}
                        />
                        {errors.mainAdvertisementName && (
                            <p className="text-red-500 text-sm mt-1">{errors.mainAdvertisementName}</p>
                        )}
                    </div>

                    <div className="bg-gray-50/50 md:p-5 p-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-[#EAECF0]">
                        <label className="block mb-2 text-gray-700 font-medium">
                            Admin
                        </label>
                        <input
                            type="text"
                            value={adminFullName}
                            className={commonInputClass}
                            readOnly
                            disabled
                        />
                    </div>

                    <div className="bg-gray-50/50 md:p-5 p-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-[#EAECF0]">
                        <label className="block mb-2 text-gray-700 font-medium">
                            Danh Mục <span className="text-red-500">*</span>
                        </label>
                        <select
                            name="categoryId"
                            value={selectedCategory}
                            onChange={(e) => {
                                const selectedCategoryNoDiacritics = e.target.value;
                                setSelectedCategory(selectedCategoryNoDiacritics);
                                setAdvertisement(prev => ({ ...prev, categoryId: selectedCategoryNoDiacritics }));
                                setErrors(prev => ({ ...prev, category: '' }));
                            }}
                            className={`border-[1.5px] border-slate-400 w-full rounded-md p-2.5 bg-white shadow-sm hover:shadow focus:shadow-md outline-none transition-all duration-300 ${
                                errors.category ? 'ring-2 ring-red-500' : 'focus:ring-2 focus:ring-blue-300'
                            }`}
                        >
                            <option value="">Chọn danh mục</option>
                            {categories.map((category) => (
                                <option key={category.categoryNameNoDiacritics} value={category.categoryNameNoDiacritics}>
                                    {category.categoryName}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="bg-gray-50/50 md:p-5 p-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-[#EAECF0]">
                        <label className="block mb-2 text-gray-700 font-medium">
                            Nhà Quảng Cáo <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={advertiserFullName}  // Hiển thị tên thay vì ID
                            onChange={handleChange}
                            className="border-[1.5px] border-slate-400 w-full rounded-md p-2.5 bg-white shadow-sm hover:shadow focus:shadow-md outline-none transition-all duration-300"
                            onClick={() => setShowAdvertiserModal(true)}
                            placeholder="Nhấp để chọn nhà quảng cáo"
                            readOnly
                        />
                        {showAdvertiserModal && (
                            <AdvertiserSearchModal
                                isOpen={showAdvertiserModal}
                                onClose={() => setShowAdvertiserModal(false)}
                                onSelectAdvertiser={(selectedAdvertiser: { advertiserId: string, fullName: string }) => {
                                    setAdvertisement(prev => ({ ...prev, advertiserId: selectedAdvertiser.advertiserId }));
                                    setAdvertiserFullName(selectedAdvertiser.fullName);  // Lưu tên đầy ủ
                                    setShowAdvertiserModal(false);
                                }}
                            />
                        )}
                    </div>

                    <div className="bg-gray-50/50 md:p-5 p-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-[#EAECF0]">
                        <label className="block mb-2 text-gray-700 font-medium">
                            Dịch Vụ <span className="text-red-500">*</span>
                        </label>
                        <Tooltip title={!selectedCategory ? "Vui lòng chọn danh mục trước" : ""} placement="top">
                            <div>
                                <select
                                    name="serviceId"
                                    value={advertisement.serviceId}
                                    onChange={handleServiceSelect}
                                    className={`${commonInputClass} ${
                                        !selectedCategory ? 'bg-gray-100 cursor-not-allowed' : ''
                                    } ${errors.serviceId ? 'ring-2 ring-red-500' : 'focus:ring-2 focus:ring-blue-300'}`}
                                    disabled={!selectedCategory}
                                >
                                    <option value="">Chọn dịch vụ</option>
                                    {services.map((service) => (
                                        <option key={service.serviceId} value={service.serviceId}>
                                            {service.serviceName}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </Tooltip>
                    </div>

                    <div className="bg-gray-50/50 md:p-5 p-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-[#EAECF0]">
                        <label className="block mb-2 text-gray-700 font-medium">Số Điện Thoại</label>
                        <input
                            type="tel"
                            name="phoneNumber"
                            value={advertisement.phoneNumber}
                            onChange={handleChange}
                            className={commonInputClass}
                        />
                    </div>

                    <div className="md:col-span-2 bg-gray-50/50 md:p-5 p-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-[#EAECF0]">
                        <label className="block mb-2 text-gray-700 font-medium">
                            Địa Chỉ <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="address"
                            value={advertisement.address}
                            onChange={handleChange}
                            className={`${commonInputClass} ${
                                errors.address ? 'ring-2 ring-red-500' : 'focus:ring-2 focus:ring-blue-300'
                            }`}
                        />
                        {errors.address && (
                            <p className="text-red-500 text-sm mt-1">{errors.address}</p>
                        )}
                    </div>

                    <div className="md:col-span-2 bg-gray-50/50 md:p-5 p-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-[#EAECF0]">
                        <div className="flex justify-between items-center mb-4">
                            <label className="block text-gray-700 font-medium">Mô Tả</label>
                            <button
                                type="button"
                                onClick={() => setShowCustomDescriptions(!showCustomDescriptions)}
                                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-all duration-300 text-sm"
                            >
                                {showCustomDescriptions ? 'Dùng Mô Tả Đơn' : 'Mô Tả Tùy Chỉnh'}
                            </button>
                        </div>
                        
                        {showCustomDescriptions ? (
                            <div className="space-y-4">
                                {advertisement.customDescriptions.map((desc, index) => (
                                    <div key={index} className="relative">
                                        <textarea
                                            value={desc}
                                            onChange={(e) => handleCustomDescriptionChange(index, e.target.value)}
                                            className={`${commonInputClass} min-h-[100px] resize-y pr-12`}
                                            placeholder={`Đoạn ${index + 1}`}
                                            rows={3}
                                        />
                                        <div className="absolute right-2 top-2 flex gap-2">
                                            {index > 0 && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeCustomDescription(index)}
                                                    className="p-1 text-red-500 hover:text-red-700"
                                                    title="Remove paragraph"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                                    </svg>
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={addCustomDescription}
                                    className="mt-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-all duration-300 text-sm"
                                >
                                    + Thêm Đoạn
                                </button>
                            </div>
                        ) : (
                            <textarea
                                name="detailedDescription"
                                value={advertisement.detailedDescription}
                                onChange={handleChange}
                                className={`${commonInputClass} min-h-[120px] resize-y`}
                                rows={3}
                            />
                        )}
                    </div>

                    <div className="bg-gray-50/50 md:p-5 p-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-[#EAECF0]">
                        <label className="block mb-2 text-gray-700 font-medium">Ngày Mở Cửa</label>
                        <DatePickerOne
                            selected={advertisement.adStartDate ? new Date(advertisement.adStartDate) : null}
                            onChange={(date: Date) => setAdvertisement(prev => ({ ...prev, adStartDate: date.toISOString() }))}
                        />
                    </div>

                    <div className="bg-gray-50/50 md:p-5 p-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-[#EAECF0]">
                        <label className="block mb-2 text-gray-700 font-medium">Ngày Đóng Cửa</label>
                        <DatePickerOne
                            selected={advertisement.adEndDate ? new Date(advertisement.adEndDate) : null}
                            onChange={(date: Date) => setAdvertisement(prev => ({ ...prev, adEndDate: date.toISOString() }))}
                        />
                    </div>

                    <div className="bg-gray-50/50 md:p-5 p-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-[#EAECF0]">
                        <label className="block mb-2 text-gray-700 font-medium">Giá Thấp Nhất</label>
                        <input
                            type="number"
                            name="priceRangeLow"
                            value={advertisement.priceRangeLow}
                            onChange={handleNumberChange}
                            className={commonInputClass}
                        />
                    </div>

                    <div className="bg-gray-50/50 md:p-5 p-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-[#EAECF0]">
                        <label className="block mb-2 text-gray-700 font-medium">Giá Cao Nhất</label>
                        <input
                            type="number"
                            name="priceRangeHigh"
                            value={advertisement.priceRangeHigh}
                            onChange={handleNumberChange}
                            className={commonInputClass}
                        />
                        {priceRangeError && (
                            <p className="text-red-500 text-sm mt-1">{priceRangeError}</p>
                        )}
                    </div>

                    <div className="bg-gray-50/50 md:p-5 p-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-[#EAECF0]">
                        <label className="block mb-2 text-gray-700 font-medium">Giờ Mở Cửa</label>
                        <input
                            type="time"
                            value={`${advertisement.openingHourStart.hour.toString().padStart(2, '0')}:${advertisement.openingHourStart.minute.toString().padStart(2, '0')}`}
                            onChange={(e) => handleTimeChange('openingHourStart', e)}
                            className={commonInputClass}
                        />
                    </div>

                    <div className="bg-gray-50/50 md:p-5 p-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-[#EAECF0]">
                        <label className="block mb-2 text-gray-700 font-medium">Giờ Đóng Cửa</label>
                        <input
                            type="time"
                            value={`${advertisement.openingHourEnd.hour.toString().padStart(2, '0')}:${advertisement.openingHourEnd.minute.toString().padStart(2, '0')}`}
                            onChange={(e) => handleTimeChange('openingHourEnd', e)}
                            className={commonInputClass}
                        />
                    </div>

                    <div className="bg-gray-50/50 md:p-5 p-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-[#EAECF0]">
                        <label className="block mb-2 text-gray-700 font-medium">Google Map Link</label>
                        <input
                            type="url"
                            name="googleMapLink"
                            value={advertisement.googleMapLink}
                            onChange={handleChange}
                            className={commonInputClass}
                        />
                    </div>

                    <div className="bg-gray-50/50 md:p-5 p-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-[#EAECF0]">
                        <label className="block mb-2 text-gray-700 font-medium">Website Link (nếu có)</label>
                        <input
                            type="url"
                            name="websiteLink"
                            value={advertisement.websiteLink}
                            onChange={handleChange}
                            className={commonInputClass}
                        />
                    </div>

                    <div className="bg-gray-50/50 md:p-5 p-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-[#EAECF0]">
                        <label className="block mb-2 text-gray-700 font-medium">Zalo Link</label>
                        <input
                            type="url"
                            name="zaloLink"
                            value={advertisement.zaloLink}
                            onChange={handleChange}
                            className={commonInputClass}
                        />
                    </div>

                    <div className="bg-gray-50/50 md:p-5 p-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-[#EAECF0]">
                        <label className="block mb-2 text-gray-700 font-medium">Facebook Link</label>
                        <input
                            type="url"
                            name="facebookLink"
                            value={advertisement.facebookLink}
                            onChange={handleChange}
                            className={commonInputClass}
                        />
                    </div>
                </div>

                <div className="mt-8 md:col-span-2">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Danh Sách hình ảnh</h3>
                    {advertisement.mediaList.map((media, index) => (
                        <div key={index} className="relative bg-gray-50/50 md:p-6 p-3 mb-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-[#EAECF0]">
                            {index > 0 && (
                                <button
                                    type="button"
                                    onClick={() => removeMedia(index)}
                                    className="absolute top-3 right-3 p-1.5 bg-red-50 text-red-500 rounded-full hover:bg-red-100 
                                             transition-all duration-300 group"
                                    title="Remove media"
                                >
                                    <svg 
                                        xmlns="http://www.w3.org/2000/svg" 
                                        className="h-5 w-5" 
                                        viewBox="0 0 20 20" 
                                        fill="currentColor"
                                    >
                                        <path 
                                            fillRule="evenodd" 
                                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" 
                                            clipRule="evenodd" 
                                        />
                                    </svg>
                                </button>
                            )}

                            <div>
                                <label className="block mb-2 text-gray-700 font-medium">
                                    {media.type === 'BANNER' ? 'Ảnh Banner' : 'Media'} {index === 0 && <span className="text-red-500">*</span>}
                                </label>
                                
                                {/* Preview container */}
                                {media.preview && (
                                    <div className="mb-4 relative group">
                                        <div className="flex justify-center items-center">
                                            <img 
                                                src={media.preview} 
                                                alt={`Preview ${index}`}
                                                className="max-w-full h-auto rounded-lg shadow-md object-contain"
                                                style={{ maxHeight: '200px' }}
                                            />
                                        </div>
                                        <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 
                                              transition-opacity duration-300 rounded-lg flex items-center justify-center">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    const updatedMediaList = [...advertisement.mediaList];
                                                    if (updatedMediaList[index].preview) {
                                                        URL.revokeObjectURL(updatedMediaList[index].preview!);
                                                    }
                                                    updatedMediaList[index] = {
                                                        ...updatedMediaList[index],
                                                        url: '',
                                                        preview: undefined
                                                    };
                                                    setAdvertisement(prev => ({
                                                        ...prev,
                                                        mediaList: updatedMediaList
                                                    }));
                                                }}
                                                className="text-white bg-red-500 px-4 py-2 rounded-md hover:bg-red-600 
                                                 transition-colors duration-300"
                                            >                                                Xóa Ảnh
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* File input */}
                                <div className="flex items-center justify-center w-full">
                                    <label className="flex flex-col items-center justify-center w-full h-32 
                                                    border-2 border-gray-300 border-dashed rounded-lg 
                                                    cursor-pointer bg-gray-50 hover:bg-gray-100 transition-all duration-300
                                                    ${!media.preview ? 'block' : 'hidden'}">
                                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                            <svg className="w-8 h-8 mb-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                                            </svg>
                                            <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Nhấp để tải lên</span> hoặc kéo thả</p>
                                            <p className="text-xs text-gray-500">PNG, JPG or GIF (MAX. 800x400px)</p>
                                        </div>
                                        <input 
                                            type="file"
                                            className="hidden"
                                            accept="image/*"
                                            onChange={(e) => handleFileSelect(index, e)}
                                        />
                                    </label>
                                </div>
                            </div>

                            <div className="mt-4">
                                <label className="block mb-2 text-gray-700 font-medium">Loại Phương Tiện</label>
                                <select
                                    name="type"
                                    value={media.type}
                                    onChange={(e) => handleMediaChange(index, e)}
                                    className={commonInputClass}
                                    disabled={index === 0}
                                >
                                    <option value="BANNER">BANNER</option>
                                    <option value="VIDEO">VIDEO</option>
                                    <option value="IMAGE">IMAGE</option>
                                </select>
                            </div>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={addMedia}
                        className="mt-4 px-6 py-2.5 bg-blue-500 text-white rounded-md hover:bg-blue-600 
                                 transition-all duration-300 shadow-md hover:shadow-lg flex items-center gap-2"
                    >
                        <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            className="h-5 w-5" 
                            viewBox="0 0 20 20" 
                            fill="currentColor"
                        >
                            <path 
                                fillRule="evenodd" 
                                d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" 
                                clipRule="evenodd" 
                            />
                        </svg>
                        <span>Thêm Phương Tiện</span>
                    </button>
                </div>

                {/* Add a separator and submit section */}
                <div className="mt-12 pt-6 border-t border-gray-200 md:col-span-2">
                    <div className="flex flex-col items-center justify-center space-y-4">
                        <h3 className="text-lg font-medium text-gray-700 text-center">
                            Xác nhận thông tin quảng cáo
                        </h3>
                        <p className="text-gray-500 text-sm text-center max-w-md md:px-4">
                            Vui lòng kiểm tra lại thông tin trước khi gửi. Sau khi gửi, quảng cáo sẽ được xem xét và phê duyệt.
                        </p>
                        <div className="flex md:flex-row flex-col items-center justify-center w-full md:gap-4 gap-2">
                            <button 
                                type="button"
                                onClick={() => {
                                    // Cách 1: Sử dụng scrollIntoView
                                    document.getElementById('form-header')?.scrollIntoView({ 
                                        behavior: 'smooth',
                                        block: 'start'
                                    });
                                    
                                    // Hoặc cách 2: Sử dụng setTimeout với scrollTo
                                    setTimeout(() => {
                                        window.scrollTo({
                                            top: 0,
                                            behavior: 'smooth'
                                        });
                                    }, 100);

                                    // Reset các lỗi
                                    setErrors({
                                        mainAdvertisementName: '',
                                        category: '',
                                        advertiserId: '',
                                        serviceId: '',
                                        address: ''
                                    });
                                    
                                    // Hiển thị thông báo
                                    messageApi.info('Vui lòng kiểm tra lại thông tin từ đầu');
                                }}
                                className="w-full md:w-auto px-6 py-2.5 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 
                                         transition-all duration-300 shadow-sm hover:shadow flex items-center justify-center gap-2"
                            >
                                <svg 
                                    xmlns="http://www.w3.org/2000/svg" 
                                    className="h-5 w-5" 
                                    viewBox="0 0 20 20" 
                                    fill="currentColor"
                                >
                                    <path 
                                        fillRule="evenodd" 
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" 
                                        clipRule="evenodd" 
                                    />
                                </svg>
                                <span>Xem lại từ đầu</span>
                            </button>
                            <button 
                                type="submit" 
                                disabled={isSubmitting}
                                className={`w-full md:w-auto px-8 py-2.5 ${
                                    isSubmitting 
                                        ? 'bg-gray-400 cursor-not-allowed' 
                                        : 'bg-green-600 hover:bg-green-700'
                                } text-white rounded-md transition-all duration-300 shadow-lg hover:shadow-xl 
                                flex items-center justify-center gap-2`}
                            >
                                {isSubmitting ? (
                                    <>
                                        <span className="animate-spin">⌛</span>
                                        <span>Đang xử lý...</span>  
                                    </>
                                ) : (
                                    <>
                                        <span>Đăng quảng cáo</span>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </form>
            {showProgress && (
                <LoadingProgress 
                    progress={uploadProgress}
                    message={`Đang tải lên ${uploadProgress === 100 ? 'hoàn tất' : '...'}`}
                />
            )}
        </>
    );
};

export default AdvertisementForm;
