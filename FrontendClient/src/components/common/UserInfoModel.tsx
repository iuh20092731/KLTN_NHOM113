import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/redux/store';
import { updateUser } from '@/redux/thunks/user';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, User, Mail, Phone, MessageCircle, Facebook, Zap, X } from 'lucide-react';
import defaultAvatar from '../../assets/img/default-avatar.jpg'

interface UserInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  userInfoRef: React.RefObject<HTMLDivElement>;
}

const UserInfoModal: React.FC<UserInfoModalProps> = ({ isOpen, onClose, userInfoRef }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { userInfo, status, error } = useSelector((state: RootState) => state.user);
  const [isEditing, setIsEditing] = useState(false);
  const [editedInfo, setEditedInfo] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    zalo: '',
    facebook: '',
    avatar: '',
  });
  useEffect(() => {
    if (userInfo) {
      setEditedInfo({
        firstName: userInfo.firstName || '',
        lastName: userInfo.lastName || '',
        phoneNumber: userInfo.phoneNumber || '',
        zalo: userInfo.zalo || '',
        facebook: userInfo.facebook || '',
        avatar: userInfo.avatar || defaultAvatar,
      });
    }
  }, [userInfo]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      if (!userInfo) return;
      const changedFields = Object.entries(editedInfo).reduce<Partial<typeof editedInfo>>((acc, [key, value]) => {
        if (value !== userInfo[key as keyof typeof userInfo]) {
          acc[key as keyof typeof editedInfo] = value;
        }
        return acc;
      }, {});

      if (Object.keys(changedFields).length > 0) {
        await dispatch(updateUser({ userId: userInfo.userId, data: changedFields }));
        // ... xử lý sau khi cập nhật thành công
      }
      setIsEditing(false);
    } catch (error) {
      // ... error handling
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleClose = () => {
    setIsEditing(false);
    if (userInfo) {
      setEditedInfo({
        firstName: userInfo.firstName || '',
        lastName: userInfo.lastName || '',
        phoneNumber: userInfo.phoneNumber || '',
        zalo: userInfo.zalo || '',
        facebook: userInfo.facebook || '',
        avatar: userInfo.avatar || defaultAvatar,
      });
    }
    onClose();
  };

  const userFields = userInfo ? [
    { icon: <User className="h-5 w-5" />, label: "Tên đăng nhập", value: userInfo.username },
    { icon: <Mail className="h-5 w-5" />, label: "Email", value: userInfo.email },
    { icon: <User className="h-5 w-5" />, label: "Họ và tên", value: `${editedInfo.firstName} ${editedInfo.lastName}`, name: ["firstName", "lastName"], editable: true },
    { icon: <Phone className="h-5 w-5" />, label: "Số điện thoại", value: editedInfo.phoneNumber, name: "phoneNumber", editable: true },
    { icon: <MessageCircle className="h-5 w-5" />, label: "Zalo", value: editedInfo.zalo, name: "zalo", editable: true },
    { icon: <Facebook className="h-5 w-5" />, label: "Facebook", value: editedInfo.facebook, name: "facebook", editable: true },
    { icon: <Zap className="h-5 w-5" />, label: "Trạng thái", value: userInfo.active ? "Hoạt động" : "Không hoạt động" },
  ] : [];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 overflow-y-auto">
      <div className="w-full max-w-2xl mx-auto px-4">
        <Card ref={userInfoRef} className='mt-80 mb-10 lg:mt-0 relative'>
          <Button
            onClick={handleClose}
            variant="ghost"
            className="absolute top-2 right-2 p-2"
            aria-label="Close"
          >
            <X className="h-4 w-4 md:h-6 md:w-6" />
          </Button>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center pb-3 text-[#16A34A]">Thông tin người dùng</CardTitle>
            
            {/* <CardDescription className="text-center mt-4">Quản lý thông tin cá nhân của bạn</CardDescription> */}
            <div className="flex justify-center mt-4 mb-2">
              <img
                src={editedInfo.avatar || defaultAvatar}
                alt="Avatar"
                className="w-24 h-24 rounded-full object-cover border "
              />
            </div>
          </CardHeader>
          <CardContent>
            {status === 'loading' ? (
              <div className="flex justify-center items-center h-40">
                <Loader2 className="mr-2 h-16 w-16 animate-spin" />
                <span className="text-xl font-semibold">Đang tải...</span>
              </div>
            ) : status === 'failed' ? (
              <div className="text-red-500 text-center text-xl font-semibold">
                <span className="block mb-2">❌</span>
                {error}
              </div>
            ) : !userInfo ? (
              <div className="text-yellow-500 text-center text-xl font-semibold">
                <span className="block mb-2">⚠️</span>
                Không tìm thấy thông tin người dùng
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {userFields.map((field, index) => (
                  <div key={index} className="space-y-2">
                    <Label htmlFor={field.label} className="flex items-center space-x-2">
                      {field.icon}
                      <span>{field.label}</span>
                    </Label>
                    <div className="flex items-center space-x-2">
                      {field.editable && isEditing ? (
                        Array.isArray(field.name) ? (
                          <div className="flex space-x-2 w-full">
                            <Input
                              id={`${field.label}-firstName`}
                              name="firstName"
                              value={editedInfo.firstName}
                              onChange={handleInputChange}
                              className="bg-white flex-grow"
                              placeholder="Họ"
                            />
                            <Input
                              id={`${field.label}-lastName`}
                              name="lastName"
                              value={editedInfo.lastName}
                              onChange={handleInputChange}
                              className="bg-white flex-grow"
                              placeholder="Tên"
                            />
                          </div>
                        ) : (
                          <Input
                            id={field.label}
                            name={field.name as string}
                            value={field.value}
                            onChange={handleInputChange}
                            className="bg-white flex-grow"
                          />
                        )
                      ) : (
                        <Input 
                          id={field.label} 
                          value={field.value} 
                          readOnly 
                          className="bg-gray-100 flex-grow" 
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button onClick={handleClose} variant="default" className="bg-red-600 hover:bg-red-500">Đóng</Button>
            {isEditing ? (
              <Button onClick={handleSave} variant="default" className="bg-green-600 hover:bg-green-500">Lưu thông tin</Button>
            ) : (
              <Button onClick={handleEdit} variant="default" className="bg-green-600 hover:bg-green-500">Cập nhật thông tin</Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default UserInfoModal;
