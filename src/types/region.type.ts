export interface IRegion {
  id: string;
  area: string;
  description: string;
  isActive: boolean;
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
