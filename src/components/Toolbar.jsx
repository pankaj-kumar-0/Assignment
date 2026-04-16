import { IMPACT_OPTIONS, TOXICITY_OPTIONS } from '../constants/moderation'

function Toolbar({
  activeView,
  filters,
  onViewChange,
  onFilterChange,
}) {
  return (
    <section className="toolbar">
      <div className="tabs" role="tablist" aria-label="Moderation views">
        <button
          type="button"
          className={activeView === 'queue' ? 'tab active' : 'tab'}
          onClick={() => onViewChange('queue')}
        >
          Queue
        </button>
        <button
          type="button"
          className={activeView === 'reports' ? 'tab active' : 'tab'}
          onClick={() => onViewChange('reports')}
        >
          Processed reports
        </button>
      </div>

      <div className="filter-grid">
        <label>
          <span>Status</span>
          <select name="status" value={filters.status} onChange={onFilterChange}>
            <option value="all">All</option>
            {activeView === 'queue' ? null : (
              <>
                <option value="processed">Processed</option>
                <option value="invalid">Invalid</option>
              </>
            )}
          </select>
        </label>

        <label>
          <span>Impact</span>
          <select name="impact" value={filters.impact} onChange={onFilterChange}>
            <option value="all">All</option>
            {IMPACT_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>

        <label>
          <span>Toxicity type</span>
          <select
            name="toxicity"
            value={filters.toxicity}
            onChange={onFilterChange}
          >
            <option value="all">All</option>
            {TOXICITY_OPTIONS.filter((item) => item !== 'Custom').map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
      </div>
    </section>
  )
}

export default Toolbar
