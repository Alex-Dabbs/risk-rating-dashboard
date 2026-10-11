import { useState } from 'react'
import { X } from 'lucide-react'
import { emptyForm, residualRiskOptions, statusOptions } from '../../data/findings'

export default function AddFindingDialog({ open, onClose, onSubmit }) {
  const [form, setForm] = useState(emptyForm)
  function update(field, value) { setForm((current) => ({ ...current, [field]: value })) }
  function submit(event) {
    event.preventDefault()
    onSubmit(form)
    setForm(emptyForm)
  }

  if (!open) return null

  return <div className="modal-backdrop add-finding-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}>
    <section className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className="modal-heading"><div><div className="eyebrow">FINDINGS REGISTER</div><h2 id="modal-title">Add a finding</h2></div><button className="close-button" onClick={onClose} aria-label="Close"><X aria-hidden="true" /></button></div>
      <p className="modal-intro">Capture the finding details and assign a remediation owner.</p>
      <form onSubmit={submit}>
        <label className="field full"><span>Finding description (30 characters minimum)</span><textarea required minLength={30} rows={4} value={form.description} onChange={(event) => update('description', event.target.value)} placeholder="Describe the security finding" /><span className="field-hint" aria-live="polite">{form.description.length}/30 characters minimum</span></label>
        <label className="field full"><span>ISO control area</span><input required value={form.controlArea} onChange={(event) => update('controlArea', event.target.value)} placeholder="e.g. A.5.15" /></label>
        <div className="form-row"><label className="field"><span>Date identified</span><input type="date" required value={form.dateIdentified} onChange={(event) => update('dateIdentified', event.target.value)} /></label><label className="field"><span>Remediation due</span><input type="date" required value={form.dueDate} onChange={(event) => update('dueDate', event.target.value)} /></label></div>
        <div className="form-row"><label className="field"><span>Risk criticality</span><select value={form.risk} onChange={(event) => update('risk', event.target.value)}>{['Low', 'Medium', 'High', 'Critical'].map((risk) => <option key={risk}>{risk}</option>)}</select></label><label className="field"><span>Current status</span><select value={form.status} onChange={(event) => update('status', event.target.value)}>{statusOptions.map((status) => <option key={status}>{status}</option>)}</select></label></div>
        <label className="field full"><span>Residual risk after controls</span><select required value={form.residualRisk} onChange={(event) => update('residualRisk', event.target.value)}><option value="">Not assessed</option>{residualRiskOptions.map((risk) => <option key={risk}>{risk}</option>)}</select></label>
        <label className="field full"><span>Residual Risk Rationale</span><textarea required rows={3} value={form.residualRiskRationale} onChange={(event) => update('residualRiskRationale', event.target.value)} placeholder="Briefly explain why this residual risk rating is appropriate." /></label>
        <label className="field full"><span>Owner / department</span><input required value={form.owner} onChange={(event) => update('owner', event.target.value)} placeholder="e.g. IAM" /></label>
        <label className="field full"><span>Remediation Strategy</span><textarea required rows={4} value={form.remediationStrategy} onChange={(event) => update('remediationStrategy', event.target.value)} placeholder="Describe how the finding will be addressed." /></label>
        <label className="field full"><span>Evidence</span><select value={form.evidence} onChange={(event) => update('evidence', event.target.value)}>{['No Evidence Provided', 'Evidence Provided', 'Evidence Validated'].map((evidence) => <option key={evidence}>{evidence}</option>)}</select></label>
        <div className="modal-actions"><button type="button" className="cancel-button" onClick={onClose}>Cancel</button><button type="submit" className="primary-button">Add Finding</button></div>
      </form>
    </section>
  </div>
}
