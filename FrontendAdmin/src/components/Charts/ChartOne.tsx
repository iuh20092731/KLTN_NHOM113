import { ApexOptions } from 'apexcharts';
import React, { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';

interface ChartOneState {
  series: {
    name: string;
    data: number[];
  }[];
}

interface MonthlyStats {
  activeAdvertisementsCount: number;
  month: number;
  year: number;
}

const ChartOne: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const previousYear = currentYear - 1;

  const [state, setState] = useState<ChartOneState>({
    series: [
      {
        name: `Năm ${currentYear}`,
        data: [],
      },
      {
        name: `Năm ${previousYear}`,
        data: [],
      },
    ],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = sessionStorage.getItem('token');
        if (!token) {
          console.error('No token found');
          return;
        }

        const apiUrl = import.meta.env.VITE_API_URL;
        const response = await fetch(`${apiUrl}/api/v1/main-advertisements/active-in-all-months`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }

        const data = await response.json();

        // Tách dữ liệu theo năm hiện tại và năm trước
        const dataPreviousYear = data.result
          .filter((item: MonthlyStats) => item.year === previousYear)
          .sort((a: MonthlyStats, b: MonthlyStats) => a.month - b.month)
          .map((item: MonthlyStats) => item.activeAdvertisementsCount);

        const dataCurrentYear = data.result
          .filter((item: MonthlyStats) => item.year === currentYear)
          .sort((a: MonthlyStats, b: MonthlyStats) => a.month - b.month)
          .map((item: MonthlyStats) => item.activeAdvertisementsCount);

        setState({
          series: [
            {
              name: `Năm ${currentYear}`,
              data: dataCurrentYear,
            },
            {
              name: `Năm ${previousYear}`,
              data: dataPreviousYear,
            },
          ],
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [currentYear, previousYear]);

  const handleReset = () => {
    setState((prevState) => ({
      ...prevState,
    }));
  };
  handleReset;

  const options: ApexOptions = {
    legend: {
      show: true,
      position: 'top',
      horizontalAlign: 'left',
    },
    colors: ['#3C50E0', '#80CAEE'],
    chart: {
      fontFamily: 'Satoshi, sans-serif',
      height: 335,
      type: 'area',
      dropShadow: {
        enabled: true,
        color: '#623CEA14',
        top: 10,
        blur: 4,
        left: 0,
        opacity: 0.1,
      },

      toolbar: {
        show: false,
      },
    },
    responsive: [
      {
        breakpoint: 1024,
        options: {
          chart: {
            height: 300,
          },
        },
      },
      {
        breakpoint: 1366,
        options: {
          chart: {
            height: 350,
          },
        },
      },
    ],
    stroke: {
      width: [2, 2],
      curve: 'smooth',
    },
    // labels: {
    //   show: false,
    //   position: "top",
    // },
    grid: {
      xaxis: {
        lines: {
          show: true,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    markers: {
      size: 4,
      colors: ['#fff', '#fff'],
      strokeColors: ['#3C50E0', '#80CAEE'],
      strokeWidth: 3,
      strokeOpacity: 0.9,
      strokeDashArray: 0,
      fillOpacity: 1,
      discrete: [],
      hover: {
        size: undefined,
        sizeOffset: 5,
      },
    },
    xaxis: {
      type: 'category',
      categories: [
        'Tháng 1',
        'Tháng 2',
        'Tháng 3',
        'Tháng 4',
        'Tháng 5',
        'Tháng 6',
        'Tháng 7',
        'Tháng 8',
        'Tháng 9',
        'Tháng 10',
        'Tháng 11',
        'Tháng 12'
      ],
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      title: {
        text: 'Số lượng quảng cáo',
        style: {
          fontSize: '14px',
        },
      },
      min: 0,
      max: undefined,
    },
  };

  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white px-5 pt-7.5 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:col-span-8">
      <div className="flex flex-wrap items-start justify-between gap-3 sm:flex-nowrap">
        <div className="flex w-full flex-wrap gap-3 sm:gap-5">
          <div className="flex w-full">
            <div className="w-full">
              <h4 className="text-xl font-bold text-black dark:text-white">
                Thống kê quảng cáo theo tháng
              </h4>
              <p className="text-sm font-medium">So sánh năm {previousYear} và {currentYear}</p>
            </div>
          </div>
        </div>
        <div className="flex w-full max-w-45 justify-end">
          <div className="inline-flex items-center rounded-md bg-whiter p-1.5 dark:bg-meta-4">
            <button className="rounded py-1 px-3 text-xs font-medium text-black hover:bg-white hover:shadow-card dark:text-white dark:hover:bg-boxdark">
              Ngày
            </button>
            <button className="rounded py-1 px-3 text-xs font-medium text-black hover:bg-white hover:shadow-card dark:text-white dark:hover:bg-boxdark">
              Tuần
            </button>
            <button className="rounded bg-white py-1 px-3 text-xs font-medium text-black shadow-card hover:bg-white hover:shadow-card dark:bg-boxdark dark:text-white dark:hover:bg-boxdark">
              Tháng
            </button>
          </div>
        </div>
      </div>

      <div>
        <div id="chartOne" className="-ml-5">
          <ReactApexChart
            options={options}
            series={state.series}
            type="area"
            height={350}
          />
        </div>
      </div>
    </div>
  );
};

export default ChartOne;
