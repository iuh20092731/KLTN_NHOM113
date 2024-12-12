import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { changePassword } from '@/redux/thunks/auth';
import { useToast } from '@/hooks/use-toast';

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({ isOpen, onClose }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const token = useSelector((state: RootState) => state.auth.token);

  const dispatch = useDispatch<AppDispatch>();
  const { toast } = useToast();
  const userId = useSelector((state: RootState) => state.user.userInfo?.userId);

  useEffect(() => {
    if (confirmPassword && newPassword !== confirmPassword) {
      setConfirmPasswordError('Mật khẩu xác nhận không khớp');
    } else {
      setConfirmPasswordError('');
    }
  }, [newPassword, confirmPassword]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setPasswordError('Mật khẩu mới và xác nhận mật khẩu không khớp');
      return;
    }
    setPasswordError('');
    
    if (!userId) {
      toast({
        variant: "destructive",
        description: "Không thể xác định người dùng. Vui lòng đăng nhập lại.",
      });
      return;
    }
    try {
      const resultAction = await dispatch(changePassword({
        oldPassword: currentPassword,
        newPassword: newPassword,
        userId: userId,
        token: token ?? ''
      }));

      if (changePassword.fulfilled.match(resultAction)) {
        toast({ description: "Đổi mật khẩu thành công." });
        onClose();
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        toast({
          variant: "destructive",
          description: resultAction.payload as string || "Đổi mật khẩu thất bại. Vui lòng thử lại.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        description: "Đã xảy ra lỗi khi đổi mật khẩu.",
      });
    }
  };

  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    switch (field) {
      case 'current':
        setShowCurrentPassword(!showCurrentPassword);
        break;
      case 'new':
        setShowNewPassword(!showNewPassword);
        break;
      case 'confirm':
        setShowConfirmPassword(!showConfirmPassword);
        break;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-sm shadow-xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X size={20} />
        </button>
        <h2 className="text-xl font-bold mb-4 text-center text-[#16A34A]">Đổi mật khẩu</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4 relative">
            <label htmlFor="currentPassword" className="block text-gray-700 mb-2 text-sm font-medium">Mật khẩu hiện tại</label>
            <div className="relative">
              <input
                type={showCurrentPassword ? "text" : "password"}
                id="currentPassword"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-3 py-2 border rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                required
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('current')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600"
                tabIndex={-1}
              >
              </button>
            </div>
          </div>
          <div className="mb-4 relative">
            <label htmlFor="newPassword" className="block text-gray-700 mb-2 text-sm font-medium">Mật khẩu mới</label>
            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3 py-2 border rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                required
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('new')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600"
                tabIndex={-1}
              >
              </button>
            </div>
          </div>
          <div className="mb-6 relative">
            <label htmlFor="confirmPassword" className="block text-gray-700 mb-2 text-sm font-medium">Xác nhận mật khẩu mới</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`w-full px-3 py-2 border rounded-md text-gray-700 focus:outline-none focus:ring-2 ${
                  confirmPasswordError ? 'border-red-500 focus:ring-red-500' : 'focus:ring-green-500'
                } text-sm`}
                required
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('confirm')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600"
                tabIndex={-1}
              >
              </button>
            </div>
            {confirmPasswordError && (
              <p className="text-red-500 text-xs mt-1">{confirmPasswordError}</p>
            )}
          </div>
          {passwordError && <p className="text-red-500 text-xs mb-4">{passwordError}</p>}
          <div className="flex justify-center">
            <button
              type="submit"
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-300 text-sm w-full font-medium"
            >
              Đổi mật khẩu
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordModal;