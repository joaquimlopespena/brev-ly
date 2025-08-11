// Tipos para o projeto de encurtador de URLs

export interface Link {
  id: string;
  originalUrl: string;
  shortUrl: string;
  createdAt: Date;
  accessCount: number;
  isActive: boolean;
}

export interface CreateLinkRequest {
  originalUrl: string;
  customShortUrl?: string;
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
