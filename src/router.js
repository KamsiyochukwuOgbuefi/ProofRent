export function getRoute() {
  const parts = window.location.hash.replace(/^#\/?/, '').split('/').filter(Boolean);
  if (parts.length === 0 || (parts.length === 1 && parts[0] === 'dashboard')) return { page: 'dashboard' };
  if (parts[0] === 'cases' && parts[1] && parts.length === 2) return { page: 'case', caseId: parts[1] };
  if (parts[0] === 'cases' && parts[1] && parts[2] === 'evidence' && parts[3] && parts.length === 4) {
    return { page: 'evidence', caseId: parts[1], evidenceId: parts[3] };
  }
  if (parts[0] === 'agent' && parts[1] === 'cases' && parts[2] && parts.length === 3) return { page: 'agent', caseId: parts[2] };
  return { page: 'not-found' };
}

export function navigate(path) {
  window.location.hash = path;
}
