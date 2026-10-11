import { useMemo, useState } from 'react'
import { Check } from 'lucide-react'
import './styles/index.css'
import WorkspaceLayout from './components/WorkspaceLayout'
import OverviewPage from './features/overview/OverviewPage'
import AddFindingDialog from './features/findings/AddFindingDialog'
import FindingDetailDialog from './features/findings/FindingDetailDialog'
import FindingsPage from './features/findings/FindingsPage'
import { localDateString, residualRiskOptions, riskOrder } from './data/findings'
import { useFindings } from './hooks/useFindings'
import { useTheme } from './hooks/useTheme'
import { filterAndSortFindings, getResidualRiskCounts, getRiskCounts } from './utils/findings'

function App() {
  const { findings, addFinding, updateStatus, saveFinding, updateHistory } = useFindings()
  const { theme, toggleTheme } = useTheme()
  const [activeSection, setActiveSection] = useState('overview')
  const [query, setQuery] = useState('')
  const [riskFilter, setRiskFilter] = useState('All risks')
  const [statusFilter, setStatusFilter] = useState('All statuses')
  const [chartYearFilter, setChartYearFilter] = useState('all')
  const [sortBy, setSortBy] = useState('dueDate')
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedFindingId, setSelectedFindingId] = useState(null)
  const [notice, setNotice] = useState('')

  const today = new Date().toISOString().slice(0, 10)
  const overdueCount = findings.filter((finding) => finding.dueDate < today && finding.status !== 'Closed').length
  const riskCounts = getRiskCounts(findings, riskOrder)
  const residualRiskCounts = getResidualRiskCounts(findings, residualRiskOptions)
  const assessedResidualRiskCount = findings.filter((finding) => residualRiskOptions.includes(finding.residualRisk)).length
  const unassessedResidualRiskCount = findings.length - assessedResidualRiskCount
  const chartYearOptions = useMemo(() => [...new Set([...findings.map((finding) => finding.dateIdentified?.slice(0, 4)), chartYearFilter !== 'all' ? chartYearFilter : null].filter(Boolean))].sort((a, b) => b.localeCompare(a)), [findings, chartYearFilter])
  const chartFindings = useMemo(() => chartYearFilter === 'all' ? findings : findings.filter((finding) => finding.dateIdentified?.slice(0, 4) === chartYearFilter), [findings, chartYearFilter])
  const chartRiskCounts = getRiskCounts(chartFindings, riskOrder)
  const visibleFindings = useMemo(() => filterAndSortFindings(findings, { query, riskFilter, statusFilter, sortBy }), [findings, query, riskFilter, statusFilter, sortBy])
  const selectedFinding = findings.find((finding) => finding.id === selectedFindingId) || null

  function handleAddFinding(form) {
    const finding = addFinding(form)
    setModalOpen(false)
    setNotice(`Finding ${finding.id} added`)
    window.setTimeout(() => setNotice(''), 3000)
  }

  function handleOpenFinding(finding) {
    setSelectedFindingId(finding.id)
  }

  function handlePostUpdate(id, comment) {
    if (!comment) return false
    updateHistory(id, (finding) => ({ ...finding, updates: [...(finding.updates || []), { comment, author: 'Demo User', createdAt: new Date().toISOString() }], lastUpdated: localDateString() }))
    return true
  }

  function handleDeleteUpdate(id, updateIndex) {
    updateHistory(id, (finding) => ({ ...finding, updates: (finding.updates || []).filter((_, index) => index !== updateIndex), lastUpdated: localDateString() }))
  }

  return <WorkspaceLayout activeSection={activeSection} onNavigate={setActiveSection} findingCount={findings.length} theme={theme} onToggleTheme={toggleTheme} overlays={<>
    {notice && <div className="toast"><Check aria-hidden="true" /> {notice}</div>}
    <AddFindingDialog open={modalOpen} onClose={() => setModalOpen(false)} onSubmit={handleAddFinding} />
    {selectedFinding && <FindingDetailDialog key={selectedFinding.id} finding={selectedFinding} onClose={() => setSelectedFindingId(null)} onSave={saveFinding} onPostUpdate={handlePostUpdate} onDeleteUpdate={handleDeleteUpdate} />}
  </>}>
    {activeSection === 'overview'
      ? <OverviewPage findings={findings} overdueCount={overdueCount} riskCounts={riskCounts} residualRiskCounts={residualRiskCounts} assessedResidualRiskCount={assessedResidualRiskCount} unassessedResidualRiskCount={unassessedResidualRiskCount} chartFindings={chartFindings} chartRiskCounts={chartRiskCounts} chartYearFilter={chartYearFilter} chartYearOptions={chartYearOptions} onChartYearChange={setChartYearFilter} onOpenFinding={handleOpenFinding} />
      : <FindingsPage findings={findings} visibleFindings={visibleFindings} today={today} theme={theme} query={query} riskFilter={riskFilter} statusFilter={statusFilter} sortBy={sortBy} onQueryChange={setQuery} onRiskChange={setRiskFilter} onStatusChange={setStatusFilter} onSortChange={setSortBy} onUpdateStatus={updateStatus} onOpenFinding={handleOpenFinding} onAddFinding={() => setModalOpen(true)} />}
  </WorkspaceLayout>
}

export default App
