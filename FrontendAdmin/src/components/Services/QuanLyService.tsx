import React, { useEffect, useState, useRef, useMemo } from 'react';
import { Table, Button, Space, Switch, message, Select, Modal } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, ArrowDownOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import Breadcrumb from '../Breadcrumbs/Breadcrumb';
import ServiceModal from './ServiceModal';
import { deleteService, getServices, updateService, getServiceById, deleteAdvertisementService } from '../../redux/thunks/service';
import { getCategories } from '../../redux/thunks/categories';
import { RootState } from '../../redux/store';
import { useLocation, useNavigate } from 'react-router-dom';


const QuanLyService = () => {
  const dispatch = useDispatch();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState<number | null>(null);
  const [isDeletingButton, setIsDeletingButton] = useState(false);
  const [isFullScreenLoading, setIsFullScreenLoading] = useState(false);
  const [deleteProgress, setDeleteProgress] = useState(0);

  const services = useSelector((state: RootState) => state.service.serviceAll);
  const categories = useSelector((state: RootState) => state.categories.items) || [];


  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        await dispatch(getCategories() as any);
        await dispatch(getServices() as any);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [dispatch]);

  useEffect(() => {
    const messageKey = 'category_message_shown';
    if (location.state?.selectedCategoryId && !localStorage.getItem(messageKey)) {
      setSelectedCategory(location.state.selectedCategoryId);
      message.info(`Đang xem dịch vụ của danh mục: ${location.state.categoryName}`);
      localStorage.setItem(messageKey, 'true');

      // Clear location state
      navigate(location.pathname, {
        state: null,
        replace: true
      });

      // Remove the flag after a short delay
      setTimeout(() => {
        localStorage.removeItem(messageKey);
      }, 1000);
    }
  }, [location.state, navigate]);

  const columns = [
    {
      title: <span className="text-base">ID</span>,
      dataIndex: 'serviceId',
      key: 'serviceId',
      render: (text) => <span className="font-medium text-base">{text}</span>,
      sorter: (a, b) => a.serviceId - b.serviceId,
      resizable: true,
    },
    {
      title: <span className="text-base">Tên dịch vụ</span>,
      dataIndex: 'serviceName',
      key: 'serviceName',
      render: (text) => <span className="font-medium text-base">{text}</span>,
      sorter: (a, b) => a.serviceName.localeCompare(b.serviceName),
      resizable: true,
    },
    {
      title: <span className="text-base">Danh mục</span>,
      dataIndex: 'categoryId',
      key: 'categoryId',
      render: (categoryId: number) => {
        const category = categories.find(cat => cat.categoryId === categoryId);
        return <span className="text-gray-600 text-base">{category ? category.categoryName : ''}</span>;
      },
      resizable: true,
    },
    {
      title: <span className="text-base">Mô tả</span>,
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
      render: (text) => <span className="text-gray-600 text-base">{text}</span>,
      resizable: true,
    },
    {
      title: <span className="text-base">Giao hàng</span>,
      dataIndex: 'deliveryAvailable',
      key: 'deliveryAvailable',
      align: 'center',
      render: (delivery: boolean | undefined) => (
        <div className="flex justify-center">
          <Switch
            checked={delivery}
            disabled={true}
            className={`${delivery ? 'bg-blue-500' : 'bg-slate-200'} opacity-60`}
          />
        </div>
      ),
      resizable: true,
    },
    {
      title: <span className="text-base">Trạng thái</span>,
      dataIndex: 'isActive',
      key: 'isActive',
      align: 'center',
      render: (active: boolean | undefined, record: { serviceId: any; }) => (
        <div className="flex justify-center">
          <Switch
            checked={active}
            onChange={(checked) => handleStatusChange(record.serviceId, checked)}
            className={active ? 'bg-blue-500' : 'bg-slate-200'}
          />
        </div>
      ),
      resizable: true,
    },
    {
      title: <span className="text-base">Thao tác</span>,
      key: 'action',
      align: 'center',
      className: 'action-column',
      render: (_: any, record: { serviceId: any; }) => (
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
            onClick={() => handleDelete(record.serviceId)}
          >
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  const handleDeliveryChange = async (serviceId: any, checked: boolean) => {
    try {
      await dispatch(updateService({
        serviceId,
        data: { deliveryAvailable: checked }
      }) as any);
      await dispatch(getServices() as any);
      message.success('Cập nhật trạng thái giao hàng thành công');
    } catch (error) {
      message.error('Cập nhật thất bại');
    }
  };

  const handleStatusChange = async (serviceId: any, checked: boolean) => {
    try {
      await dispatch(updateService({
        serviceId,
        data: { isActive: checked }
      }) as any);
      await dispatch(getServices() as any);
      message.success('Cập nhật trạng thái thành công');
    } catch (error) {
      message.error('Cập nhật thất bại');
    }
  };

  const handleEdit = async (service: any) => {
    try {
      const response = await dispatch(getServiceById(service.serviceId)).unwrap();
      const formattedService = {
        ...response,
        imageUrl: response.media?.[0]?.mediaUrl || '',
      };
      setEditingService(formattedService);
      setIsModalVisible(true);
    } catch (error) {
      message.error('Không thể tải thông tin dịch vụ');
    }
  };

  const handleDelete = (serviceId: number) => {
    setServiceToDelete(serviceId);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (serviceToDelete !== null) {
      try {
        // Bật loading cho nút và full screen
        setIsDeletingButton(true);
        setIsFullScreenLoading(true);
        setDeleteProgress(0);

        // Bắt đầu progress animation
        const interval = setInterval(() => {
          setDeleteProgress((prev) => {
            if (prev >= 90) {
              clearInterval(interval);
              return 90;
            }
            return prev + 5;
          });
        }, 100);

        // Thực hiện xóa service
        await dispatch(deleteAdvertisementService(serviceToDelete)).unwrap();

        // Sau khi xóa thành công, set progress lên 100%
        setDeleteProgress(100);

        // Cập nhật lại danh sách services
        await dispatch(getServices() as any);

        // Đợi một chút để người dùng thấy 100% trước khi đóng
        await new Promise(resolve => setTimeout(resolve, 500));

        message.success('Xóa dịch vụ thành công');
      } catch (error) {
        console.error('Delete service failed:', error);
        message.error('Xóa dịch vụ thất bại! Vui lòng thử lại.');
      } finally {
        clearInterval();
        setIsFullScreenLoading(false);
        setIsDeleteModalOpen(false);
        setServiceToDelete(null);
        setDeleteProgress(0);
        setIsDeletingButton(false);
      }
    }
  };

  const filteredServices = useMemo(() => {
    // console.log('Current selectedCategory:', selectedCategory);
    if (selectedCategory === null || selectedCategory === undefined || selectedCategory === 1) {
      return services;
    }
    return services.filter(service => service.categoryId === selectedCategory);
  }, [selectedCategory, services]);

  const handleModalClose = () => {
    setIsModalVisible(false);
    setEditingService(null);
    // Refresh data after modal closes
    dispatch(getServices() as any);
  };

  const handleToggleShowAll = () => {
    setShowAll(!showAll);
  };

  return (
    <>
      <Breadcrumb pageName="Quản Lý Dịch Vụ" />

      <div className="min-h-screen bg-gray-50">
        <div className="bg-white rounded-lg shadow-lg p-5">
          <div className="flex justify-between items-center mb-4">
            <Select
              style={{ width: 200 }}
              placeholder="Lọc theo danh mục"
              allowClear
              value={selectedCategory}
              onChange={(value) => {
                // console.log('Selected value:', value);
                setSelectedCategory(value === undefined ? null : value);
              }}
            >
              {categories?.map(category => (
                <Select.Option key={category.categoryId} value={category.categoryId}>
                  {category.categoryName}
                </Select.Option>
              ))}
            </Select>

            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => {
                setEditingService(null);
                setIsModalVisible(true);
              }}
              className="bg-green-500 hover:bg-green-600 flex items-center"
            >
              Thêm dịch vụ mới
            </Button>
          </div>

          <Table
            columns={columns}
            dataSource={showAll ? services : filteredServices as any}
            rowKey="serviceId"
            loading={loading}
            scroll={{ x: 'max-content' }}
            pagination={showAll ? false : {
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total) => `Tổng ${total} dịch vụ`,
              className: 'px-4',
            }}
            className="rounded-lg text-base"
            rowClassName={() => 'hover:bg-gray-50 cursor-pointer'}
          />

          <div className="flex justify-center">
            <Button
              onClick={handleToggleShowAll}
              type="primary"
              className={showAll ? "bg-blue-500 hover:bg-blue-600 mt-4" : "bg-green-500 hover:bg-green-600 mt-4"}
            >
              {showAll ? 'Hiển thị phân trang' : 'Xem tất cả'}
              <span className="ml-2">
                <ArrowDownOutlined />
              </span>
            </Button>
          </div>

          <ServiceModal
            visible={isModalVisible}
            onCancel={handleModalClose}
            service={editingService}
            categories={categories}
          />
        </div>
      </div>

      {/* Loading overlay */}
      {isFullScreenLoading && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-72">
            <div className="space-y-4">
              <div className="h-2 bg-gray-200 rounded">
                <div
                  className="h-full bg-blue-500 rounded transition-all duration-300"
                  style={{ width: `${deleteProgress}%` }}
                />
              </div>
              <p className="text-center text-gray-600">
                {deleteProgress === 100 ? 'Hoàn tất' : 'Đang xóa...'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirmation modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl w-11/12 max-w-md p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Xác nhận xóa</h2>
            <p className="text-gray-600 mb-6">Bạn có chắc chắn muốn xóa dịch vụ này không?</p>
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
                onClick={handleDeleteConfirm}
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

export default QuanLyService; 