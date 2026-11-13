
import { ISkills } from "./skills.types";

export interface ICategory {
  id: string;
  name: string;
  icon: string | null;
  description?: string;
  duration: number;
  isActive: boolean;
  skill: ISkills[]
}

export interface ICategoryCreate {
  name: string;
  icon?: string;
  description?: string;
  duration: number;
}

export interface ICategoryUpdate {
  name?: string;
  icon?: string;
  description?: string;
  duration?: number;
}
