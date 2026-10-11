import { CircleDot, Clock3, FileText, ShieldAlert, TriangleAlert, ChevronDown } from 'lucide-react'
import { controlAreaNames, residualRiskOptions, riskOrder } from '../../data/findings'

function MetricCard({ label, value, detail, tone, icon: Icon }) {
  return <article className="metric-card"><div className="metric-top"><span>{label}</span><span className={`metric-icon ${tone}`}><Icon aria-hidden="true" /></span></div><div className="metric-value">{value}</div><div className="metric-foot">{detail}</div></article>
}

function RiskDistribution({ findings, counts, year, years, onYearChange }) {
  return <article className="panel risk-panel" data-tour="risk-distribution"><div className="panel-heading"><div><h2>Risk Distribution</h2><p>Findings by assessed criticality</p></div><label className="period-selector"><select className="period-chip" aria-label="Filter risk distribution by year" value={year} onChange={(event) => onYearChange(event.target.value)}><option value="all">All findings</option>{years.map((item) => <option key={item} value={item}>{item}</option>)}</select><ChevronDown className="period-chevron" aria-hidden="true" /></label></div>
    <div className="chart-area"><div className="donut" style={{ '--critical': `${findings.length ? counts.Critical / findings.length * 100 : 0}%`, '--high': `${findings.length ? counts.High / findings.length * 100 : 0}%`, '--medium': `${findings.length ? counts.Medium / findings.length * 100 : 0}%` }}><div className="donut-center"><strong>{findings.length}</strong><span>findings</span></div></div><div className="legend">{riskOrder.slice().reverse().map((risk) => <div className="legend-row" key={risk}><span className={`legend-dot ${risk.toLowerCase()}`} />{risk}<strong>{counts[risk]}</strong></div>)}</div></div>
    <div className="chart-note">Risk levels reflect the latest assessment for each finding.</div>
  </article>
}

function NeedsAttention({ findings, onOpenFinding }) {
  const attentionFindings = findings.filter((finding) => finding.status !== 'Closed').sort((a, b) => (a.dueDate < b.dueDate ? -1 : 1)).slice(0, 3)
  return <article className="panel focus-panel" data-tour="needs-attention"><div className="panel-heading"><div><h2>Needs Attention</h2><p>Prioritized items to review</p></div><span className="attention-icon"><TriangleAlert aria-hidden="true" /></span></div>
    {attentionFindings.map((finding) => <div className="focus-item" key={finding.id}><span className={`focus-bar ${finding.risk.toLowerCase()}`} /><div className="focus-copy"><button className="finding-link" onClick={() => onOpenFinding(finding)}>{finding.id}</button><span>{finding.controlArea} · {controlAreaNames[finding.controlArea] || 'Control area'} · Due {finding.dueDate}</span></div><span className={`risk-tag ${finding.risk.toLowerCase()}`}>{finding.risk}</span></div>)}
    {!findings.length && <div className="empty-small">Add a finding to see what needs attention.</div>}
  </article>
}

function ResidualRiskPanel({ findings, counts, assessedCount, unassessedCount }) {
  return <section className="panel residual-risk-panel" aria-labelledby="residual-risk-title" data-tour="residual-risk">
    <div className="panel-heading"><div><h2 id="residual-risk-title">Residual Risk</h2><p>Risk remaining after security controls are considered</p></div><span className="residual-assessment-count">{assessedCount} of {findings.length} assessed</span></div>
    <div className="residual-risk-bar" role="img" aria-label={`Residual risk distribution among ${assessedCount} assessed findings: ${residualRiskOptions.map((risk) => `${counts[risk]} ${risk}`).join(', ')}`}>{residualRiskOptions.map((risk) => <span key={risk} className={`residual-risk-segment ${risk.toLowerCase()}`} style={{ width: assessedCount ? `${counts[risk] / assessedCount * 100}%` : '0%' }} />)}</div>
    <div className="residual-risk-legend">{residualRiskOptions.map((risk) => <div className={`residual-risk-item ${risk === 'Accepted' ? 'accepted' : ''}`} key={risk}><span className={`legend-dot ${risk.toLowerCase()}`} /><span>{risk}</span><strong>{counts[risk]}</strong></div>)}<div className="residual-risk-item unassessed"><span className="legend-dot" /><span>Not assessed</span><strong>{unassessedCount}</strong></div></div>
    <p className="residual-risk-note">Residual ratings are entered for each finding in its details. Unassessed findings are not included in the distribution.</p>
  </section>
}

export default function OverviewPage({ findings, overdueCount, riskCounts, residualRiskCounts, assessedResidualRiskCount, unassessedResidualRiskCount, chartFindings, chartRiskCounts, chartYearFilter, chartYearOptions, onChartYearChange, onOpenFinding }) {
  return <>
    <section className="page-heading" id="overview"><div><div className="eyebrow">SECURITY &amp; COMPLIANCE</div><h1>Security Overview</h1><p>A clear view of your security findings and remediation progress.</p></div></section>
    <div className="metrics-grid" data-tour="overview-metrics">
      <MetricCard label="Total findings" value={findings.length} detail="Across all control areas" tone="blue" icon={FileText} />
      <MetricCard label="Overdue findings" value={overdueCount} detail="Past due and not yet closed" tone="orange" icon={Clock3} />
      <MetricCard label="Open findings" value={findings.filter((finding) => finding.status !== 'Closed').length} detail="Awaiting remediation or review" tone="violet" icon={CircleDot} />
      <MetricCard label="Critical risk" value={riskCounts.Critical} detail="Requires immediate attention" tone="red" icon={ShieldAlert} />
    </div>
    <section className="content-grid">
      <RiskDistribution findings={chartFindings} counts={chartRiskCounts} year={chartYearFilter} years={chartYearOptions} onYearChange={onChartYearChange} />
      <NeedsAttention findings={findings} onOpenFinding={onOpenFinding} />
    </section>
    <ResidualRiskPanel findings={findings} counts={residualRiskCounts} assessedCount={assessedResidualRiskCount} unassessedCount={unassessedResidualRiskCount} />
  </>
}
