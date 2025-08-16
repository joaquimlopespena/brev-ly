import type { CreateLinkRequest, Link, ApiResponse, ExportCSVResponse } from '../types';

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || '/api';

export class ApiService {
    private static async request<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<ApiResponse<T>> {
        try {
            const fullUrl = `${API_BASE_URL}${endpoint}`;
            console.log('🔍 DEBUG INFO:');
            console.log('  - API_BASE_URL:', API_BASE_URL);
            console.log('  - endpoint:', endpoint);
            console.log('  - fullUrl:', fullUrl);
            console.log('  - window.location.origin:', window.location.origin);
            console.log('🌐 Making request to:', fullUrl);
            console.log('🔧 Request options:', { method: options.method, headers: options.headers });
            
            const finalHeaders = {
                'Content-Type': 'application/json',
                ...options.headers,
            };
            
            console.log('🔧 Final headers:', finalHeaders);
            console.log('🔧 Request method:', options.method);
            console.log('🔧 Request body:', options.body);
            
            const response = await fetch(fullUrl, {
                headers: finalHeaders,
                ...options,
            });

            console.log('📡 Response status:', response.status);
            console.log('📡 Response headers:', Object.fromEntries(response.headers.entries()));
            
            if (!response.ok) {
                console.error('❌ HTTP Error:', response.status, response.statusText);
            }
            
            const data = await response.json();
            console.log('📦 API Response:', data);
            
            // Retorna a resposta da API mesmo em caso de erro HTTP
            return data;
        } catch (error) {
            console.error('❌ Request failed:', error);
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

    static async downloadCSV(): Promise<ExportCSVResponse> {
        const response = await this.request<ExportCSVResponse>(`/url/export`, {
            method: 'POST',
            body: JSON.stringify({})
        });
        return response as ExportCSVResponse;
    }
    static async getLink(name: string): Promise<Link> {
        const response = await this.request<Link>(`/${name}`);
        return response as unknown as Link;
    }

    static async deleteLink(id: string): Promise<ApiResponse<void>> {
        // Simula exatamente a requisição do curl que funciona
        const endpoint = `/url/delete/${id}`;
        console.log('🗑️ Delete endpoint:', endpoint);
        
        return this.request<void>(endpoint, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                // Removendo Content-Type para simular o curl
            },
        });
    }
}
