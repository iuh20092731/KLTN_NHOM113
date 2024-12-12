import { useEffect, useState } from 'react';
import Breadcrumb from '../Breadcrumbs/Breadcrumb';
import { useAuth } from '../../context/AuthContext';
import { Advertisement } from '../../interfaces/Advertisement';
import { Button, message, Table, Space } from 'antd';
import { useNavigate } from 'react-router-dom';
import type { TablePaginationConfig } from 'antd/es/table';

const FrmADRegisted = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [advertisements, setAdvertisements] = useState<Advertisement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAll, setShowAll] = useState(false);
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const apiUrl = (import.meta as any).env.VITE_API_URL;
  const { token } = useAuth();
  const navigate = useNavigate();

  const success = (type, content) => {
    messageApi.open({
      type: type,
      content: content,
    });
  };

  const fetchAdvertisements = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/v1/main-advertisements/registered?adStatus=Pending`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setAdvertisements(data.result);
      setPagination(prev => ({
        ...prev,
        total: data.result.length
      }));
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdvertisements();
  }, []);

  const columns = [
    {
      title: <span className="text-base">Thao tác</span>,
      key: 'action',
      fixed: 'left',
      width: 120,
      align: 'center',
      render: (_, record: Advertisement) => (
        <Button
          type="primary"
          onClick={(e) => {
            e.stopPropagation();
            handleApprove(record);
          }}
          className="bg-green-500 hover:bg-green-600"
        >
          Phê duyệt
        </Button>
      ),
    },
    {
      title: <span className="text-base">ID</span>,
      dataIndex: 'advertisementId',
      key: 'advertisementId',
      width: 100,
      align: 'center',
      render: (text) => <span className="font-medium text-base">{text}</span>,
      sorter: (a, b) => a.advertisementId - b.advertisementId,
    },
    {
      title: <span className="text-base">Tên</span>,
      dataIndex: 'mainAdvertisementName',
      key: 'mainAdvertisementName',
      render: (text) => <span className="font-medium text-base">{text}</span>,
      sorter: (a, b) => a.mainAdvertisementName.localeCompare(b.mainAdvertisementName),
    },
    {
      title: <span className="text-base">Tên dịch vụ</span>,
      dataIndex: 'serviceName',
      key: 'serviceName',
      align: 'center',
    },
    {
      title: <span className="text-base">Thời gian đăng ký</span>,
      dataIndex: 'createTime',
      key: 'createTime',
      width: 200,
      align: 'center',
      render: (createTime: string) => {
        const date = new Date(createTime);
        return (
          <div className="text-gray-600">
            <div>{date.toLocaleDateString('vi-VN', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit'
            })}</div>
            <div className="text-sm text-gray-500">{date.toLocaleTimeString('vi-VN', {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit'
            })}</div>
          </div>
        );
      },
    },
    {
      title: <span className="text-base">Địa chỉ</span>,
      dataIndex: 'address',
      key: 'address',
      align: 'center',
    },
    {
      title: <span className="text-base">Trạng thái</span>,
      dataIndex: 'adStatus',
      key: 'adStatus',
      width: 130,
      align: 'center',
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
      title: <span className="text-base">Điện thoại</span>,
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
      align: 'center',
    },
  ];

  const handleApprove = async (item: Advertisement) => {
    const advertisementId = item.advertisementId;

    try {
      const response = await fetch(`${apiUrl}/api/v1/main-advertisements/${advertisementId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ newStatus: 'Active' })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Advertisement approved:', data);
      success('success', "Approved Successfully");
      // Cập nhật lại danh sách hoặc trạng thái ở đây nếu cần
      fetchAdvertisements();
    } catch (error) {
      success('error', "Approved Failed");
      console.error('Error approving advertisement:', error);
    }
  };

  const handleToggleShowAll = () => {
    setShowAll(!showAll);
    setPagination(prev => ({ ...prev, current: 1 }));
  };

  return (
    <>
      {contextHolder}
      <Breadcrumb pageName="Form Quản lý quảng cáo đã đăng ký" />

      <div className="min-h-screen bg-gray-50">
        <div className="bg-white rounded-lg shadow-lg p-5">
          {/* <div className="flex justify-between items-center mb-4">
            <Button
              type="primary"
              className="bg-green-500 hover:bg-green-600 flex items-center"
            >
              Phê duyệt quảng cáo
            </Button>
          </div> */}

          <Table
            columns={columns}
            dataSource={advertisements}
            rowKey="advertisementId"
            loading={loading}
            scroll={{ x: 1000 }}
            pagination={showAll ? false : {
              current: pagination.current,
              pageSize: pagination.pageSize,
              total: pagination.total,
              showSizeChanger: true,
              showTotal: (total) => `Tổng ${total} quảng cáo`,
              className: 'px-4',
            }}
            className="rounded-lg text-base"
            rowClassName={() => 'hover:bg-gray-50 cursor-pointer'}
            onRow={(record) => ({
              // onClick: () => navigate(`/advertisements/update/${record.advertisementId}`),
            })}
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
    </>
  );
};

export default FrmADRegisted;
