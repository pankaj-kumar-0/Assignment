import {
  IMPACT_CLASS_MAP,
  STATUS_LABELS,
} from '../constants/moderation'
import EmptyState from './EmptyState'
import Pagination from './Pagination'
import TagList from './TagList'

function QueueTable({
  filteredCount,
  selectedCount,
  currentPageItems,
  allRowsSelected,
  selectedIds,
  onToggleSelectAll,
  onToggleSelection,
  onOpenBatchPanel,
  onOpenSinglePanel,
  page,
  totalPages,
  onPageChange,
}) {
  return (
    <section className="panel">
      <div className="panel-header">
        <div>
          <h2>Message Queue</h2>
          <p>{filteredCount} reports pending review.</p>
        </div>

        <button
          type="button"
          className="primary-button"
          onClick={onOpenBatchPanel}
          disabled={selectedCount === 0}
        >
          Tag Selected ({selectedCount})
        </button>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  checked={allRowsSelected}
                  onChange={onToggleSelectAll}
                  aria-label="Select all visible reports"
                />
              </th>
              <th>#</th>
              <th>Logged By</th>
              <th>Message</th>
              <th>Toxicity Type</th>
              <th>Impact</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {currentPageItems.length === 0 ? (
              <tr>
                <td colSpan="8">
                  <EmptyState
                    title="No queue items found"
                    description="Try changing the filters or open the processed reports tab."
                  />
                </td>
              </tr>
            ) : (
              currentPageItems.map((item) => (
                <tr key={item.id} className="queue-row row-untagged">
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(item.id)}
                      onChange={() => onToggleSelection(item.id)}
                      aria-label={`Select report ${item.id}`}
                    />
                  </td>
                  <td>{item.id}</td>
                  <td className="strong-cell">{item.loggedBy}</td>
                  <td>
                    <p className="message-cell">{item.message}</p>
                  </td>
                  <td>
                    <TagList values={item.toxicityTypes} placeholder="Not tagged yet" />
                  </td>
                  <td>
                    {item.impact ? (
                      <span className={`impact-pill ${IMPACT_CLASS_MAP[item.impact]}`}>
                        {item.impact}
                      </span>
                    ) : (
                      <span className="placeholder">Select impact</span>
                    )}
                  </td>
                  <td>
                    <span className={`status-badge status-${item.status}`}>
                      {STATUS_LABELS[item.status]}
                    </span>
                  </td>
                  <td>
                    <button
                      type="button"
                      className="text-button"
                      onClick={() => onOpenSinglePanel(item)}
                    >
                      Tag
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Pagination page={page} totalPages={totalPages} onPageChange={onPageChange} />
    </section>
  )
}

export default QueueTable
