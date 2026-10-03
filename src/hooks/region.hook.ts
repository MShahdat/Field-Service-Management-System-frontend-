import { getRegions } from "@/api";
import { useQuery } from "@tanstack/react-query";

export const useGetRegions = () => {
  return useQuery({
    queryKey: ["regions"],
    queryFn: getRegions,
  });
};
