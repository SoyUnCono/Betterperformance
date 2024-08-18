export interface Entry {
  id: string;
  key: string;
  value: string;
}

export interface Regedit {
  id: string;
  path: string;
  entries: Entry[];
}

export interface FormValues {
  regedits: {
    path: string;
    entries: Entry[];
  }[];
}
