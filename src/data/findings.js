import browserFindingsSnapshot from './browser-findings.snapshot.json'

export const currentYear = String(new Date().getFullYear())

export const starterFindings = browserFindingsSnapshot

export const riskOrder = ['Critical', 'High', 'Medium', 'Low']
export const residualRiskOptions = ['Low', 'Medium', 'High', 'Critical', 'Accepted']
export const statusOptions = ['Open', 'In Progress', 'Under Review', 'Closed']
export const legacySampleIds = ['SEC-2026-001', 'SEC-2026-002', 'SEC-2026-003', 'SEC-2026-004', 'SEC-2026-005']
export const previousSampleIds = ['001', '002', '003', '004', '005']
export const controlAreaNames = {
  'A.5.15': 'Access Control',
  'A.5.17': 'Authentication Information',
  'A.8.20': 'Networks Security',
  'A.8.23': 'Web Filtering',
  'A.5.24-A.5.26': 'Incident Response',
}
export const emptyForm = { description: '', controlArea: '', dateIdentified: '', dueDate: '', risk: 'Medium', residualRisk: '', residualRiskRationale: '', owner: '', status: 'Open', evidence: 'No Evidence Provided', evidenceDetails: '', remediationStrategy: '' }
export const localDateString = (date = new Date()) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
