import reportedMessages from '../data/reportedMessages.json'

export function getStoredMessages(storageKey) {
  const storedValue = localStorage.getItem(storageKey)

  if (!storedValue) {
    return createInitialState()
  }

  try {
    const parsedValue = JSON.parse(storedValue)
    return Array.isArray(parsedValue) && parsedValue.length
      ? parsedValue
      : createInitialState()
  } catch {
    return createInitialState()
  }
}

export function createInitialState() {
  return reportedMessages.map((item) => ({
    ...item,
    toxicityTypes: [],
    impact: '',
    comment: '',
    status: 'untagged',
    updatedBy: '',
    updatedAt: '',
  }))
}

export function formatDateTime(dateTime) {
  if (!dateTime) {
    return '--'
  }

  return new Intl.DateTimeFormat('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(dateTime))
}

export function getFormStateFromMessage(message, toxicityOptions, defaultFormState) {
  const customLabel = message.toxicityTypes.find(
    (type) => !toxicityOptions.includes(type),
  )

  return {
    ...defaultFormState,
    toxicityTypes: customLabel
      ? [...message.toxicityTypes.filter((type) => type !== customLabel), 'Custom']
      : [...message.toxicityTypes],
    customToxicity: customLabel ?? '',
    impact: message.impact,
    comment: message.comment,
    markInvalid: message.status === 'invalid',
  }
}
