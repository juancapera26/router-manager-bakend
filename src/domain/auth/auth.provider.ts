// domain/auth/auth.provider.ts
export interface AuthProvider {
  createUser(email: string, password: string): Promise<string>; // devuelve UID
  setRole(uid: string, role: string): Promise<void>;
}
