import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import LogoDark from '../../images/logo/logo-dark.svg';
import Logo from '../../images/logo/logo.svg';
import { useAuth } from '../../context/AuthContext';
import { useDispatch } from 'react-redux';
import { setUser, setToken } from '../../store/userSlice';
import { FiEye, FiEyeOff } from 'react-icons/fi'; // Thêm import này

const SignIn: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL;
  const { setToken: setAuthToken } = useAuth();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);  // Add this line
  const [showModal, setShowModal] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState<number>(0);
  const [lockoutTime, setLockoutTime] = useState<number | null>(null);
  const usernameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const savedLockoutTime = localStorage.getItem('loginLockoutTime');
    const savedAttempts = localStorage.getItem('loginAttempts');
    
    if (savedLockoutTime) {
      const lockoutEndTime = parseInt(savedLockoutTime);
      if (lockoutEndTime > Date.now()) {
        setLockoutTime(lockoutEndTime);
      } else {
        localStorage.removeItem('loginLockoutTime');
        localStorage.removeItem('loginAttempts');
      }
    }
    
    if (savedAttempts) {
      setLoginAttempts(parseInt(savedAttempts));
    }
  }, []);

  useEffect(() => {
    if (!showModal && usernameRef.current) {
      setTimeout(() => {
        usernameRef.current?.focus();
      }, 100);
    }
  }, [showModal]);

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (lockoutTime && lockoutTime > Date.now()) {
      const remainingTime = Math.ceil((lockoutTime - Date.now()) / 1000 / 60);
      setError(`Tài khoản đã bị khóa. Vui lòng thử lại sau ${remainingTime} phút.`);
      setShowModal(true);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${apiUrl}/api/v1/auth/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: email, password: password }),
      });

      if (!response.ok) {
        const newAttempts = loginAttempts + 1;
        setLoginAttempts(newAttempts);
        localStorage.setItem('loginAttempts', newAttempts.toString());

        if (newAttempts >= 5) {
          const lockoutEndTime = Date.now() + 10 * 60 * 1000; // 10 phút
          setLockoutTime(lockoutEndTime);
          localStorage.setItem('loginLockoutTime', lockoutEndTime.toString());
          throw new Error('Bạn đã đăng nhập sai 5 lần. Tài khoản bị khóa trong 10 phút.');
        }

        throw new Error(`Đăng nhập thất bại. Còn ${5 - newAttempts} lần thử lại.`);
      }

      localStorage.removeItem('loginAttempts');
      localStorage.removeItem('loginLockoutTime');
      setLoginAttempts(0);
      setLockoutTime(null);

      const data = await response.json();
      setAuthToken(data.result.token);

      // Dispatch actions to update Redux store
      dispatch(setToken(data.result.token));
      // dispatch(setUser(data.result.user)); // Giả sử API trả về thông tin user

      if (data.result.token) {
        sessionStorage.setItem('token', data.result.token);

        // console.log("Token đã lưu trong session:", sessionStorage.getItem('token'));
        navigate('/');
        // console.log('Đăng nhập thành công.');
      } else {
        throw new Error('Token không hợp lệ.');
      }
    } catch (error: any) {
      setError(error.message);
      setShowModal(true);
    } finally {
      setLoading(false);
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    // Tăng delay để đảm bảo modal đã đóng hoàn toàn
    setTimeout(() => {
      if (usernameRef.current) {
        usernameRef.current.focus();
        // Optional: Select all text
        usernameRef.current.select();
      }
    }, 100);
  };

  const handleFormKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && showModal) {
      event.preventDefault();
      handleModalClose();
    }
  };

  return (
    <>
      <div className="text-center sm:text-left">
        <Breadcrumb pageName="Sign In" />
      </div>

      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="flex flex-wrap items-center">
          <div className="hidden w-full xl:block xl:w-1/2">
            <div className="py-17.5 px-26 text-center">
              <Link className="mb-5.5 inline-block" to="/">
                <img className="hidden dark:block" src={Logo} alt="Logo" />
                <img className="dark:hidden" src="/logo-HN-2.png" alt="Logo" />
              </Link>

              <p className="2xl:px-20 -mt-6">
                Hung Ngan Services
              </p>

              <span className="mt-15 inline-block">
                <img src="/bg-cchn.jpg" alt="" />
              </span>
            </div>
          </div>

          <div className="w-full border-stroke dark:border-strokedark xl:w-1/2 xl:border-l-2">
            <div className="w-full p-4 sm:p-12.5 xl:p-17.5">
              <span className="mb-1.5 block font-medium text-center sm:text-left">
                Chào mừng ADMIN
              </span>
              <h2 className="mb-7 mt-3 text-xl font-bold text-black dark:text-white sm:text-2xl text-center sm:text-left">
                Đăng nhập DichVuHungNgan
              </h2>

              <form onSubmit={handleLogin} onKeyDown={handleFormKeyDown}>
                <div className="mb-4">
                  <label className="mb-2.5 block font-medium text-black dark:text-white">
                    Tên đăng nhập
                  </label>
                  <div className="relative">
                    <input
                      ref={usernameRef}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Nhập tên đăng nhập"
                      className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />

                    <span className="absolute right-4 top-4">
                      <svg
                        className="fill-current"
                        width="22"
                        height="22"
                        viewBox="0 0 22 22"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g opacity="0.5">
                          <path
                            d="M19.2516 3.30005H2.75156C1.58281 3.30005 0.585938 4.26255 0.585938 5.46567V16.6032C0.585938 17.7719 1.54844 18.7688 2.75156 18.7688H19.2516C20.4203 18.7688 21.4172 17.8063 21.4172 16.6032V5.4313C21.4172 4.26255 20.4203 3.30005 19.2516 3.30005ZM19.2516 4.84692C19.2859 4.84692 19.3203 4.84692 19.3547 4.84692L11.0016 10.2094L2.64844 4.84692C2.68281 4.84692 2.71719 4.84692 2.75156 4.84692H19.2516ZM19.2516 17.1532H2.75156C2.40781 17.1532 2.13281 16.8782 2.13281 16.5344V6.35942L10.1766 11.5157C10.4172 11.6875 10.6922 11.7563 10.9672 11.7563C11.2422 11.7563 11.5172 11.6875 11.7578 11.5157L19.8016 6.35942V16.5688C19.8703 16.9125 19.5953 17.1532 19.2516 17.1532Z"
                            fill=""
                          />
                        </g>
                      </svg>
                    </span>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="mb-2.5 block font-medium text-black dark:text-white">
                    Mật khẩu
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Nhập mật khẩu"
                      className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 focus:outline-none"
                    >
                      {showPassword ? (
                        <FiEyeOff className="w-5 h-5" />
                      ) : (
                        <FiEye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="mb-4 text-danger text-sm text-center">
                    {error}
                  </div>
                )}

                <div className="mb-5">
                  <input
                    type="submit"
                    value="Đăng nhập"
                    className="w-full cursor-pointer rounded-lg border border-meta-3 bg-meta-3  p-4 text-white transition hover:bg-opacity-90"
                  />
                </div>

                

                {/* <div className="mt-6 text-center">
                  <p>
                    Bạn chưa có tài khoản?{' '}
                    <Link to="/auth/signup" className="text-primary">
                      Đăng ký
                    </Link>
                  </p>
                </div> */}
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Modal thông báo lỗi */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-boxdark rounded-lg p-8 max-w-md w-full mx-4">
            <div className="text-center">
              <div className="mb-6">
                <svg
                  className="mx-auto h-12 w-12 text-red-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-black dark:text-white mb-4">
                Đăng nhập thất bại
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                {error}
              </p>
              <button
                autoFocus
                onClick={handleModalClose}
                className="bg-meta-3 text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition-colors"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SignIn;
