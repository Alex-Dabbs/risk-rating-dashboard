import { currentYear, legacySampleIds, previousSampleIds, starterFindings } from '../data/findings'

export function migrateFindings(records) {
  const today = new Date().toISOString().slice(0, 10)
  const usedIds = new Set()
  let fallbackNumber = 1
  const nextAvailableId = () => {
    let id = `${currentYear}-${String(fallbackNumber).padStart(4, '0')}`
    while (usedIds.has(id)) {
      fallbackNumber += 1
      id = `${currentYear}-${String(fallbackNumber).padStart(4, '0')}`
    }
    fallbackNumber += 1
    return id
  }

  return records.map((finding) => {
    const oldId = String(finding.id || '')
    const snapshotIndex = starterFindings.findIndex((sample) => sample.id === oldId)
    const legacyIndex = legacySampleIds.indexOf(oldId)
    const sampleIndex = legacyIndex >= 0 ? legacyIndex : previousSampleIds.indexOf(oldId)
    let id = oldId
    if (snapshotIndex >= 0 && finding.description === 'Example record for demonstrating the dashboard only. Replace with assessment data.' && finding.owner === 'Sample Department' && finding.lastUpdated === '2026-01-11') {
      const sample = starterFindings[snapshotIndex]
      return { ...sample, id, dateIdentified: finding.dateIdentified || sample.dateIdentified, dueDate: finding.dueDate || sample.dueDate, status: finding.status || sample.status }
    }
    if (sampleIndex >= 0) id = starterFindings[sampleIndex].id
    else if (/^\d{1,4}$/.test(oldId)) id = `${currentYear}-${oldId.padStart(4, '0')}`
    else {
      const match = oldId.match(/^(?:SEC-)?(\d{4})-(\d+)$/)
      if (match) id = `${match[1]}-${match[2].padStart(4, '0')}`
    }
    if (!id || usedIds.has(id)) id = nextAvailableId()
    usedIds.add(id)

    if (sampleIndex >= 0) {
      const sample = starterFindings[sampleIndex]
      return { ...finding, ...sample, id, description: finding.description || finding.title || sample.description, dateIdentified: finding.dateIdentified, dueDate: finding.dueDate, status: finding.status, lastUpdated: today, residualRisk: finding.residualRisk || '', residualRiskRationale: finding.residualRiskRationale || '', evidenceDetails: finding.evidenceDetails || '', remediationStrategy: finding.remediationStrategy || '', updates: Array.isArray(finding.updates) ? finding.updates : [] }
    }
    return { ...finding, id, description: finding.description || finding.title || '', controlArea: finding.controlArea || finding.area || '', evidence: finding.evidence || 'No Evidence Provided', residualRisk: finding.residualRisk || '', residualRiskRationale: finding.residualRiskRationale || '', evidenceDetails: finding.evidenceDetails || '', remediationStrategy: finding.remediationStrategy || '', updates: Array.isArray(finding.updates) ? finding.updates : [], ...(oldId !== id ? { lastUpdated: today } : {}) }
  })
}

export function loadFindings() {
  try {
    const saved = localStorage.getItem('grc-findings')
    if (!saved) return starterFindings
    const records = JSON.parse(saved)
    if (!Array.isArray(records)) return starterFindings
    const migrated = migrateFindings(records)
    localStorage.setItem('grc-findings', JSON.stringify(migrated))
    return migrated
  } catch {
    return starterFindings
  }
}

export function getNextFindingId(findings, date = new Date()) {
  const year = date.getFullYear()
  const nextNumber = findings.reduce((max, finding) => {
    const match = finding.id.match(/^(\d{4})-(\d{4})$/)
    return match && Number(match[1]) === year ? Math.max(max, Number(match[2])) : max
  }, 0) + 1
  return `${year}-${String(nextNumber).padStart(4, '0')}`
}

export const getRiskCounts = (findings, risks) => risks.reduce((counts, risk) => ({ ...counts, [risk]: findings.filter((finding) => finding.risk === risk).length }), {})
export const getResidualRiskCounts = (findings, risks) => risks.reduce((counts, risk) => ({ ...counts, [risk]: findings.filter((finding) => finding.residualRisk === risk).length }), {})

export function filterAndSortFindings(findings, { query, riskFilter, statusFilter, sortBy }) {
  return findings
    .filter((finding) => finding.id.toLowerCase().includes(query.toLowerCase()))
    .filter((finding) => riskFilter === 'All risks' || finding.risk === riskFilter)
    .filter((finding) => statusFilter === 'All statuses' || finding.status === statusFilter)
    .sort((a, b) => String(a[sortBy]).localeCompare(String(b[sortBy])))
}
