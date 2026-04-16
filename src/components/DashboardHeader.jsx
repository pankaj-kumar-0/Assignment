import StatCard from './StatCard'

function DashboardHeader({ counts }) {
  return (
    <header className="hero-section">
      <div className="hero-content">
        <p className="eyebrow">Moderation Dashboard</p>
        <h1>Toxic Message Tagging & Review</h1>
        <p className="hero-copy">
          Review reported messages, assign toxicity labels and impact, and keep
          track of processed reports.
        </p>
      </div>

      <div className="stat-grid">
        <StatCard label="Total reports" value={counts.total} />
        <StatCard label="Untagged" value={counts.untagged} emphasis="warning" />
        <StatCard label="Processed" value={counts.processed} emphasis="success" />
        <StatCard label="Invalid" value={counts.invalid} emphasis="neutral" />
      </div>
    </header>
  )
}

export default DashboardHeader
