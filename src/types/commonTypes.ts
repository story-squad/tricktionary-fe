export interface HostPlayerProps {
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
