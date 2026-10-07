import { useQuery } from "@tanstack/react-query";
import { getOrganization } from "../service/organization";
import useOrgStore from "../stores/useOrgStore";
import { useEffect } from "react";

export const useOrganization = () => {
  const { setOrg } = useOrgStore();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["organization"],
    queryFn: getOrganization,
    staleTime: 60 * 60 * 1000,
  });

  useEffect(() => {
    if (isLoading) return;

    if (data) {
      setOrg(data);
    }
  }, [data, isLoading, setOrg]);

  return { data, isLoading, error, refetch };
};
