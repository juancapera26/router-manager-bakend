// domain/auth/auth.provider.ts
export interface AuthProvider {
  createUser(correo: string, contrasena: string): Promise<string>; // devuelve UID
  setRole(uid: string, role: string): Promise<void>;
}
