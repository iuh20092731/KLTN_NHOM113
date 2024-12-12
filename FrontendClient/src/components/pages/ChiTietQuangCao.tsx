import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Statistic, Button, Form, Input, TimePicker, Switch, message, Divider } from 'antd';
import { EyeOutlined, LikeOutlined, ShareAltOutlined, BookOutlined,PhoneOutlined, GlobalOutlined,
  FacebookOutlined, EnvironmentOutlined, ClockCircleOutlined, DollarOutlined, SaveOutlined, EditOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import TextArea from 'antd/es/input/TextArea';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { addMediaAdvertisement, deleteMediaAdvertisement, getAdvertisementById, updateAdvertisement, updateMediaAdvertisement } from '@/redux/thunks/advertisement';
import { Modal } from 'antd'; 
import { uploadImage } from '@/redux/thunks/uploadImage';
import { PlusCircle } from 'lucide-react';
import { Media } from '@/types/Advertisement';


interface ChiTietQuangCaoProps {
  adId: number;
}

const ChiTietQuangCao: React.FC<ChiTietQuangCaoProps> = ({ adId }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [form] = Form.useForm();
  const dispatch = useDispatch<AppDispatch>();
  const { advertisement } = useSelector((state: RootState) => state.advertisement);

  const [isModalVisible, setIsModalVisible] = useState(false); // State to control modal visibility

  useEffect(() => {
    dispatch(getAdvertisementById(adId));
  }, [dispatch, adId]);

  const handleEdit = () => {
    form.setFieldsValue({
      ...advertisement,
      openingHourStart: dayjs(advertisement?.openingHourStart, 'HH:mm:ss'),
      openingHourEnd: dayjs(advertisement?.openingHourEnd, 'HH:mm:ss'),
    });
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      const formattedValues = {
        ...values,
        openingHourStart: values.openingHourStart.format('HH:mm:ss'),
        openingHourEnd: values.openingHourEnd.format('HH:mm:ss'),
      };
      await dispatch(updateAdvertisement({ id: adId, data: formattedValues }) as any)
      setIsEditing(false);
      message.success('Cập nhật thành công!');
    } catch (error) {
      message.error('Vui lòng kiểm tra lại thông tin!');
    }
  };

  const StatisticCard = () => (
    <Card className="mb-6 shadow-md hover:shadow-lg transition-shadow duration-300">
      <Row gutter={[16, 16]}>
        <Col xs={12} sm={8} md={4}>
          <Statistic 
            title={<span className="text-gray-600 font-medium">Lượt ghé thăm</span>}
            value={advertisement?.clicks || 0} 
            prefix={<EyeOutlined className="text-rose-500" />} 
          />
        </Col>
        <Col xs={12} sm={8} md={4}>
          <Statistic 
            title={<span className="text-gray-600 font-medium">Lượt thích</span>}
            // value={adData.likes} 
            prefix={<LikeOutlined className="text-green-500" />} 
          />
        </Col>
        <Col xs={12} sm={8} md={4}>
          <Statistic 
            title={<span className="text-gray-600 font-medium">Chia sẻ</span>}
            // value={adData.shared} 
            prefix={<ShareAltOutlined className="text-yellow-500" />} 
          />
        </Col>
        <Col xs={12} sm={8} md={4}>
          <Statistic 
            title={<span className="text-gray-600 font-medium">Đã lưu</span>}
            // value={adData.saved} 
            prefix={<BookOutlined className="text-purple-500" />} 
          />
        </Col>
      </Row>
    </Card>
  );


  const handleUpdateImages = () => {
    setIsModalVisible(true); // Show the modal when "Cập nhật" is clicked
  };

  const handleModalClose = () => {
    setIsModalVisible(false); // Close the modal
  };

  const handleDeleteImage = async (imageId: number) => {
    await dispatch(deleteMediaAdvertisement(imageId) as any);
    message.success('Hình ảnh đã đưc xóa!');
    dispatch(getAdvertisementById(adId));
  };

  const handleUpdateImage = async (imageId: number) => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.onchange = async (e) => {
      const files = (e.target as HTMLInputElement).files;
      if (files) {
        const formData = new FormData();
        Array.from(files).forEach((file) => {
          formData.append('files', file);
        });
        const response = await dispatch(uploadImage(formData) as any);
        const parsedPayload = JSON.parse(response.payload);
        await dispatch(updateMediaAdvertisement({ mediaId: imageId, url: parsedPayload[0] }));
        message.success('Hình ảnh đã được cập nhật!');
        dispatch(getAdvertisementById(adId));
      }
    };
    fileInput.click();
  };

  const handleUpload = async () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.onchange = async (e) => {
      const files = (e.target as HTMLInputElement).files;
      if (files) {
        const formData = new FormData();
        Array.from(files).forEach((file) => {
          formData.append('files', file);
        });
        const uploadedUrl = await dispatch(uploadImage(formData)).unwrap();
        const parsedUrl = JSON.parse(uploadedUrl);
        const mediaList: Media = parsedUrl.map((url: string) => {
            return {
              name: "Hình ảnh",
              content: "Media content description",
              url: url,
              type:"IMAGE",
              advertisementId: adId
            };
        });
        await dispatch(addMediaAdvertisement(mediaList) as any);
        message.success('Hình ảnh đã được thêm!');
        dispatch(getAdvertisementById(adId));
      }
    };
    fileInput.click();
  };

  return (
    <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-lg shadow-sm">
          <h1 className="text-3xl font-bold text-gray-800 bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
            Chi tiết quảng cáo
          </h1>
          {!isEditing ? (
            <Button type="primary" icon={<EditOutlined />} onClick={handleEdit}
              className="bg-blue-500 hover:bg-blue-600 transition-colors duration-300 shadow-md">Chỉnh sửa</Button>
          ) : (
            <Button 
              type="primary" 
              icon={<SaveOutlined />} 
              onClick={handleSave}
              className="bg-green-500 hover:bg-green-600 transition-colors duration-300 shadow-md"
            >
              Lưu thay đổi
            </Button>
          )}
        </div>

        <StatisticCard />

        <Card className="mb-6 shadow-lg rounded-xl">
          {isEditing ? (
            <Form
              form={form}
              layout="vertical" 
              initialValues={advertisement || {}}
              className="space-y-4"
            >
              <Row gutter={[16, 16]}>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="mainAdvertisementName"
                    label={<span className="text-gray-700 font-medium">Tên quảng cáo</span>}
                    rules={[{ required: true }]}
                  >
                    <Input className="rounded-md hover:border-blue-400 focus:border-blue-500" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="phoneNumber"
                    label="Số điện thoại"
                    rules={[{ required: true }]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col xs={24}>
                  <Form.Item name="address" label="Địa chỉ" rules={[{ required: true }]}>
                    <Input />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item name="openingHourStart" label="Giờ mở cửa">
                    <TimePicker format="HH:mm" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="openingHourEnd"
                    label="Giờ đóng cửa"
                  >
                    <TimePicker format="HH:mm" />
                  </Form.Item>
                </Col>
                {/* Add more form fields as needed */}
              </Row>

              <Divider />

              <Row gutter={[16, 16]}>
                <Col xs={24}>
                  <Form.Item
                    name="detailedDescription"
                    label="Mô tả chi tiết"
                  >
                    <TextArea rows={4} />
                  </Form.Item>
                </Col>
              </Row>

              <Divider />

              <Row gutter={[16, 16]}>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="websiteLink"
                    label="Website"
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item name="facebookLink" label="Facebook">
                    <Input />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item name="zaloLink" label="Zalo">
                    <Input />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item name="deliveryAvailable" label="Có giao hàng" valuePropName="checked">
                    <Switch />
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                  <h3 className="text-xl font-semibold mb-4 text-blue-600">Thông tin cơ bản</h3>
                  <div className="space-y-4">
                    <p className="flex items-center text-gray-700 hover:text-gray-900 transition-colors">
                      <strong className="min-w-[120px] inline-block">Tên quảng cáo:</strong>
                      <span>{advertisement?.mainAdvertisementName}</span>
                    </p>
                    <p className="flex items-center text-gray-700 hover:text-gray-900 transition-colors">
                      <PhoneOutlined className="mr-3 text-blue-500" />
                      <span>{advertisement?.phoneNumber}</span>
                    </p>
                    <p className="flex items-center text-gray-700 hover:text-gray-900 transition-colors">
                      <EnvironmentOutlined className="mr-3 text-blue-500" />
                      <span>{advertisement?.address}</span>
                    </p>
                    <p className="flex items-center text-gray-700 hover:text-gray-900 transition-colors">
                      <ClockCircleOutlined className="mr-3 text-blue-500" />
                      {advertisement?.openingHourStart} - {advertisement?.openingHourEnd}
                    </p>
                    <p className="flex items-center text-gray-700 hover:text-gray-900 transition-colors">
                      <DollarOutlined className="mr-3 text-blue-500" />
                      {advertisement?.priceRangeLow.toLocaleString('vi-VN')} - {advertisement?.priceRangeHigh.toLocaleString('vi-VN')} VNĐ
                    </p>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                  <h3 className="text-xl font-semibold mb-4 text-blue-600">Liên kết</h3>
                  <div className="space-y-4">
                    <p className="flex items-center">
                      <GlobalOutlined className="mr-3 text-blue-500" />
                      {
                        advertisement?.websiteLink ? (
                          <a 
                            href={advertisement?.websiteLink} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:text-blue-600 hover:underline transition-colors"
                          >
                            Website
                          </a>
                        ) : (
                          <span>Không có</span>
                        )
                      }
                    </p>
                    <p className="flex items-center">
                      <FacebookOutlined className="mr-3 text-blue-500" />
                      {
                        advertisement?.facebookLink ? (
                          <a 
                            href={advertisement?.facebookLink} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:text-blue-600 hover:underline transition-colors"
                          >
                            Facebook
                          </a>
                        ) : (
                          <span>Không có</span>
                        )
                      }
                    </p>
                    <p className="flex items-center">
                      <img src="../../assets/icons/zalo.svg" alt="Zalo" className="inline-block w-4 h-4 mr-2" />
                      {
                        advertisement?.zaloLink ? (
                          <a 
                            href={advertisement?.zaloLink} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:text-blue-600 hover:underline transition-colors"
                          >
                            Zalo
                          </a>
                        ) : (
                          <span>Không có</span>
                        )
                      }
                    </p>
                  </div>
                </div>
              </div>

              <Divider className="border-gray-200" />

              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-4 text-blue-600">Mô tả</h3>
                <p className="text-gray-600 leading-relaxed text-justify">{advertisement?.detailedDescription}</p>
              </div>
            </div>
          )}
        </Card>
        <Card className="mb-6 shadow-lg rounded-xl">
          <div className="sm:flex sm:justify-between items-center mb-4">
            <h3 className="text-xl font-semibold mb-4 text-blue-600">Hình ảnh quảng cáo</h3>
            <div className="flex gap-4">
              <Button type="primary" icon={<PlusCircle />} onClick={handleUpload}>Thêm</Button>
              <Button type="primary" icon={<EditOutlined />} onClick={handleUpdateImages}>Cập nhật</Button>
            </div>
          </div>
          <Row gutter={[16, 16]}>
            {advertisement?.mediaList.map((image) => (
              <Col key={image.id} xs={24} sm={12} md={8}>
                <img
                  src={image.url || ""}
                  alt={image.name || ""}
                  className="w-full h-60 rounded-lg object-cover"
                />
              </Col>
            ))}
          </Row>
        </Card>

        {/* Modal for updating images */}
        <Modal
          title="Cập nhật hình ảnh"
          visible={isModalVisible}
          onCancel={handleModalClose}
          footer={null} // Customize footer if needed
          width={1000}
        >
          <Row gutter={[16, 16]}>
            {advertisement?.mediaList.map((image) => (
              <Col key={image.id} xs={24} sm={12} md={8}>
                <img
                  src={image.url || ""}
                  alt={image.name || ""}
                  className="w-full h-60 rounded-lg object-cover"
                />
                <div className="flex justify-between px-4 py-1">
                  <Button onClick={() => handleUpdateImage(image.id)}>Thay đổi</Button>
                  <Button onClick={() => handleDeleteImage(image.id)}>Xóa</Button>
                </div>
              </Col>
            ))}
          </Row>
        </Modal>
        </div>
    </div>
  );
};

export default ChiTietQuangCao;