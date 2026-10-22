import { itemScore } from './rewindBrief';

const riskOf = item => (item && typeof item === 'object' && (item.risk_assessment || item.riskAssessment || item.score)) || null;

// Denormalized snapshot of the ranked suspects the user saw. The backend stores this
// because change events are purged by the free-plan retention job, while the saved
// resolution must survive to power future similar-incident suggestions.
export const buildSuspectSignature = (items, limit = 3) =>
  (Array.isArray(items) ? items : []).slice(0, limit).map(item => {
    const change = (item && typeof item === 'object' && (item.event || item)) || {};
    return {
      event_id: change.id || null,
      type: change.type || null,
      service: change.service || null,
      summary: change.summary ? String(change.summary).slice(0, 500) : null,
      occurred_at: change.occurred_at || null,
      score: item && typeof item === 'object' ? itemScore(item) : null,
      role: item?.role || null,
      // Dominant file category (mixed/ci-only/...). Lets the backend match similar
      // incidents across different services.
      content_class: riskOf(item)?.content?.content_class || null,
    };
  });

/**
 * Query params for GET /rewind/suggestions: the rewind scope plus the ranked suspects'
 * types and content classes. The backend never trusts a fingerprint from the request;
 * it derives that from the linked incident itself.
 */
export const suggestionQueryParams = (queryParams, items, incidentId = '') => {
  const signature = buildSuspectSignature(items, 10);
  const unique = values => [...new Set(values.filter(Boolean))];
  return {
    incident_at: queryParams?.incidentTime ? new Date(queryParams.incidentTime + (queryParams.incidentTime.endsWith('Z') ? '' : 'Z')).toISOString() : null,
    window_minutes: queryParams?.windowMinutes,
    ...(queryParams?.service ? { service: queryParams.service } : {}),
    ...(queryParams?.environment ? { environment: queryParams.environment } : {}),
    ...(incidentId ? { incident_id: incidentId } : {}),
    suspect_types: unique(signature.map(s => s.type)).join(','),
    content_classes: unique(signature.map(s => s.content_class)).join(','),
  };
};

// Culprit choices for the picker: only ranked changes that carry a source event id.
export const culpritOptions = (items) =>
  (Array.isArray(items) ? items : [])
    .map((item, index) => {
      const change = (item && typeof item === 'object' && (item.event || item)) || {};
      if (!change.id) return null;
      return {
        id: change.id,
        label: `#${index + 1} ${change.summary || change.type || 'Change'} - ${change.service || 'Unspecified'}`,
      };
    })
    .filter(Boolean);
