interface Address {
  [key: string]: string;
}

export interface IManagerApplyPayload {
  user: {
    name: string;
    email: string;
  };
  manager: {
    phone: string;
    address: Address;
    nid: string;
    region: string[];
  };
}
