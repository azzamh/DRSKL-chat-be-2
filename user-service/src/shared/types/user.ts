export interface User {
  id: string | null;
  username: string;
  email: string;
  full_name: string | null;
  address: string | null;
}

export interface DecodedToken {
  id: number
  iat?: number
  exp?: number
}
