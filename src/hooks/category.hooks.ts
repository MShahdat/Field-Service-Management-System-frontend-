import { getAllCategories } from "@/api";
import { QueryParams } from "@/types";
import { useQuery } from "@tanstack/react-query";

// export const useCategoryCreate = () => {
//   const queryClient = useQueryClient()
//   return useQuery({
//     queryKey: ''
//   })
// }

export const useGetAllCategories = (params?: QueryParams) => {
  return useQuery({
    queryKey: ["all-categories", params],
    queryFn: () => getAllCategories(params),
  });
};
