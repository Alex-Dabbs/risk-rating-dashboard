import { Plus, Search } from 'lucide-react'
import StatusMenu from '../../components/StatusMenu'
import { controlAreaNames, riskOrder, statusOptions } from '../../data/findings'

function FindingRow({ finding, today, theme, onOpenFinding, onUpdateStatus }) {
  const overdue = finding.dueDate < today && finding.status !== 'Closed'
  return <tr><td><div className="finding-cell"><button className="finding-link" onClick={() => onOpenFinding(finding)}>{finding.id}</button><span>{finding.controlArea} <i>·</i> {controlAreaNames[finding.controlArea] || 'Control area'}</span></div></td><td><span className={`risk-tag ${finding.risk.toLowerCase()}`}><span className="tiny-dot" />{finding.risk}</span></td><td><div className="owner-cell"><span className="owner-avatar">{finding.owner.split(/\s+/).map((part) => part[0]).join('').slice(0, 2)}</span>{finding.owner}</div></td><td>{finding.dateIdentified}</td><td className={overdue ? 'overdue-date' : ''}>{finding.dueDate}{overdue && <small>Overdue</small>}</td><td><StatusMenu value={finding.status} onChange={(status) => onUpdateStatus(finding.id, status)} label={`Update status for ${finding.id}`} theme={theme} /></td><td>{finding.lastUpdated}</td></tr>
}

function FindingCard({ finding, today, theme, onOpenFinding, onUpdateStatus }) {
  const overdue = finding.dueDate < today && finding.status !== 'Closed'
  return <article className="finding-card"><div className="finding-card-heading"><span className={`risk-tag ${finding.risk.toLowerCase()}`}><span className="tiny-dot" />{finding.risk}</span><StatusMenu value={finding.status} onChange={(status) => onUpdateStatus(finding.id, status)} label={`Update status for ${finding.id}`} theme={theme} /></div><h3><button className="finding-link" onClick={() => onOpenFinding(finding)}>{finding.id}</button></h3><div className="finding-card-id">{finding.controlArea} <span>·</span> {controlAreaNames[finding.controlArea] || 'Control area'}</div><dl><div><dt>Owner / department</dt><dd>{finding.owner}</dd></div><div><dt>Date identified</dt><dd>{finding.dateIdentified}</dd></div><div><dt>Remediation due</dt><dd className={overdue ? 'overdue-date' : ''}>{finding.dueDate}{overdue && <small>Overdue</small>}</dd></div><div><dt>Last updated</dt><dd>{finding.lastUpdated}</dd></div></dl></article>
}

function FindingsFilters({ query, riskFilter, statusFilter, sortBy, onQueryChange, onRiskChange, onStatusChange, onSortChange }) {
  return <div className="table-controls"><label className="search-box"><Search aria-hidden="true" /><input aria-label="Search by unique finding ID" value={query} onChange={(event) => onQueryChange(event.target.value)} placeholder="Search by finding ID..." /></label><select value={riskFilter} onChange={(event) => onRiskChange(event.target.value)}><option>All risks</option>{riskOrder.map((risk) => <option key={risk}>{risk}</option>)}</select><select value={statusFilter} onChange={(event) => onStatusChange(event.target.value)}><option>All statuses</option>{statusOptions.map((status) => <option key={status}>{status}</option>)}</select><select value={sortBy} onChange={(event) => onSortChange(event.target.value)}><option value="dueDate">Sort: Due date</option><option value="risk">Sort: Risk</option><option value="lastUpdated">Sort: Updated</option><option value="id">Sort: Finding ID</option></select></div>
}

export default function FindingsPage({ findings, visibleFindings, today, theme, query, riskFilter, statusFilter, sortBy, onQueryChange, onRiskChange, onStatusChange, onSortChange, onUpdateStatus, onOpenFinding, onAddFinding }) {
  return <>
    <section className="page-heading" id="findings-page"><div><div className="eyebrow">ANALYST WORKSPACE</div><h1>Findings</h1><p>Review ownership, update records, and track remediation progress.</p></div></section>
    <section className="panel findings-panel" id="findings" data-tour="findings-register">
      <div className="findings-header"><div><h2>Security Findings</h2><p>Track ownership, risk, and remediation due dates.</p></div><button className="primary-button" onClick={onAddFinding}><Plus aria-hidden="true" /> Add Finding</button></div>
      <FindingsFilters query={query} riskFilter={riskFilter} statusFilter={statusFilter} sortBy={sortBy} onQueryChange={onQueryChange} onRiskChange={onRiskChange} onStatusChange={onStatusChange} onSortChange={onSortChange} />
      <div className="table-wrap"><table><thead><tr><th>FINDING ID / CONTROL AREA</th><th>RISK</th><th>OWNER / DEPARTMENT</th><th>DATE IDENTIFIED</th><th>REMEDIATION DUE</th><th>STATUS</th><th>UPDATED</th></tr></thead><tbody>{visibleFindings.map((finding) => <FindingRow key={finding.id} finding={finding} today={today} theme={theme} onOpenFinding={onOpenFinding} onUpdateStatus={onUpdateStatus} />)}{visibleFindings.length === 0 && <tr><td className="no-results" colSpan="7">No findings match your filters. Add a finding or adjust your search.</td></tr>}</tbody></table></div>
      <div className="finding-cards">{visibleFindings.map((finding) => <FindingCard key={finding.id} finding={finding} today={today} theme={theme} onOpenFinding={onOpenFinding} onUpdateStatus={onUpdateStatus} />)}{visibleFindings.length === 0 && <div className="cards-empty">No findings match your filters. Add a finding or adjust your search.</div>}</div>
      <div className="table-footer"><span>Showing <strong>{visibleFindings.length}</strong> of <strong>{findings.length}</strong> findings</span><span>Last refreshed {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span></div>
    </section>
  </>
}
