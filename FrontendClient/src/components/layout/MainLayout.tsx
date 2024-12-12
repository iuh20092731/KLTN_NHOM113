import { useState, useRef, useEffect } from 'react';
import { Header, Footer } from '../common';
import { Outlet } from 'react-router-dom';
import UserInfoModal from '@/components/common/UserInfoModel';
import useWindowSize from '@/hooks/useWindowsSize';
export default function MainLayout() {
  const [isUserInfoOpen, setIsUserInfoOpen] = useState(false);
  const userInfoRef = useRef<HTMLDivElement>(null);
  const { isMobile } = useWindowSize();
  const openUserInfo = () => setIsUserInfoOpen(true);
  const closeUserInfo = () => setIsUserInfoOpen(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userInfoRef.current && !userInfoRef.current.contains(event.target as Node)) {
        closeUserInfo();
      }
    };

    if (isUserInfoOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isUserInfoOpen]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header openUserInfo={openUserInfo} className="flex-shrink-0" />
      <main className={`flex-grow py-16 px-4 lg:py-8 md:px-10 ${isMobile ? 'mt-[140px]' : ''}`}>
        <Outlet />
      </main>
      <UserInfoModal isOpen={isUserInfoOpen} onClose={closeUserInfo} userInfoRef={userInfoRef} />
      <Footer className="flex-shrink-0" />
    </div>
  )
}