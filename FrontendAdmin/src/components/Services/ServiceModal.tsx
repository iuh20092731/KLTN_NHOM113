import { Modal, Form, Input, Select, Switch, message, Upload, Button } from 'antd';
import { useDispatch } from 'react-redux';
// import { createService, updateService } from '../../redux/services/serviceSlice';
import { useEffect } from 'react';
import { createService } from '../../redux/thunks/service';
import { updateService } from '../../redux/thunks/service';
import { useState } from 'react';
import { UploadOutlined, LoadingOutlined, PlusOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { uploadOneImage } from "../../redux/thunks/cloudDinary";
import { updateAdvertisementService } from '../../redux/thunks/service';
import { uploadImage } from '../../redux/thunks/cloudDinary';

const ServiceModal = ({ visible, onCancel, service, categories }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const [uploadLoading, setUploadLoading] = useState(false);
  const [tempFile, setTempFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditing = !!service;

  useEffect(() => {
    if (service) {
      form.setFieldsValue({
        serviceName: service.serviceName,
        description: service.description,
        categoryId: service.categoryId,
        deliveryAvailable: service.deliveryAvailable,
        isActive: service.isActive,
        imageUrl: service.imageUrl,
      });
      setPreviewUrl(service.imageUrl || '');
    } else {
      form.resetFields();
      setPreviewUrl('');
      setTempFile(null);
    }
  }, [service, form]);

  const beforeUpload = (file) => {
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      message.error('Chỉ được upload file ảnh!');
      return Upload.LIST_IGNORE;
    }

    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Kích thước ảnh phải nhỏ hơn 2MB!');
      return Upload.LIST_IGNORE;
    }

    const previewURL = URL.createObjectURL(file);
    setPreviewUrl(previewURL);
    setTempFile(file);
    return false;
  };

  // Reset tất cả state và form
  const resetAll = () => {
    form.resetFields();
    setPreviewUrl('');
    setTempFile(null);
    form.setFieldValue('imageUrl', ''); // Reset trường imageUrl trong form
  };

  // Xử lý đóng modal
  const handleCancel = () => {
    resetAll();
    onCancel();
  };

  // Xử lý sau khi submit thành công
  const handleSuccess = () => {
    resetAll();
    onCancel();
  };

  const onFinish = async (values) => {
    try {
      setIsSubmitting(true);

      let mediaUrl = '';
      // Upload ảnh nếu có file mới
      if (tempFile) {
        const formData = new FormData();
        formData.append('files', tempFile);

        try {
          const uploadResult = await dispatch(uploadImage(formData)).unwrap();
          const [imageUrl] = JSON.parse(uploadResult);
          mediaUrl = imageUrl;
        } catch (error) {
          message.error('Upload ảnh thất bại');
          return;
        }
      }

      // Prepare media data
      let media = [];
      if (service) {
        // Trường hợp cập nhật
        if (mediaUrl) {
          // Nếu có ảnh mới upload
          media = [{
            mediaId: null,
            mediaUrl: mediaUrl,
            mediaType: 'IMAGE',
          }];
        } else if (service.media && service.media.length > 0) {
          // Nếu không có ảnh mới, giữ nguyên media cũ
          media = service.media.map(m => ({
            mediaId: m.mediaId,
            mediaUrl: m.mediaUrl,
            mediaType: 'IMAGE'
          }));
        }
      } else {
        // Trường hợp thêm mới
        if (!mediaUrl) {
          message.error('Vui lòng tải lên hình ảnh!');
          return;
        }
        media = [{
          mediaId: null,
          mediaUrl: mediaUrl,
          mediaType: 'IMAGE',
        }];
      }

      const requestData = {
        ...values,
        imageUrl: mediaUrl,
        advertisementMedia: media,
      };

      if (service) {
        // Trường hợp cập nhật
        await dispatch(updateAdvertisementService({
          serviceId: service.serviceId,
          data: requestData
        })).unwrap();
        message.success('Cập nhật dịch vụ thành công');
      } else {
        // Trường hợp thêm mới
        await dispatch(createService(requestData)).unwrap();
        message.success('Thêm mới dịch vụ thành công');
      }

      handleSuccess();
    } catch (error) {
      console.error('Error:', error);
      message.error('Có lỗi xảy ra: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {isSubmitting && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 flex flex-col items-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mb-4"></div>
            <p className="text-lg font-semibold text-gray-700">Đang xử lý...</p>
            <p className="text-sm text-gray-500 mt-2">Vui lòng đợi trong giây lát</p>
          </div>
        </div>
      )}
      <Modal
        title={isEditing ? 'Sửa dịch vụ' : 'Thêm dịch vụ mới'}
        open={visible}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Hủy
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={() => form.submit()}
            className="bg-blue-500"
            disabled={
              isSubmitting ||
              !!form.getFieldsError().filter(({ errors }) => errors.length).length
            }
          >
            {isSubmitting ? 'Đang xử lý...' : (isEditing ? 'Cập nhật' : 'Thêm mới')}
          </Button>,
        ]}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            isActive: true,
            deliveryAvailable: false
          }}
        >


          <Form.Item
            name="serviceName"
            label="Tên dịch vụ"
            rules={[
              { required: true, message: 'Vui lòng nhập tên dịch vụ!' },
              { max: 255, message: 'Tên dịch vụ không được quá 255 ký tự!' }
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="categoryId"
            label="Danh mục"
            rules={[{ required: true, message: 'Vui lòng chọn danh mục!' }]}
          >
            <Select>
              {categories.map(category => (
                <Select.Option key={category.categoryId} value={category.categoryId}>
                  {category.categoryName}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="description"
            label="Mô tả"
          >
            <Input.TextArea rows={4} />
          </Form.Item>

          <Form.Item
            name="imageUrl"
            label={
              <span className="text-gray-700 font-medium">
                Hình ảnh <span className="text-red-500">*</span>
              </span>
            }
            rules={[
              { required: true, message: 'Vui lòng tải lên hình ảnh!' },
            ]}
          >
            <div className="flex flex-col items-center justify-center w-full">
              <Upload
                name="file"
                listType="picture"
                showUploadList={false}
                beforeUpload={beforeUpload}
                className="w-full flex justify-center "
              >
                {(previewUrl || form.getFieldValue('imageUrl')) ? (
                  <div className="relative group w-[95%] hover:cursor-pointer">
                    <div className="w-full h-[200px] rounded-lg flex justify-center items-center border-2 border-dashed border-gray-300">
                      <img
                        src={previewUrl || form.getFieldValue('imageUrl')}
                        alt="service"
                        className="w-full h-full object-contain rounded-lg"
                      />
                    </div>
                    <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg">
                      <EditOutlined className="text-white text-xl" />
                    </div>
                  </div>
                ) : (
                  <div className="w-[100%] h-[150px] mx-2 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 transition-colors">
                    {uploadLoading ? <LoadingOutlined className="text-xl" /> : <PlusOutlined className="text-xl" />}
                    <div className="mt-3 text-gray-500">Nhấn để tải ảnh lên</div>
                    <div className="mt-1 text-gray-400 text-sm">PNG, JPG tối đa 2MB</div>
                  </div>
                )}
              </Upload>

              {(previewUrl || form.getFieldValue('imageUrl')) && (
                <Button
                  danger
                  type="text"
                  icon={<DeleteOutlined />}
                  onClick={() => {
                    setPreviewUrl('');
                    setTempFile(null);
                    form.setFieldValue('imageUrl', '');
                  }}
                  className="hover:text-red-600 mt-3"
                >
                  Xóa ảnh
                </Button>
              )}
            </div>
          </Form.Item>

          <Form.Item
            name="deliveryAvailable"
            label="Giao hàng"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>

          <Form.Item
            name="isActive"
            label="Kích hoạt"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default ServiceModal; 