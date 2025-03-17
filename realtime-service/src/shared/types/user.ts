export interface User {
  id: string | null;
  username: string;
  email: string;
  full_name: string | null;
  address: string | null;
}

export interface DecodedToken {
  id: string
  username: string
  iat?: number
  exp?: number
}
