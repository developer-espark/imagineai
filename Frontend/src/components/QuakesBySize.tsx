import ApexCharts from 'react-apexcharts';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { VITE_APP_API_URL } from '../config/env';
import { getMinutesDifference } from '../helper/timeinMinute.helper';
import { QUAKES_CHART } from '../graphql/pulse';

const QuakesBySize = () => {
  const [quakesChartData, setQuakesChartData] = useState<any>([]);

  useEffect(() => {
    const fetchQuakesData = async () => {
      try {
        const response = await axios.post(
          VITE_APP_API_URL,
          { query: QUAKES_CHART }
        );

        const formattedData = response.data.data.getDataForQuakesChart.map((quake: any) => ({
          count: quake.count,
          age: getMinutesDifference(quake.interval) + " minutes ago",
        }));

        setQuakesChartData(formattedData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchQuakesData();
  }, []);


  const sizeChartData = quakesChartData.map((quake) => ({
    x: quake.age,
    y: quake.count,
  }));

  const options = {
    chart: {
      type: 'scatter',
      zoom: {
        enabled: false,
      },
    },
    xaxis: {
      title: {
        text: 'Age (Minutes)',
      },
      labels: {
        formatter: function (value) {
          return value
        },
      },
      // min: -70,
      // max: 0,
    },
    yaxis: {
      title: {
        text: 'Magnitude',
      },
      // min: 0,
      // max: 6.5,
    },
    title: {
      text: 'Quakes By Size',
      align: 'center',
    },
    grid: {
      show: true,
      borderColor: '#e0e0e0',
    },
    tooltip: {
      x: {
        formatter: function (value) {
          if (value === 0) return 'Now';
          return `${Math.abs(value)} mins ago`;
        },
      },
      y: {
        formatter: (val) => `${val} Magnitude`,
      },
    },
  };

  const series = [
    {
      name: 'Quakes',
      data: sizeChartData,
    },
  ];

  return (
    <div className="bg-white p-4 rounded-lg shadow flex-1 border border-gray-200 w-full">
      {/* <h2 className="text-base text-gray-800">Quakes By Size</h2> */}
      <div className="mt-4 w-[500px]">
        <ApexCharts options={options} series={series} type="scatter" height={350} />
      </div>
    </div>
  );
};

export default QuakesBySize;