import { ITechnician } from "./technician.types";

export interface ISkills {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  categoryId: string;
  isDelete: boolean;
  isActive: boolean;
  category: {
    id: string;
    name: string;
    icon?: string;
  };
  technician: ITechnician[]
}

export interface ISkillCreated {
  name: string;
  icon?: string;
  description?: string;
  categoryId: string;
}

export interface ISkillUpdated {
  name?: string;
  icon?: string;
  description?: string;
  categoryId?: string;
}
