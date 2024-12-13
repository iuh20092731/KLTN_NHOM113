import { useState, useEffect } from 'react';
import { Table, Button, Space, message, Modal, Form, Input } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import Breadcrumb from '../Breadcrumbs/Breadcrumb';
import { useAuth } from '../../context/AuthContext';

interface FAQ {
    faqId: number;
    question: string;
    answer: string;
    advertisementId: number;
}

const FrmFAQList = () => {
    const [faqs, setFaqs] = useState<FAQ[]>([]);
    const [loading, setLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();
    const { advertisementId } = useParams();
    const { token } = useAuth();
    const apiUrl = (import.meta as any).env.VITE_API_URL;
    const [isEditing, setIsEditing] = useState(false);
    const [editingFaqId, setEditingFaqId] = useState<number | null>(null);
    const navigate = useNavigate();

    const columns = [
        {
            title: 'Câu hỏi',
            dataIndex: 'question',
            key: 'question',
        },
        {
            title: 'Trả lời',
            dataIndex: 'answer',
            key: 'answer',
        },
        {
            title: 'Thao tác',
            key: 'action',
            width: 150,
            render: (_: any, record: FAQ) => (
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
                        onClick={() => handleDelete(record)}
                    >
                        Xóa
                    </Button>
                </Space>
            ),
        },
    ];

    const fetchFAQs = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${apiUrl}/api/v1/faqs/advertisement/${advertisementId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (!response.ok) throw new Error('Failed to fetch FAQs');
            const data = await response.json();
            setFaqs(data.result);
        } catch (error) {
            message.error('Không thể tải danh sách câu hỏi');
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = () => {
        setIsEditing(false);
        setEditingFaqId(null);
        form.resetFields();
        setIsModalVisible(true);
    };

    const handleSubmit = async (values: any) => {
        try {
            if (isEditing && editingFaqId) {
                // Update existing FAQ
                const response = await fetch(`${apiUrl}/api/v1/faqs/${editingFaqId}`, {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        question: values.question,
                        answer: values.answer,
                        advertisementId: Number(advertisementId)
                    }),
                });

                if (!response.ok) throw new Error('Failed to update FAQ');
                message.success('Cập nhật câu hỏi thành công');
            } else {
                // Create new FAQ
                const response = await fetch(`${apiUrl}/api/v1/faqs`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        question: values.question,
                        answer: values.answer,
                        advertisementId: Number(advertisementId)
                    }),
                });

                if (!response.ok) throw new Error('Failed to create FAQ');
                message.success('Thêm câu hỏi thành công');
            }

            setIsModalVisible(false);
            setIsEditing(false);
            setEditingFaqId(null);
            form.resetFields();
            fetchFAQs();
        } catch (error) {
            message.error(isEditing ? 'Không thể cập nhật câu hỏi' : 'Không thể thêm câu hỏi');
        }
    };

    const handleEdit = (record: FAQ) => {
        setIsEditing(true);
        setEditingFaqId(record.faqId);
        form.setFieldsValue(record);
        setIsModalVisible(true);
    };

    const handleDelete = (record: FAQ) => {
        Modal.confirm({
            title: 'Xác nhận xóa',
            content: 'Bạn có chắc chắn muốn xóa câu hỏi này?',
            onOk: async () => {
                try {
                    const response = await fetch(`${apiUrl}/api/v1/faqs/${record.faqId}`, {
                        method: 'DELETE',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                        },
                    });
                    if (!response.ok) throw new Error('Failed to delete FAQ');
                    message.success('Xóa câu hỏi thành công');
                    fetchFAQs();
                } catch (error) {
                    message.error('Không thể xóa câu hỏi');
                }
            },
        });
    };

    useEffect(() => {
        fetchFAQs();
    }, [advertisementId]);

    return (
        <>
            <Breadcrumb pageName="Quản lý Q&A" />
            <div className="bg-white rounded-lg shadow-lg p-5">
                <div className="mb-4 flex justify-between items-center">
                    <Button
                        onClick={() => navigate(-1)}
                        icon={<ArrowLeftOutlined />}
                        className="flex items-center bg-blue-500 hover:bg-blue-600 text-white transition-colors duration-200"
                    >
                        Quay lại
                    </Button>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={handleAdd}
                        className="bg-green-500 hover:bg-green-600"
                    >
                        Thêm câu hỏi
                    </Button>
                </div>

                <Table
                    columns={columns}
                    dataSource={faqs}
                    loading={loading}
                    rowKey="faqId"
                />

                <Modal
                    title={isEditing ? "Sửa câu hỏi" : "Thêm câu hỏi mới"}
                    open={isModalVisible}
                    onCancel={() => {
                        setIsModalVisible(false);
                        setIsEditing(false);
                        setEditingFaqId(null);
                        form.resetFields();
                    }}
                    footer={null}
                >
                    <Form
                        form={form}
                        onFinish={handleSubmit}
                        layout="vertical"
                    >
                        <Form.Item
                            name="question"
                            label="Câu hỏi"
                            rules={[{ required: true, message: 'Vui lòng nhập câu hỏi' }]}
                        >
                            <Input.TextArea rows={3} />
                        </Form.Item>

                        <Form.Item
                            name="answer"
                            label="Trả lời"
                            rules={[{ required: true, message: 'Vui lòng nhập câu trả lời' }]}
                        >
                            <Input.TextArea rows={5} />
                        </Form.Item>

                        <Form.Item className="mb-0 text-right">
                            <Space>
                                <Button onClick={() => setIsModalVisible(false)}>
                                    Hủy
                                </Button>
                                <Button type="primary" htmlType="submit" className="bg-blue-500">
                                    Lưu
                                </Button>
                            </Space>
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        </>
    );
};

export default FrmFAQList; 