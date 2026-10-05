import apiClient from "@/lib/apiClient";
import { ICategoryCreate, ICategoryUpdate, QueryParams } from "@/types";

export const createCategory = (payload: ICategoryCreate) => {
  return apiClient(`/category`, {
    method: "POST",
    body: payload,
  });
};

//& public
export const getCategories = (params?: QueryParams) => {
  return apiClient("/category/all", {
    params,
  });
};

//& admin
export const getAllCategories = (params?: QueryParams) => {
  return apiClient("/category/all-category", {
    params,
  });
};

export const updateCategory = (payload: ICategoryUpdate, id: string) => {
  return apiClient(`/category/${id}`, {
    method: "PUT",
    body: payload,
  });
};

export const deactiveCategory = (id: string) => {
  return apiClient(`/category/${id}`, {
    method: "PATCH",
  });
};
