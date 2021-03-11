export interface HOCProps {
  children: React.ReactNode;
}

export interface DecodedToken {
  exp: number;
  ext: string;
  iat: number;
  lob: string;
  pid: string;
  sub: string;
}

export interface ReactionItem {
  id: number;
  content: string;
}

export type DoubleNumberDict = {
  [key: number]: { [key: number]: number };
};

export type StringStringDict = {
  [key: string]: string;
};

export type NumberNumberDict = {
  [key: number]: number;
};

export type StringNumberDict = {
  [key: string]: number;
};

export type NumberStringDict = {
  [key: number]: string;
};
