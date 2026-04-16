import { IMPACT_OPTIONS, TOXICITY_OPTIONS } from '../constants/moderation'

function TaggingModal({
  isOpen,
  panelState,
  currentMessage,
  formState,
  formError,
  onClose,
  onSubmit,
  onToggleInvalid,
  onToggleToxicity,
  onCustomToxicityChange,
  onImpactChange,
  onCommentChange,
}) {
  if (!isOpen) {
    return null
  }

  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <div
        className="modal-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="tagging-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="modal-header">
          <div>
            <p className="eyebrow">
              {panelState.mode === 'batch' ? 'Bulk Update' : 'Report Details'}
            </p>
            <h2 id="tagging-title">
              {panelState.mode === 'batch'
                ? `Tag ${panelState.ids.length} selected messages`
                : 'Update report'}
            </h2>
          </div>
          <button type="button" className="icon-button" onClick={onClose}>
            Close
          </button>
        </div>

        <form className="tag-form" onSubmit={onSubmit}>
          {panelState.mode === 'single' ? (
            <div className="message-preview-card">
              <label>
                <span>Logged By</span>
                <input type="text" value={currentMessage?.loggedBy ?? ''} readOnly />
              </label>

              <label>
                <span>Message</span>
                <textarea rows="4" value={currentMessage?.message ?? ''} readOnly />
              </label>
            </div>
          ) : (
            <div className="batch-preview">
              <span>Selected reports</span>
              <p>
                Apply the same values to {panelState.ids.length} selected
                reports.
              </p>
            </div>
          )}

          <label className="checkbox-row">
            <span>Mark this report as invalid</span>
            <input
              type="checkbox"
              checked={formState.markInvalid}
              onChange={(event) => onToggleInvalid(event.target.checked)}
            />
          </label>

          <div>
            <span className="field-label">Toxicity Type</span>
            <div className="checkbox-grid">
              {TOXICITY_OPTIONS.map((option) => (
                <label className="checkbox-chip" key={option}>
                  <input
                    type="checkbox"
                    checked={formState.toxicityTypes.includes(option)}
                    onChange={() => onToggleToxicity(option)}
                    disabled={formState.markInvalid}
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
          </div>

          {formState.toxicityTypes.includes('Custom') ? (
            <label>
              <span>Custom Toxicity Type label</span>
              <input
                type="text"
                placeholder="Enter a custom label"
                value={formState.customToxicity}
                onChange={(event) => onCustomToxicityChange(event.target.value)}
                disabled={formState.markInvalid}
              />
            </label>
          ) : null}

          <div>
            <span className="field-label">Impact</span>
            <div className="segmented-control">
              {IMPACT_OPTIONS.map((option) => (
                <button
                  type="button"
                  key={option}
                  className={formState.impact === option ? 'segment active' : 'segment'}
                  onClick={() => onImpactChange(option)}
                  disabled={formState.markInvalid}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          <label>
            <span>Comment</span>
            <textarea
              rows="4"
              placeholder="Optional note"
              value={formState.comment}
              onChange={(event) => onCommentChange(event.target.value)}
            />
          </label>

          {formError ? <p className="form-error">{formError}</p> : null}

          <div className="modal-actions">
            <button type="button" className="secondary-button" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="primary-button">
              Submit Tag
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default TaggingModal
