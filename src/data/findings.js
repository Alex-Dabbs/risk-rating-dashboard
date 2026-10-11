export const currentYear = String(new Date().getFullYear())

export const starterFindings = [
  { id: `${currentYear}-0001`, description: 'Example record for demonstrating the dashboard only. Replace with assessment data.', controlArea: 'A.5.15', dateIdentified: '2026-01-12', dueDate: '2026-12-25', risk: 'Low', residualRisk: '', residualRiskRationale: '', owner: 'Sample Department', status: 'In Progress', evidence: 'No Evidence Provided', evidenceDetails: '', remediationStrategy: '', lastUpdated: '2026-01-11', updates: [] },
  { id: `${currentYear}-0002`, description: 'Example record for demonstrating the dashboard only. Replace with assessment data.', controlArea: 'A.5.17', dateIdentified: '2026-02-21', dueDate: '2026-12-26', risk: 'Medium', residualRisk: '', residualRiskRationale: '', owner: 'Sample Department', status: 'Open', evidence: 'No Evidence Provided', evidenceDetails: '', remediationStrategy: '', lastUpdated: '2026-01-11', updates: [] },
  { id: `${currentYear}-0003`, description: 'Example record for demonstrating the dashboard only. Replace with assessment data.', controlArea: 'A.8.20', dateIdentified: '2026-03-18', dueDate: '2026-12-27', risk: 'High', residualRisk: '', residualRiskRationale: '', owner: 'Sample Department', status: 'In Progress', evidence: 'No Evidence Provided', evidenceDetails: '', remediationStrategy: '', lastUpdated: '2026-01-11', updates: [] },
  { id: `${currentYear}-0004`, description: 'Example record for demonstrating the dashboard only. Replace with assessment data.', controlArea: 'A.8.23', dateIdentified: '2026-04-30', dueDate: '2026-12-28', risk: 'High', residualRisk: '', residualRiskRationale: '', owner: 'Sample Department', status: 'Open', evidence: 'No Evidence Provided', evidenceDetails: '', remediationStrategy: '', lastUpdated: '2026-01-11', updates: [] },
  { id: `${currentYear}-0005`, description: 'Example record for demonstrating the dashboard only. Replace with assessment data.', controlArea: 'A.5.24-A.5.26', dateIdentified: '2026-05-26', dueDate: '2026-12-29', risk: 'Critical', residualRisk: '', residualRiskRationale: '', owner: 'Sample Department', status: 'Under Review', evidence: 'No Evidence Provided', evidenceDetails: '', remediationStrategy: '', lastUpdated: '2026-01-11', updates: [] },
]

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
