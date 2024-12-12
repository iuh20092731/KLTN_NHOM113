import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import SelectGroupTwo from '../Forms/SelectGroup/SelectGroupTwo';
import { useAppSelector, useAppDispatch } from '../../hooks/reduxHooks';
import { RootState } from '../../redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { Button, message, Space, Input, Spin } from 'antd';
import DataTable from '../Tables/DataTable';
import Breadcrumb from '../Breadcrumbs/Breadcrumb';
import AdvertiserSearchModal from '../AdvertiserSearchModal';
import { getCategories } from '../../redux/thunks/categories';
import { AppDispatch } from '../../redux/store';
import { Category } from '../../interfaces/Category';
import { Service } from '../../interfaces/Service';
import { getServiceById, getServiceByName, getServiceByCategoryId } from '../../redux/thunks/service';
import { createAdvertisement } from '../../redux/thunks/postAdvertisement';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { getAdvertisement } from '../../redux/thunks/getAdvertisement';
import { uploadMedia } from '../../services/advertisementService';
import { setCurrentAdvertisement } from '../../redux/actions/advertisementActions';
import { PlusOutlined } from '@ant-design/icons';

interface OpeningHour {
    hour: number;
    minute: number;
    second: number;
    nano: number;
}

interface Media {
    id?: number;
    name: string;
    content: string;
    url: string;
    type: 'BANNER' | 'VIDEO' | 'IMAGE';
}

interface Advertisement {
    mainAdvertisementName: string;
    serviceId: number;
    advertiserId: string;
    adminId: string;
    adStartDate: Date;
    adEndDate: Date;
    reviewNotes: string | null;
    description: string;
    detailedDescription: string;
    address: string;
    phoneNumber: string;
    priceRangeLow: string;
    priceRangeHigh: string;
    openingHourStart: string;
    openingHourEnd: string;
    googleMapLink: string;
    websiteLink: string;
    facebookLink: string | null;
    zaloLink: string | null;
    adStatus: 'Active' | 'Inactive' | 'Pending';
    mediaList: Media[];
    deliveryAvailable: boolean;
}

// Add new interface for drag state
interface DragState {
    isDragging: boolean;
    index: number | null;
}

const FrmADUpdate: React.FC = () => {
    const dispatch: AppDispatch = useDispatch();
    const navigate = useNavigate();
    const currentAdvertisement = useSelector((state: RootState) => state.advertisement.currentAdvertisement);

    useEffect(() => {
        // Try to get data in this order: Redux -> localStorage -> URL params
        if (currentAdvertisement) {
            setAdvertisement(currentAdvertisement);
            // Also save to localStorage as backup
            localStorage.setItem('currentAdvertisement', JSON.stringify(currentAdvertisement));
        } else {
            // Try localStorage
            const savedAdvertisement = localStorage.getItem('currentAdvertisement');
            if (savedAdvertisement) {
                const parsedAdvertisement = JSON.parse(savedAdvertisement);
                dispatch(setCurrentAdvertisement(parsedAdvertisement));
                setAdvertisement(parsedAdvertisement);
            } else {
                // If no data found, redirect back to list
                message.error('Không tìm thấy thông tin quảng cáo');
                navigate('/advertisements/list');
            }
        }

        // Cleanup function
        return () => {
            // Only remove from localStorage if navigating away from update page
            if (!window.location.pathname.includes('/advertisements/update')) {
                localStorage.removeItem('currentAdvertisement');
            }
        };
    }, [currentAdvertisement, dispatch, navigate]);

    const [messageApi, contextHolder] = message.useMessage();

    // Lấy user từ Redux store
    const user = useSelector((state: RootState) => state.user.user);

    // Khởi tạo state với giá trị mặc định là empty string thay vì null
    const [advertisement, setAdvertisement] = useState<Advertisement>({
        mainAdvertisementName: '',
        serviceId: 5,
        advertiserId: '',
        adminId: user?.userId || '',
        adStartDate: new Date(),
        adEndDate: new Date(),
        reviewNotes: '', // Thay đổi từ null thành empty string
        description: '',
        detailedDescription: '',
        address: '',
        phoneNumber: '',
        priceRangeLow: '',
        priceRangeHigh: '',
        openingHourStart: '00:00:00',
        openingHourEnd: '00:00:00',
        googleMapLink: '',
        websiteLink: '',
        facebookLink: '', // Thay đổi từ null thành empty string
        zaloLink: '', // Thay đổi từ null thành empty string
        adStatus: 'Pending',
        mediaList: [],
        deliveryAvailable: false,
    });

    // Cập nhật adminId khi user được load
    useEffect(() => {
        if (user?.userId) {
            setAdvertisement(prev => ({
                ...prev,
                adminId: user.userId
            }));
        }
    }, [user]);

    const [selectedCategory, setSelectedCategory] = useState<number>(0);
    const [categories, setCategories] = useState<Category[]>([]);
    const [services, setServices] = useState<Service[]>([]);
    const [serviceData, setServiceData] = useState<Service | null>(null);
    const [categorySelected, setCategorySelected] = useState<number>(0);

    // Lấy item từ URL một lần duy nhất khi component mount
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const itemString = params.get('item');
    const item = itemString ? JSON.parse(decodeURIComponent(itemString)) : null;
    const advertisementId = useSelector((state: RootState) => state.advertisement.currentAdvertisement?.advertisementId);

    // Xử lý item từ URL một lần duy nhất khi component mount
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const itemString = params.get('item');

        if (itemString) {
            try {
                const item = JSON.parse(decodeURIComponent(itemString));

                // Convert ISO string to Date object
                const startDate = item.adStartDate ? new Date(item.adStartDate) : new Date();
                const endDate = item.adEndDate ? new Date(item.adEndDate) : new Date();

                const formattedData = {
                    ...item,
                    adStartDate: startDate,
                    adEndDate: endDate,
                    reviewNotes: item.reviewNotes || '',
                    facebookLink: item.facebookLink || '',
                    zaloLink: item.zaloLink || '',
                    websiteLink: item.websiteLink || '',
                    categoryId: item.categoryId || 0,
                };

                setAdvertisement(formattedData);
                setSelectedServiceId(item.serviceId);
                setCategorySelected(item.categoryId);
            } catch (error) {
                console.error('Error parsing item from URL:', error);
            }
        }
    }, []);

    useEffect(() => {
        dispatch(getCategories()).then((data) => {
            return setCategories(data.payload as Category[]);
        });
    }, [dispatch]);

    useEffect(() => {
        if (selectedCategory) {
            dispatch(getServiceByCategoryId(selectedCategory)).then((data) => {
                setServices(data.payload as Service[]);
            });
        }
    }, [dispatch, selectedCategory]);

    // const apiUrl = import.meta.env.VITE_API_URL;
    const apiUrl = (import.meta as any).env.VITE_API_URL;

    const [showAdvertiserModal, setShowAdvertiserModal] = useState(false);

    // Add new state for price range error
    const [priceRangeError, setPriceRangeError] = useState<string>('');

    // Add new state for serviceId
    const [selectedServiceId, setSelectedServiceId] = useState<number>(5);

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
                setPriceRangeError('Price Range High must be greater than Price Range Low');
            } else {
                setPriceRangeError('');
            }
        }
    };

    const handleTimeChange = (field: 'openingHourStart' | 'openingHourEnd', e: React.ChangeEvent<HTMLInputElement>) => {
        const timeValue = `${e.target.value}:00`;
        setAdvertisement(prev => ({
            ...prev,
            [field]: timeValue,
        }));
    };

    const handleMediaChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        const updatedMediaList = [...advertisement.mediaList];
        updatedMediaList[index] = { ...updatedMediaList[index], [name]: value };
        setAdvertisement(prev => ({ ...prev, mediaList: updatedMediaList }));
    };

    // Thêm state để theo dõi media mới
    const [newMediaIndexes, setNewMediaIndexes] = useState<number[]>([]);

    // Cập nhật hàm addMedia
    const addMedia = () => {
        setAdvertisement(prev => ({
            ...prev,
            mediaList: [...prev.mediaList, { name: '', content: '', url: '', type: 'IMAGE' }],
        }));
        setNewMediaIndexes(prev => [...prev, advertisement.mediaList.length]);
    };

    // Thêm state để quản lý loading
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true); // Bắt đầu loading
        try {
            if (advertisement) {
                // Nếu có advertisementId, gọi API cập nhật
                await handleUpdate(e);
            } else {
                // Nếu không có advertisementId, gọi API tạo mới
                await dispatch(createAdvertisement(advertisement)).unwrap();
                messageApi.success('Advertisement created successfully!');
            }
        } catch (error) {
            messageApi.error('Failed to process advertisement. Please try again.');
            console.error('Error processing advertisement:', error);
        } finally {
            setIsLoading(false); // Kết thúc loading
        }
    };

    useEffect(() => {
        if (selectedServiceId) {
            console.log(selectedServiceId);
            dispatch(getServiceById(selectedServiceId))
                .then((response) => {
                    const service = response.payload as Service;
                    setServiceData(service);
                    setCategorySelected(service.categoryId || 0);
                })
                .catch((error) => {
                    console.error('Error fetching service:', error);
                });
        }
    }, [dispatch, selectedServiceId]);

    const handleNewClick = () => {
        // Reset the form to initial state
        setAdvertisement({
            mainAdvertisementName: '',
            serviceId: 5,
            advertiserId: '',
            adminId: user.userId,
            adStartDate: new Date(),
            adEndDate: new Date(),
            reviewNotes: '',
            description: '',
            detailedDescription: '',
            address: '',
            phoneNumber: '',
            priceRangeLow: '',
            priceRangeHigh: '',
            openingHourStart: '00:00:00',
            openingHourEnd: '00:00:00',
            googleMapLink: '',
            websiteLink: '',
            facebookLink: '',
            zaloLink: '',
            adStatus: 'Pending',
            mediaList: [],
            deliveryAvailable: false,
        });
        setSelectedCategory("");
        // Clear URL parameters
        window.history.replaceState({}, '', window.location.pathname);
    };

    // Update your category select handler
    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const categoryId = Number(e.target.value);
        setSelectedCategory(categoryId);
        setAdvertisement(prev => ({
            ...prev,
            categoryId: categoryId,
            serviceId: '' // Reset service selection when category changes
        }));
    };

    // Update the service selection handler
    const handleServiceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newServiceId = Number(e.target.value);
        setSelectedServiceId(newServiceId);
        setAdvertisement(prev => ({
            ...prev,
            serviceId: newServiceId
        }));
    };

    // First, add a useEffect to find and set the selected category when categorySelected changes
    useEffect(() => {
        if (categorySelected && categories.length > 0) {
            const category = categories.find(cat => cat.categoryId === categorySelected);
            if (category) {
                setSelectedCategory(category.categoryId);
            }
        }
    }, [categorySelected, categories]);

    // Add token from Redux store
    const token = useSelector((state: RootState) => state.user.token);

    // Thêm hàm fetchAdvertisement
    const fetchAdvertisement = async (id: string) => {
        try {
            const response = await fetch(`${apiUrl}/api/v2/main-advertisements/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch advertisement');
            }

            const data = await response.json();
            setAdvertisement(data.result);
            dispatch(setCurrentAdvertisement(data.result));
            localStorage.setItem('currentAdvertisement', JSON.stringify(data.result));
        } catch (error) {
            console.error('Error fetching advertisement:', error);
            messageApi.error('Failed to fetch updated advertisement data');
        }
    };

    // Thêm state mới để lưu file ảnh tạm thời
    const [tempFiles, setTempFiles] = useState<{ [key: number]: File }>({});

    // Sửa lại hàm handleFileUpload để chỉ preview
    const handleFileUpload = (file: File, index: number) => {
        try {
            // Tạo URL preview cho file
            const previewUrl = URL.createObjectURL(file);

            // Lưu file vào state tạm thời
            setTempFiles(prev => ({
                ...prev,
                [index]: file
            }));

            // Cập nhật UI với URL preview
            const updatedMediaList = [...advertisement.mediaList];
            updatedMediaList[index] = {
                ...updatedMediaList[index],
                url: previewUrl, // URL tạm thời để preview
                content: file.name,
                name: file.name
            };
            setAdvertisement(prev => ({ ...prev, mediaList: updatedMediaList }));
        } catch (error) {
            console.error('Error handling file:', error);
            messageApi.error('Failed to preview image. Please try again.');
        }
    };

    // Thêm hàm mới để upload ảnh
    const uploadImage = async (file: File): Promise<string> => {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch(`${apiUrl}/api/v1/upload/image`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            body: formData,
        });

        if (!response.ok) {
            throw new Error('Failed to upload image');
        }

        return await response.text();
    };

    // Thêm state để theo dõi progress
    const [uploadProgress, setUploadProgress] = useState(0);
    const [showProgress, setShowProgress] = useState(false);

    // Thêm component LoadingProgress
    const LoadingProgress = ({ progress, message }: { progress: number, message: string }) => (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-80">
                <div className="mb-4">
                    <div className="h-2 w-full bg-gray-200 rounded">
                        <div
                            className="h-full bg-blue-500 rounded transition-all duration-300"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>
                <p className="text-center text-gray-700">{message}</p>
            </div>
        </div>
    );

    // Sửa lại hàm handleUpdate
    const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setShowProgress(true);
        setUploadProgress(0);
        try {
            if (!token || !advertisementId) {
                throw new Error('Missing required data');
            }

            // Upload tất cả ảnh mới
            const updatedMediaList = [...advertisement.mediaList];
            const totalFiles = Object.keys(tempFiles).length;
            let completedFiles = 0;

            for (const [index, file] of Object.entries(tempFiles)) {
                try {
                    const imageUrl = await uploadImage(file);
                    updatedMediaList[Number(index)] = {
                        ...updatedMediaList[Number(index)],
                        url: imageUrl
                    };
                    completedFiles++;
                    setUploadProgress((completedFiles / totalFiles) * 100);
                } catch (error) {
                    console.error(`Error uploading image at index ${index}:`, error);
                    messageApi.error(`Failed to upload image ${Number(index) + 1}`);
                    return;
                }
            }

            // Cập nhật advertisement với URLs mới
            const updateRequest = {
                mainAdvertisementName: advertisement.mainAdvertisementName,
                adStartDate: advertisement.adStartDate instanceof Date
                    ? advertisement.adStartDate.toISOString()
                    : new Date(advertisement.adStartDate).toISOString(),
                adEndDate: advertisement.adEndDate instanceof Date
                    ? advertisement.adEndDate.toISOString()
                    : new Date(advertisement.adEndDate).toISOString(),
                reviewNotes: advertisement.reviewNotes,
                description: advertisement.description,
                detailedDescription: advertisement.detailedDescription,
                address: advertisement.address,
                phoneNumber: advertisement.phoneNumber,
                priceRangeLow: parseFloat(advertisement.priceRangeLow),
                priceRangeHigh: parseFloat(advertisement.priceRangeHigh),
                openingHourStart: advertisement.openingHourStart,
                openingHourEnd: advertisement.openingHourEnd,
                googleMapLink: advertisement.googleMapLink,
                websiteLink: advertisement.websiteLink,
                zaloLink: advertisement.zaloLink,
                facebookLink: advertisement.facebookLink,
                deliveryAvailable: advertisement.deliveryAvailable,
                serviceId: advertisement.serviceId,
                advertisementMedia: updatedMediaList.map(media => ({
                    id: media.id || null,
                    name: media.name,
                    content: media.content,
                    url: media.url,
                    type: media.type,
                })),
            };

            const response = await fetch(`${apiUrl}/api/v2/main-advertisements/${advertisementId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(updateRequest),
            });

            if (!response.ok) {
                throw new Error('Failed to update advertisement');
            }

            messageApi.success('Advertisement updated successfully!');
            setTempFiles({});
            await fetchAdvertisement(advertisementId);

        } catch (error) {
            messageApi.error('Failed to update advertisement. Please try again.');
            console.error('Error updating advertisement:', error);
        } finally {
            setShowProgress(false);
            setUploadProgress(0);
        }
    };

    // Thêm CSS custom cho DatePicker
    const datePickerCustomStyles = {
        input: "w-full border rounded p-2 h-[42px] focus:outline-none focus:border-blue-500",
        // Nu bạn muốn ty chỉnh thêm các style khác
    };

    const [deletingIndex, setDeletingIndex] = useState<number | null>(null);

    const handleMediaDelete = (index: number) => {
        setDeletingIndex(index); // Set the index of the media being deleted
        setTimeout(() => {
            const updatedMediaList = advertisement.mediaList.filter((_, i) => i !== index);
            setAdvertisement(prev => ({ ...prev, mediaList: updatedMediaList }));
            setDeletingIndex(null); // Reset deleting index after deletion
        }, 300); // Delay to allow for fade-out effect
    };

    const [uploading, setUploading] = useState<boolean>(false); // Add state for uploading

    // Add new state for drag and drop
    const [dragState, setDragState] = useState<DragState>({
        isDragging: false,
        index: null
    });

    // Add drag and drop handlers
    const handleDragEnter = (e: React.DragEvent, index: number) => {
        e.preventDefault();
        e.stopPropagation();
        setDragState({ isDragging: true, index });
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragState({ isDragging: false, index: null });
    };

    const handleDrop = async (e: React.DragEvent, index: number) => {
        e.preventDefault();
        e.stopPropagation();
        setDragState({ isDragging: false, index: null });

        const files = e.dataTransfer.files;
        if (files && files.length > 0) {
            await handleFileUpload(files[0], index);
        }
    };

    useEffect(() => {
        if (advertisement.categoryId) {
            setSelectedCategory(advertisement.categoryId);
        }
    }, [advertisement, categories]);

    const { advertisementId: urlAdvertisementId } = useParams<{ advertisementId: string }>();

    useEffect(() => {
        const fetchAdvertisement = async () => {
            if (urlAdvertisementId) {
                try {
                    const response = await getAdvertisement(urlAdvertisementId); // Gi API để lấy quảng cáo
                    setAdvertisement(response.result); // Cập nhật state với dữ liệu quảng cáo
                } catch (error) {
                    message.error('Failed to fetch advertisement details');
                    console.error('Error fetching advertisement:', error);
                }
            }
        };

        fetchAdvertisement();
    }, [urlAdvertisementId]);

    // Cleanup function trong useEffect để clear URLs tạm thời
    useEffect(() => {
        return () => {
            // Clear all preview URLs when component unmounts
            advertisement.mediaList.forEach(media => {
                if (media.url && media.url.startsWith('blob:')) {
                    URL.revokeObjectURL(media.url);
                }
            });
        };
    }, []);

    // Add this near the top of your component with other state declarations
    const [errors, setErrors] = useState({
        mainAdvertisementName: '',
        category: '',
        advertiserId: '',
        serviceId: '',
        address: ''
    });

    // Thêm useEffect để load services khi category thay đổi
    useEffect(() => {
        const fetchServices = async () => {
            if (selectedCategory && categories.length > 0) {
                try {
                    // Tìm category dựa trên selectedCategory (là categoryId)
                    const selectedCat = categories.find(cat => cat.categoryId === selectedCategory);
                    if (!selectedCat) {
                        // console.log('Categories:', categories);
                        // console.log('Selected Category ID:', selectedCategory);
                        throw new Error('Category not found');
                    }

                    // Log để debug
                    // console.log('Selected Category:', selectedCat);
                    // console.log('Category Name No Diacritics:', selectedCat.categoryNameNoDiacritics);

                    // Chuyển đổi categoryNameNoDiacritics thành chữ thường
                    const categoryName = selectedCat.categoryNameNoDiacritics.toLowerCase();

                    const response = await fetch(`${apiUrl}/api/v1/advertisement-services/category?categoryName=${categoryName}`, {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                        },
                    });

                    if (!response.ok) {
                        throw new Error('Failed to fetch services');
                    }
                    const data = await response.json();
                    setServices(data.result || []);
                } catch (error) {
                    console.error('Error fetching services:', error);
                    message.error('Failed to load services');
                }
            } else {
                setServices([]); // Reset services when no category is selected
            }
        };

        fetchServices();
    }, [selectedCategory, categories, token, apiUrl]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch(`${apiUrl}/api/v1/categories`, {
                    // headers: {
                    //     'Authorization': `Bearer ${token}`,
                    // },
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch categories');
                }
                const data = await response.json();
                setCategories(data.result || []);
            } catch (error) {
                console.error('Error fetching categories:', error);
                message.error('Failed to load categories');
            }
        };

        fetchCategories();
    }, [token, apiUrl]);

    return (
        <>
            {contextHolder}
            {showProgress && (
                <LoadingProgress
                    progress={uploadProgress}
                    message={`Đang tải lên ${uploadProgress === 100 ? 'hoàn tất' : '...'}`}
                />
            )}
            <Breadcrumb pageName="Cập nhật Quảng Cáo" />
            <div className="min-h-screen bg-gray-50">
                <div className="bg-white rounded-lg shadow-lg p-5">
                    {/* <div id="form-header">
                        <div className="flex justify-between items-center mb-4">
                            
                            <Button
                                type="primary"
                                icon={<PlusOutlined />}
                                onClick={handleNewClick}
                                className="bg-green-500 hover:bg-green-600 flex items-center"
                            >
                                Thêm quảng cáo mới
                            </Button>
                        </div>
                    </div> */}

                    <form onSubmit={handleSubmit} className="space-y-4 p-6 bg-white rounded-md shadow-md">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <div>
                                <label className="block mb-2">Tên Quảng Cáo</label>
                                <input
                                    type="text"
                                    name="mainAdvertisementName"
                                    value={advertisement?.mainAdvertisementName}
                                    onChange={handleChange}
                                    className="w-full border rounded p-2"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block mb-2">Mã Quản Trị Viên</label>
                                <input
                                    type="text"
                                    name="adminId"
                                    value={advertisement?.adminId}
                                    onChange={handleChange}
                                    className="w-full border rounded p-2"
                                    required
                                    disabled
                                />
                            </div>

                            <div>
                                <label className="block mb-2">Danh Mục</label>
                                <select
                                    name="categoryId"
                                    value={selectedCategory}
                                    onChange={handleCategoryChange}
                                    className="w-full border rounded p-2"
                                    required
                                >
                                    <option value="">Chọn danh mục</option>
                                    {categories.map((category) => (
                                        <option
                                            key={category.categoryId}
                                            value={category.categoryId}
                                        >
                                            {category.categoryName}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block mb-2">Mã Nhà Quảng Cáo</label>
                                <input
                                    type="text"
                                    name="advertiserId"
                                    value={advertisement?.advertiserId}
                                    onChange={handleChange}
                                    className="w-full border rounded p-2"
                                    required
                                    onDoubleClick={() => setShowAdvertiserModal(true)}
                                />
                                {showAdvertiserModal && (
                                    <AdvertiserSearchModal
                                        isOpen={showAdvertiserModal}
                                        onClose={() => setShowAdvertiserModal(false)}
                                        onSelectAdvertiser={(selectedAdvertiser: { advertiserId: string }) => {
                                            setAdvertisement(prev => ({ ...prev, advertiserId: selectedAdvertiser.advertiserId }));
                                            setShowAdvertiserModal(false);
                                        }}
                                    />
                                )}
                            </div>
                            <div>
                                <label className="block mb-2">Dịch Vụ</label>
                                <select
                                    name="serviceId"
                                    value={advertisement?.serviceId || ''}
                                    onChange={handleServiceChange}
                                    className="w-full border rounded p-2"
                                    required
                                >
                                    <option value="">Chọn dịch vụ</option>
                                    {services.map((service) => (
                                        <option
                                            key={service.serviceId}
                                            value={service.serviceId}
                                        >
                                            {service.serviceName}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block mb-2">Số Điện Thoại</label>
                                <input
                                    type="tel"
                                    name="phoneNumber"
                                    value={advertisement?.phoneNumber}
                                    onChange={handleChange}
                                    className="w-full border rounded p-2"
                                    required
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block mb-2">Địa Chỉ</label>
                                <input
                                    type="text"
                                    name="address"
                                    value={advertisement?.address}
                                    onChange={handleChange}
                                    className="w-full border rounded p-2"
                                    required
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block mb-2">Mô Tả Chi Tiết</label>
                                <textarea
                                    name="detailedDescription"
                                    value={advertisement?.detailedDescription}
                                    onChange={handleChange}
                                    className="w-full border rounded p-2"
                                    rows={6}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block mb-2">Ngày Bắt Đầu</label>
                                <DatePicker
                                    selected={advertisement?.adStartDate}
                                    onChange={(date: Date) => {
                                        // console.log('Setting new start date:', date);
                                        setAdvertisement(prev => ({
                                            ...prev,
                                            adStartDate: date
                                        }));
                                    }}
                                    dateFormat="yyyy-MM-dd"
                                    className={datePickerCustomStyles.input}
                                />
                            </div>

                            <div>
                                <label className="block mb-2">Ngày Kết Thúc</label>
                                <DatePicker
                                    selected={advertisement?.adEndDate}
                                    onChange={(date: Date) => {
                                        // console.log('Setting new end date:', date);
                                        setAdvertisement(prev => ({
                                            ...prev,
                                            adEndDate: date
                                        }));
                                    }}
                                    dateFormat="yyyy-MM-dd"
                                    className={datePickerCustomStyles.input}
                                />
                            </div>

                            <div>
                                <label className="block mb-2">Giá Thấp Nhất</label>
                                <input
                                    type="number"
                                    name="priceRangeLow"
                                    value={advertisement?.priceRangeLow}
                                    onChange={handleNumberChange}
                                    className="w-full border rounded p-2"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block mb-2">Giá Cao Nhất</label>
                                <input
                                    type="number"
                                    name="priceRangeHigh"
                                    value={advertisement?.priceRangeHigh}
                                    onChange={handleNumberChange}
                                    className="w-full border rounded p-2"
                                    required
                                />
                                {priceRangeError && (
                                    <p className="text-red-500 text-sm mt-1">{priceRangeError}</p>
                                )}
                            </div>

                            <div>
                                <label className="block mb-2">Giờ Mở Cửa</label>
                                <input
                                    type="time"
                                    value={advertisement?.openingHourStart.slice(0, 5)}
                                    onChange={(e) => handleTimeChange('openingHourStart', e)}
                                    className="w-full border rounded p-2"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block mb-2">Giờ Đóng Cửa</label>
                                <input
                                    type="time"
                                    value={advertisement?.openingHourEnd.slice(0, 5)}
                                    onChange={(e) => handleTimeChange('openingHourEnd', e)}
                                    className="w-full border rounded p-2"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block mb-2">Đường Dẫn Google Map</label>
                                <input
                                    type="url"
                                    name="googleMapLink"
                                    value={advertisement?.googleMapLink}
                                    onChange={handleChange}
                                    className="w-full border rounded p-2"
                                />
                            </div>

                            <div>
                                <label className="block mb-2">Website Link (nếu có)</label>
                                <input
                                    type="url"
                                    name="websiteLink"
                                    value={advertisement?.websiteLink}
                                    onChange={handleChange}
                                    className="w-full border rounded p-2"
                                />
                            </div>

                            <div>
                                <label className="block mb-2">Facebook Link (nếu có)</label>
                                <input
                                    type="url"
                                    name="facebookLink"
                                    value={advertisement?.facebookLink}
                                    onChange={handleChange}
                                    className="w-full border rounded p-2"
                                />
                            </div>

                            <div>
                                <label className="block mb-2">Zalo Link (nếu có)</label>
                                <input
                                    type="url"
                                    name="zaloLink"
                                    value={advertisement?.zaloLink}
                                    onChange={handleChange}
                                    className="w-full border rounded p-2"
                                />
                            </div>
                        </div>

                        <div>
                            <h3 className="font-bold mt-5 mb-2">Danh Sách Phương Tiện</h3>
                            {advertisement?.mediaList.map((media, index) => (
                                <div
                                    key={index}
                                    className={`relative md:p-6 p-3 mb-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-[#EAECF0] 
                                        ${newMediaIndexes.includes(index) ? 'bg-blue-50' : 'bg-gray-50/50'}`}
                                >
                                    <div
                                        className={`relative w-full h-[200px] border-2 border-dashed rounded-lg mb-4 flex items-center justify-center cursor-pointer
                                            ${dragState.isDragging && dragState.index === index ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}
                                            hover:border-blue-500 hover:bg-blue-50 transition-colors`}
                                        onDragEnter={(e) => handleDragEnter(e, index)}
                                        onDragOver={(e) => e.preventDefault()}
                                        onDragLeave={handleDragLeave}
                                        onDrop={(e) => handleDrop(e, index)}
                                        onClick={() => document.getElementById(`file-input-${index}`)?.click()}
                                    >
                                        {media.url ? (
                                            <img
                                                src={media.url}
                                                alt={media.name}
                                                className="h-full w-full object-contain rounded"
                                            />
                                        ) : (
                                            <div className="text-center">
                                                <i className="fas fa-cloud-upload-alt text-3xl mb-2"></i>
                                                <p>Kéo thả hình ảnh vào đây hoặc nhấp để chọn</p>
                                            </div>
                                        )}
                                        <input
                                            id={`file-input-${index}`}
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => e.target.files && handleFileUpload(e.target.files[0], index)}
                                            className="hidden"
                                        />
                                    </div>

                                    <div>
                                        <label className="block mb-2">Tên Phương Tiện</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={media.name}
                                            onChange={(e) => handleMediaChange(index, e)}
                                            className="w-full border border-[#E0E0E0] rounded p-2"
                                            required
                                        />
                                    </div>
                                    <div className="mt-1">
                                        <label className="block mb-2">Nội Dung</label>
                                        <input
                                            type="text"
                                            name="content"
                                            value={media.content}
                                            onChange={(e) => handleMediaChange(index, e)}
                                            className="w-full border-[#E0E0E0] border rounded p-2"
                                            required
                                        />
                                    </div>
                                    <div className="mt-1">
                                        <label className="block mb-2">Đường Dẫn</label>
                                        <input
                                            type="text"
                                            name="url"
                                            value={media.url}
                                            onChange={(e) => handleMediaChange(index, e)}
                                            className="w-full border-[#E0E0E0] border rounded p-2"
                                            required
                                        />
                                    </div>
                                    <div className="mt-1">
                                        <label className="block mb-2">Loại Phương Tiện</label>
                                        <select
                                            name="type"
                                            value={media.type}
                                            onChange={(e) => handleMediaChange(index, e)}
                                            className="w-full border-[#E0E0E0] border rounded p-2"
                                        >
                                            <option value="IMAGE">IMAGE</option>
                                            <option value="VIDEO">VIDEO</option>
                                            <option value="BANNER">BANNER</option>
                                        </select>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => handleMediaDelete(index)}
                                        className="mt-3 p-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                                    >
                                        Xóa Phương Tiện
                                    </button>
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={addMedia}
                                className="mt-4 px-6 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-md hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 shadow-md hover:shadow-lg flex items-center gap-2"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                                </svg>
                                <span>Thêm Phương Tiện</span>
                            </button>
                        </div>

                        <div className="mt-12 pt-6 border-t border-gray-200 md:col-span-2">
                            <div className="flex flex-col items-center justify-center space-y-4">
                                <h3 className="text-lg font-medium text-gray-700 text-center">
                                    Xác Nhận Thông Tin Quảng Cáo
                                </h3>
                                <p className="text-gray-500 text-sm text-center max-w-md md:px-4">
                                    Vui lòng kiểm tra thông tin trước khi gửi. Sau khi gửi, quảng cáo sẽ được xem xét và phê duyệt.
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

                                            // Cách 3: Scroll legacy (phòng trường hợp 2 cách trên không hoạt động)
                                            setTimeout(() => {
                                                document.body.scrollTop = 0; // For Safari
                                                document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
                                            }, 200);

                                            // Reset các lỗi
                                            setErrors({
                                                mainAdvertisementName: '',
                                                category: '',
                                                advertiserId: '',
                                                serviceId: '',
                                                address: ''
                                            });

                                            // Hiển thị thông báo
                                            messageApi.info('Please review the information from the beginning');
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
                                        <span>Xem Lại Từ Đầu</span>
                                    </button>
                                    <button
                                        type="submit"
                                        className={`w-full md:w-auto px-8 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-md transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2`}
                                    >
                                        <span>Cập Nhật Quảng Cáo</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>

                    {/* Thêm CSS global cho DatePicker */}
                    <style>
                        {`
                        .react-datepicker-wrapper {
                            width: 100%;
                        }
                        .react-datepicker__input-container {
                            width: 100%;
                        }
                        .react-datepicker__input-container input {
                            width: 100%;
                            height: 42px;
                            padding: 8px;
                            border: 1px solid #59697E;
                            border-radius: 0.375rem;
                        }
                        .react-datepicker__input-container input:focus {
                            outline: none;
                            border-color: #3b82f6;
                        }
                    `}
                    </style>
                </div>
            </div>
        </>
    );
};

export default FrmADUpdate;