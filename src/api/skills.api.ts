import apiClient from "@/lib/apiClient";
import type { QueryParams } from "@/types";
import type { ISkillCreated, ISkillUpdated } from "@/types/skills.types";

//& public
export const getSkills = (params?: QueryParams) => {
  return apiClient("/skill/all", {
    params,
  });
};

//& admin
export const getAllSkills = (params: QueryParams) => {
  return apiClient("/skill/all-skill", {
    params,
  });
};

export const createSkill = (payload: ISkillCreated) => {
  return apiClient("/skill", {
    method: "POST",
    body: payload,
  });
};

export const updateSkill = (payload: ISkillUpdated, id: string) => {
  return apiClient(`/skill/${id}`, {
    method: "PUT",
    body: payload,
  });
};

export const skillStatusUpdate = (id: string) => {
  return apiClient(`/skill/${id}`, {
    method: "PATCH",
  });
};

export const skillDeleteUpdate = (id: string) => {
  return apiClient(`/skill/delete/${id}`, {
    method: "PATCH",
  });
};
