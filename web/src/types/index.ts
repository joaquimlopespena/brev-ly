// Tipos para o projeto de encurtador de URLs

export interface Link {
  id: string;
  name: string;
  url: string;
  createdAt: string;
  count_access: number;
}

export interface CreateLinkRequest {
  name: string;
  url: string;
}

export interface CreateLinkResponse {
  success: boolean;
  data?: Link;
  error?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
