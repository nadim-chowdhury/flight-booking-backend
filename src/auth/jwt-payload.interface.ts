export interface JwtPayload {
  email: string;
  sub: number; // User's ID
  roles?: string[]; // Optional roles array
}
