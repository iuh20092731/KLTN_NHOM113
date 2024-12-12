import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';

interface UserResponse {
    id: string;
    username: string;
    firstName: string;
    lastName: string;
    avatar: string;
    phoneNumber: string;
    roles: Array<{ id: number; name: string }>;
}

const TopNewUsers = () => {
    const [users, setUsers] = useState<UserResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const { token } = useAuth();
    const apiUrl = import.meta.env.VITE_API_URL;

    useEffect(() => {
        const fetchTopNewUsers = async () => {
            try {
                const response = await fetch(
                    `${apiUrl}/api/v1/users/top-new-users?page=0&size=6`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (!response.ok) {
                    throw new Error('Failed to fetch top new users');
                }

                const data = await response.json();
                setUsers(data.result?.content || []);
            } catch (error) {
                console.error('Error fetching top new users:', error);
                setUsers([]);
            } finally {
                setLoading(false);
            }
        };

        fetchTopNewUsers();
    }, [token, apiUrl]);

    if (loading) {
        return (
            <div className="col-span-12 xl:col-span-4 h-[400px] flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="col-span-12 xl:col-span-4">
            <div className="rounded-lg border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                <div className="border-b border-stroke px-7.5 py-4 mt-1 dark:border-strokedark">
                    <h3 className="text-xl font-semibold text-black dark:text-white flex items-center gap-2 mt-1">
                        <UserOutlined className="text-primary" />
                        Người dùng mới
                    </h3>
                </div>

                <div className="p-4 py-5">
                    {users && users.length > 0 ? (
                        <div className="flex flex-col divide-y divide-stroke dark:divide-strokedark">
                            {users.map((user) => (
                                <div
                                    key={user.id}
                                    className="flex items-center gap-4 p-[18px] hover:bg-gray-2 dark:hover:bg-meta-4 rounded-md transition-colors duration-200"
                                >
                                    <Avatar
                                        size={45}
                                        src={user.avatar}
                                        icon={!user.avatar && <UserOutlined />}
                                        className="flex-shrink-0"
                                    />
                                    <div className="flex flex-1 items-center justify-between">
                                        <div>
                                            <h5 className="font-medium text-black dark:text-white">
                                                {user.firstName} {user.lastName}
                                            </h5>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                @{user.username}
                                            </p>
                                        </div>
                                        <div className="text-sm text-gray-500 dark:text-gray-400">
                                            {user.phoneNumber}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-[300px] text-gray-500">
                            Không tìm thấy người dùng
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TopNewUsers; 