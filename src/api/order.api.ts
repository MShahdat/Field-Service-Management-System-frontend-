import apiClient from "@/lib/apiClient";
import { QueryParams } from "@/types";



export const MyOrder = (params: QueryParams) => {
  return apiClient("/workorder/my-workorder", {
    params,
  });
};



export const singleOrder = (id: string) => {
  return apiClient(`/workorder/${id}`);
};