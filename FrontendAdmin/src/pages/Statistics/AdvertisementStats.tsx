import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import ChartThree from '../../components/Charts/ChartThree';
import DataTable from '../../components/Tables/DataTable';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store/store';
import { fetchAdvertisementStats } from '../../redux/thunks/thongKe';

const AdvertisementStats: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [stats, setStats] = useState([]);

  useEffect(() => {
    const loadStats = async () => {
      const result = await dispatch(fetchAdvertisementStats());
      setStats(result.payload);
    };
    loadStats();
  }, [dispatch]);

  return (
    <>


      <main>
        <Breadcrumb pageName="Advertisement Statistics" />
        <section className="flex justify-center items-center">
              Trần Huy Đang phát triển
        </section>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
          <ChartThree />
        </div>
        <div className="mt-4">
          {/* <DataTable
            title="Advertisement Access Statistics"
            columns={[
              { title: 'Advertisement Name', dataIndex: 'advertisementName' },
              { title: 'Total Views', dataIndex: 'totalViews' },
              { title: 'Last Access', dataIndex: 'lastAccess' }
            ]}
            data={stats}
            path="/statistics/advertisement"
          /> */}
          
        </div>
      </main>
    </>
  );
};

export default AdvertisementStats; 
