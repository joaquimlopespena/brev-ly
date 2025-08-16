import type { CreateLinkRequest, CreateLinkResponse, Link, ApiResponse } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:3333';

export class ApiService {
    private static async request<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<ApiResponse<T>> {
        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers,
                },
                ...options,
            });

            const data = await response.json();
            console.log('API Response:', data);
            
            // Retorna a resposta da API mesmo em caso de erro HTTP
            return data;
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Erro desconhecido',
            };
        }
    }

    static async createLink(linkData: CreateLinkRequest): Promise<ApiResponse<Link>> {
        return this.request<Link>('/url/store', {
            method: 'POST',
            body: JSON.stringify(linkData),
        });
    }

    static async getLinks(): Promise<ApiResponse<Link[]>> {
        return this.request<Link[]>('/url');
    }

    static async getLink(id: string): Promise<ApiResponse<Link>> {
        return this.request<Link>(`/url/${id}`);
    }

    static async deleteLink(id: string): Promise<ApiResponse<void>> {
        return this.request<void>(`/url/delete/${id}`, {
            method: 'DELETE',
        });
    }
}
