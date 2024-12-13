import { useEffect, useState } from 'react';
import { Table, Button, Space, message, Select, Modal, Dropdown, Input } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, SearchOutlined, CloseOutlined, HeartOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import Breadcrumb from '../Breadcrumbs/Breadcrumb';
import { useLocation, useNavigate } from 'react-router-dom';
import { Advertisement } from '../../interfaces/Advertisement';
import { useAuth } from '../../context/AuthContext';
import type { MenuProps } from 'antd';

import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { setCurrentAdvertisement } from '../../redux/actions/advertisementActions';

interface CategoryResponse {
    categoryId: number;
    categoryName: string;
    categoryNameNoDiacritics: string;
    isActive: boolean;
}

interface AdvertisementServiceResponse {
    serviceId: number;
    serviceName: string;
    isActive: boolean;
}

const COLUMN_TYPE = 'column';

const DraggableColumn = ({ column, index, moveColumn }) => {
    const fixedColumns = ['action', 'advertisementId'];
    const isFixed = fixedColumns.includes(column.key);

    if (isFixed) {
        return (
            <div className={`
                p-2 
                select-none
                ${column.key === 'action' ? 'border-l-2 border-gray-200' : ''}
                ${column.key === 'advertisementId' ? 'bg-gray-50' : ''}
            `}>
                <span className="text-base font-medium">{column.title}</span>
            </div>
        );
    }

    const [{ isDragging }, ref] = useDrag({
        type: COLUMN_TYPE,
        item: { index },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    const [{ isOver }, drop] = useDrop({
        accept: COLUMN_TYPE,
        hover: (draggedItem) => {
            if (draggedItem.index !== index) {
                moveColumn(draggedItem.index, index);
                draggedItem.index = index;
            }
        },
        collect: (monitor) => ({
            isOver: monitor.isOver(),
        }),
    });

    return (
        <div
            ref={(node) => ref(drop(node))}
            className={`
                group
                cursor-move 
                transition-all 
                duration-300
                select-none
                relative
                p-2
                rounded-md
                ${isDragging ? 'opacity-50 scale-95 bg-blue-50 shadow-lg' : ''}
                ${isOver ? 'bg-blue-50' : ''}
                ${!isDragging && !isOver ? 'hover:bg-gray-50' : ''}
            `}
        >
            <div className="flex items-center gap-2">
                <svg
                    className={`
                        w-4 h-4
                        transition-opacity duration-200
                        ${isDragging ? 'text-blue-500' : 'text-gray-400'}
                        ${!isDragging ? 'opacity-0 group-hover:opacity-100' : ''}
                    `}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 8h16M4 16h16"
                    />
                </svg>
                <span className="font-medium">{column.title}</span>
            </div>

            {isOver && (
                <>
                    <div className="absolute -left-0.5 inset-y-0 w-0.5 bg-blue-500" />
                    <div className="absolute -right-0.5 inset-y-0 w-0.5 bg-blue-500" />
                </>
            )}

            {isDragging && (
                <div className="absolute inset-0 rounded-md ring-2 ring-blue-500 ring-opacity-50" />
            )}
        </div>
    );
};

// Thêm hàm để lấy thứ tự cột mặc định
const getDefaultColumnOrder = (columns) => {
    return columns.map(col => col.key);
};

const FrmADList = () => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);
    const [advertisements, setAdvertisements] = useState<Advertisement[]>([]);
    const [filteredAdvertisements, setFilteredAdvertisements] = useState<Advertisement[]>([]);
    const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
    const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
    const [searchText, setSearchText] = useState('');
    const [isSearchVisible, setIsSearchVisible] = useState(false);
    const [searchColumnKey, setSearchColumnKey] = useState<string | null>(null);
    const [showAll, setShowAll] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { token } = useAuth();
    const apiUrl = (import.meta as any).env.VITE_API_URL;
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [categories, setCategories] = useState<CategoryResponse[]>([]);
    const [services, setServices] = useState<AdvertisementServiceResponse[]>([]);
    const [selectedService, setSelectedService] = useState<string | null>(null);

    // Sửa lại hàm getColumnContextMenu
    const getColumnContextMenu = (columnKey: string): MenuProps => ({
        items: [
            {
                key: '1',
                label: 'Tìm kiếm',
                icon: <SearchOutlined />,
                onClick: () => {
                    setSearchColumnKey(columnKey);
                    setIsSearchVisible(true);
                    // Reset search text khi mở ô tìm kiếm mới
                    setSearchText('');
                }
            }
        ],
        // Thêm để đảm bảo menu hiển thị đúng
        onClick: (e) => {
            e.domEvent.stopPropagation();
        }
    });

    // Khởi tạo columns với thứ tự từ localStorage hoặc mặc định
    const [columns, setColumns] = useState(() => {
        const savedColumnOrder = localStorage.getItem('advertisementColumnOrder');
        const defaultColumns = [
            {
                title: <span className="text-base">ID</span>,
                dataIndex: 'advertisementId',
                key: 'advertisementId',
                width: 70,
                render: (text: string) => <span className="font-medium text-base">{text}</span>,
                sorter: (a, b) => a.advertisementId - b.advertisementId,
            },
            {
                title: (
                    <Dropdown
                        menu={getColumnContextMenu('mainAdvertisementName')}
                        trigger={['contextMenu']}
                        overlayStyle={{ zIndex: 1051 }}
                        onContextMenu={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                        }}
                    >
                        <div
                            className="flex flex-col items-start w-full"
                            onMouseDown={e => e.stopPropagation()}
                            onClick={e => e.stopPropagation()}
                        >
                            <span className="text-base">Tên quảng cáo</span>
                            {isSearchVisible && searchColumnKey === 'mainAdvertisementName' && (
                                <div
                                    className="flex items-center gap-2 mt-2 w-full"
                                    onClick={e => e.stopPropagation()}
                                    onMouseDown={e => e.stopPropagation()}
                                >
                                    <Input
                                        autoFocus // Thêm để tự động focus vào input
                                        placeholder="Tìm kiếm..."
                                        value={searchText}
                                        onChange={(e) => {
                                            e.stopPropagation();
                                            setSearchText(e.target.value);
                                        }}
                                        style={{ width: 150 }}
                                        allowClear
                                        onMouseDown={e => e.stopPropagation()}
                                        onClick={e => e.stopPropagation()}
                                        onKeyDown={e => e.stopPropagation()}
                                        className="!z-[1052]"
                                    />
                                    <CloseOutlined
                                        className="text-gray-400 hover:text-gray-600 cursor-pointer text-sm !z-[1052]"
                                        onMouseDown={e => e.stopPropagation()}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setSearchText('');
                                            setIsSearchVisible(false);
                                            fetchAdvertisements(pagination.current, pagination.pageSize, selectedStatus);
                                        }}
                                    />
                                </div>
                            )}
                        </div>
                    </Dropdown>
                ),
                dataIndex: 'mainAdvertisementName',
                key: 'mainAdvertisementName',
                width: window.innerWidth < 768 ? 180 : 200,
                render: (text: string) => (
                    <span className="font-medium text-base">{text}</span>
                ),
                sorter: (a, b) => a.mainAdvertisementName.localeCompare(b.mainAdvertisementName),
            },
            {
                title: <span className="text-base">Dịch vụ</span>,
                dataIndex: 'serviceName',
                key: 'serviceName',
                width: 150,
            },
            {
                title: <span className="text-base">Thời gian</span>,
                key: 'time',
                width: 200,
                render: (record: any) => (
                    <div>
                        <div>Bắt đầu: {new Date(record.adStartDate).toLocaleDateString()}</div>
                        <div>Kết thúc: {new Date(record.adEndDate).toLocaleDateString()}</div>
                    </div>
                ),
                sorter: (a, b) => new Date(a.adStartDate).getTime() - new Date(b.adStartDate).getTime(),
            },
            {
                title: <span className="text-base">Tương tác</span>,
                key: 'interactions',
                width: 200,
                render: (record: any) => (
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <span className="flex items-center gap-1">
                                <i className="fas fa-eye text-blue-500"></i>
                                <span className="font-medium">Lượt xem:</span>
                            </span>
                            <span className="text-blue-600 font-semibold">{record.views}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="flex items-center gap-1">
                                <span className="font-medium">Lượt thích:</span>
                            </span>
                            <span className="text-red-600 font-semibold">{record.likes}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="flex items-center gap-1">
                                <i className="fas fa-mouse-pointer text-green-500"></i>
                                <span className="font-medium">Lượt click:</span>
                            </span>
                            <span className="text-green-600 font-semibold">{record.clicks}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="flex items-center gap-1">
                                <i className="fas fa-bookmark text-purple-500"></i>
                                <span className="font-medium">Đã lưu:</span>
                            </span>
                            <span className="text-purple-600 font-semibold">{record.saved}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="flex items-center gap-1">
                                <i className="fas fa-share-alt text-indigo-500"></i>
                                <span className="font-medium">Chia sẻ:</span>
                            </span>
                            <span className="text-indigo-600 font-semibold">{record.shared}</span>
                        </div>
                    </div>
                ),
            },
            {
                title: <span className="text-base">Thông tin liên hệ</span>,
                key: 'contact',
                width: 200,
                render: (record: any) => (
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <i className="fas fa-phone text-green-500"></i>
                            <span className="font-medium">SĐT:</span>
                            <span className="text-blue-600">{record.phoneNumber}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <i className="fas fa-map-marker-alt text-red-500"></i>
                            <span className="font-medium">Địa chỉ:</span>
                            <span className="text-gray-600">{record.address}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <i className="fas fa-clock text-orange-500"></i>
                            <span className="font-medium">Giờ mở cửa:</span>
                            <span className="text-gray-600">
                                {record.openingHourStart.slice(0, 5)} - {record.openingHourEnd.slice(0, 5)}
                            </span>
                        </div>
                    </div>
                ),
            },
            {
                title: <span className="text-base">Giá</span>,
                key: 'price',
                width: 150,
                render: (record: any) => (
                    <div className="p-2 bg-gray-50 rounded-lg">
                        <div className="text-center">
                            <div className="text-green-600 font-semibold">
                                {record.priceRangeLow.toLocaleString('vi-VN')}đ
                            </div>
                            <div className="text-gray-400 my-1">đến</div>
                            <div className="text-green-600 font-semibold">
                                {record.priceRangeHigh.toLocaleString('vi-VN')}đ
                            </div>
                        </div>
                    </div>
                ),
            },
            {
                title: <span className="text-base">Liên kết</span>,
                key: 'links',
                width: 150,
                render: (record: any) => (
                    <div className="space-y-2">
                        {record.googleMapLink && (
                            <a
                                href={record.googleMapLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-blue-500 hover:text-blue-600 transition-colors"
                            >
                                <i className="fab fa-google text-red-500"></i>
                                <span>Google Maps</span>
                            </a>
                        )}
                        {record.websiteLink && (
                            <a
                                href={record.websiteLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-blue-500 hover:text-blue-600 transition-colors"
                            >
                                <i className="fas fa-globe text-blue-500"></i>
                                <span>Website</span>
                            </a>
                        )}
                        {record.facebookLink && (
                            <a
                                href={record.facebookLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-blue-500 hover:text-blue-600 transition-colors"
                            >
                                <i className="fab fa-facebook text-blue-600"></i>
                                <span>Facebook</span>
                            </a>
                        )}
                        {record.zaloLink && (
                            <a
                                href={record.zaloLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-blue-500 hover:text-blue-600 transition-colors"
                            >
                                <i className="fas fa-comment text-blue-500"></i>
                                <span>Zalo</span>
                            </a>
                        )}
                    </div>
                ),
            },
            {
                title: <span className="text-base">Trạng thái</span>,
                dataIndex: 'adStatus',
                key: 'adStatus',
                width: 130,
                render: (status: string) => (
                    <span className={`text-base ${status === 'Active' ? 'text-green-500' :
                        status === 'Pending' ? 'text-yellow-500' :
                            status === 'Approved' ? 'text-blue-500' :
                                status === 'Rejected' ? 'text-red-500' :
                                    'text-gray-500'
                        }`}>
                        {status}
                    </span>
                ),
            },
            {
                title: <span className="text-base">Thao tác</span>,
                key: 'action',
                width: 150,
                fixed: 'right',
                className: 'action-column',
                render: (_: any, record: Advertisement) => (
                    <div className="flex flex-col gap-2">
                        <Space>
                            <Button
                                type="primary"
                                size="small"
                                icon={<EditOutlined />}
                                onClick={() => handleEdit(record)}
                                className="bg-blue-500 hover:bg-blue-600"
                            >
                                Sửa
                            </Button>
                            <Button
                                type="primary"
                                danger
                                size="small"
                                icon={<DeleteOutlined />}
                                onClick={() => handleDelete(record)}
                            >
                                Xóa
                            </Button>
                        </Space>
                        <Button
                            type="default"
                            size="small"
                            icon={<HeartOutlined className="text-red-500" />}
                            onClick={() => handleAddToFavorite(record)}
                            className="border-red-500 hover:border-red-600 hover:text-red-600"
                        >
                            Yêu thích
                        </Button>
                        <Button
                            type="default"
                            size="small"
                            icon={<QuestionCircleOutlined className="text-blue-500" />}
                            onClick={() => navigate(`/advertisements/${record.advertisementId}/faqs`)}
                            className="border-blue-500 hover:border-blue-600 hover:text-blue-600"
                        >
                            Q&A
                        </Button>
                    </div>
                ),
            },
        ];

        if (savedColumnOrder) {
            const orderArray = JSON.parse(savedColumnOrder);
            return orderArray
                .map(key => defaultColumns.find(col => col.key === key))
                .filter(Boolean);
        }

        localStorage.setItem('advertisementColumnOrder', JSON.stringify(getDefaultColumnOrder(defaultColumns)));
        return defaultColumns;
    });

    const moveColumn = (fromIndex, toIndex) => {
        const updatedColumns = [...columns];
        const [movedColumn] = updatedColumns.splice(fromIndex, 1);
        updatedColumns.splice(toIndex, 0, movedColumn);
        setColumns(updatedColumns);

        const newOrder = updatedColumns.map(col => col.key);
        localStorage.setItem('advertisementColumnOrder', JSON.stringify(newOrder));
    };

    const fetchAdvertisements = async (
        page = 1,
        pageSize = 10,
        status: string | null = null,
        category: string | null = null,
        service: string | null = null
    ) => {
        setLoading(true);
        try {
            let url = `${apiUrl}/api/v2/main-advertisements?page=${page - 1}&size=${showAll ? 1000 : pageSize}`;

            // Add query parameters
            if (status) {
                url += `&adStatus=${status}`;
            }
            if (category) {
                url += `&categoryName=${category}`;
            }
            if (service) {
                url += `&serviceName=${service}`;
            }

            const response = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch advertisements');
            }

            const data = await response.json();
            setAdvertisements(data.result.content);
            setFilteredAdvertisements(data.result.content);
            setPagination({
                current: data.result.pageable.pageNumber + 1,
                pageSize: data.result.pageable.pageSize,
                total: data.result.totalElements,
            });
        } catch (error) {
            message.error('Failed to fetch advertisements');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAdvertisements(
            pagination.current,
            pagination.pageSize,
            selectedStatus,
            selectedCategory,
            selectedService
        );
    }, [selectedStatus, selectedCategory, selectedService]);

    useEffect(() => {
        if (searchText === '') {
            setFilteredAdvertisements(advertisements);
        } else {
            const filteredData = advertisements.filter(ad =>
                removeVietnameseTones(ad.mainAdvertisementName.toLowerCase()).includes(removeVietnameseTones(searchText.toLowerCase()))
            );
            setFilteredAdvertisements(filteredData);
        }
    }, [searchText, advertisements]);

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        filterAdvertisements(selectedService, selectedCategory);
    }, [advertisements]);

    const handleTableChange = (newPagination) => {
        fetchAdvertisements(
            newPagination.current,
            newPagination.pageSize,
            selectedStatus,
            selectedCategory,
            selectedService
        );
    };

    const handleStatusChange = (value: string | null) => {
        setSelectedStatus(value);
        setPagination({ ...pagination, current: 1 });
    };

    const handleSearch = (value: string) => {
        setSearchText(value);
    };

    const handleEdit = (record: Advertisement) => {
        dispatch(setCurrentAdvertisement(record));
        localStorage.setItem('currentAdvertisement', JSON.stringify(record));
        navigate('/advertisements/update');
    };

    const handleDelete = (record: Advertisement) => {
        Modal.confirm({
            title: 'Xác nhận xóa',
            content: 'Bạn có chắc chắn muốn xóa quảng cáo này không?',
            okText: 'Xóa',
            okType: 'danger',
            cancelText: 'Hủy',
            onOk: async () => {
                try {
                    const response = await fetch(`${apiUrl}/api/v1/main-advertisements/${record.advertisementId}`, {
                        method: 'DELETE',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                    });

                    if (!response.ok) {
                        throw new Error('Failed to delete advertisement');
                    }

                    message.success('Xóa quảng cáo thành công');
                    fetchAdvertisements(pagination.current, pagination.pageSize, selectedStatus);
                } catch (error) {
                    message.error('Xóa quảng cáo thất bại');
                }
            },
        });
    };

    const handleToggleShowAll = () => {
        setShowAll(!showAll);
        setPagination(prev => ({ ...prev, current: 1 }));
        fetchAdvertisements(1, showAll ? 10 : 1000, selectedStatus);
    };

    const removeVietnameseTones = (str: string) => {
        return str
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/đ/g, 'd')
            .replace(/Đ/g, 'D');
    };

    const handleRowDoubleClick = (record: Advertisement) => {
        dispatch(setCurrentAdvertisement(record));
        localStorage.setItem('currentAdvertisement', JSON.stringify(record));
        navigate('/advertisements/update');
    };

    const fetchCategories = async () => {
        try {
            const response = await fetch(`${apiUrl}/api/v1/categories`);
            if (!response.ok) {
                throw new Error('Failed to fetch categories');
            }
            const data = await response.json();
            if (data.result) {
                // Lọc các category active và sắp xếp theo tên
                const activeCategories = data.result
                    .filter(cat => cat.isActive)
                    .sort((a, b) => a.categorySeq - b.categorySeq);
                setCategories(activeCategories);

                // Log để debug
                // console.log('Fetched categories:', activeCategories);
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
            message.error('Không thể tải danh sách danh mục');
        }
    };

    const fetchServicesByCategory = async (categoryNameNoDiacritics: string) => {
        try {
            const response = await fetch(
                `${apiUrl}/api/v1/advertisement-services/category?categoryName=${categoryNameNoDiacritics.toLowerCase()}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                }
            );
            if (!response.ok) {
                throw new Error('Failed to fetch services');
            }
            const data = await response.json();
            if (data.result && Array.isArray(data.result)) {
                const services = data.result
                    .sort((a, b) => a.serviceName.localeCompare(b.serviceName));

                if (services.length === 0) {
                    message.info('Không có dịch vụ nào trong danh mục này');
                }

                setServices(services);
            } else {
                setServices([]);
                message.info('Không có dịch vụ nào trong danh mục này');
            }
        } catch (error) {
            console.error('Error fetching services:', error);
            setServices([]);
            message.error('Không thể tải danh sách dịch vụ theo danh mục');
        }
    };

    const handleServiceChange = (value: string | null) => {
        setSelectedService(value);
        filterAdvertisements(value, selectedCategory);
    };

    const handleCategoryChange = (value: string | null) => {
        setSelectedCategory(value);
        setSelectedService(null); // Reset selected service when category changes

        if (value) {
            fetchServicesByCategory(value);
        } else {
            setServices([]);
        }

        filterAdvertisements(null, value);
    };

    const filterAdvertisements = (service: string | null, category: string | null) => {
        let filtered = [...advertisements];

        if (category && category !== 'all') {
            filtered = filtered.filter(ad =>
                removeVietnameseTones(ad.categoryNameNoDiacritics.toLowerCase()) ===
                removeVietnameseTones(category.toLowerCase())
            );
        }

        if (service) {
            filtered = filtered.filter(ad =>
                removeVietnameseTones(ad.serviceName.toLowerCase()) ===
                removeVietnameseTones(service.toLowerCase())
            );
        }

        setFilteredAdvertisements(filtered);
    };

    const handleAddToFavorite = async (record: Advertisement) => {
        try {
            const request = {
                advertisementId: record.advertisementId,
                serviceId: record.serviceId,
                addedDate: new Date().toISOString(),
                status: 'ACTIVE'
            };

            const response = await fetch(`${apiUrl}/api/v1/favorite-advertisements`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(request)
            });

            const data = await response.json();

            if (!response.ok) {
                if (data.code === 10005) {
                    message.warning('Quảng cáo này đã có trong danh sách yêu thích');
                    return;
                }
                throw new Error('Failed to add to favorites');
            }

            message.success('Đã thêm vào danh sách yêu thích');
        } catch (error) {
            console.error('Error:', error);
            message.error('Không thể thêm vào danh sách yêu thích');
        }
    };

    return (
        <DndProvider backend={HTML5Backend}>
            <Breadcrumb pageName="Quản Lý Quảng Cáo" />

            <div className="min-h-screen bg-gray-50">
                <div className="bg-white rounded-lg shadow-lg p-5">
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex gap-4">
                            <div className="flex flex-col gap-2">
                                {/* <div className="text-sm font-medium text-gray-700 mb-1">
                                    <span className="flex items-center gap-1">
                                        <i className="fas fa-filter text-blue-500"></i>
                                        Bộ lọc tìm kiếm
                                    </span>
                                </div> */}
                                <div className="flex gap-4">
                                    <div className="flex flex-col">
                                        <label className="text-sm text-gray-600 mb-1">Trạng thái</label>
                                        <Select
                                            style={{ width: 200 }}
                                            placeholder="Lọc theo trạng thái"
                                            allowClear
                                            value={selectedStatus}
                                            onChange={handleStatusChange}
                                        >
                                            <Select.Option value="Active">Active</Select.Option>
                                            <Select.Option value="Inactive">Inactive</Select.Option>
                                            <Select.Option value="Pending">Pending</Select.Option>
                                            <Select.Option value="Approved">Approved</Select.Option>
                                            <Select.Option value="Rejected">Rejected</Select.Option>
                                        </Select>
                                    </div>

                                    <div className="flex flex-col">
                                        <label className="text-sm text-gray-600 mb-1">Danh mục</label>
                                        <Select
                                            style={{ width: 200 }}
                                            placeholder="Lọc theo danh mục"
                                            allowClear
                                            value={selectedCategory}
                                            onChange={handleCategoryChange}
                                            className="w-64"
                                        >
                                            {categories
                                                .filter(cat => cat.isActive)
                                                .sort((a, b) => a.categorySeq - b.categorySeq)
                                                .map(category => (
                                                    <Select.Option
                                                        key={category.categoryId}
                                                        value={category.categoryNameNoDiacritics}
                                                    >
                                                        {category.categoryName}
                                                    </Select.Option>
                                                ))}
                                        </Select>
                                    </div>

                                    <div className="flex flex-col">
                                        <label className="text-sm text-gray-600 mb-1">Dịch vụ</label>
                                        <Select
                                            style={{ width: 200 }}
                                            placeholder="Lọc theo dịch vụ"
                                            allowClear
                                            value={selectedService}
                                            onChange={handleServiceChange}
                                            className="w-64"
                                        >
                                            {services.map(service => (
                                                <Select.Option
                                                    key={service.serviceId}
                                                    value={service.serviceName}
                                                >
                                                    {service.serviceName}
                                                </Select.Option>
                                            ))}
                                        </Select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={() => navigate('/advertisements/create')}
                            className="bg-green-500 hover:bg-green-600 flex items-center"
                        >
                            Thêm quảng cáo
                        </Button>
                    </div>

                    <Table
                        columns={columns.map((col, index) => ({
                            ...col,
                            title: (
                                <DraggableColumn
                                    column={col}
                                    index={index}
                                    moveColumn={moveColumn}
                                />
                            ),
                        }))}
                        dataSource={filteredAdvertisements}
                        rowKey="advertisementId"
                        loading={loading}
                        scroll={{ x: 1800 }}
                        pagination={showAll ? false : {
                            current: pagination.current,
                            pageSize: pagination.pageSize,
                            total: pagination.total,
                            showSizeChanger: true,
                            showTotal: (total) => `Tổng ${total} quảng cáo`,
                            className: 'px-4',
                        }}
                        onChange={handleTableChange}
                        className="rounded-lg text-base"
                        rowClassName={() => 'hover:bg-gray-50 cursor-pointer'}
                        onRow={(record) => ({
                            onDoubleClick: () => {
                                handleRowDoubleClick(record);
                            },
                        })}
                    />

                    <div className="flex justify-center">
                        <Button
                            onClick={handleToggleShowAll}
                            type="primary"
                            className="bg-blue-500 hover:bg-blue-600"
                        >
                            {showAll ? 'Hiển thị phân trang' : 'Xem tất cả'}
                        </Button>
                    </div>
                </div>
            </div>
        </DndProvider>
    );
};

export default FrmADList; 