import React, { useState, useEffect } from "react";
import { useDispatch } from 'react-redux';
import { getSocialGroupLinks, updateSocialGroupLinkStatus, createSocialGroupLink, deleteSocialGroupLink } from '../../redux/thunks/socialGroupLinks';
import { uploadImage } from '../../redux/thunks/cloudDinary';
import { Switch, message, Upload, Modal } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import type { UploadFile } from 'antd/es/upload/interface';
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";

interface SocialLinkResponse {
  id: number;
  serial: number;
  platform: string;
  groupName: string;
  groupLink: string;
  description: string;
  remark: string;
  isActive: boolean;
  imageUrl: string;
}

interface SocialLink {
  url: string;
  text: string;
}

interface SocialGroup {
  name: string;
  icon: string;
  mainGroup: SocialLinkResponse;
  links: SocialLinkResponse[];
}

interface SocialGroupLinkCreationRequest {
  platform: string;
  groupName: string;
  groupLink: string;
  description: string;
  remark: string;
  isActive: boolean;
  imageUrl: string;
  serial: number;
}

const QuanLyLinkSocial: React.FC = () => {
  const dispatch = useDispatch();
  const [socialGroups, setSocialGroups] = useState<SocialGroup[]>([]);
  const [loading, setLoading] = useState(false);
  const [newGroup, setNewGroup] = useState<SocialGroup>({
    name: "",
    icon: "",
    mainGroup: {} as SocialLinkResponse,
    links: [],
  });
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedGroupIndex, setSelectedGroupIndex] = useState<number | null>(null);
  const [newLink, setNewLink] = useState<SocialGroupLinkCreationRequest>({
    platform: '',
    groupName: '',
    groupLink: '',
    description: '',
    remark: '',
    isActive: true,
    imageUrl: '',
    serial: 0
  });
  const [newGroupForm, setNewGroupForm] = useState<SocialGroupLinkCreationRequest>({
    platform: '',
    groupName: '',
    groupLink: '',
    description: '',
    remark: '',
    isActive: true,
    imageUrl: '',
    serial: 0
  });
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');
  const [tempFile, setTempFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showProgress, setShowProgress] = useState(false);

  useEffect(() => {
    const fetchSocialGroups = async () => {
      setLoading(true);
      try {
        const response = await dispatch(getSocialGroupLinks()).unwrap();

        const groupedData = response.reduce((acc: { [key: string]: SocialGroup }, link) => {
          if (!acc[link.platform]) {
            acc[link.platform] = {
              name: link.platform,
              icon: link.imageUrl,
              mainGroup: {} as SocialLinkResponse,
              links: []
            };
          }

          if (link.serial === 0) {
            acc[link.platform].mainGroup = link;
          } else {
            acc[link.platform].links.push(link);
          }
          return acc;
        }, {});

        const formattedGroups = Object.values(groupedData);
        setSocialGroups(formattedGroups);

        // console.log(formattedGroups);
      } catch (error) {
        console.error('Error fetching social groups:', error);
        message.error('Có lỗi khi tải dữ liệu!');
      } finally {
        setLoading(false);
      }
    };

    fetchSocialGroups();
  }, [dispatch]);

  const handleCancel = () => setPreviewOpen(false);

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
    setPreviewTitle(file.name || file.url!.substring(file.url!.lastIndexOf('/') + 1));
  };

  const handleChange = async (info: any) => {
    const file = info.file.originFileObj;
    if (file) {
      try {
        const previewURL = URL.createObjectURL(file);
        setPreviewUrl(previewURL);
        setTempFile(file);
        setFileList([info.file]);
      } catch (error) {
        console.error('Preview failed:', error);
        message.error('Không thể hiển thị ảnh preview!');
      }
    }
  };

  const handleAddGroup = async () => {
    if (!newGroupForm.platform || !newGroupForm.groupName || !newGroupForm.groupLink) {
      message.warning("Vui lòng điền đầy đủ thông tin bắt buộc!");
      return;
    }

    setShowProgress(true);
    setUploadProgress(0);

    try {
      let imageUrl = '';

      if (tempFile) {
        setUploadProgress(30);
        const formData = new FormData();
        formData.append('files', tempFile);

        const uploadResult = await dispatch(uploadImage(formData)).unwrap();
        const [uploadedImageUrl] = JSON.parse(uploadResult);
        imageUrl = uploadedImageUrl;
        setUploadProgress(60);
      }

      await dispatch(createSocialGroupLink({
        ...newGroupForm,
        imageUrl: imageUrl,
        serial: 0
      })).unwrap();

      setUploadProgress(80);

      const response = await dispatch(getSocialGroupLinks()).unwrap();
      const groupedData = response.reduce((acc: { [key: string]: SocialGroup }, link) => {
        if (!acc[link.platform]) {
          acc[link.platform] = {
            name: link.platform,
            icon: link.imageUrl,
            mainGroup: {} as SocialLinkResponse,
            links: []
          };
        }

        if (link.serial === 0) {
          acc[link.platform].mainGroup = link;
        } else {
          acc[link.platform].links.push(link);
        }
        return acc;
      }, {});

      const formattedGroups = Object.values(groupedData);
      setSocialGroups(formattedGroups);

      setUploadProgress(100);
      message.success('Thêm nhóm thành công');

      setNewGroupForm({
        platform: '',
        groupName: '',
        groupLink: '',
        description: '',
        remark: '',
        isActive: true,
        imageUrl: '',
        serial: 0
      });
      setFileList([]);
      setPreviewUrl('');
      setTempFile(null);
    } catch (error) {
      console.error('Error adding group:', error);
      message.error('Thêm nhóm thất bại');
    } finally {
      setShowProgress(false);
    }
  };

  const handleOpenModal = (groupIndex: number) => {
    setSelectedGroupIndex(groupIndex);
    setModalOpen(true);
    setNewLink({
      platform: socialGroups[groupIndex].name,
      groupName: '',
      groupLink: '',
      description: '',
      remark: '',
      isActive: true,
      imageUrl: '',
      serial: 0
    });
  };

  const getNextSerial = (platform: string, groups: SocialGroup[]): number => {
    const group = groups.find(g => g.name === platform);
    if (!group) return 1;

    const maxSerial = Math.max(0, ...group.links.map(link => link.serial));
    return maxSerial + 1;
  };

  const handleAddLink = async () => {
    if (!newLink.platform || !newLink.groupName || !newLink.groupLink) {
      message.warning("Vui lòng điền đầy đủ thông tin bắt buộc!");
      return;
    }

    try {
      const nextSerial = getNextSerial(newLink.platform, socialGroups);

      await dispatch(createSocialGroupLink({
        ...newLink,
        serial: nextSerial  // Add the calculated serial number
      })).unwrap();

      const response = await dispatch(getSocialGroupLinks()).unwrap();

      const groupedData = response.reduce((acc: { [key: string]: SocialGroup }, link) => {
        if (!acc[link.platform]) {
          acc[link.platform] = {
            name: link.platform,
            icon: link.imageUrl,
            mainGroup: {} as SocialLinkResponse,
            links: []
          };
        }

        if (link.serial === 0) {
          acc[link.platform].mainGroup = link;
        } else {
          acc[link.platform].links.push(link);
        }
        return acc;
      }, {});

      const formattedGroups = Object.values(groupedData);
      setSocialGroups(formattedGroups);

      message.success('Thêm liên kết thành công');
      setModalOpen(false);

      setNewLink({
        platform: '',
        groupName: '',
        groupLink: '',
        description: '',
        remark: '',
        isActive: true,
        imageUrl: '',
        serial: 0
      });
    } catch (error) {
      console.error('Error creating link:', error);
      message.error('Thêm liên kết thất bại');
    }
  };

  const handleDeleteGroup = async (groupIndex: number) => {
    try {
      const groupToDelete = socialGroups[groupIndex];
      // console.log('Group to delete:', groupToDelete);

      // Lấy platform của nhóm cần xóa
      const platform = groupToDelete.name;

      // Xóa tất cả các link con trước
      if (groupToDelete.links && groupToDelete.links.length > 0) {
        // console.log('Links to delete:', groupToDelete.links);
        for (const link of groupToDelete.links) {
          if (link.id) {
            // console.log('Deleting link with ID:', link.id);
            await dispatch(deleteSocialGroupLink(link.id)).unwrap();
          }
        }
      }

      // Lấy lại dữ liệu mới nhất để tìm mainGroup
      const allLinks = await dispatch(getSocialGroupLinks()).unwrap();
      const mainGroup = allLinks.find(link => link.platform === platform && link.serial === 0);

      // Nếu có mainGroup thì xóa
      if (mainGroup?.id) {
        // console.log('Deleting main group with ID:', mainGroup.id);
        await dispatch(deleteSocialGroupLink(mainGroup.id)).unwrap();
      }

      // Refresh data sau khi xóa
      const response = await dispatch(getSocialGroupLinks()).unwrap();
      // console.log('Updated data after deletion:', response);

      const groupedData = response.reduce((acc: { [key: string]: SocialGroup }, link) => {
        if (!acc[link.platform]) {
          acc[link.platform] = {
            name: link.platform,
            icon: link.imageUrl,
            mainGroup: {} as SocialLinkResponse,
            links: []
          };
        }

        if (link.serial === 0) {
          acc[link.platform].mainGroup = link;
        } else {
          acc[link.platform].links.push(link);
        }
        return acc;
      }, {});

      const formattedGroups = Object.values(groupedData);
      setSocialGroups(formattedGroups);

      message.success('Xóa nhóm thành công');
    } catch (error) {
      console.error('Error deleting group:', error);
      console.error('Error details:', error.response?.data || error.message);
      message.error('Xóa nhóm thất bại');
    }
  };

  const handleDeleteLink = async (groupIndex: number, linkIndex: number) => {
    try {
      const linkToDelete = socialGroups[groupIndex].links[linkIndex];

      await dispatch(deleteSocialGroupLink(linkToDelete.id)).unwrap();

      const response = await dispatch(getSocialGroupLinks()).unwrap();

      const groupedData = response.reduce((acc: { [key: string]: SocialGroup }, link) => {
        if (!acc[link.platform]) {
          acc[link.platform] = {
            name: link.platform,
            icon: link.imageUrl,
            mainGroup: {} as SocialLinkResponse,
            links: []
          };
        }

        if (link.serial === 0) {
          acc[link.platform].mainGroup = link;
        } else {
          acc[link.platform].links.push(link);
        }
        return acc;
      }, {});

      const formattedGroups = Object.values(groupedData);
      setSocialGroups(formattedGroups);

      message.success('Xóa liên kết thành công');
    } catch (error) {
      console.error('Error deleting link:', error);
      message.error('Xóa liên kết thất bại');
    }
  };

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const LoadingProgress = ({ progress, message }: { progress: number, message: string }) => (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-80">
        <div className="mb-4">
          <div className="h-2 w-full bg-gray-200 rounded">
            <div
              className="h-full bg-blue-500 rounded transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
        <p className="text-center text-gray-700">{message}</p>
      </div>
    </div>
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Breadcrumb pageName="Quản lý các nhóm xã hội" />
      <div className="max-w-full mx-auto p-6 bg-white rounded-lg shadow-lg">
        {/* <h1 className="text-2xl font-bold text-center mb-6">Quản lý các nhóm xã hội</h1> */}
        <div className="space-y-4">
          {socialGroups.map((group, groupIndex) => (
            <div key={groupIndex} className="border border-gray-200 p-4 rounded-md shadow-md bg-gray-50 hover:bg-gray-100 transition-all">
              <div className="flex flex-col md:flex-row justify-between items-start mb-4">
                <div className="flex flex-col md:flex-row items-start md:items-center gap-4 w-full md:w-auto mb-4 md:mb-0">
                  <img
                    src={group.mainGroup.imageUrl || '/default-image.png'}
                    alt={group.mainGroup.platform}
                    className="w-16 h-16 object-contain rounded-lg shadow-sm"
                  />
                  <div>
                    <h2 className="text-xl font-bold text-gray-800 block">Nhóm {group.mainGroup.platform}</h2>
                    <p className="text-gray-600 text-sm block">{group.mainGroup.description}</p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                  <button
                    onClick={() => handleOpenModal(groupIndex)}
                    className="flex items-center justify-center gap-1 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                  >
                    <PlusOutlined className="text-sm" />
                    Thêm liên kết
                  </button>
                  <button
                    onClick={() => {
                      Modal.confirm({
                        title: 'Xác nhận xóa nhóm',
                        content: 'Bạn có chắc chắn muốn xóa nhóm này? Tất cả các liên kết trong nhóm sẽ bị xóa.',
                        okText: 'Xóa',
                        okType: 'danger',
                        cancelText: 'Hủy',
                        onOk: () => handleDeleteGroup(groupIndex)
                      });
                    }}
                    className="flex items-center justify-center gap-1 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                  >
                    <DeleteOutlined className="text-sm" />
                    Xóa nhóm
                  </button>
                </div>
              </div>

              <div className="mt-4">
                <ul className="space-y-3">
                  {group.links.map((link, linkIndex) => (
                    <li key={link.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 bg-white rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                      <div className="mb-2 sm:mb-0">
                        <a
                          href={link.groupLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 font-medium break-all block"
                        >
                          {link.groupName}
                        </a>
                        {link.description && (
                          <p className="text-gray-500 text-sm mt-1 block">{link.description}</p>
                        )}
                      </div>
                      <button
                        onClick={() => {
                          Modal.confirm({
                            title: 'Xác nhận xóa',
                            content: 'Bạn có chắc chắn muốn xóa liên kết này không?',
                            okText: 'Xóa',
                            okType: 'danger',
                            cancelText: 'Hủy',
                            onOk: () => handleDeleteLink(groupIndex, linkIndex)
                          });
                        }}
                        className="flex items-center gap-1 px-3 py-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors mt-2 sm:mt-0"
                      >
                        <DeleteOutlined className="text-sm" />
                        Xóa
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 p-4 md:p-6 border border-gray-200 rounded-lg shadow-md bg-white">
          <h3 className="text-xl font-bold text-gray-800 mb-6 block">Thêm nhóm mới</h3>
          <div className="grid grid-cols-1 gap-4 md:gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tên nền tảng <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={newGroupForm.platform}
                onChange={(e) => setNewGroupForm({ ...newGroupForm, platform: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                placeholder="Ví dụ: Facebook, Zalo..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tên nhóm <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={newGroupForm.groupName}
                onChange={(e) => setNewGroupForm({ ...newGroupForm, groupName: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                placeholder="Tên nhóm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Liên kết nhóm <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={newGroupForm.groupLink}
                onChange={(e) => setNewGroupForm({ ...newGroupForm, groupLink: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                placeholder="https://..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mô tả
              </label>
              <textarea
                value={newGroupForm.description}
                onChange={(e) => setNewGroupForm({ ...newGroupForm, description: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                rows={3}
                placeholder="Mô tả ngắn gọn về nhóm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hình ảnh
              </label>
              <Upload
                listType="picture-card"
                fileList={fileList}
                onPreview={handlePreview}
                onChange={handleChange}
                className="upload-list-inline"
              >
                {fileList.length >= 1 ? null : (
                  <div>
                    <PlusOutlined />
                    <div className="mt-2">Tải lên</div>
                  </div>
                )}
              </Upload>
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <button
              onClick={handleAddGroup}
              className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <PlusOutlined />
              Thêm nhóm
            </button>
          </div>
        </div>

        <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>

        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white p-4 md:p-6 rounded-lg shadow-xl w-full max-w-[600px] max-h-[90vh] overflow-y-auto">
              <h3 className="text-xl font-bold text-gray-800 mb-6">Thêm liên kết mới</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nền tảng
                  </label>
                  <select
                    value={newLink.platform}
                    onChange={(e) => setNewLink({ ...newLink, platform: e.target.value })}
                    className="border p-2 rounded-md w-full"
                  >
                    {socialGroups.map((group) => (
                      <option key={group.name} value={group.name}>
                        {group.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tên nhóm
                  </label>
                  <input
                    type="text"
                    value={newLink.groupName}
                    onChange={(e) => setNewLink({ ...newLink, groupName: e.target.value })}
                    className="border p-2 rounded-md w-full"
                    placeholder="Nhập tên liên kết"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Liên kết
                  </label>
                  <input
                    type="text"
                    value={newLink.groupLink}
                    onChange={(e) => setNewLink({ ...newLink, groupLink: e.target.value })}
                    className="border p-2 rounded-md w-full"
                    placeholder="Nhập đường dẫn đến nhóm (URL)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mô tả
                  </label>
                  <input
                    type="text"
                    value={newLink.description}
                    onChange={(e) => setNewLink({ ...newLink, description: e.target.value })}
                    className="border p-2 rounded-md w-full"
                    placeholder="Nhập mô tả ngắn gọn về nhóm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ghi chú
                  </label>
                  <input
                    type="text"
                    value={newLink.remark}
                    onChange={(e) => setNewLink({ ...newLink, remark: e.target.value })}
                    className="border p-2 rounded-md w-full"
                    placeholder="Nhập ghi chú thêm (nếu có)"
                  />
                </div>

                <div className="flex items-center">
                  <label className="text-sm font-medium text-gray-700 mr-2">
                    Kích hoạt
                  </label>
                  <Switch
                    checked={newLink.isActive}
                    onChange={(checked) => setNewLink({ ...newLink, isActive: checked })}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
                <button
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                >
                  Hủy
                </button>
                <button
                  onClick={handleAddLink}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Thêm liên kết
                </button>
              </div>
            </div>
          </div>
        )}

        {showProgress && (
          <LoadingProgress
            progress={uploadProgress}
            message="Đang xử lý, vui lòng đợi..."
          />
        )}
      </div>
    </>
  );
};

const getBase64 = (file: any): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

export default QuanLyLinkSocial;
