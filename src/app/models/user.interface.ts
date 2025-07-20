export interface User {
    id: string;
    email: string;
    username: string;
    name?: string;
}

export interface AuthResponse {
    access_token: string;
    username: string;
}

/**
 * Interfaz para las credenciales de login
 */
export interface LoginCredentials {
  username: string;
  password: string;
}

/**
 * Interfaz para el registro
 */
export interface RegisterData {
  email: string;
  password: string;
  username: string;
  name?: string;
}