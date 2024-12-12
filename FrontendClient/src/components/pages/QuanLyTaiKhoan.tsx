import React, { useEffect, useState} from 'react';
import { Card, Tabs, Table, Button, Typography, Badge, Tag, Modal, Input, Form, message } from 'antd';
import { WalletOutlined, FileTextOutlined, BellOutlined, EditOutlined, ClockCircleOutlined, PlusCircleOutlined, GiftOutlined, BankOutlined, DownloadOutlined } from '@ant-design/icons';
import { encodeString } from '@/utils/encodeString'; 
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { getAdverByUserId } from '@/redux/thunks/advertisement';

const mockPosts = [
    {
      id: "1",
      title: "CĂN HỘ IMPERIA SOLA PARK CHỈ 62,8 TRIỆU/M2, 2 HẦM XE, CK TRỰC TIẾP 138 TRIỆU, TT SỚM CK TỚI 12.5%",
      date: "2024-03-15",
      status: "active"
    },
    {
      id: "2",
      title: "RESORT QUAN 12",
      date: "2024-03-14",
      status: "pending"
    },
    {
      id: "3",
      title: "NHÀ ĐẤT IMPERIA SOLA PARK",
      date: "2024-03-13",
      status: "active"
    },
    {
      id: "4",
      title: "IMPERIA SOLA PARK",
      date: "2024-03-12",
      status: "active"
    }
];

const { Title, Text } = Typography;
const { TabPane } = Tabs;

interface MediaItem {
  id: number;
  name: string;
  content: string;
  url: string;
  type: string;
  status: string;
  advertisementId: number;
}

interface TimeObject {
  hour: number;
  minute: number;
  second: number;
  nano: number;
}

interface Advertisement {
  advertisementId: number;
  mainAdvertisementName: string;
  serviceId: number;
  advertiserId: string;
  adminId: string;
  adStartDate: string;
  adEndDate: string;
  clicks: number;
  adStatus: string;
  reviewNotes: string;
  description: string;
  detailedDescription: string;
  address: string;
  phoneNumber: string;
  priceRangeLow: number;
  priceRangeHigh: number;
  openingHourStart: TimeObject;
  openingHourEnd: TimeObject;
  googleMapLink: string;
  websiteLink: string;
  zaloLink: string;
  facebookLink: string;
  deliveryAvailable: boolean;
  mediaList: MediaItem[];
}

const EXTENSION_PRICES = [
  { months: 3, price: 79000, label: '3 tháng' },
  { months: 6, price: 149000, label: '6 tháng' },
  { months: 9, price: 209000, label: '9 tháng' },
  { months: 12, price: 249000, label: '1 năm' },
];

const QuanLyTaiKhoan: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const userID = useSelector((state: RootState) => state.user.userInfo?.userId)
  const advertisementByUser = useSelector((state: RootState) => state.advertisement.advertisementsByUserId)
  useEffect(()=>{
    if (userID) {
      dispatch(getAdverByUserId(userID))
    }
  },[dispatch, userID])

  console.log("advertisementByUser: " + JSON.stringify(advertisementByUser, null, 2))

  const navigate = useNavigate();
  const mainBalance = 1000000;
  const promotionBalance = 200000;

  const postColumns = [
    {
      title: 'Tiêu đề',
      dataIndex: 'title',
      key: 'title',
      ellipsis: true,
      width: 220,
      render: (text: string) => (
        <span className="font-medium text-gray-800 line-clamp-1 overflow-hidden text-ellipsis max-w-[230px]">
          {text.length > 30 ? `${text.substring(0, 30)}...` : text}
        </span>
      ),
    },
    {
      title: 'Ngày đăng',
      dataIndex: 'date',
      key: 'date',
      render: (date: string) => (
        <span className="text-gray-600 whitespace-nowrap">
          <ClockCircleOutlined className="mr-2" />
          {date}
        </span>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'active' ? 'green' : 'orange'} className="rounded-full px-3">
          {status === 'active' ? 'Đang hiển thị' : 'Chờ duyệt'}
        </Tag>
      ),
    },
    {
      title: 'Thao tác',
      key: 'action',
      align: { xs: 'center', sm: 'left' } as const,
      render: (_: any, record: any) => (
        <div className="flex items-center sm:justify-start justify-center">
          <Button 
            type="link" 
            className="flex items-center text-blue-600 hover:text-blue-800"
            icon={<EditOutlined />}
          >
            Sửa
          </Button>
          <Button 
            type="link" 
            className="flex items-center text-red-600 hover:text-red-800"
            onClick={() => handleDeletePost(record.id)}
            danger
          >
            Xóa
          </Button>
        </div>
      ),
    },
  ];

  const adColumns = [
    {
      title: 'Tên quảng cáo',
      dataIndex: 'mainAdvertisementName',
      key: 'mainAdvertisementName',
      ellipsis: true,
      width: 220,
    //   responsive: ['xs'],
      render: (text: string) => (
        <span className="font-medium text-gray-800 line-clamp-2 overflow-hidden text-ellipsis">{text}</span>
      ),
    },
    {
      title: 'Ngày bắt đầu',
      dataIndex: 'adStartDate',
      key: 'adStartDate',
      responsive: ['md'],
      render: (date: string) => (
        <span className="text-gray-600 whitespace-nowrap">
          <ClockCircleOutlined className="mr-2" />
          {new Date(date).toLocaleDateString('vi-VN')}
        </span>
      ),
    },
    {
      title: 'Ngày kết thúc',
      dataIndex: 'adEndDate',
      key: 'adEndDate',
    //   responsive: ['sm'],
      render: (date: string) => (
        <span className="text-gray-600 whitespace-nowrap">
          <ClockCircleOutlined className="mr-2" />
          {new Date(date).toLocaleDateString('vi-VN')}
        </span>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'adStatus', 
      key: 'adStatus',
      width: 220,
      render: (status: string) => {
        const statusConfig: Record<string, { color: string; text: string }> = {
          Active: { color: 'success', text: 'Đang chạy' },
          Pending: { color: 'warning', text: 'Chờ duyệt' }, 
          Inactive: { color: 'error', text: 'Hết hạn' },
        };
        const config = statusConfig[status] || { color: 'default', text: status };
        return <Badge className='flex items-center' status={config.color as any} text={<span className="text-gray-700 whitespace-nowrap">{config.text}</span>} />;
      },
    },
    {
      title: 'Thao tác',
      key: 'action',
    //   responsive: ['xs'],
      render: (_: any, record: Advertisement) => (
        <div className="flex items-center gap-2">
          <Button 
            type="primary"
            onClick={() => handleExtendAd(record.advertisementId)}
            className="bg-rose-500 hover:bg-rose-600 rounded-full px-3 py-1 h-auto"
          >
            Gia hạn
          </Button>
          <Button 
            type="primary"
            className="bg-blue-500 hover:bg-blue-600 rounded-full px-3 py-1 h-auto"
            onClick={() => handleClickDetailAd(record.advertisementId)}
          >
            Chi tiết
          </Button>
        </div>
      ),
    },
  ];

  const [isExtendModalVisible, setIsExtendModalVisible] = useState(false);
  const [selectedAd, setSelectedAd] = useState<Advertisement | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<typeof EXTENSION_PRICES[0] | null>(null);

  const handleExtendAd = (id: number) => {
    const ad = advertisementByUser.find(a => a.advertisementId === id);
    if (ad) {
      setSelectedAd(ad as unknown as Advertisement);
    } else {
      setSelectedAd(null);
    }
    setSelectedPlan(null);
    setIsExtendModalVisible(true);
  };

  const handleConfirmExtension = () => {
    if (!selectedPlan || !selectedAd) return;
    
    console.log('Extending ad:', {
      adId: selectedAd.advertisementId,
      months: selectedPlan.months,
      price: selectedPlan.price
    });
    
    message.success('Gia hạn quảng cáo thành công!');
    setIsExtendModalVisible(false);
  };

  const handleClickDetailAd = (id: number) => {
    navigate(`/quanlyadver/${id}`);
  };

  const [isDepositModalVisible, setIsDepositModalVisible] = useState(false);
  const [form] = Form.useForm();

  const bankInfo = {
    bankName: "MB",
    accountNumber: "023852001",
    accountName: "Nguyen Anh Vu",
    content: `Nap Tien Dich Vu Hung Ngan`
  };


  const commonAmounts = [
    10000,
    50000,
    100000,
    200000,
    500000,
    1000000,
  ];

  const handleDeposit = () => {
    setIsDepositModalVisible(true);
  };

  const [qrValue, setQrValue] = useState<string>('');
  const [, setSelectedAmount] = useState<number>(0);

  const handleAmountChange = (value: number) => {
    setSelectedAmount(value);
    form.setFieldsValue({ amount: value });
  };

  const handleConfirm = () => {
    form.validateFields().then(values => {
        const amount = values.amount;
        if (amount && amount >= 10000) {
            const QR = `https://img.vietqr.io/image/${bankInfo.bankName}-${bankInfo.accountNumber}-compact2.png?amount=${amount}&addInfo=${encodeString(bankInfo.content)}&accountName=${encodeString(bankInfo.accountName)}`;
            setQrValue(QR);
        } else {
            message.error('Số tiền tối thiểu là 10,000 VNĐ');
        }
    }).catch(error => {
        console.log('Validation failed:', error);
    });
};

  const handleCloseModal = () => {
    form.resetFields();
    setQrValue('');
    setSelectedAmount(0);
    setIsDepositModalVisible(false);
  };

  const handleDownloadQR = () => {
    const link = document.createElement('a');
    link.href = qrValue;
    link.download = `QR_NapTien_${form.getFieldValue('amount')}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDeletePost = (id: string) => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      content: 'Bạn có chắc chắn muốn xóa tin đăng này không?',
      okText: 'Xóa',
      cancelText: 'Hủy',
      okButtonProps: { danger: true },
      onOk() {
        console.log('Deleting post:', id);
        // Add your delete logic here
      },
    });
  };

  return (
      <div className=" md:my-12 lg:my-0 p-3 md:p-6 bg-gray-50 min-h-screen">
        <Title level={2} className="text-xl md:text-2xl mb-6 text-gray-800"> Quản lý tài khoản </Title>
        <Card className="mb-6 relative p-[1px] bg-gradient-to-r from-blue-500 via-purple-400 to-pink-400 rounded-lg hover:shadow-xl transition-all duration-300">
            <div className="bg-white p-5 rounded-lg">
                <div className="flex flex-col md:flex-row md:items-center justify-between">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 md:gap-8">
                        <div className="flex items-center">
                            <div className="bg-blue-50 p-3 rounded-full mr-4">
                                <WalletOutlined className="text-2xl text-blue-500" />
                            </div>
                            <div>
                                <div className="text-sm md:text-base text-gray-600">Tài khoản chính</div>
                                <Title level={3} className="!m-0 text-lg md:text-xl text-gray-800">
                                    {mainBalance.toLocaleString('vi-VN')} VNĐ
                                </Title>
                            </div>
                        </div>

                        <div className="flex items-center">
                            <div className="bg-red-50 p-3 rounded-full mr-4">
                                <GiftOutlined className="text-2xl text-red-500" />
                            </div>
                            <div>
                                <div className="text-sm md:text-base text-gray-600">Tài khoản khuyến mãi</div>
                                <Title level={3} className="!m-0 text-lg md:text-xl text-gray-800">
                                    {promotionBalance.toLocaleString('vi-VN')} VNĐ
                                </Title>
                            </div>
                        </div>
                    </div>
                    
                    <Button
                        type="primary"
                        icon={<PlusCircleOutlined />}
                        onClick={handleDeposit}
                        className="bg-green-500 hover:bg-secondary-color flex items-center mt-4 md:mt-0"
                    >
                        <span>Nạp tiền</span>
                    </Button>
                </div>
            </div>
        </Card>

        <Card className="shadow-md border-1 border-gray-300 [&_.ant-card-body]:!p-2">
            <Tabs defaultActiveKey="1" className="mt-4" tabBarStyle={{ marginBottom: '1.5rem' }}>
                <TabPane
                    tab={
                    <span className="flex items-center ml-2">
                        <BellOutlined className="text-gray-600" />
                        <span className="inline-block ml-2 ml">Quảng cáo đã đăng ký</span>
                    </span>
                    }
                    key="1"
                >
                    <Table
                    columns={adColumns as any}
                    dataSource={advertisementByUser}
                    rowKey="advertisementId"
                    pagination={{ 
                        pageSize: 10,
                        responsive: true,
                        size: window.innerWidth <= 640 ? 'small' : 'default'
                    }}
                    scroll={{ x: true }}
                    size={window.innerWidth <= 640 ? 'small' : 'middle'}
                    className="overflow-x-auto"
                    rowClassName="hover:bg-gray-50"
                    />
                </TabPane>
                <TabPane
                    tab={
                    <span className="flex items-center">
                        <FileTextOutlined className="text-gray-600" />
                        <span className="inline-block ml-2">Tin đăng</span>
                    </span>
                    }
                    key="2"
                >
                    <Table
                    columns={postColumns as any}
                    dataSource={mockPosts}
                    rowKey="id"
                    pagination={{ 
                        pageSize: 10,
                        responsive: true,
                        size: window.innerWidth <= 640 ? 'small' : 'default'
                    }}
                    scroll={{ x: true }}
                    size={window.innerWidth <= 640 ? 'small' : 'middle'}
                    className="overflow-x-auto"
                    rowClassName="hover:bg-gray-50"
                    />
                </TabPane>
            </Tabs>
        </Card>

        {/* Modal Nạp tiền */}
        <Modal
          title={
            <div className="flex items-center gap-2 text-lg">
              <BankOutlined className="text-blue-500" />
              <span>Nạp tiền qua chuyển khoản</span>
            </div>
          }
          open={isDepositModalVisible}
          onCancel={handleCloseModal}
          footer={null}
          width={600}
          destroyOnClose={true}
        >
          <div className="py-4">
            <Form
              form={form}
              layout="vertical"
              initialValues={{ amount: 100000 }}
              onValuesChange={(_, values) => handleAmountChange(values.amount)}
            >
              {/* Số tiền nạp */}
              <Form.Item
                label="Số tiền nạp"
                name="amount"
                rules={[
                  { required: true, message: 'Vui lòng nhập số tiền' },
                  { 
                    validator: (_, value) => {
                        if (!value || value < 10000) {
                            return Promise.reject('Số tiền tối thiểu là 10,000 VNĐ');
                        }
                        return Promise.resolve();
                    }
                  }
                ]}
              >
                <div className="space-y-4">
                  <Input
                    type="number"
                    min={10000}
                    addonAfter="VNĐ"
                    className="w-full"
                    value={form.getFieldValue('amount')}
                    onChange={(e) => handleAmountChange(Number(e.target.value))}
                  />
                  <div className="grid grid-cols-3 gap-2">
                    {commonAmounts.map(amount => (
                      <Button
                        key={amount}
                        className="w-full"
                        onClick={() => handleAmountChange(amount)}
                      >
                        {amount.toLocaleString('vi-VN')}đ
                      </Button>
                    ))}
                  </div>
                </div>
              </Form.Item>
            </Form>

            {/* Thông tin chuyển khoản */}
            <div className="mt-6 bg-gray-50 p-4 rounded-lg">
              <Title level={5}>Thông tin chuyển khoản</Title>
              <div className="space-y-2 mt-3">
                <div className="flex justify-between">
                  <Text className="text-gray-500">Ngân hàng:</Text>
                  <Text strong>{bankInfo.bankName}</Text>
                </div>
                <div className="flex justify-between">
                  <Text className="text-gray-500">Số tài khoản:</Text>
                  <Text strong copyable>{bankInfo.accountNumber}</Text>
                </div>
                <div className="flex justify-between">
                  <Text className="text-gray-500">Tên tài khoản:</Text>
                  <Text strong>{bankInfo.accountName}</Text>
                </div>
                <div className="flex justify-between">
                  <Text className="text-gray-500">Nội dung CK:</Text>
                  <Text strong copyable>{bankInfo.content}</Text>
                </div>
              </div>
            </div>

            {/* QR Code */}
            {qrValue && (
              <div className="mt-6 flex flex-col items-center">
                <Text className="mb-4">Quét mã QR để chuyển khoản</Text>
                <div className="relative">
                    <img src={qrValue} alt="QR Code" className="w-full max-w-md" />
                    <Button
                        type="primary"
                        icon={<DownloadOutlined />}
                        className="absolute bottom-2 right-2 flex items-center bg-blue-500 hover:bg-blue-600"
                        onClick={handleDownloadQR}
                        title="Tải mã QR"
                    />
                </div>
              </div>
            )}

            {/* Lưu ý */}
            <div className="mt-6 text-sm text-gray-500">
              <Text strong className="text-red-500">Lưu ý:</Text>
              <ul className="list-disc ml-4 mt-2">
                <li>Vui lòng chuyển khoản đúng số tiền và nội dung để được cộng tiền tự động</li>
                <li>Thời gian xử lý từ 1-5 phút sau khi chuyển khoản thành công</li>
                <li>Nếu cần hỗ trợ, vui lòng liên hệ: 0909260517</li>
              </ul>
            </div>

            <Button type="primary" className="w-full mt-4" onClick={handleConfirm}>Xác nhận</Button>
          </div>
        </Modal>

        <Modal
          title="Gia hạn quảng cáo"
          open={isExtendModalVisible}
          onCancel={() => setIsExtendModalVisible(false)}
          footer={[
            <Button key="cancel" onClick={() => setIsExtendModalVisible(false)}>
              Hủy
            </Button>,
            <Button
              key="submit"
              type="primary"
              disabled={!selectedPlan}
              onClick={handleConfirmExtension}
              className="bg-blue-500"
            >
              Xác nhận
            </Button>
          ]}
        >
          {selectedAd && (
            <div className="space-y-4">
              <div className="font-medium">
                Quảng cáo: {selectedAd.mainAdvertisementName}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                {EXTENSION_PRICES.map((plan) => (
                  <div
                    key={plan.months}
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      selectedPlan?.months === plan.months
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                    onClick={() => setSelectedPlan(plan)}
                  >
                    <div className="font-medium">{plan.label}</div>
                    <div className="text-lg text-blue-600 font-semibold">
                      {plan.price.toLocaleString('vi-VN')} VNĐ
                    </div>
                  </div>
                ))}
              </div>
              
              {selectedPlan && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <div className="text-lg font-medium">Tổng thanh toán:</div>
                  <div className="text-xl text-blue-600 font-bold">
                    {selectedPlan.price.toLocaleString('vi-VN')} VNĐ
                  </div>
                </div>
              )}
            </div>
          )}
        </Modal>
      </div>
  );
};

export default QuanLyTaiKhoan;
