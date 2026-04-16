import { useEffect, useMemo, useState } from 'react'
import DashboardHeader from './components/DashboardHeader'
import QueueTable from './components/QueueTable'
import ReportsGrid from './components/ReportsGrid'
import TaggingModal from './components/TaggingModal'
import Toolbar from './components/Toolbar'
import {
  CURRENT_MODERATOR,
  DEFAULT_FORM_STATE,
  INITIAL_FILTERS,
  PAGE_SIZE,
  STORAGE_KEY,
  TOXICITY_OPTIONS,
} from './constants/moderation'
import {
  getFormStateFromMessage,
  getStoredMessages,
} from './utils/moderation'

function App() {
  const [messages, setMessages] = useState(() => getStoredMessages(STORAGE_KEY))
  const [activeView, setActiveView] = useState('queue')
  const [filters, setFilters] = useState(INITIAL_FILTERS)
  const [page, setPage] = useState(1)
  const [selectedIds, setSelectedIds] = useState([])
  const [panelState, setPanelState] = useState({
    open: false,
    mode: 'single',
    ids: [],
  })
  const [formState, setFormState] = useState(DEFAULT_FORM_STATE)
  const [formError, setFormError] = useState('')

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages))
  }, [messages])

  const counts = useMemo(() => {
    const processed = messages.filter((item) => item.status === 'processed').length
    const invalid = messages.filter((item) => item.status === 'invalid').length
    const untagged = messages.length - processed - invalid

    return {
      total: messages.length,
      processed,
      invalid,
      untagged,
    }
  }, [messages])

  const filteredMessages = useMemo(() => {
    return messages.filter((item) => {
      const matchesView =
        activeView === 'queue'
          ? item.status === 'untagged'
          : item.status === 'processed' || item.status === 'invalid'

      if (!matchesView) {
        return false
      }

      if (filters.status !== 'all' && item.status !== filters.status) {
        return false
      }

      if (filters.impact !== 'all' && item.impact !== filters.impact) {
        return false
      }

      if (
        filters.toxicity !== 'all' &&
        !item.toxicityTypes.includes(filters.toxicity)
      ) {
        return false
      }

      return true
    })
  }, [activeView, filters, messages])

  const totalPages = Math.max(1, Math.ceil(filteredMessages.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)

  const currentPageItems = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE
    return filteredMessages.slice(start, start + PAGE_SIZE)
  }, [currentPage, filteredMessages])

  const selectedQueueIds = selectedIds.filter((id) =>
    messages.some((item) => item.id === id && item.status === 'untagged'),
  )
  const currentMessage =
    panelState.mode === 'single'
      ? messages.find((item) => item.id === panelState.ids[0]) ?? null
      : null

  function handleFilterChange(event) {
    const { name, value } = event.target
    setFilters((current) => ({
      ...current,
      [name]: value,
    }))
    setPage(1)
  }

  function resetForm() {
    setFormState(DEFAULT_FORM_STATE)
    setFormError('')
  }

  function openSinglePanel(message) {
    setPanelState({
      open: true,
      mode: 'single',
      ids: [message.id],
    })
    setFormState(
      getFormStateFromMessage(message, TOXICITY_OPTIONS, DEFAULT_FORM_STATE),
    )
    setFormError('')
  }

  function openBatchPanel() {
    setPanelState({
      open: true,
      mode: 'batch',
      ids: selectedQueueIds,
    })
    resetForm()
  }

  function closePanel() {
    setPanelState({
      open: false,
      mode: 'single',
      ids: [],
    })
    resetForm()
  }

  function toggleSelection(id) {
    setSelectedIds((current) =>
      current.includes(id)
        ? current.filter((itemId) => itemId !== id)
        : [...current, id],
    )
  }

  function toggleSelectAllOnPage() {
    const pageIds = currentPageItems
      .filter((item) => item.status === 'untagged')
      .map((item) => item.id)

    const alreadyAllSelected = pageIds.every((id) => selectedIds.includes(id))

    setSelectedIds((current) =>
      alreadyAllSelected
        ? current.filter((id) => !pageIds.includes(id))
        : [...new Set([...current, ...pageIds])],
    )
  }

  function handleToxicityChange(option) {
    setFormState((current) => {
      const exists = current.toxicityTypes.includes(option)
      const nextTypes = exists
        ? current.toxicityTypes.filter((item) => item !== option)
        : [...current.toxicityTypes, option]

      return {
        ...current,
        toxicityTypes: nextTypes,
        customToxicity:
          option === 'Custom' && exists ? '' : current.customToxicity,
      }
    })
  }

  function handleSubmit(event) {
    event.preventDefault()

    if (!formState.markInvalid && formState.toxicityTypes.length === 0) {
      setFormError('Select at least one toxicity type.')
      return
    }

    if (
      !formState.markInvalid &&
      formState.toxicityTypes.includes('Custom') &&
      !formState.customToxicity.trim()
    ) {
      setFormError('Add a custom toxicity label.')
      return
    }

    if (!formState.markInvalid && !formState.impact) {
      setFormError('Select an impact level.')
      return
    }

    const nextToxicityTypes = formState.markInvalid
      ? []
      : formState.toxicityTypes.flatMap((type) => {
          if (type !== 'Custom') {
            return type
          }

          return formState.customToxicity.trim()
        })

    const nextStatus = formState.markInvalid ? 'invalid' : 'processed'
    const timeStamp = new Date().toISOString()

    setMessages((current) =>
      current.map((item) =>
        panelState.ids.includes(item.id)
          ? {
              ...item,
              toxicityTypes: nextToxicityTypes,
              impact: formState.markInvalid ? '' : formState.impact,
              comment: formState.comment.trim(),
              status: nextStatus,
              updatedBy: CURRENT_MODERATOR,
              updatedAt: timeStamp,
            }
          : item,
      ),
    )

    setSelectedIds((current) =>
      current.filter((id) => !panelState.ids.includes(id)),
    )
    setActiveView('queue')
    closePanel()
  }

  const allRowsSelected =
    currentPageItems.length > 0 &&
    currentPageItems
      .filter((item) => item.status === 'untagged')
      .every((item) => selectedIds.includes(item.id))

  return (
    <div className="app-shell">
      <DashboardHeader counts={counts} />

      <Toolbar
        activeView={activeView}
        filters={filters}
        onViewChange={(view) => {
          setActiveView(view)
          setPage(1)
        }}
        onFilterChange={handleFilterChange}
      />

      {activeView === 'queue' ? (
        <QueueTable
          filteredCount={filteredMessages.length}
          selectedCount={selectedQueueIds.length}
          currentPageItems={currentPageItems}
          allRowsSelected={allRowsSelected}
          selectedIds={selectedIds}
          onToggleSelectAll={toggleSelectAllOnPage}
          onToggleSelection={toggleSelection}
          onOpenBatchPanel={openBatchPanel}
          onOpenSinglePanel={openSinglePanel}
          page={currentPage}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      ) : (
        <ReportsGrid
          filteredCount={filteredMessages.length}
          currentPageItems={currentPageItems}
          onOpenSinglePanel={openSinglePanel}
          page={currentPage}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      )}

      <TaggingModal
        isOpen={panelState.open}
        panelState={panelState}
        currentMessage={currentMessage}
        formState={formState}
        formError={formError}
        onClose={closePanel}
        onSubmit={handleSubmit}
        onToggleInvalid={(checked) =>
          setFormState((current) => ({
            ...current,
            markInvalid: checked,
          }))
        }
        onToggleToxicity={handleToxicityChange}
        onCustomToxicityChange={(value) =>
          setFormState((current) => ({
            ...current,
            customToxicity: value,
          }))
        }
        onImpactChange={(value) =>
          setFormState((current) => ({
            ...current,
            impact: value,
          }))
        }
        onCommentChange={(value) =>
          setFormState((current) => ({
            ...current,
            comment: value,
          }))
        }
      />
    </div>
  )
}

export default App
