import { ApexOptions } from 'apexcharts';
import React, { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
import { useAuth } from '../../context/AuthContext';

interface ClickTrackingReport {
  type: number;
  valueId: number;
  name: string;
  clickCount: number;
  lastClicked: string | null;
  previousMonthClickCount: number;
}

const ChartTwo: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<ClickTrackingReport[]>([]);
  const { token } = useAuth();
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const currentDate = new Date();
        const response = await fetch(
          `${apiUrl}/api/v1/click-tracking/reports/service?year=${currentDate.getFullYear()}&month=${currentDate.getMonth() + 1}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
            }
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }

        const reportData = await response.json();
        // Lọc ra 7 dịch vụ có lượt click cao nhất
        const topServices = reportData
          .sort((a: ClickTrackingReport, b: ClickTrackingReport) => b.clickCount - a.clickCount)
          .slice(0, 7);

        setData(topServices);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const options: ApexOptions = {
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
      categories: data.map(item => item.name.replace(/Dịch vụ\s*/gi, '')),
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      title: {
        text: 'Số lượt click',
      },
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

  const series = [
    {
      name: 'Tháng này',
      data: data.map(item => item.clickCount),
    },
    {
      name: 'Tháng trước',
      data: data.map(item => item.previousMonthClickCount),
    },
  ];

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white p-7.5 shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-4">
      <div className="mb-4 justify-between gap-4 sm:flex">
        <div>
          <h4 className="text-xl font-semibold text-black dark:text-white">
            Thống kê lượt truy cập theo dịch vụ
          </h4>
        </div>
      </div>

      <div>
        <div id="chartTwo" className="-ml-5 -mb-9">
          <ReactApexChart
            options={options}
            series={series}
            type="bar"
            height={350}
          />
        </div>
      </div>
    </div>
  );
};

export default ChartTwo;
