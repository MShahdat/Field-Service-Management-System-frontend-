import apiClient from "@/lib/apiClient";

export const updateProfileImg = (payload: File) => {
  const formData = new FormData();
  formData.append("profile", payload);

  return apiClient("/user/profile-image", {
    method: "PATCH",
    body: formData,
  });
};
