import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../redux/store';
import { fetchCategoryReports, fetchServiceReports } from '../../redux/thunks/clickTracking';
import { ClickTrackingReport } from '../../interfaces/ClickTracking';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import ReactApexChart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import { useNavigate } from 'react-router-dom';
import { selectIsAuthenticated } from '../../redux/selectors/authSelectors';

const CategoryStats = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const [filters, setFilters] = useState({
    type: 1,
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1
  });
  const [isTableExpanded, setIsTableExpanded] = useState(false);

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (!isAuthenticated && !token) {
      navigate('/auth/signin');
      return;
    }

    const { type, year, month } = filters;
    if (type === 1) {
      dispatch(fetchCategoryReports({ year, month }));
    } else {
      dispatch(fetchServiceReports({ year, month }));
    }
  }, [dispatch, isAuthenticated, navigate, filters]);

  const { reports, loading, error } = useSelector((state: RootState) => state.clickTracking);

//   useEffect(() => {
//     console.log('Reports updated:', reports);
//   }, [reports]);

  const formatName = (name: string) => {
    return name.replace(/dịch vụ/gi, 'DV').trim();
  };

  const chartOptions: ApexOptions = {
    colors: ['#3C50E0', '#80CAEE'],
    chart: {
      fontFamily: 'Satoshi, sans-serif',
      type: 'bar',
      height: 335,
      stacked: true,
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        borderRadius: 0,
        columnWidth: '25%',
        borderRadiusApplication: 'end',
        borderRadiusWhenStacked: 'last',
      },
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories: reports.map(item => formatName(item.name)),
    },
    legend: {
      position: 'top',
      horizontalAlign: 'left',
      fontFamily: 'Satoshi',
      fontWeight: 500,
      fontSize: '14px',
      markers: {
        radius: 99,
      },
    },
    fill: {
      opacity: 1,
    },
  };

  const chartData = {
    series: [
      {
        name: 'Current Month Clicks',
        data: reports.map(item => item.clickCount),
      },
      {
        name: 'Previous Month Clicks',
        data: reports.map(item => item.previousMonthClickCount),
      },
    ],
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      <Breadcrumb pageName={filters.type === 1 ? "Category Statistics" : "Service Statistics"} />
      
      <div className="mb-4 rounded-sm border border-stroke bg-white p-7.5 shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="mb-4 justify-between gap-4 sm:flex">
          <div>
            <h4 className="text-xl font-semibold text-black dark:text-white">
              {filters.type === 1 ? "Category" : "Service"} Click Overview
            </h4>
          </div>
          <div className="flex gap-3">
            <select
              className="rounded-lg border-[1.5px] border-stroke bg-transparent py-1.5 px-3 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input"
              value={filters.type}
              onChange={(e) => setFilters(prev => ({ ...prev, type: Number(e.target.value) }))}
            >
              <option value={1}>Category</option>
              <option value={2}>Service</option>
            </select>

            <select
              className="rounded-lg border-[1.5px] border-stroke bg-transparent py-1.5 px-3 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input"
              value={filters.year}
              onChange={(e) => setFilters(prev => ({ ...prev, year: Number(e.target.value) }))}
            >
              {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>

            <select
              className="rounded-lg border-[1.5px] border-stroke bg-transparent py-1.5 px-3 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input"
              value={filters.month}
              onChange={(e) => setFilters(prev => ({ ...prev, month: Number(e.target.value) }))}
            >
              {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                <option key={month} value={month}>
                  {new Date(2000, month - 1).toLocaleString('default', { month: 'long' })}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <div id="chartTwo" className="-ml-5 -mb-9">
            <ReactApexChart
              options={chartOptions}
              series={chartData.series}
              type="bar"
              height={350}
            />
          </div>
        </div>
      </div>

      <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <div 
          className="flex justify-between items-center cursor-pointer hover:bg-gray-50 dark:hover:bg-meta-4 p-2 rounded"
          onClick={() => setIsTableExpanded(!isTableExpanded)}
        >
          <h4 className="text-xl font-semibold text-black dark:text-white pb-2">
            Detail Data
          </h4>
          <svg 
            className={`w-5 h-5 transition-transform ${isTableExpanded ? 'rotate-180' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>

        {isTableExpanded && (
          <div className="max-w-full overflow-x-auto mt-4">
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-gray-2 text-left dark:bg-meta-4">
                  <th className="py-4 px-4 font-medium text-black dark:text-white">
                    {filters.type === 1 ? "Category" : "Service"} Name
                  </th>
                  <th className="py-4 px-4 font-medium text-black dark:text-white">
                    Click Count
                  </th>
                  <th className="py-4 px-4 font-medium text-black dark:text-white">
                    Last Clicked
                  </th>
                  <th className="py-4 px-4 font-medium text-black dark:text-white">
                    Previous Month
                  </th>
                </tr>
              </thead>
              <tbody>
                {reports.map((item, index) => (
                  <tr key={index}>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      {formatName(item.name)}
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      {item.clickCount}
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      {new Date(item.lastClicked).toLocaleString()}
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      {item.previousMonthClickCount}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
};

export default CategoryStats; 