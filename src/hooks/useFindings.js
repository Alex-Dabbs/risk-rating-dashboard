import { useState } from 'react'
import { getNextFindingId, loadFindings } from '../utils/findings'
import { localDateString } from '../data/findings'

export function useFindings() {
  const [findings, setFindings] = useState(loadFindings)

  function persist(next) {
    setFindings(next)
    localStorage.setItem('grc-findings', JSON.stringify(next))
  }

  function addFinding(form) {
    const newFinding = { ...form, id: getNextFindingId(findings), lastUpdated: new Date().toISOString().slice(0, 10), updates: [] }
    persist([newFinding, ...findings])
    return newFinding
  }

  function updateStatus(id, status) {
    const date = new Date().toISOString().slice(0, 10)
    persist(findings.map((finding) => finding.id === id ? { ...finding, status, lastUpdated: date } : finding))
  }

  function saveFinding(draft) {
    if (!draft || draft.description.trim().length < 30) return false
    const existing = findings.find((finding) => finding.id === draft.id)
    if (!existing) return false
    const updated = { ...draft, updates: existing.updates || [], lastUpdated: localDateString() }
    persist(findings.map((finding) => finding.id === updated.id ? updated : finding))
    return updated
  }

  function updateHistory(id, transform) {
    const current = findings.find((finding) => finding.id === id)
    if (!current) return null
    const updated = transform(current)
    persist(findings.map((finding) => finding.id === id ? updated : finding))
    return updated
  }

  return { findings, addFinding, updateStatus, saveFinding, updateHistory, setFindings }
}

