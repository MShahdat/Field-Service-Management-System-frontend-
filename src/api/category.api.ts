import apiClient from "@/lib/apiClient";
import { QueryParams } from "@/types";

// export const createCategory = (payload: ICategoryPayload) => {
//   return apiClient(`/category`, {
//     method: 'POST',
//     body: payload
//   })
// }

export const getAllCategories = (params?: QueryParams) => {
  return apiClient("/category/all-category", {
    params,
  });
};
