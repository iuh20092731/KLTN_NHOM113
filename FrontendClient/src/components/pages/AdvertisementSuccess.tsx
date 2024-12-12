import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { CheckCircle } from 'lucide-react';
import Confetti from 'react-confetti';

const AdvertisementSuccess: React.FC = () => {
  const navigate = useNavigate();
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    setDimensions({ width: window.innerWidth, height: window.innerHeight });
    if (window.innerWidth >= 1024) {
      window.scrollTo({
        top: window.innerHeight / 5,
        behavior: 'smooth'
      });
    }
  }, []);

  return (
    <>
      <Confetti width={dimensions.width} height={dimensions.height} />
      <div className="relative bg-gradient-to-b from-green-100 to-green-300 flex items-center justify-center py-10">
        <div className="bg-white p-10 rounded-xl shadow-lg transform transition duration-500 hover:scale-105 z-10 max-w-lg w-full text-center">
          {/* Icon with animation */}
          <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6 animate-bounce" />
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Đăng ký quảng cáo thành công!</h1>
          <p className="text-gray-600 mb-8 text-lg">Cảm ơn bạn đã đăng ký quảng cáo. Chúng tôi sẽ xem xét và phê duyệt trong thời gian sớm nhất.</p>
          
          <div className="space-y-6">
            <Button 
              onClick={() => navigate('/')} 
              className="w-full py-3 bg-green-500 hover:bg-green-600 text-white text-lg rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105"
            >
              Về trang chủ
            </Button>
            <Button 
              onClick={() => navigate('/registeradvertisement')} 
              className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white text-lg rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105"
            >
              Đăng ký quảng cáo khác
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdvertisementSuccess;
