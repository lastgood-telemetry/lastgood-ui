import { itemScore } from './rewindBrief';

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
    };
  });

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
