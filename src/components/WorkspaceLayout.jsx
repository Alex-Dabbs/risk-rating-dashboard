import { ChevronDown, CircleHelp, ClipboardList, LayoutDashboard, Moon, Sun } from 'lucide-react'

export default function WorkspaceLayout({ activeSection, onNavigate, findingCount, theme, onToggleTheme, onStartTutorial, children, overlays }) {
  return <div className="app-shell" data-theme={theme}>
    <aside className="sidebar">
      <a className="brand" href="#overview"><span className="brand-mark">N</span><span>Northstar<span className="brand-sub">GRC workspace</span></span></a>
      <div className="nav-label">WORKSPACE</div>
      <button type="button" className={`nav-item${activeSection === 'overview' ? ' active' : ''}`} aria-current={activeSection === 'overview' ? 'page' : undefined} onClick={() => onNavigate('overview')}><LayoutDashboard aria-hidden="true" /> Overview</button>
      <button type="button" className={`nav-item${activeSection === 'findings' ? ' active' : ''}`} aria-current={activeSection === 'findings' ? 'page' : undefined} onClick={() => onNavigate('findings')}><ClipboardList aria-hidden="true" /> Findings <span className="nav-count">{findingCount}</span></button>
      <div className="sidebar-bottom"><div className="company-avatar">CES</div><div><strong>Ceraphin Energy Solutions</strong><small>Enterprise workspace</small></div><ChevronDown className="chevron" aria-hidden="true" /></div>
    </aside>
    <main className="main-content">
      <header className="topbar"><div className="crumb">Workspace <span>/</span> {activeSection === 'overview' ? 'Security Overview' : 'Findings'}</div><div className="top-actions"><span className="updated-dot" /> Data saved locally <button className="tutorial-launcher" type="button" onClick={() => onStartTutorial(activeSection)} aria-label={`Start ${activeSection === 'overview' ? 'Overview' : 'Findings'} tutorial`} title={`Start ${activeSection === 'overview' ? 'Overview' : 'Findings'} tutorial`}><CircleHelp aria-hidden="true" /></button><button className="theme-toggle" type="button" onClick={onToggleTheme} aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`} title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}>{theme === 'dark' ? <Sun aria-hidden="true" /> : <Moon aria-hidden="true" />}</button><div className="profile">AD</div></div></header>
      <nav className="mobile-nav" aria-label="Workspace sections"><button type="button" className={activeSection === 'overview' ? 'active' : ''} aria-current={activeSection === 'overview' ? 'page' : undefined} onClick={() => onNavigate('overview')}>Overview</button><button type="button" className={activeSection === 'findings' ? 'active' : ''} aria-current={activeSection === 'findings' ? 'page' : undefined} onClick={() => onNavigate('findings')}>Findings <span>{findingCount}</span></button></nav>
      {children}
      <footer className="page-footer">Northstar GRC <span>·</span> ISO 27001:2022 control areas <span className="footer-right">Information stored in this browser</span></footer>
    </main>
    {overlays}
  </div>
}
