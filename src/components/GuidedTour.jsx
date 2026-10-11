import { useEffect, useState } from 'react'
import { ArrowLeft, ArrowRight, X } from 'lucide-react'

const overviewSteps = [
  {
    target: 'overview-metrics',
    title: 'Executive metrics',
    body: 'The top row summarizes total findings, overdue items, open findings, and critical-risk findings. Together, these counts show the size and urgency of the current register.',
  },
  {
    target: 'risk-distribution',
    title: 'Risk Distribution',
    body: 'This chart shows findings by assessed criticality. Use the year filter to focus on the year a finding was identified and compare risk levels over time.',
  },
  {
    target: 'needs-attention',
    title: 'Needs Attention',
    body: 'This list prioritizes up to three findings that are not closed, based on due date. Select a finding ID to open its record and review the details or updates.',
  },
  {
    target: 'residual-risk',
    title: 'Residual Risk',
    body: 'Residual risk shows what may remain after security controls are considered. It distinguishes accepted risk from rated risk and shows which findings still need assessment. To work with the records, select Findings in the Workspace navigation on the left.',
  },
]

const findingsSteps = [
  {
    target: 'findings-register',
    title: 'Security Findings register',
    body: 'This is the analyst workspace for the organization’s findings. The register keeps control areas, risk, owners, due dates, and status together so teams can prioritize remediation, find records, and track progress. Select Next to open finding 2026-0005 and see its details.',
  },
  {
    target: 'finding-record',
    placement: 'right',
    title: 'Finding 2026-0005',
    body: 'This record brings the finding description and key fields together: ISO control area, criticality, owner, status, dates, residual risk and rationale, remediation strategy, and evidence. These details help reviewers understand the issue and its treatment.',
  },
  {
    target: 'finding-edit',
    title: 'Editing a finding',
    body: 'Use Edit Finding to update the record as remediation progresses. Next, I’ll show the editable fields and the Save and Cancel controls.',
  },
  {
    target: 'finding-editor',
    placement: 'right',
    scrollToTop: true,
    title: 'Editable fields',
    body: 'You can update the finding details while its unique ID stays fixed. Required fields are validated before saving; Evidence details is optional. Save Changes records the edit and refreshes Last Updated. Cancel discards unsaved changes.',
  },
  {
    target: 'finding-updates',
    scrollToTop: true,
    title: 'Updates and activity history',
    body: 'Post a progress note here to document work performed. Each update is stored with the posting user and date/time, creating an activity history for the finding. Existing notes can also be deleted.',
  },
]

function getGeometry(element, placement = 'center') {
  const rect = element.getBoundingClientRect()
  const padding = 7
  const left = Math.max(8, rect.left - padding)
  const top = Math.max(8, rect.top - padding)
  const right = Math.min(window.innerWidth - 8, rect.right + padding)
  const bottom = Math.min(window.innerHeight - 8, rect.bottom + padding)
  const width = Math.min(380, window.innerWidth - 32)
  const centeredLeft = Math.max(16, Math.min(window.innerWidth - width - 16, (left + right) / 2 - width / 2))
  const rightLeft = right + 16
  const leftLeft = left - width - 16
  const tooltipLeft = placement === 'right'
    ? rightLeft + width <= window.innerWidth - 16
      ? rightLeft
      : leftLeft >= 16
        ? leftLeft
        : centeredLeft
    : centeredLeft
  const roomBelow = window.innerHeight - bottom
  const placeBelow = roomBelow >= 270 || top < 250
  const tooltipTop = placeBelow
    ? Math.max(16, Math.min(bottom + 14, window.innerHeight - 260))
    : Math.max(16, top - 250)

  return { left, top, right, bottom, width: right - left, height: bottom - top, tooltipLeft, tooltipTop }
}

export default function GuidedTour({ tourType = 'overview', stepIndex, onPrevious, onNext, onClose }) {
  const [geometry, setGeometry] = useState(null)
  const tourSteps = tourType === 'findings' ? findingsSteps : overviewSteps
  const step = tourSteps[stepIndex]
  const isLastStep = stepIndex === tourSteps.length - 1

  useEffect(() => {
    let updateTimer
    let disposed = false
    const target = document.querySelector(`[data-tour="${step.target}"]`)

    if (!target) {
      onClose()
      return undefined
    }

    if (step.scrollToTop) {
      const modal = target.closest('.detail-modal')
      if (modal) modal.scrollTo({ top: 0, behavior: 'smooth' })
      else target.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' })
    } else {
      target.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' })
    }

    const measure = () => {
    if (!disposed) setGeometry(getGeometry(target, step.placement))
    }
    updateTimer = window.setTimeout(measure, 220)
    window.addEventListener('resize', measure)
    window.addEventListener('scroll', measure, true)

    return () => {
      disposed = true
      window.clearTimeout(updateTimer)
      window.removeEventListener('resize', measure)
      window.removeEventListener('scroll', measure, true)
    }
  }, [step.target, onClose])

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  if (!geometry) return null

  const topShade = { top: 0, left: 0, width: '100%', height: geometry.top }
  const leftShade = { top: geometry.top, left: 0, width: geometry.left, height: geometry.height }
  const rightShade = { top: geometry.top, left: geometry.right, width: Math.max(0, window.innerWidth - geometry.right), height: geometry.height }
  const bottomShade = { top: geometry.bottom, left: 0, width: '100%', height: Math.max(0, window.innerHeight - geometry.bottom) }

  return <div className="guided-tour" role="presentation">
    <div className="tour-shade" style={topShade} />
    <div className="tour-shade" style={leftShade} />
    <div className="tour-shade" style={rightShade} />
    <div className="tour-shade" style={bottomShade} />
    <div className="tour-spotlight" style={{ top: geometry.top, left: geometry.left, width: geometry.width, height: geometry.height }} />
    <section className="tour-card" role="dialog" aria-modal="true" aria-labelledby="tour-title" aria-describedby="tour-description" style={{ top: geometry.tooltipTop, left: geometry.tooltipLeft }}>
      <div className="tour-card-header"><span className="tour-step-count">{tourType.toUpperCase()} TOUR · {stepIndex + 1} OF {tourSteps.length}</span><button type="button" className="tour-close" onClick={onClose} aria-label="Close tutorial"><X aria-hidden="true" /></button></div>
      <h2 id="tour-title">{step.title}</h2>
      <p id="tour-description">{step.body}</p>
      <div className="tour-card-footer"><button type="button" className="tour-skip" onClick={onClose}>Skip tutorial</button><div className="tour-nav-buttons">{stepIndex > 0 && <button type="button" className="tour-previous" onClick={onPrevious}><ArrowLeft aria-hidden="true" /> Previous</button>}<button type="button" className="tour-next" onClick={isLastStep ? onClose : onNext}>{isLastStep ? 'Finish' : 'Next'} {!isLastStep && <ArrowRight aria-hidden="true" />}</button></div></div>
    </section>
  </div>
}
