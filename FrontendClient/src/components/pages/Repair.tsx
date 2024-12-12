import React, { useEffect } from "react";
import Component1 from "../common/home/Component1";
import { InterestBanner } from "../common";
import Component4 from "../common/home/Component4";
import Component3 from "../common/home/Component3";
import ServiceBanner from "../common/banner/ServiceBanner";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { getServiceByName } from "@/redux/thunks/service";
import { Link, useParams } from "react-router-dom";
import { Home } from "lucide-react";

const RepairPage: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { page } = useParams<{ page: string }>();
  const service = useSelector((state: RootState) => state.service.service);

  useEffect(() => {
    if (page) {
      dispatch(getServiceByName(page));
    }
  }, [dispatch, page]);
  return (
    <>
      <nav className="flex items-center text-sm text-gray-500 mb-4">
          <Link to="/" className="flex items-center hover:text-gray-700">
            <Home className="w-4 h-4 mr-1" />
            Trang chủ
          </Link>
          <span className="mx-2">/</span>
          <Link to="/repair" className="hover:text-gray-700">
            Sửa chữa
          </Link>
        </nav>
     <div className="grid grid-cols-1 md:grid-cols-6 gap-10 py-5">
      <div className="col-span-1 md:col-span-4">
        <ServiceBanner />
      </div>
      {
        service[0] && (
          <div className="col-span-1 md:col-span-4 row-span-2">
        <Component1
          serviceId={service[0].serviceId}
          serviceName={service[0].serviceName || ""}
        />
      </div>)
      }
      {
        service[1] && (
          <div className="col-span-1 md:col-span-4 row-span-4 col-start-1 md:row-start-2">
        <Component4
          serviceId={service[1].serviceId}
          serviceName={service[1].serviceName || ""}
        />
      </div>)
      }
      {
        service[2] && (
          <div className="col-span-1 md:col-span-4 row-span-2 col-start-1 md:row-start-6">
        <Component3
          serviceId={service[2].serviceId}
          serviceName={service[2].serviceName || ""}
        />
      </div>)
      }
      <div className="hidden md:block row-span-4 col-start-1 md:col-start-5 col-span-2 md:row-start-1">
        <InterestBanner />
      </div>
      {/* <div className="hidden md:block row-span-4 col-start-1 md:col-start-5 col-span-2 md:row-start-5">
        <InterestBanner1 />
      </div> */}
    </div>
    </>
  );
};

export default RepairPage;
