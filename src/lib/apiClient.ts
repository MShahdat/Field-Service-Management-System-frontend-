import { ofetch } from "ofetch";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL_API;

const apiClient = ofetch.create({
  baseURL: BASE_URL,
  credentials: "include",
  onResponseError({ response }) {
    const errorData = response._data as { message?: string } | undefined;

    if (errorData?.message) {
      throw new Error(errorData.message);
    }
  },
});

export default apiClient;
