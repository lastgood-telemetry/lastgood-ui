import { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import useOrgStore from '../stores/useOrgStore';
import { rewindRequestParams } from '../util/rewind';

export const sameRewindScope = (left, right) => !!left && !!right &&
  JSON.stringify(rewindRequestParams(left)) === JSON.stringify(rewindRequestParams(right));

// Private, in-memory state survives sidebar navigation, not logout/page reload.
// The organization boundary prevents a retained brief crossing workspaces.
export default function useRewindSession(defaultSelection) {
  const client = useQueryClient();
  const orgId = useOrgStore(state => state.org?.id);
  const key = ['rewind-session', orgId];
  client.setQueryDefaults(['rewind-session'], { gcTime: Infinity });
  const [session, setSession] = useState(() => client.getQueryData(key) || {
    selection: defaultSelection, submitted: null, snapshot: null,
  });
  useEffect(() => {
    client.setQueryData(key, session);
  }, [client, orgId, session]);
  return [session, setSession];
}
