/**
 * Interfaz para los links del usuario
 */
export interface Link {
  sort(arg0: (a: { order: number; }, b: { order: number; }) => number): Link[];
  id: string;
  title: string;
  url: string;
  click_count: number;
  order: number;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Interfaz para crear/editar un link
 */
export interface LinkData {
  title: string;
  url: string;
  order?: number;
}

/**
 * Interfaz para la respuesta de la API
 */
export interface ApiResponse<T> {
  sort(arg0: (a: any, b: any) => number): Link[];
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}