import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createSkill,
  getAllSkills,
  getSkills,
  skillDeleteUpdate,
  skillStatusUpdate,
  updateSkill,
} from "@/api";
import type { QueryParams } from "@/types";

//& public (technician profile complete form)
export const useGetSkills = (params?: QueryParams) => {
  return useQuery({
    queryKey: ["skills", params],
    queryFn: () => getSkills(params),
  });
};

export const useGetAllSkills = (params: QueryParams) => {
  return useQuery({
    queryKey: ["all-skills", params],
    queryFn: () => getAllSkills(params),
  });
};

export const useSkillCreate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createSkill,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["all-skills"],
      });
    },
  });
};

export const useUpdateSkill = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      payload,
      id,
    }: {
      payload: Parameters<typeof updateSkill>[0];
      id: Parameters<typeof updateSkill>[1];
    }) => updateSkill(payload, id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["all-skills"],
      });
    },
  });
};

export const useSkillStatusUpdate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => skillStatusUpdate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["all-skills"],
      });
    },
  });
};

export const useSkillDeleteUpdate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => skillDeleteUpdate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["all-skills"],
      });
    },
  });
};
