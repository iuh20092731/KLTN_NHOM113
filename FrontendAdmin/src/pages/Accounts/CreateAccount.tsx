import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { createAccount } from '../../redux/thunks/account';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../redux/store';
import { User } from '../../interfaces/User';
import { message } from 'antd';
import LoadingProgress from '../../components/LoadingProgress/LoadingProgress';

// const token = useSelector((state: RootState) => state.user.token);
// console.log(token);

const CreateAccount: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const token = useSelector((state: RootState) => state.user.token);
  // const {account} = useSelector((state: RootState) => state.account);

  const apiUrl = import.meta.env.VITE_API_URL;

  // const token = useSelector((state: RootState) => state.user.token);

  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    zalo: '',
    facebook: '',
    dateOfBirth: '',
    userType: '',
    avatar: '',
  });

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const [messageApi, contextHolder] = message.useMessage();

  const [uploadProgress, setUploadProgress] = useState(0);
  const [showProgress, setShowProgress] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        setAvatarFile(file);
        
        // Tạo URL preview cho ảnh
        const previewUrl = URL.createObjectURL(file);
        setAvatarPreview(previewUrl);
    }
  };

  // Cleanup URL khi component unmount
  useEffect(() => {
    return () => {
        // Cleanup preview URL để tránh memory leak
        if (avatarPreview) {
            URL.revokeObjectURL(avatarPreview);
        }
    };
  }, [avatarPreview]);

  const getAuthToken = (): string => {
    // Implement this function to retrieve the authentication token
    // For example, you might get it from localStorage
    return localStorage.getItem('authToken') || '';
  };

  const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file); 

    try {
      const response = await axios.post(`${apiUrl}/api/v1/upload/image`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  };

  // const createAccount = async (userData: any): Promise<ApiResponse<UserResponse>> => {
  //   try {
  //     const response = await axios.post<ApiResponse<UserResponse>>(`${apiUrl}/api/v1/users/create/admin`, userData, {
  //       headers: {
  //         'Content-Type': 'application/json',
  //         'Authorization': `Bearer ${getAuthToken()}`,
  //       },
  //     });
  //     return response.data;
  //   } catch (error) {
  //     console.error('Error creating account:', error);
  //     throw error;
  //   }
  // };

  const success = (type, content) => {
    messageApi.open({
      type: type,
      content: content,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setShowProgress(true);
    setUploadProgress(0);

    try {
        let avatarUrl = formData.avatar;
        if (avatarFile) {
            setUploadProgress(30);
            avatarUrl = await uploadImage(avatarFile);
            setUploadProgress(60);
        }

        const dataToSubmit: User = {
            username: formData.username,
            password: formData.password,
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            phoneNumber: formData.phoneNumber,
            zalo: formData.zalo,
            facebook: formData.facebook,
            avatar: avatarUrl,
            userType: formData.userType,
        };

        setUploadProgress(80);
        const response = await dispatch(createAccount({ userData: dataToSubmit, token: token as string }));
        setUploadProgress(100);
        
        if (response.payload?.code === 1000) {
            success('success', "Account Created Successfully");
            setFormData({
                username: '',
                password: '',
                confirmPassword: '',
                firstName: '',
                lastName: '',
                email: '',
                phoneNumber: '',
                zalo: '',
                facebook: '',
                dateOfBirth: '',
                userType: '',
                avatar: '',
            });
            setAvatarFile(null);
        } else {
            if (response.payload?.message?.includes('User existed')) {
                success('error', "Email or username already exists");
            } else {
                success('error', response.payload?.message || "Account Creation Failed");
            }
        }

    } catch (error) {
        console.error('Failed to create account:', error);
        if (error.response?.data?.message?.includes('User existed')) {
            success('error', "Email or username already exists");
        } else {
            success('error', "Account Creation Failed");
        }
    } finally {
        setShowProgress(false);
    }
  };

  return (
    <>
      {contextHolder}
      <Breadcrumb pageName="Create Account" />

      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        {/* <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
          <h3 className="font-medium text-black dark:text-white">
            Create New Account
          </h3>
        </div> */}

        <div className="flex justify-center py-6">
          <div className="flex flex-col items-center">
            {avatarPreview ? (
              <div className="relative group mb-3">
                <img
                  src={avatarPreview}
                  alt="Avatar preview"
                  className="w-32 h-32 rounded-full object-cover border-2 border-primary"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <label htmlFor="avatar-upload" className="cursor-pointer text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </label>
                </div>
              </div>
            ) : (
              <label
                htmlFor="avatar-upload"
                className="w-32 h-32 rounded-full border-2 border-dashed border-gray-300 dark:border-gray-600 flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors duration-300"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span className="mt-2 text-sm text-gray-500 dark:text-gray-400">Chọn ảnh</span>
              </label>
            )}
            <input
              id="avatar-upload"
              type="file"
              name="avatar"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Cho phép PNG, JPG
            </p>
          </div>
        </div>

        <form className="p-6.5" onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 sm:col-span-1">
              <div className="mb-4.5">
                <label className="mb-2.5 block text-red-500 dark:text-red-400">
                  Username *
                </label>
                <input
                  type="text"
                  name="username"
                  placeholder="Enter username"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-4.5">
                <label className="mb-2.5 block text-red-500 dark:text-red-400">
                  Password *
                </label>
                <input
                  type="password"
                  name="password"
                  placeholder="Enter password"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-4.5">
                <label className="mb-2.5 block text-red-500 dark:text-red-400">
                  Confirm Password *
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm password"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-4.5">
                <label className="mb-2.5 block text-red-500 dark:text-red-400">
                  First Name *
                </label>
                <input
                  type="text"
                  name="firstName"
                  placeholder="Enter first name"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-4.5">
                <label className="mb-2.5 block text-red-500 dark:text-red-400">
                  Last Name *
                </label>
                <input
                  type="text"
                  name="lastName"
                  placeholder="Enter last name"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-4.5">
                <label className="mb-2.5 block text-red-500 dark:text-red-400">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter email address"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <div className="mb-4.5">
                <label className="mb-2.5 block text-black dark:text-white">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phoneNumber"
                  placeholder="Enter phone number"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-4.5">
                <label className="mb-2.5 block text-black dark:text-white">
                  Zalo
                </label>
                <input
                  type="text"
                  name="zalo"
                  placeholder="Enter Zalo ID"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  value={formData.zalo}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-4.5">
                <label className="mb-2.5 block text-black dark:text-white">
                  Facebook
                </label>
                <input
                  type="text"
                  name="facebook"
                  placeholder="Enter Facebook profile"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  value={formData.facebook}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-4.5">
                <label className="mb-2.5 block text-black dark:text-white">
                  Date of Birth
                </label>
                <input
                  type="date"
                  name="dateOfBirth"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-4.5">
                <label className="mb-2.5 block text-red-500 dark:text-red-400">
                  User Type *
                </label>
                <select
                  name="userType"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  value={formData.userType}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select user type</option>
                  <option value="ADMIN">Admin</option>
                  <option value="USER">User</option>
                </select>
              </div>
            </div>
          </div>
          <button className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray">
            Create Account
          </button>
        </form>
      </div>

      {showProgress && (
        <LoadingProgress 
          progress={uploadProgress}
          message={`Đang tạo tài khoản ${uploadProgress === 100 ? 'hoàn tất' : '...'}`}
        />
      )}
    </>
  );
};

export default CreateAccount;
