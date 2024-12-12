import { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, Switch, message, Popconfirm, Upload, Tag, Space } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import axios from 'axios';
import { RootState } from '../../redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { createCategory, deleteCategory, getCategories, updateCategoryStatus, updateCategory } from '../../redux/thunks/categories';
import { LoadingOutlined, PlusOutlined, EditOutlined, DeleteOutlined, HomeOutlined, AppstoreOutlined } from '@ant-design/icons';
import { uploadOneImage } from '../../redux/thunks/cloudDinary';
import { Link, useNavigate } from 'react-router-dom';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import LoadingProgress from '../LoadingProgress/LoadingProgress';

interface CategoryType {
  categoryId: number;
  categoryName: string;
  categoryNameNoDiacritics: string;
  categorySeq: number;
  createdDate: string;
  imageLink: string;
  isActive: boolean;
  remark: string;
  updatedDate: string;
  advertisementServices: string | null;
}

const FrmCategories = () => {
  // const [categories, setCategories] = useState<CategoryType[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form] = Form.useForm();
  const [uploadLoading, setUploadLoading] = useState(false);
  const [tempFile, setTempFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showProgress, setShowProgress] = useState(false);
  const url = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  const columns: ColumnsType<CategoryType> = [
    {
      title: <span className="text-base">ID</span>,
      dataIndex: 'categoryId',
      align: 'center',
      sorter: (a, b) => a.categoryId - b.categoryId,
      resizable: true,
      className: 'text-base',
    },
    {
      title: <span className="text-base">Tên danh mục</span>,
      dataIndex: 'categoryName',
      render: (text) => <span className="font-medium text-base">{text}</span>,
      sorter: (a, b) => a.categoryName.localeCompare(b.categoryName),
      resizable: true,
    },
    {
      title: <span className="text-base">Tên tiếng anh</span>,
      dataIndex: 'categoryNameNoDiacritics',
      render: (text) => <span className="text-gray-600 text-base">{text}</span>,
      sorter: (a, b) => a.categoryNameNoDiacritics.localeCompare(b.categoryNameNoDiacritics),
      resizable: true,
    },
    {
      title: <span className="text-base">Thứ tự</span>,
      dataIndex: 'categorySeq',
      align: 'center',
      sorter: (a, b) => a.categorySeq - b.categorySeq,
      resizable: true,
      className: 'text-base',
    },
    {
      title: <span className="text-base">Icon</span>,
      dataIndex: 'imageLink',
      align: 'center',
      render: (text) => text ? (
        <div className="flex justify-center items-center">
          <div className="w-10 h-10 bg-[#24BC5A] rounded-lg flex justify-center items-center">
            <img
              src={text}
              alt="category"
              className="w-8 h-8 rounded-lg object-cover border border-white shadow-sm"
            />
          </div>
        </div>
      ) : (
        <div className="text-center">
          <span className="text-gray-400">No Icon</span>
        </div>
      ),
      resizable: true,
    },
    {
      title: <span className="text-base">Trạng thái</span>,
      dataIndex: 'isActive',
      align: 'center',
      render: (active, record) => (
        <div className="flex justify-center">
          <Switch
            checked={active}
            onChange={(checked) => handleStatusChange(record.categoryId, checked)}
            className={active ? 'bg-blue-500' : 'bg-slate-200'}
          />
        </div>
      ),
      resizable: true,
    },
    {
      title: <span className="text-base">Thao tác</span>,
      key: 'action',
      fixed: 'right',
      align: 'center',
      render: (_, record) => (
        <Button
          type="primary"
          size="small"
          icon={<EditOutlined />}
          className="bg-blue-500 hover:bg-blue-600"
          onClick={() => handleEdit(record)}
        >
          Sửa
        </Button>
      ),
    },
  ];

  const dispatch = useDispatch();
  const categories = useSelector((state: RootState) => state.categories.items);

  useEffect(() => {
    dispatch(getCategories() as any);
    // console.log("Categories from Redux:", categories);
  }, [dispatch]);


  const handleEdit = (record: CategoryType) => {
    setEditingId(record.categoryId);
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    try {
      dispatch(deleteCategory(id) as any);
      message.success('Xóa danh mục thành công');
    } catch (error) {
      message.error('Lỗi khi xóa danh mục');
    }
  };

  const handleCreate = async (values: any) => {
    try {
      dispatch(createCategory(values) as any);
      message.success('Thêm danh mục thành công');
    } catch (error) {
      message.error('Lỗi khi thêm danh mục');
    }
  };

  const beforeUpload = (file: File) => {
    // Kiểm tra định dạng file
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      message.error('Chỉ được upload file ảnh!');
      return Upload.LIST_IGNORE;
    }

    // Kiểm tra kích thưc file (2MB)
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Kích thước ảnh phải nhỏ hơn 2MB!');
      return Upload.LIST_IGNORE;
    }

    // Tạo preview URL
    const previewURL = URL.createObjectURL(file);
    setPreviewUrl(previewURL);
    setTempFile(file);
    return false; // Prevent default upload
  };

  const handleSubmit = async (values: any) => {
    try {
      setShowProgress(true);
      setUploadProgress(0);
      const token = sessionStorage.getItem('token');
      
      if (!token) {
        message.error('Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại');
        return;
      }

      if (editingId) {
        // Xử lý cập nhật category
        if (tempFile) {
          const formData = new FormData();
          formData.append('file', tempFile);
          setUploadProgress(30);
          const uploadResponse = await dispatch(uploadOneImage({ formData }) as any);
          setUploadProgress(60);
          
          if (!uploadResponse.payload) {
            throw new Error('Không thể tải lên hình ảnh');
          }
          values.imageLink = uploadResponse.payload;
        }

        // Gọi API update category
        setUploadProgress(80);
        const updateResult = await dispatch(updateCategory({ 
          categoryId: editingId,
          data: values,
          token 
        }) as any);
        setUploadProgress(100);

        if (updateResult.error) {
          throw new Error(updateResult.error.message || 'Lỗi khi cập nhật danh mục');
        }

        message.success('Cập nhật danh mục thành công');
      } else {
        // Xử lý thêm mới category
        if (!tempFile) {
          message.error('Vui lòng tải lên hình ảnh!');
          return;
        }

        // Upload ảnh
        const formData = new FormData();
        formData.append('file', tempFile);
        setUploadProgress(30);
        const uploadResponse = await dispatch(uploadOneImage({ formData }) as any);
        setUploadProgress(60);

        if (!uploadResponse.payload) {
          throw new Error('Không thể tải lên hình ảnh');
        }

        // Tạo object data để gửi lên API
        const submitData = {
          categoryName: values.categoryName,
          categoryNameNoDiacritics: values.categoryNameNoDiacritics,
          categorySeq: values.categorySeq,
          imageLink: uploadResponse.payload
        };

        // Gọi API create category
        setUploadProgress(80);
        const createResult = await dispatch(createCategory(submitData) as any);
        setUploadProgress(100);
        
        if (createResult.error) {
          throw new Error(createResult.error.message || 'Lỗi khi tạo danh mục');
        }

        message.success('Thêm danh mục thành công');
      }

      // Reset form và states
      setIsModalVisible(false);
      form.resetFields();
      setTempFile(null);
      setPreviewUrl('');
      
      // Refresh danh sách categories
      dispatch(getCategories() as any);

    } catch (error: any) {
      if (error.response?.status === 401) {
        message.error('Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại');
      } else {
        message.error(error.message || 'Có lỗi xảy ra khi lưu danh mục');
      }
      console.error('Error in handleSubmit:', error);
    } finally {
      setShowProgress(false);
    }
  };

  // Cập nhật handleStatusChange để sử dụng sessionStorage
  const handleStatusChange = async (categoryId: number, status: boolean) => {
    try {
      const token = sessionStorage.getItem('token');
      if (!token) {
        message.error('Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại');
        return;
      }
      const result = await dispatch(updateCategoryStatus({ categoryId, status, token }) as any);
      if (result.error) {
        throw new Error(result.error);
      }
      message.success('Cập nhật trạng thái thành công');
      dispatch(getCategories() as any);
    } catch (error) {
      message.error('Lỗi khi cập nhật trạng thái');
      dispatch(getCategories() as any);
    }
  };

  // Thêm hàm helper để tìm seq max
  const getMaxSeq = (categories: CategoryType[]) => {
    return categories.reduce((max, cat) => Math.max(max, cat.categorySeq), 0);
  };

  const handleRowDoubleClick = (record: CategoryType) => {
    navigate('/forms/form-elements', { 
      state: { 
        selectedCategoryId: record.categoryId,
        categoryName: record.categoryName,
        showMessage: true
      } 
    });
  };

  return (
    <>
      <Breadcrumb pageName="Quản lý danh mục" />
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white rounded-lg shadow-lg p-5">
            <div className="flex justify-between items-center mb-4">
              <Button
                type="primary"
                icon={<PlusOutlined />}
                className='bg-green-500 hover:bg-green-600 flex items-center'
                onClick={() => {
                  setEditingId(null);
                  form.resetFields();
                  form.setFieldValue('categorySeq', getMaxSeq(categories) + 1); // Set giá trị mặc định
                  setIsModalVisible(true);
                }}
              >
                Thêm danh mục
              </Button>
            </div>

            <Table
              columns={columns}
              dataSource={categories}
              rowKey="categoryId"
              loading={loading}
              scroll={{ x: 'max-content' }}
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showTotal: (total) => `Tổng ${total} danh mục`,
                className: 'px-4',
              }}
              className="rounded-lg text-base"
              rowClassName={() => 'hover:bg-gray-50 cursor-pointer'}
              onRow={(record) => ({
                onDoubleClick: () => handleRowDoubleClick(record),
              })}
            />
        </div>

        <Modal
          title={editingId ? "Sửa danh mục" : "Thêm danh mục mới"}
          open={isModalVisible}
          onCancel={() => {
            setIsModalVisible(false);
            form.resetFields();
            setPreviewUrl('');
            setTempFile(null);
          }}
          footer={null}
          width={500}
          className='modal-custom'
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            className="py-2"
          >
            <div className="space-y-4">
              {/* Category Name */}
              <Form.Item
                name="categoryName"
                label={
                  <span className="text-gray-700 font-medium">
                    Tên danh mục <span className="text-red-500">*</span>
                  </span>
                }
                rules={[
                  { required: true, message: 'Vui lòng nhập tên danh mục!' },
                  { max: 20, message: 'Tên danh mục không được quá 20 ký tự!' }
                ]}
              >
                <Input 
                  className="shadow-sm hover:border-blue-400 focus:border-blue-500" 
                  placeholder="Nhập tên danh mục"
                />
              </Form.Item>

              {/* English Name - Always visible */}
              <Form.Item
                name="categoryNameNoDiacritics"
                label={
                  <span className="text-gray-700 font-medium">
                    Tên tiếng anh <span className="text-red-500">*</span>
                  </span>
                }
                rules={[
                  { required: true, message: 'Vui lòng nhập tên tiếng anh!' },
                  { max: 20, message: 'Tên không được quá 20 ký tự!' }
                ]}
              >
                <Input 
                  className="shadow-sm hover:border-blue-400 focus:border-blue-500"
                  placeholder="Nhập tên tiếng anh"
                />
              </Form.Item>

              {/* Sequence Number */}
              <Form.Item
                name="categorySeq"
                label={
                  <span className="text-gray-700 font-medium">
                    Thứ tự <span className="text-red-500">*</span>
                  </span>
                }
                rules={[
                  { required: true, message: 'Vui lòng nhập thứ tự!' }
                ]}
              >
                <InputNumber 
                  min={0} 
                  className="w-full shadow-sm hover:border-blue-400 focus:border-blue-500"
                  placeholder="Nhập thứ tự hiển thị"
                />
              </Form.Item>

              {/* Image Upload */}
              <Form.Item
                name="imageLink"
                label={
                  <span className="text-gray-700 font-medium">
                    Hình ảnh <span className="text-red-500">*</span>
                  </span>
                }
                rules={[
                  { required: true, message: 'Vui lòng tải lên hình ảnh!' },
                ]}
              >
                <div className="flex flex-col items-center space-y-3">
                  <Upload
                    name="file"
                    listType="picture-card"
                    showUploadList={false}
                    beforeUpload={beforeUpload}
                    className="shadow-sm bg-[#24BC5A] rounded-lg"
                  >
                    {(previewUrl || form.getFieldValue('imageLink')) ? (
                      <div className="relative group ">
                        <div className="w-full h-full rounded-lg flex justify-center items-center">
                          <img
                            src={previewUrl || form.getFieldValue('imageLink')}
                            alt="category icon"
                            className="w-[80%] h-[80%] object-cover"
                          />
                        </div>
                        <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg">
                          <EditOutlined className="text-white text-xl" />
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center p-3">
                        {uploadLoading ? <LoadingOutlined className="text-xl" /> : <PlusOutlined className="text-xl" />}
                        <div className="mt-1 text-gray-500">Tải ảnh lên</div>
                      </div>
                    )}
                  </Upload>

                  {(previewUrl || form.getFieldValue('imageLink')) && (
                    <Button
                      danger
                      type="text"
                      icon={<DeleteOutlined />}
                      onClick={() => {
                        setPreviewUrl('');
                        setTempFile(null);
                        form.setFieldValue('imageLink', '');
                      }}
                      className="hover:text-red-600"
                    >
                      Xóa ảnh
                    </Button>
                  )}
                </div>
              </Form.Item>

              {/* Status and Remarks - Only show when editing */}
              {editingId && (
                <div className="space-y-4">
                  <Form.Item
                    name="isActive"
                    label={<span className="text-gray-700 font-medium">Trạng thái</span>}
                    valuePropName="checked"
                  >
                    <Switch checkedChildren="Hoạt động" unCheckedChildren="Không hoạt động"/>
                  </Form.Item>

                  <Form.Item
                    name="remark"
                    label={<span className="text-gray-700 font-medium">Ghi chú</span>}
                    rules={[
                      { max: 255, message: 'Ghi chú không được quá 255 ký tự!' }
                    ]}
                  >
                    <Input.TextArea 
                      rows={3}
                      className="shadow-sm hover:border-blue-400 focus:border-blue-500"
                      placeholder="Nhập ghi chú (nếu có)"
                    />
                  </Form.Item>
                </div>
              )}

              {/* Form Actions */}
              <Form.Item className="flex justify-end mb-0 mt-4">
                <Space>
                  <Button 
                    onClick={() => setIsModalVisible(false)}
                    className="hover:bg-gray-100"
                  >
                    Hủy
                  </Button>
                  <Button 
                    type="primary" 
                    htmlType="submit"
                    className='bg-blue-500 hover:bg-blue-600'
                  >
                    {editingId ? 'Cập nhật' : 'Thêm mới'}
                  </Button>
                </Space>
              </Form.Item>
            </div>
          </Form>
        </Modal>
      </div>
      {showProgress && (
        <LoadingProgress 
          progress={uploadProgress}
          message={`Đang xử lý ${uploadProgress === 100 ? 'hoàn tất' : '...'}`}
        />
      )}
    </>
  );
};

export default FrmCategories;
