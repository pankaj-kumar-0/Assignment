function StatCard({ label, value, emphasis }) {
  return (
    <div className={`stat-card ${emphasis ?? ''}`}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  )
}

export default StatCard
