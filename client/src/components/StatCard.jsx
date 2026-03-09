export default function StatCard({ label, value, unit, color }) {
  return (
    <div className="bg-gray-800 rounded-2xl p-5">
      <p className="text-gray-400 text-sm mb-2">{label}</p>
      <p className={`text-4xl font-bold ${color}`}>
        {value}
        <span className="text-lg ml-1 text-gray-300">{unit}</span>
      </p>
    </div>
  )
}
