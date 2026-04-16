export const STORAGE_KEY = 'toxicity-review-state'
export const PAGE_SIZE = 12
export const CURRENT_MODERATOR = 'Moderator Jane'

export const TOXICITY_OPTIONS = [
  'Harassment',
  'Hate',
  'Threats',
  'Trolling',
  'Slurs',
  'Abuse',
  'Personal Attack',
  'Discrimination',
  'Spamming',
  'Toxic Behavior',
  'Bullying',
  'Cheating',
  'Custom',
]

export const IMPACT_OPTIONS = ['Low', 'Medium', 'High', 'Critical']

export const IMPACT_CLASS_MAP = {
  Low: 'impact-low',
  Medium: 'impact-medium',
  High: 'impact-high',
  Critical: 'impact-critical',
}

export const STATUS_LABELS = {
  untagged: 'Untagged',
  processed: 'Processed',
  invalid: 'Invalid',
}

export const INITIAL_FILTERS = {
  status: 'all',
  impact: 'all',
  toxicity: 'all',
}

export const DEFAULT_FORM_STATE = {
  toxicityTypes: [],
  customToxicity: '',
  impact: '',
  comment: '',
  markInvalid: false,
}
