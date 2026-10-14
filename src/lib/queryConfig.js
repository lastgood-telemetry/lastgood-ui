// Central cache policy for React Query. Reference data changes only when the
// user edits it in this console, and every edit invalidates its key, so it can
// sit in cache for minutes. Live data stays short.
export const MINUTE = 60 * 1000;

export const STALE = {
  reference: 5 * MINUTE, // services, topology graph/deps/config, integrations
  moderate: 2 * MINUTE, // postmortems, team invites
  live: 30 * 1000, // events feed, rewind event discovery
};

export const queryKeys = {
  services: ['services'],
  postmortems: ['postmortems'],
  topology: ['topology'],
  topologyGraph: ['topology', 'graph'],
  topologyDeps: ['topology', 'dependencies'],
  topologyConfig: ['topology', 'config'],
  teamInvites: ['team-invites'],
};

// Call after any edit that changes the service catalog or the topology.
export function invalidateTopologyAndServices(queryClient) {
  return Promise.all([
    queryClient.invalidateQueries({ queryKey: queryKeys.topology }),
    queryClient.invalidateQueries({ queryKey: queryKeys.services }),
  ]);
}
