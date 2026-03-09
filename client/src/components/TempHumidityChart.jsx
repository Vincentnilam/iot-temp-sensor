import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

function formatTime(dateStr) {
  return new Date(dateStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

export default function TempHumidityChart({ data }) {
  if (!data.length) {
    return (
      <div className="bg-gray-800 rounded-2xl p-5 text-gray-400">
        No historical data yet.
      </div>
    )
  }

  return (
    <div className="bg-gray-800 rounded-2xl p-5">
      <h2 className="text-lg font-semibold mb-4 text-gray-200">
        Last {data.length} readings
      </h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis
            dataKey="createdAt"
            tickFormatter={formatTime}
            tick={{ fill: '#9ca3af', fontSize: 12 }}
          />
          <YAxis tick={{ fill: '#9ca3af', fontSize: 12 }} />
          <Tooltip
            contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }}
            labelFormatter={(label) => new Date(label).toLocaleString()}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="temperature"
            stroke="#fb923c"
            dot={false}
            name="Temp (°C)"
          />
          <Line
            type="monotone"
            dataKey="humidity"
            stroke="#60a5fa"
            dot={false}
            name="Humidity (%)"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
