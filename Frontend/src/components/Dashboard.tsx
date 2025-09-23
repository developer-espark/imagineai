import Question from './Question'
import KPICard from './KPICard'
import QuakesBySize from './QuakesBySize'
import QuakesList from './QuakesList'
import { useEffect, useState } from 'react'
import { EARTHQUAKE_STATS, } from '../graphql/pulse'
import { VITE_APP_API_URL } from '../config/env'
import axios from 'axios'

const Dashboard = () => {
  const [loading, setLoading] = useState(false);

  const handleQuestionSubmit = async (question: string) => {
    setLoading(true);
    try {
      const SUBMIT_QUESTION = `
      mutation($question: String!) {
        askQuestion(question: $question)
      }
    `;

      const response = await axios.post(
        VITE_APP_API_URL,
        {
          query: SUBMIT_QUESTION,
          variables: { question },
        }
      );

      setLoading(false);
      return response.data

    } catch (error) {
      console.error('Error submitting question:', error);
      setLoading(false);
    }
  };

  const [totalQuakesData, setTotalQuakesData] = useState<any>({});
  useEffect(() => {
    const fetchQuakesData = async () => {
      try {
        const response = await axios.post(
          VITE_APP_API_URL,
          { query: EARTHQUAKE_STATS }
        );
        setTotalQuakesData(response.data.data.getCounts)
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchQuakesData();
  }, []);

  return (
    <div className="container py-10 px-10 shadow bg-white rounded-lg mx-auto">
      <p className="text-lg font-bold text-gray-900 pb-2 mb-5 border-b border-b-gray-200">
        Earthquakes (Last hour)
      </p>

      <div className="flex flex-col items-center">
        <Question onSubmit={handleQuestionSubmit} loading={loading} />

        <div className="max-w-4xl w-full flex flex-wrap gap-6 mx-auto">
          <div className="flex flex-col md:flex-row gap-6 w-full">
            <KPICard
              title="Total Quakes"
              value={totalQuakesData.total_count || 0}
              subtitle="+1 vs Previous Hour"
            />
            <KPICard
              title="Strongest Quake"
              value={totalQuakesData.max_mag || 0}
              subtitle={totalQuakesData.max_mag_place || '-'}
            />
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            <QuakesBySize />
            <QuakesList />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard