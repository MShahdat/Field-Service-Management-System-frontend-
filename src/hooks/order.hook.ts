import { useQuery } from "@tanstack/react-query";
import { MyOrder, singleOrder } from "@/api";
import type { QueryParams } from "@/types";

export const useMyOrder = (params: QueryParams) => {
  return useQuery({
    queryKey: ["my-order", params],
    queryFn: () => MyOrder(params),
  });
};

export const useSingleOrder = (id: string) => {
  return useQuery({
    queryKey: ["single-order", id],
    queryFn: () => singleOrder(id),
  });
};
