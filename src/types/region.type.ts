import type { IManager } from "./manager.types";
import type { ITechnician } from "./technician.types";

export interface IRegion {
  id: string;
  area: string;
  description: string;
  isActive: boolean;
  manager?: IManager[];
  technicians?: ITechnician[];
}

export interface IRegionCreate {
  area: string;
  description: string;
}

export interface IRegionUpdate {
  id: string;
  area: string;
  description: string;
}
