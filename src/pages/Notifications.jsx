import React from "react";
import { useSearchParams } from "react-router-dom";
import useOrgStore from "../stores/useOrgStore";
import SlackPanel from "../components/Integrations/SlackPanel";

// Notification destinations (where incident alerts go). Not an ingestion source.
const Notifications = () => {
  const { org } = useOrgStore();
  const [searchParams] = useSearchParams();
  return <SlackPanel orgId={org?.id} returnState={searchParams.get("slack")} />;
};

export default Notifications;
