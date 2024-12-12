import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import MuaBanNhaDat from "../common/RealState/MuaBanNhaDat";
import { setActiveTab } from "@/redux/slices/tabSlice";
import ChoThue from "../common/RealState/ChoThue";
import BanTin from "../common/RealState/BanTin";
import { Link } from "react-router-dom";
import { Home } from "lucide-react";

const RealStatePage: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const activeTab = useSelector((state: RootState) => state.tab.activeTab);

  const renderTabContent = () => {
    switch (activeTab) {
      case "Bán căn hộ":
        return <MuaBanNhaDat />;
      case "Cho thuê căn hộ":
        return <ChoThue />;
      case "Mua - Thuê":
        return <BanTin />;
      default:
        return null;
    }
  };

  return (
    <>
      <nav className="flex items-center text-sm text-gray-500 mb-4">
          <Link to="/" className="flex items-center hover:text-gray-700">
            <Home className="w-4 h-4 mr-1" />
            Trang chủ
          </Link>
          <span className="mx-2">/</span>
          <Link to="/realestate" className="hover:text-gray-700">
            Dịch vụ nhà đất
          </Link>
        </nav>
    <div className="grid grid-cols-1 md:grid-cols-6 gap-10 py-5">
      {/* Tabs */}
      <div className="col-span-1 md:col-span-4 flex justify-around border-b-2 border-gray-200">
        <div
          className={`cursor-pointer pb-2 ${
            activeTab === "Mua - Thuê"
              ? "border-b-4 border-secondary-color text-secondary-color"
              : "text-gray-500 hover:text-primary-color"
          }`}
          onClick={() => dispatch(setActiveTab("Mua - Thuê"))}
        >
          <span className="text-sm font-semibold">Mua - Thuê</span>
        </div>
        <div
          className={`cursor-pointer pb-2 ${
            activeTab === "Bán căn hộ"
              ? "border-b-4 border-secondary-color text-secondary-color"
              : "text-gray-500 hover:text-primary-color"
          }`}
          onClick={() => dispatch(setActiveTab("Bán căn hộ"))}
        >
          <span className="text-sm font-semibold">Bán căn hộ</span>
        </div>

        <div
          className={`cursor-pointer pb-2 ${
            activeTab === "Cho thuê căn hộ"
              ? "border-b-4 border-secondary-color text-secondary-color"
              : "text-gray-500 hover:text-primary-color"
          }`}
          onClick={() => dispatch(setActiveTab("Cho thuê căn hộ"))}
        >
          <span className="text-sm font-semibold">Cho thuê căn hộ</span>
        </div>
      </div>

      {/* Tab Content */}
      <div className="col-span-1 md:col-span-4 row-span-2">
        {renderTabContent()}
      </div>
    </div>
    </>
  );
};

export default RealStatePage;
