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