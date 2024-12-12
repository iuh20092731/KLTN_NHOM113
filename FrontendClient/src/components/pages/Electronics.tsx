import { Home } from 'lucide-react';
import React from 'react';
import { Link } from 'react-router-dom';
import { InterestBanner } from '../common';
import ServiceBanner from '../common/banner/ServiceBanner';

const ElectronicPage: React.FC = () => {
  return (
    <>
    <nav className="flex items-center text-sm text-gray-500 mb-4">
          <Link to="/" className="flex items-center hover:text-gray-700">
            <Home className="w-4 h-4 mr-1" />
            Trang chủ
          </Link>
          <span className="mx-2">/</span>
          <Link to="/transportation" className="hover:text-gray-700">
            Vận tải
          </Link>
        </nav>
    <div className="grid grid-cols-1 md:grid-cols-6 gap-10 py-5">
      <div className="col-span-1 md:col-span-4">
        <ServiceBanner />
      </div>
      <div className="container mx-auto py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

      </div>

    </div>

      <div className="hidden md:block row-span-4 col-start-1 md:col-start-5 col-span-2 md:row-start-1">
        <InterestBanner />
      </div>
    </div>
    </>
  );
};

export default ElectronicPage;