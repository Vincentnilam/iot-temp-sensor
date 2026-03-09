import { useState, useEffect } from 'react'
import StatCard from './components/StatCard'
import TempHumidityChart from './components/TempHumidityChart'

export default function App() {
  const [latest, setLatest] = useState(null)
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 30000)
    return () => clearInterval(interval)
  }, [])

  async function fetchData() {
    try {
      const [latestRes, historyRes] = await Promise.all([
        fetch('/api/temperature/latest'),
        fetch('/api/temperature?limit=50'),
      ])
      const latestData = await latestRes.json()
      const historyData = await historyRes.json()
      setLatest(latestData)
      setHistory([...historyData.data].reverse())
      setError(null)
    } catch {
      setError('Failed to fetch data. Is the server running?')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 md:p-10">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Vincent's Room Temp</h1>
        {latest && (
          <p className="text-gray-400 text-sm mt-1">
            Last updated: {new Date(latest.createdAt).toLocaleString()}
          </p>
        )}
      </header>

      {loading ? (
        <p className="text-gray-400">Loading...</p>
      ) : error ? (
        <p className="text-red-400">{error}</p>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 mb-8 max-w-sm">
            <StatCard
              label="Temperature"
              value={latest?.temperature?.toFixed(1)}
              unit="°C"
              color="text-orange-400"
            />
            <StatCard
              label="Humidity"
              value={latest?.humidity?.toFixed(1)}
              unit="%"
              color="text-blue-400"
            />
          </div>

          <TempHumidityChart data={history} />
        </>
      )}
    </div>
  )
}
