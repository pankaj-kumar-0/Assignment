import {
  IMPACT_CLASS_MAP,
  STATUS_LABELS,
} from '../constants/moderation'
import { formatDateTime } from '../utils/moderation'
import EmptyState from './EmptyState'
import Pagination from './Pagination'
import TagList from './TagList'

function ReportsGrid({
  filteredCount,
  currentPageItems,
  onOpenSinglePanel,
  page,
  totalPages,
  onPageChange,
}) {
  return (
    <section className="panel">
      <div className="panel-header">
        <div>
          <h2>Processed Reports</h2>
          <p>{filteredCount} reports have been reviewed.</p>
        </div>
      </div>

      <div className="report-grid">
        {currentPageItems.length === 0 ? (
          <EmptyState
            title="No processed reports yet"
            description="Processed reports will appear here after they are tagged."
          />
        ) : (
          currentPageItems.map((item) => (
            <article className="report-card" key={item.id}>
              <div className="report-card-top">
                <span className={`status-badge status-${item.status}`}>
                  {STATUS_LABELS[item.status]}
                </span>
                {item.impact ? (
                  <span className={`impact-pill ${IMPACT_CLASS_MAP[item.impact]}`}>
                    {item.impact}
                  </span>
                ) : null}
              </div>

              <div className="report-identity">
                <h3>{item.loggedBy}</h3>
                <span className="report-id">Report #{item.id}</span>
              </div>

              <p className="report-message">{item.message}</p>

              <div className="meta-list">
                <div>
                  <span>Toxicity Type</span>
                  <TagList values={item.toxicityTypes} placeholder="Invalid report" />
                </div>
                <div>
                  <span>Comment</span>
                  <p>{item.comment || '--'}</p>
                </div>
                <div>
                  <span>Updated By</span>
                  <p>{item.updatedBy || '--'}</p>
                </div>
                <div>
                  <span>Date & Time</span>
                  <p>{formatDateTime(item.updatedAt)}</p>
                </div>
              </div>

              <button
                type="button"
                className="text-button"
                onClick={() => onOpenSinglePanel(item)}
              >
                Edit tag
              </button>
            </article>
          ))
        )}
      </div>

      <Pagination page={page} totalPages={totalPages} onPageChange={onPageChange} />
    </section>
  )
}

export default ReportsGrid
