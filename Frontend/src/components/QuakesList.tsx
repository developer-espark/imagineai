import { QUAKES_BY_SIZE, } from '../graphql/pulse';
import { VITE_APP_API_URL } from '../config/env';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { getAgeInMinutes } from '../helper/timeinMinute.helper';

const QuakesList = () => {
  const [quakesData, setQuakesData] = useState([]);
  
  useEffect(() => {
    const fetchQuakesData = async () => {
      try {
        const response = await axios.post(
          VITE_APP_API_URL,
          { query: QUAKES_BY_SIZE }
        );
        const formattedData = response.data.data.weatherStats.map((quake:any) => ({
          location: quake.place,
          size: quake.mag,
          age: getAgeInMinutes(new Date(quake.updated) as any) + 'mins ago',
        }));

        setQuakesData(formattedData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchQuakesData();
  }, []);

  return (
    <div className="bg-white p-4 rounded-lg shadow flex-1 border border-gray-200 w-full max-w-[400px]">
      <h2 className="text-base text-gray-800">Quakes</h2>

      <table className="w-full mt-4">
        <thead>
          <tr>
            <th className="text-sm text-left text-gray-500 font-normal py-1.5 border-b border-b-gray-200 w-[70%] pr-2">
              Location
            </th>
            <th className="text-sm text-left text-gray-500 font-normal py-1.5 border-b border-b-gray-200 w-[15%]">
              Size
            </th>
            <th className="text-sm text-left text-gray-500 font-normal py-1.5 border-b border-b-gray-200 w-[15%]">
              Age
            </th>
          </tr>
        </thead>
        <tbody>
          {quakesData.map((quake:any, index:number) => (
            <tr key={index}>
              <td className="text-sm text-left text-gray-800 font-normal py-1.5 border-b border-b-gray-200 w-[70%] pr-2">
                {quake.location}
              </td>
              <td className="text-sm text-left text-gray-800 font-normal py-1.5 border-b border-b-gray-200 w-[15%]">
                {quake.size}
              </td>
              <td className="text-sm text-left text-gray-800 font-normal py-1.5 border-b border-b-gray-200 w-[15%]">
                {quake.age}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default QuakesList