import { useState } from 'react'
import { X } from 'lucide-react'
import { controlAreaNames, residualRiskOptions, statusOptions } from '../../data/findings'

function FindingEditor({ finding, onCancel, onSave }) {
  const [draft, setDraft] = useState(() => ({ ...finding }))
  function update(field, value) { setDraft((current) => ({ ...current, [field]: value })) }
  function submit(event) {
    event.preventDefault()
    const saved = onSave(draft)
    if (saved) onCancel()
  }
  return <form className="edit-finding-form" onSubmit={submit}>
    <label className="field full"><span>Finding description (30 characters minimum)</span><textarea required minLength={30} rows={4} value={draft.description} onChange={(event) => update('description', event.target.value)} /><span className="field-hint" aria-live="polite">{draft.description.length}/30 characters minimum</span></label>
    <div className="detail-edit-grid">
      <label className="field"><span>ISO control area</span><input required value={draft.controlArea} onChange={(event) => update('controlArea', event.target.value)} /></label>
      <label className="field"><span>Risk criticality</span><select required value={draft.risk} onChange={(event) => update('risk', event.target.value)}>{['Low', 'Medium', 'High', 'Critical'].map((risk) => <option key={risk}>{risk}</option>)}</select></label>
      <label className="field"><span>Owner / department</span><input required value={draft.owner} onChange={(event) => update('owner', event.target.value)} /></label>
      <label className="field"><span>Current status</span><select required value={draft.status} onChange={(event) => update('status', event.target.value)}>{statusOptions.map((status) => <option key={status}>{status}</option>)}</select></label>
      <label className="field"><span>Date identified</span><input type="date" required value={draft.dateIdentified} onChange={(event) => update('dateIdentified', event.target.value)} /></label>
      <label className="field"><span>Remediation due</span><input type="date" required value={draft.dueDate} onChange={(event) => update('dueDate', event.target.value)} /></label>
    </div>
    <div className="residual-risk-assessment">
      <label className="field"><span>Residual risk after controls</span><select required value={draft.residualRisk || ''} onChange={(event) => update('residualRisk', event.target.value)}><option value="">Not assessed</option>{residualRiskOptions.map((risk) => <option key={risk}>{risk}</option>)}</select></label>
      <label className="field"><span>Residual Risk Rationale</span><textarea required rows={3} value={draft.residualRiskRationale || ''} onChange={(event) => update('residualRiskRationale', event.target.value)} placeholder="Briefly explain why this residual risk rating is appropriate." /></label>
    </div>
    <label className="field full remediation-strategy-field"><span>Remediation Strategy</span><textarea required rows={4} value={draft.remediationStrategy || ''} onChange={(event) => update('remediationStrategy', event.target.value)} placeholder="Describe how the finding will be addressed." /></label>
    <div className="evidence-block"><label className="field"><span>Evidence provided</span><select required value={draft.evidence || 'No Evidence Provided'} onChange={(event) => update('evidence', event.target.value)}>{['No Evidence Provided', 'Evidence Provided', 'Evidence Validated'].map((evidence) => <option key={evidence}>{evidence}</option>)}</select></label><label className="field"><span>Evidence details</span><textarea rows={4} value={draft.evidenceDetails || ''} onChange={(event) => update('evidenceDetails', event.target.value)} placeholder="Describe what was used to validate the control." /></label></div>
    <div className="modal-actions"><button type="button" className="cancel-button" onClick={onCancel}>Cancel</button><button type="submit" className="primary-button">Save Changes</button></div>
  </form>
}

function FindingRecord({ finding }) {
  return <>
    <p className="detail-description">{finding.description}</p>
    <div className="detail-grid"><div><span>ISO control area</span><strong>{finding.controlArea} · {controlAreaNames[finding.controlArea] || 'Control area'}</strong></div><div><span>Risk criticality</span><strong><span className={`risk-tag ${finding.risk.toLowerCase()}`}>{finding.risk}</span></strong></div><div><span>Owner / department</span><strong>{finding.owner}</strong></div><div><span>Current status</span><strong>{finding.status}</strong></div><div><span>Date identified</span><strong>{finding.dateIdentified}</strong></div><div><span>Remediation due</span><strong>{finding.dueDate}</strong></div><div><span>Last updated</span><strong>{finding.lastUpdated}</strong></div></div>
    <div className="residual-risk-rationale"><div><span>Residual risk after controls</span><strong>{finding.residualRisk || 'Not assessed'}</strong></div><div><span>Residual Risk Rationale</span><p>{finding.residualRiskRationale || 'No rationale recorded.'}</p></div></div>
    <div className="remediation-strategy"><span>Remediation Strategy</span><p>{finding.remediationStrategy || 'No remediation strategy recorded.'}</p></div>
    <div className="evidence-block"><div className="evidence-status"><span>Evidence provided</span><strong>{finding.evidence || 'No Evidence Provided'}</strong></div><div className="evidence-notes"><span>Evidence details</span><p>{finding.evidenceDetails || 'No evidence details recorded.'}</p></div></div>
  </>
}

function UpdatesPanel({ finding, onPostUpdate, onDeleteUpdate }) {
  const [comment, setComment] = useState('')
  function submit(event) {
    event.preventDefault()
    const posted = onPostUpdate(finding.id, comment.trim())
    if (posted) setComment('')
  }
  const updates = finding.updates || []
  return <section className="updates-section" aria-labelledby="updates-title">
    <div className="updates-heading"><div><h3 id="updates-title">Updates</h3><p>Record remediation actions and progress.</p></div><span className="updates-count">{updates.length}</span></div>
    <form className="update-composer" onSubmit={submit}><label className="field full"><span>Add an update</span><textarea rows={3} value={comment} onChange={(event) => setComment(event.target.value)} placeholder="Describe what you did with this finding..." required /></label><div className="update-composer-footer"><span>Posting as Demo User</span><button type="submit" className="primary-button" disabled={!comment.trim()}>Post Update</button></div></form>
    <div className="updates-list">{updates.map((update, index) => ({ update, index })).reverse().map(({ update, index }) => <article className="update-entry" key={`${update.createdAt}-${index}`}><div className="update-entry-heading"><strong>{update.author || 'Demo User'}</strong><time dateTime={update.createdAt}>{new Date(update.createdAt).toLocaleString()}</time><button type="button" className="delete-update-button" onClick={() => onDeleteUpdate(finding.id, index)} aria-label={`Delete update from ${update.author || 'Demo User'}`}>Delete</button></div><p>{update.comment}</p></article>)}{!updates.length && <p className="updates-empty">No updates yet. Add the first progress note above.</p>}</div>
  </section>
}

export default function FindingDetailDialog({ finding, onClose, onSave, onPostUpdate, onDeleteUpdate }) {
  const [editing, setEditing] = useState(false)
  return <div className="modal-backdrop detail-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}>
    <section className="modal detail-modal" role="dialog" aria-modal="true" aria-labelledby="detail-title">
      <div className="modal-heading detail-modal-heading"><div className="detail-title-area"><div className="eyebrow">FINDING DETAILS</div><div className="detail-title-row"><h2 id="detail-title">Finding {finding.id}</h2>{!editing && <button type="button" className="secondary-button" onClick={() => setEditing(true)}>Edit Finding</button>}</div></div><button className="close-button" onClick={onClose} aria-label="Close finding details"><X aria-hidden="true" /></button></div>
      <div className="detail-workspace"><section className="detail-record" aria-label="Finding record">{editing ? <FindingEditor key={finding.id} finding={finding} onCancel={() => setEditing(false)} onSave={onSave} /> : <FindingRecord finding={finding} />}</section><UpdatesPanel finding={finding} onPostUpdate={onPostUpdate} onDeleteUpdate={onDeleteUpdate} /></div>
    </section>
  </div>
}
