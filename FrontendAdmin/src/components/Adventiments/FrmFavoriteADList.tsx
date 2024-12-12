import { useEffect, useState } from 'react';
import { Table, Button, Space, message, Select, Modal, Dropdown, Input } from 'antd';
import { DeleteOutlined, SearchOutlined, CloseOutlined, HeartOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import Breadcrumb from '../Breadcrumbs/Breadcrumb';
import { useLocation, useNavigate } from 'react-router-dom';
import { MainAdvertisementResponse } from '../../interfaces/MainAdvertisementResponse';
import { useAuth } from '../../context/AuthContext';
import type { MenuProps } from 'antd';

import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

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
                <span className="font-medium">{column.title}</span>
            </div>
        </div>
    );
};

const FrmFavoriteADList = () => {
    const [loading, setLoading] = useState(true);
    const [favoriteAds, setFavoriteAds] = useState<MainAdvertisementResponse[]>([]);
    const [filteredAds, setFilteredAds] = useState<MainAdvertisementResponse[]>([]);
    const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
    const [searchText, setSearchText] = useState('');
    const { token } = useAuth();
    const apiUrl = (import.meta as any).env.VITE_API_URL;
    const [selectedService, setSelectedService] = useState<string | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    const [categories, setCategories] = useState<CategoryResponse[]>([]);
    const [services, setServices] = useState<AdvertisementServiceResponse[]>([]);

    const [showAll, setShowAll] = useState(false);

    const fetchCategories = async () => {
        try {
            const response = await fetch(`${apiUrl}/api/v1/categories`);
            if (!response.ok) {
                throw new Error('Failed to fetch categories');
            }
            const data = await response.json();
            setCategories(data.result || []);
        } catch (error) {
            message.error('Không thể tải danh sách danh mục');
        }
    };
    const fetchServices = async () => {
        try {
            const response = await fetch(`${apiUrl}/api/v1/advertisement-services`);
            if (!response.ok) {
                throw new Error('Failed to fetch services');
            }
            const data = await response.json();
            if (data.result) {
                const activeServices = data.result
                    .filter(service => service.isActive)
                    .sort((a, b) => a.serviceName.localeCompare(b.serviceName));
                setServices(activeServices);
            }
        } catch (error) {
            message.error('Không thể tải danh sách dịch vụ');
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

    const columns = [
        {
            title: <span className="text-base">ID</span>,
            dataIndex: 'advertisementId',
            key: 'advertisementId',
            width: 70,
            render: (text: number) => <span className="font-medium text-base">{text}</span>,
        },
        {
            title: <span className="text-base">Tên quảng cáo</span>,
            dataIndex: 'mainAdvertisementName',
            key: 'mainAdvertisementName',
            width: 200,
            render: (text: string) => <span className="font-medium text-base">{text}</span>,
        },
        {
            title: <span className="text-base">Dịch vụ</span>,
            dataIndex: 'serviceName',
            key: 'serviceName',
            width: 150,
        },
        {
            title: <span className="text-base">Lượt thích</span>,
            dataIndex: 'likes',
            key: 'likes',
            width: 100,
            render: (likes: number) => (
                <div className="flex items-center">
                    <HeartOutlined className="text-red-500 mr-1" />
                    <span>{likes}</span>
                </div>
            ),
        },
        {
            title: <span className="text-base">Trạng thái</span>,
            dataIndex: 'adStatus',
            key: 'adStatus',
            width: 120,
            render: (status: string) => (
                <span className={`
                    px-2 py-1 rounded-full text-sm
                    ${status === 'Active' ? 'bg-green-100 text-green-800' : ''}
                    ${status === 'Inactive' ? 'bg-gray-100 text-gray-800' : ''}
                    ${status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : ''}
                `}>
                    {status}
                </span>
            ),
        },
        {
            title: <span className="text-base">Thao tác</span>,
            key: 'action',
            width: 100,
            fixed: 'right',
            render: (_: any, record: MainAdvertisementResponse) => (
                <Button
                    type="primary"
                    danger
                    size="small"
                    icon={<DeleteOutlined />}
                    onClick={() => handleRemoveFavorite(record)}
                >
                    Xóa
                </Button>
            ),
        },
    ];

    const fetchFavoriteAds = async (page: number, pageSize: number) => {
        setLoading(true);
        try {
            const response = await fetch(
                `${apiUrl}/api/v1/favorite-advertisements/all?page=${page - 1}&size=${pageSize}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                }
            );

            if (!response.ok) {
                throw new Error('Failed to fetch favorite advertisements');
            }

            const data = await response.json();
            const { content, totalElements } = data.result;
            
            setFavoriteAds(content);
            setFilteredAds(content);
            setPagination(prev => ({
                ...prev,
                current: page,
                pageSize: pageSize,
                total: totalElements
            }));
        } catch (error) {
            console.error('Error:', error);
            message.error('Không thể tải danh sách quảng cáo yêu thích');
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveFavorite = async (record: MainAdvertisementResponse) => {
        Modal.confirm({
            title: 'Xác nhận xóa',
            content: 'Bạn có chắc chắn muốn xóa quảng cáo này khỏi danh sách yêu thích?',
            okText: 'Xóa',
            okType: 'danger',
            cancelText: 'Hủy',
            onOk: async () => {
                try {
                    const response = await fetch(`${apiUrl}/api/v1/favorite-advertisements/advertisement/${record.advertisementId}`, {
                        method: 'DELETE',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                        },
                    });

                    if (!response.ok) {
                        throw new Error('Failed to remove from favorites');
                    }

                    message.success('Đã xóa khỏi danh sách yêu thích');
                    fetchFavoriteAds(1, pagination.pageSize);
                } catch (error) {
                    message.error('Không thể xóa khỏi danh sách yêu thích');
                }
            },
        });
    };

    const handleServiceChange = (value: string | null) => {
        setSelectedService(value);
        filterAdvertisements(value, selectedCategory);
    };

    const handleCategoryChange = (value: string | null) => {
        setSelectedCategory(value);
        setSelectedService(null);
        
        if (value) {
            fetchServicesByCategory(value);
        } else {
            fetchServices();
        }
        
        filterAdvertisements(null, value);
    };

    const filterAdvertisements = (service: string | null, category: string | null) => {
        let filtered = [...favoriteAds];

        if (service) {
            filtered = filtered.filter(ad =>
                ad.serviceName === service
            );
        }

        if (category && category !== 'all') {
            filtered = filtered.filter(ad =>
                ad.categoryNameNoDiacritics === category
            );
        }

        setFilteredAds(filtered);
    };

    const handleToggleShowAll = () => {
        const newShowAll = !showAll;
        setShowAll(newShowAll);
        setPagination(prev => ({ ...prev, current: 1 }));
        fetchFavoriteAds(1, newShowAll ? 1000 : 10);
    };

    const handleTableChange = (newPagination) => {
        fetchFavoriteAds(newPagination.current, newPagination.pageSize);
    };

    useEffect(() => {
        fetchFavoriteAds(1, 10);
        fetchCategories();
    }, []);

    return (
        <DndProvider backend={HTML5Backend}>
            <Breadcrumb pageName={<>Quảng Cáo Yêu Thích <HeartOutlined className="text-red-500 text-xl mr-2" /> </>} />

            <div className="min-h-screen bg-gray-50">
                <div className="bg-white rounded-lg shadow-lg p-5">
                    <div className="flex gap-4 mb-4">
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
                    <Table
                        columns={columns}
                        dataSource={filteredAds}
                        rowKey="advertisementId"
                        loading={loading}
                        pagination={showAll ? false : {
                            current: pagination.current,
                            pageSize: pagination.pageSize,
                            total: pagination.total,
                            showSizeChanger: true,
                            showTotal: (total) => `Tổng ${total} quảng cáo`,
                        }}
                        onChange={handleTableChange}
                        className="rounded-lg text-base"
                        scroll={{ x: 1000 }}
                    />

                    <div className="flex justify-center mt-4">
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

export default FrmFavoriteADList; 