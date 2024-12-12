import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import { RootState } from '../../store'; // Adjust the import path as needed
import { toast } from 'react-toastify'; // Assuming you're using react-toastify for notifications
import { Table, Button, Select, Modal, Input } from 'antd'; // Add these imports
import { SearchOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';

interface UserDetailResponse {
    userId: string;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    zalo: string;
    facebook: string;
    avatar: string;
    active: boolean;
    userType: 'ADVERTISER' | 'ADMIN' | 'USER'; // Add other user types if needed
    roles: { id: number; name: string }[];
}

// Thêm interface để định nghĩa kiểu cho sorter
interface SorterResult {
    column: {
        key: string;
    };
    order: 'ascend' | 'descend' | undefined;
}

const AccountList: React.FC = () => {
    const [users, setUsers] = useState<UserDetailResponse[]>([]);
    const [isActive, setIsActive] = useState<string>('1'); // Change default to '1'
    const [userType, setUserType] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
    const [showAll, setShowAll] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [isSearchVisible, setIsSearchVisible] = useState(false);
    const [searchColumnKey, setSearchColumnKey] = useState<string | null>(null);
    const [filteredUsers, setFilteredUsers] = useState<UserDetailResponse[]>([]);
    const [searchColumn, setSearchColumn] = useState<{ key: string; title: string } | null>(null);

    const token = useSelector((state: RootState) => state.user.token);

    const fetchUsers = async (page = 1, size = 10) => {
        const apiUrl = import.meta.env.VITE_API_URL;
        const queryParams = new URLSearchParams();
        queryParams.append('isActive', isActive);
        if (userType) queryParams.append('userType', userType);

        queryParams.append('page', (page - 1).toString());
        queryParams.append('size', showAll ? '1000' : size.toString());

        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch(`${apiUrl}/api/v1/users/filter?${queryParams}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch users');
            }

            const data = await response.json();
            if (data.code === 1000 && Array.isArray(data.result)) {
                setUsers(data.result);
                setPagination({
                    ...pagination,
                    total: data.result.length,
                    current: page,
                    pageSize: size,
                });
            } else {
                console.error('Unexpected data structure:', data);
                setUsers([]);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
            setError('Failed to fetch users. Please try again later.');
            setUsers([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (token) {
            fetchUsers();
        }
    }, [isActive, userType, token, showAll]);

    useEffect(() => {
        if (users.length > 0) {
            let filtered = [...users];

            if (searchText && searchColumnKey) {
                filtered = filtered.filter(user => {
                    let value = '';
                    if (searchColumnKey === 'name') {
                        value = `${user.firstName} ${user.lastName} ${user.username}`;
                    } else {
                        value = user[searchColumnKey]?.toString() || '';
                    }
                    return removeVietnameseTones(value.toLowerCase())
                        .includes(removeVietnameseTones(searchText.toLowerCase()));
                });
            }

            setFilteredUsers(filtered);
        }
    }, [users, searchText, searchColumnKey]);

    const handleUpdateUserStatus = async (userId: string, newStatus: boolean) => {
        const apiUrl = import.meta.env.VITE_API_URL;
        try {
            const response = await fetch(`${apiUrl}/api/v1/users/${userId}/status`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ isActive: newStatus }),
            });

            if (!response.ok) {
                throw new Error('Failed to update user status');
            }

            const data = await response.json();
            if (data.code === 1000) {
                toast.success(`User ${newStatus ? 'activated' : 'deactivated'} successfully`);
                fetchUsers(); // Refresh the user list
            } else {
                throw new Error(data.message || 'Failed to update user status');
            }
        } catch (error) {
            console.error('Error updating user status:', error);
            toast.error('Failed to update user status. Please try again.');
        }
    };

    const handleTableChange = (newPagination: any, filters: any, sorter: SorterResult) => {
        setPagination(newPagination);

        // Xử lý sort
        if (sorter && sorter.order) {
            let sortedData = [...(filteredUsers.length > 0 ? filteredUsers : users)];

            sortedData.sort((a, b) => {
                if (sorter.column.key === 'name') {
                    const nameA = `${a.firstName} ${a.lastName}`;
                    const nameB = `${b.firstName} ${b.lastName}`;
                    return sorter.order === 'ascend'
                        ? nameA.localeCompare(nameB)
                        : nameB.localeCompare(nameA);
                }

                if (sorter.column.key === 'email') {
                    return sorter.order === 'ascend'
                        ? a.email.localeCompare(b.email)
                        : b.email.localeCompare(a.email);
                }

                return 0;
            });

            setFilteredUsers(sortedData);
        }

        // Nếu không có sort thì fetch data bình thường
        if (!sorter.order) {
            fetchUsers(newPagination.current, newPagination.pageSize);
        }
    };

    const handleToggleShowAll = () => {
        setShowAll(!showAll);
        setPagination(prev => ({ ...prev, current: 1 }));
    };

    const getColumnContextMenu = (columnKey: string, columnTitle: string): MenuProps => ({
        items: [
            {
                key: '1',
                label: 'Tìm kiếm',
                icon: <SearchOutlined />,
                onClick: (e) => {
                    e.domEvent.stopPropagation();
                    setSearchColumn({ key: columnKey, title: columnTitle });
                    setSearchColumnKey(columnKey);
                    setIsSearchVisible(true);
                }
            }
        ]
    });

    const removeVietnameseTones = (str: string) => {
        return str
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/đ/g, 'd')
            .replace(/Đ/g, 'D');
    };

    // Define columns for the Table component
    const columns = [
        {
            title: <span className="text-base text-gray-400">STT</span>,
            key: 'index',
            width: 40,
            align: 'center' as const,
            render: (_: any, __: any, index: number) => (
                <span className="text-base text-gray-400">
                    {(pagination.current - 1) * pagination.pageSize + index + 1}
                </span>
            ),
        },
        {
            title: <span className="text-base">Name</span>,
            key: 'name',
            sorter: true,
            ...getColumnContextMenu('name', 'Name'),
            render: (record: UserDetailResponse) => (
                <div>
                    <h5 className="text-base font-semibold text-primary ">
                        {record.firstName} {record.lastName}
                    </h5>
                    <p className="text-sm text-gray-400">{record.username}</p>
                </div>
            ),
        },
        {
            title: <span className="text-base">Email</span>,
            dataIndex: 'email',
            key: 'email',
            sorter: true,
            ...getColumnContextMenu('email', 'Email'),
        },
        {
            title: <span className="text-base">Phone</span>,
            dataIndex: 'phoneNumber',
            key: 'phone',
        },
        {
            title: <span className="text-base">Status</span>,
            key: 'status',
            render: (record: UserDetailResponse) => (
                <p className={`inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium ${record.active ? 'text-success bg-success' : 'text-danger bg-danger'
                    }`}>
                    {record.active ? 'Active' : 'Inactive'}
                </p>
            ),
        },
        {
            title: <span className="text-base">User Type</span>,
            dataIndex: 'userType',
            key: 'userType',
        },
        {
            title: <span className="text-base">Actions</span>,
            key: 'actions',
            render: (record: UserDetailResponse) => (
                <div className="flex items-center space-x-3.5">
                    <button className="hover:text-primary">
                        <svg
                            className="fill-current"
                            width="18"
                            height="18"
                            viewBox="0 0 18 18"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M8.99981 14.8219C3.43106 14.8219 0.674805 9.50624 0.562305 9.28124C0.47793 9.11249 0.47793 8.88749 0.562305 8.71874C0.674805 8.49374 3.43106 3.17812 8.99981 3.17812C14.5686 3.17812 17.3248 8.49374 17.4373 8.71874C17.5217 8.88749 17.5217 9.11249 17.4373 9.28124C17.3248 9.50624 14.5686 14.8219 8.99981 14.8219ZM1.85605 8.99999C2.4748 10.0406 4.89356 13.5562 8.99981 13.5562C13.1061 13.5562 15.5248 10.0406 16.1436 8.99999C15.5248 7.95936 13.1061 4.44374 8.99981 4.44374C4.89356 4.44374 2.4748 7.95936 1.85605 8.99999Z"
                                fill=""
                            />
                            <path
                                d="M9 11.3906C7.67812 11.3906 6.60938 10.3219 6.60938 9C6.60938 7.67813 7.67812 6.60938 9 6.60938C10.3219 6.60938 11.3906 7.67813 11.3906 9C11.3906 10.3219 10.3219 11.3906 9 11.3906ZM9 7.875C8.38125 7.875 7.875 8.38125 7.875 9C7.875 9.61875 8.38125 10.125 9 10.125C9.61875 10.125 10.125 9.61875 10.125 9C10.125 8.38125 9.61875 7.875 9 7.875Z"
                                fill=""
                            />
                        </svg>
                    </button>
                    {record.active ? (
                        <button
                            className="hover:text-danger"
                            onClick={() => handleUpdateUserStatus(record.userId, false)}
                        >
                            <svg
                                className="fill-current"
                                width="18"
                                height="18"
                                viewBox="0 0 18 18"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M13.7535 2.47502H11.5879V1.9969C11.5879 1.15315 10.9129 0.478149 10.0691 0.478149H7.90352C7.05977 0.478149 6.38477 1.15315 6.38477 1.9969V2.47502H4.21914C3.40352 2.47502 2.72852 3.15002 2.72852 3.96565V4.8094C2.72852 5.42815 3.09414 5.9344 3.62852 6.1594L4.07852 15.4688C4.13477 16.6219 5.09102 17.5219 6.24414 17.5219H11.7004C12.8535 17.5219 13.8098 16.6219 13.866 15.4688L14.3441 6.13127C14.8785 5.90627 15.2441 5.3719 15.2441 4.78127V3.93752C15.2441 3.15002 14.5691 2.47502 13.7535 2.47502ZM7.67852 1.9969C7.67852 1.85627 7.79102 1.74377 7.93164 1.74377H10.0973C10.2379 1.74377 10.3504 1.85627 10.3504 1.9969V2.47502H7.70664V1.9969H7.67852ZM4.02227 3.96565C4.02227 3.85315 4.10664 3.74065 4.24727 3.74065H13.7535C13.866 3.74065 13.9785 3.82502 13.9785 3.96565V4.8094C13.9785 4.9219 13.8941 5.0344 13.7535 5.0344H4.24727C4.13477 5.0344 4.02227 4.95002 4.02227 4.8094V3.96565ZM11.7285 16.2563H6.27227C5.79414 16.2563 5.40039 15.8906 5.37227 15.3844L4.95039 6.2719H13.0785L12.6566 15.3844C12.6004 15.8625 12.2066 16.2563 11.7285 16.2563Z"
                                    fill=""
                                />
                            </svg>
                        </button>
                    ) : (
                        <button
                            className="hover:text-success"
                            onClick={() => handleUpdateUserStatus(record.userId, true)}
                        >
                            <svg
                                className="fill-current"
                                width="18"
                                height="18"
                                viewBox="0 0 18 18"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M9 0.75C4.44375 0.75 0.75 4.44375 0.75 9C0.75 13.5562 4.44375 17.25 9 17.25C13.5562 17.25 17.25 13.5562 17.25 9C17.25 4.44375 13.5562 0.75 9 0.75ZM12.576 7.31438L8.55188 11.3386C8.41813 11.4723 8.24063 11.5391 8.0625 11.5391C7.88437 11.5391 7.70687 11.4723 7.57312 11.3386L5.42438 9.18984C5.15813 8.92359 5.15813 8.49141 5.42438 8.22516C5.69063 7.95891 6.12281 7.95891 6.38906 8.22516L8.0625 9.89859L11.6109 6.35016C11.8772 6.08391 12.3094 6.08391 12.5756 6.35016C12.8419 6.61641 12.8423 7.04813 12.576 7.31438Z"
                                    fill=""
                                />
                            </svg>
                        </button>
                    )}
                </div>
            ),
        },
    ];

    const searchModal = (
        <Modal
            title={`Tìm kiếm ${searchColumn?.title || ''}`}
            open={isSearchVisible}
            onOk={() => {
                setIsSearchVisible(false);
            }}
            onCancel={() => {
                setIsSearchVisible(false);
                setSearchText('');
                setSearchColumn(null);
            }}
        >
            <Input
                placeholder={`Nhập từ khóa tìm kiếm cho ${searchColumn?.title || ''}...`}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                style={{ width: '100%' }}
            />
        </Modal>
    );

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div className="text-danger">{error}</div>;
    }

    return (
        <>
            {searchModal}
            <Breadcrumb pageName="Account List" />

            <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
                <div className="mb-6 flex flex-wrap gap-5 sm:flex-nowrap sm:gap-3">
                    <select
                        className="w-full sm:w-48 rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                        value={isActive}
                        onChange={(e) => setIsActive(e.target.value)}
                    >
                        <option value="">All Status</option>
                        <option value="1">Active</option>
                        <option value="0">Inactive</option>
                    </select>
                    <select
                        className="w-full sm:w-48 rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                        value={userType}
                        onChange={(e) => setUserType(e.target.value)}
                    >
                        <option value="">All User Types</option>
                        <option value="ADVERTISER">Advertiser</option>
                        <option value="ADMIN">Admin</option>
                        <option value="USER">User</option>
                    </select>
                </div>

                <div className="max-w-full overflow-x-auto">
                    <style>
                        {`
                            .ant-table-tbody > tr > td {
                                transition: background 0.3s;
                            }
                            .ant-table-tbody > tr:hover > td {
                                background: #EBF5FF !important;
                            }
                        `}
                    </style>
                    <Table
                        columns={columns}
                        dataSource={filteredUsers.length > 0 ? filteredUsers : users}
                        rowKey="userId"
                        loading={isLoading}
                        scroll={{ x: 1000 }}
                        pagination={showAll ? false : {
                            current: pagination.current,
                            pageSize: pagination.pageSize,
                            total: pagination.total,
                            showSizeChanger: true,
                            showTotal: (total) => `Tổng ${total} tài khoản`,
                            className: 'px-4',
                        }}
                        onChange={handleTableChange}
                        className="rounded-lg text-base"
                        style={{
                            cursor: 'pointer',
                        }}
                    />
                </div>

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
        </>
    );
};

export default AccountList;
