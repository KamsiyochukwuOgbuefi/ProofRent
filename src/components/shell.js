import { escapeHtml } from '../utils.js';

export function renderShell(content, state, route, message = '') {
  const agentMode = route.page === 'agent';
  return `
    <div class="app-frame">
      <aside class="sidebar">
        <a class="brand" href="#/dashboard"><span class="brand-mark">P</span><span><strong>ProofRent</strong><small>PROPERTY EVIDENCE</small></span></a>
        <p class="nav-caption">WORKSPACE</p>
        <a class="nav-link ${route.page === 'dashboard' ? 'active' : ''}" href="#/dashboard"><span class="nav-symbol">▦</span>Portfolio overview</a>
        ${state ? `<a class="nav-link ${route.page !== 'dashboard' && !agentMode ? 'active' : ''}" href="#/cases/${encodeURIComponent(state.case.id)}"><span class="nav-symbol">◷</span>Disputed case<span class="nav-count">01</span></a>` : ''}
        <div class="sidebar-bottom"><div class="sidebar-note"><span class="note-mark">i</span><p><strong>Records, not assumptions.</strong>ProofRent shows the report, supporting records, and what remains uncertain.</p></div><span class="build-label">SAMPLE DEMO · LOCAL ONLY</span></div>
      </aside>
      <main class="main-area">
        <header class="topbar"><div class="breadcrumb"><span>ProofRent</span><i>/</i><strong>${route.page === 'dashboard' ? 'Overview' : agentMode ? 'Agent submission' : route.page === 'evidence' ? 'Evidence review' : route.page === 'case' ? 'Case file' : 'Page unavailable'}</strong></div>
          <div class="topbar-actions"><span class="sample-pill"><span></span>Sample case</span>${state && !agentMode ? `<a class="mode-switch" href="#/agent/cases/${encodeURIComponent(state.case.id)}">Open agent view <span aria-hidden="true">↗</span></a>` : state ? `<a class="mode-switch" href="#/cases/${encodeURIComponent(state.case.id)}">Return to landlord <span aria-hidden="true">↗</span></a>` : ''}<button class="reset-button" type="button" data-action="reset">Reset demo</button></div>
        </header>
        ${message ? `<div class="app-alert" role="status">${escapeHtml(message)}</div>` : ''}
        <div class="content">${content}</div>
      </main>
    </div>`;
}
