import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from './components/layout';
import { HomePage, LoginPage, RegisterPage, SearchPage, OTPVerificationPage } from './components/pages';
import PageRender from './config/routers/PageRender';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from './redux/store';
import { getUserInfo } from './redux/thunks/user';
import { clearInvalidToken } from './redux/slices/auth';
import ListAdrverByService from './components/pages/ListAdrverByService';
import RegisterAdvertisement from './components/pages/RegisterAdvertisement';
import AdvertisementSuccess from './components/pages/AdvertisementSuccess';
import QuanLyTaiKhoan from './components/pages/QuanLyTaiKhoan';
import QuanLyAdver from './components/pages/QuanLyAdver';
import SocialGroups from './components/pages/SocialGroups';
import QnAPage from './components/pages/GocHoiDap';
import RenderPage from './components/pageDong/RenderPage';
import Realestate from './components/pages/Realestate';

const App: React.FC = () => {
  const dispatch = useDispatch();
  const { isLogin, status } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      dispatch(getUserInfo() as any);
    }
    dispatch(clearInvalidToken());
  }, [dispatch]);

  if (status === 'loading') return null;

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={
            isLogin ? (
              <Navigate to={localStorage.getItem("redirectUrl") || "/"} replace />
            ) : (
              <LoginPage />
            )
          }
        />
        <Route
          path="/register"
          element={isLogin ? <Navigate to="/" replace /> : <RegisterPage />}
        />
        <Route
          path="/otp-verification"
          element={isLogin ? <Navigate to="/" replace /> : <OTPVerificationPage />}
        />
        
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="/realestate" element={<Realestate/>} />
          <Route path="/registeradvertisement" element={<RegisterAdvertisement />} />
          <Route path="dvhn/search" element={<SearchPage/>} />
          <Route path="/advertisement-success" element={<AdvertisementSuccess />} />
          <Route path="/quanlytaikhoan" element={<QuanLyTaiKhoan />} />
          <Route path="/quanlyadver/:id" element={<QuanLyAdver/>} />
          <Route path="/socialgroups" element={<SocialGroups/>} />
          <Route path="/gochoidap" element={<QnAPage/>} />
          <Route path="/:page" element={<RenderPage />} />
          <Route path="/:page/:id" element={<PageRender />} />
          <Route path="/:page/service/:serviceId" element={<ListAdrverByService />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
