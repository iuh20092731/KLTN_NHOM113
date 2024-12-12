import React, { useState, useEffect, useRef } from 'react';
import { Modal, Input, List, Avatar } from 'antd';
import axios from 'axios';

interface AdvertiserSearchModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelectAdvertiser: (advertiser: { advertiserId: string, fullName: string }) => void;
}

interface Advertiser {
    id: string;
    username: string;
    firstName: string;
    lastName: string;
    avatar: string | null;
}

const AdvertiserSearchModal: React.FC<AdvertiserSearchModalProps> = ({ isOpen, onClose, onSelectAdvertiser }) => {
    const apiUrl = import.meta.env.VITE_API_URL;
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [advertisers, setAdvertisers] = useState<Advertiser[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const inputRef = useRef<Input>(null);

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    useEffect(() => {
        if (isOpen) {
            const fetchInitialAdvertisers = async () => {
                setLoading(true);
                try {
                    const token = sessionStorage.getItem('token');
                    const response = await axios.get(`${apiUrl}/api/v1/users/advertisers/search?keyword=${searchTerm}`, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    setAdvertisers(response.data.result);
                } catch (error) {
                    console.error('Error fetching advertisers:', error);
                } finally {
                    setLoading(false);
                }
            };
            fetchInitialAdvertisers();
        }
    }, [isOpen]);

    useEffect(() => {
        if (!searchTerm) return;

        const fetchAdvertisers = async () => {
            setLoading(true);
            try {
                const token = sessionStorage.getItem('token');
                const response = await axios.get(`${apiUrl}/api/v1/users/advertisers/search?keyword=${searchTerm}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setAdvertisers(response.data.result);
            } catch (error) {
                console.error('Error fetching advertisers:', error);
            } finally {
                setLoading(false);
            }
        };

        const debounce = setTimeout(fetchAdvertisers, 300);
        return () => clearTimeout(debounce);
    }, [searchTerm]);

    const handleSelectAdvertiser = (advertiser: { advertiserId: string, fullName: string }) => {
        onSelectAdvertiser({
            advertiserId: advertiser.advertiserId,
            fullName: advertiser.fullName
        });
        onClose();
    };

    return (
        <Modal
            title="Tìm kiếm nhà quảng cáo"
            open={isOpen}
            onCancel={onClose}
            footer={null}
        >
            <Input
                ref={inputRef}
                placeholder="Nhập tên hoặc ID nhà quảng cáo"
                value={searchTerm}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
            />
            <List
                style={{ 
                    marginTop: '16px',
                    maxHeight: '60vh',
                    overflowY: 'auto',
                }}
                loading={loading}
                dataSource={advertisers}
                renderItem={(item) => (
                    <List.Item
                        key={item.id}
                        onClick={() => handleSelectAdvertiser({ advertiserId: item.id, fullName: `${item.firstName} ${item.lastName}` })}
                        style={{ cursor: 'pointer' }}
                    >
                        <List.Item.Meta
                            avatar={
                                <Avatar 
                                    src={item.avatar || 'path/to/default/avatar.png'} 
                                    style={{ display: 'flex', alignItems: 'center' }}
                                />
                            }
                            title={`${item.firstName} ${item.lastName}`}
                            description={`Username: ${item.username}`}
                        />
                    </List.Item>
                )}
            />
        </Modal>
    );
};

export default AdvertiserSearchModal;
