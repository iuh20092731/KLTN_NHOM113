import { useEffect, useState } from 'react';
import { Route, Routes, useLocation, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

import Loader from './common/Loader';
import PageTitle from './components/PageTitle';
import SignIn from './pages/Authentication/SignIn';
import SignUp from './pages/Authentication/SignUp';
import Calendar from './pages/Calendar';
import Chart from './pages/Chart';
import ApartmentService from './pages/Dashboard/ApartmentService';
// import FormElements from './pages/Form/FormElements';
import FormLayout from './pages/Form/FormLayout';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Tables from './pages/Tables';
import Alerts from './pages/UiElements/Alerts';
import Buttons from './pages/UiElements/Buttons';
import DefaultLayout from './layout/DefaultLayout';
import FrmCategories from './components/Categories/FrmCategories';
import FrmADRegisted from './components/Adventiments/FrmADRegisted';
import FrmADCreate from './components/Adventiments/FrmADCreate';
import AuthLayout from './layout/AuthLayout';
import CreateAccount from './pages/Accounts/CreateAccount';
import AccountList from './pages/Accounts/AccountList';
import QuanLyBanner from './components/Categories/QuanLyBanner';
import FrmADUpdate from './components/Adventiments/FrmADUpdate';
import QuanLyService from './components/Services/QuanLyService';
import CategoryStats from './pages/Statistics/CategoryStats';
import AdvertisementStats from './pages/Statistics/AdvertisementStats';
// import AccessStats from './pages/Statistics/AccessStats';
import QuanLyLinkSocial from './components/Categories/QuanLyLinkSocial';
import QuanLyGocHoiDap from './components/Categories/QuanLyGocHoiDap';
import FrmADList from './components/Adventiments/FrmADList';
import FrmFavoriteADList from './components/Adventiments/FrmFavoriteADList';

function App() {
  const [loading, setLoading] = useState<boolean>(true);
  const { token, setToken } = useAuth();
  const { pathname } = useLocation();
  const apiUrl = (import.meta as any).env.VITE_API_URL;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    const checkToken = async () => {
      const storedToken = sessionStorage.getItem('token');
      if (!storedToken) {
        setToken(null);
      } else {
        try {
          const response = await fetch(`${apiUrl}/api/v1/auth/introspect`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token: storedToken }),
          });
          const data = await response.json();
          if (!data.result.valid) {
            setToken(null);
            sessionStorage.removeItem('token');
          } else {
            setToken(storedToken);
          }
        } catch (error) {
          console.error('Error checking token:', error);
          setToken(null);
        }
      }
      setLoading(false);
    };

    checkToken();
  }, [setToken]);

  if (loading) {
    return <Loader />;
  }

  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path="/auth/signin" element={<>
          <PageTitle title="Signin | DichVuHungNgan" /><SignIn /> </>} />
        {/* <Route path="/auth/signup" element={<>
          <PageTitle title="Signup | DichVuHungNgan" /><SignUp /></>} /> */}
      </Route>
      <Route
        path="/"
        element={
          token ? <DefaultLayout /> : <Navigate to="/auth/signin" replace />
        }
      >
        <Route
          index
          element={
            <>
              <PageTitle title="Homepage | DichVuHungNgan" />
              <ApartmentService />
            </>
          }
        />
        <Route
          path="/calendar"
          element={
            <>
              <PageTitle title="Calendar | Dịch Vụ Hưng Ngân" />
              <Calendar />
            </>
          }
        />
        <Route
          path="/profile"
          element={
            <>
              <PageTitle title="Profile | Dịch Vụ Hưng Ngân" />
              <Profile />
            </>
          }
        />
        <Route
          path="/forms/form-elements"
          element={
            <>
              <PageTitle title="Quản lý dịch vụ | Dịch Vụ Hưng Ngân" />
              <QuanLyService />
            </>
          }
        />
        <Route
          path="/forms/form-layout"
          element={
            <>
              <PageTitle title="Form Layout | Dịch Vụ Hưng Ngân" />
              <FormLayout />
            </>
          }
        />
        <Route
          path="/forms/form-categories"
          element={
            <>
              <PageTitle title="Form Categories | Dịch Vụ Hưng Ngân" />
              <FrmCategories />
            </>
          }
        />
        <Route
          path="/forms/form-banner"
          element={
            <>
              <PageTitle title="Form Banner | Dịch Vụ Hưng Ngân" />
              <QuanLyBanner />
            </>
          }
        />
        <Route
          path="/forms/form-link-social"
          element={
            <>
              <PageTitle title="Form Link Social | Dịch Vụ Hưng Ngân" />
              <QuanLyLinkSocial />
            </>
          }
        />
        <Route
          path="/forms/form-goc-hoi-dap"
          element={
            <>
              <PageTitle title="Form Góc Hỏi Đáp | Dịch Vụ Hưng Ngân" />
              <QuanLyGocHoiDap />
            </>
          }
        />
        <Route
          path="/tables"
          element={
            <>
              <PageTitle title="Tables | Dịch Vụ Hưng Ngân" />
              <Tables />
            </>
          }
        />
        <Route
          path="/settings"
          element={
            <>
              <PageTitle title="Settings | Dịch Vụ Hưng Ngân" />
              <Settings />
            </>
          }
        />
        <Route
          path="/chart"
          element={
            <>
              <PageTitle title="Basic Chart | Dịch Vụ Hưng Ngân" />
              <Chart />
            </>
          }
        />
        <Route
          path="/ui/alerts"
          element={
            <>
              <PageTitle title="Alerts | Dịch Vụ Hưng Ngân" />
              <Alerts />
            </>
          }
        />
        <Route
          path="/ui/buttons"
          element={
            <>
              <PageTitle title="Buttons | Dịch Vụ Hưng Ngân" />
              <Buttons />
            </>
          }
        />
        <Route
          path="/advertisements/adregisted"
          element={
            <>
              <PageTitle title="Advertisement Registration | Dịch Vụ Hưng Ngân" />
              <FrmADRegisted />
            </>
          }
        />
        <Route
          path="/advertisements/create"
          element={
            <>
              <PageTitle title="Create Advertisement | Dịch Vụ Hưng Ngân" />
              <FrmADCreate />
            </>
          }
        />
        <Route
          path="/advertisements/update"
          element={
            <>
              <PageTitle title="Create Advertisement | Dịch Vụ Hưng Ngân" />
              <FrmADUpdate />
            </>
          }
        />
        <Route
          path="/advertisements/list"
          element={
            <>
              <PageTitle title="Advertisement List | Dịch Vụ Hưng Ngân" />
              <FrmADList />
            </>
          }
        />
        <Route
          path="/advertisements/favorites"
          element={
            <>
              <PageTitle title="Favorite Advertisements | Dịch Vụ Hưng Ngân" />
              <FrmFavoriteADList />
            </>
          }
        />
        {/* New routes for account management */}
        <Route
          path="/accounts/create"
          element={
            <>
              <PageTitle title="Create Account | Dịch Vụ Hưng Ngân" />
              <CreateAccount />
            </>
          }
        />
        <Route
          path="/accounts/list"
          element={
            <>
              <PageTitle title="Account List | Dịch Vụ Hưng Ngân" />
              <AccountList />
            </>
          }
        />
        <Route
          path="/statistics/category"
          element={
            <>
              <PageTitle title="Category Statistics | Dịch Vụ Hưng Ngân" />
              <CategoryStats />
            </>
          }
        />
        <Route
          path="/statistics/advertisement"
          element={
            <>
              <PageTitle title="Advertisement Statistics | Dịch Vụ Hưng Ngân" />
              <AdvertisementStats />
            </>
          }
        />
      </Route>
    </Routes>
  );
}

export default App;
