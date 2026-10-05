import React from 'react';
import { EventCard } from '../EventCard/EventCard';
import { LoadingState } from '../LoadingState/LoadingState';

/**
 * Normalise an item to { event, risk_assessment, role, causal_position }.
 *
 * The telemetry feed passes plain ChangeEvent objects directly (shape: { id, service, ... }).
 * The Rewind page passes scored items (shape: { event: {...}, risk_assessment, role, causal_position }).
 * We detect which shape we have by checking for the nested `event` key.
 */
function normaliseItem(item) {
    if (item && item.event && typeof item.event === 'object') {
        // Already scored shape from /scoring/incident
        return {
            event: item.event,
            risk_assessment: item.risk_assessment ?? null,
            role: item.role ?? null,
            causal_position: item.causal_position ?? null,
        };
    }
    // Plain ChangeEvent from /change-events
    return {
        event: item,
        risk_assessment: null,
        role: null,
        causal_position: null,
    };
}

export const Timeline = ({ events, eventsWithScores, isLoading, error }) => {
    if (isLoading) {
        return <LoadingState message="Fetching events..." />;
    }

    if (error) {
        return <div className="text-center p-8 text-status-error text-base">Error: {error.message}</div>;
    }

    // Accept either prop name; normalise everything to the scored shape.
    // Treat null/undefined as "not yet loaded" (distinct from an empty array).
    const rawItems = eventsWithScores ?? events;

    if (!rawItems || rawItems.length === 0) {
        return <div className="text-center p-8 text-text-muted text-base">No events found.</div>;
    }

    const items = rawItems.map(normaliseItem);

    // Find the first event that belongs to the causal chain (lowest causal_position).
    // The "CAUSAL PATH" section label is inserted immediately before it.
    const causalItems = items.filter(item => item.causal_position != null);
    const hasCausalChain = causalItems.length >= 2;
    const firstCausalItem = hasCausalChain
        ? causalItems.reduce((min, item) => item.causal_position < min.causal_position ? item : min)
        : null;
    const firstCausalId = firstCausalItem?.event?.id ?? null;

    return (
        <div className="max-w-3xl mx-auto py-2 md:py-8">
            {items.map((item, index) => {
                const { event, risk_assessment, role, causal_position } = item;
                const showCausalLabel = hasCausalChain && event.id === firstCausalId;

                return (
                    <React.Fragment key={event.id}>
                        {showCausalLabel && (
                            <div className="text-xs font-semibold uppercase tracking-widest text-accent/60 mb-2 mt-4">
                                Causal Path
                            </div>
                        )}
                        <EventCard
                            event={event}
                            riskAssessment={risk_assessment}
                            isLast={index === items.length - 1}
                            roleBadge={role}
                            causalChainPosition={causal_position}
                        />
                    </React.Fragment>
                );
            })}
        </div>
    );
};
