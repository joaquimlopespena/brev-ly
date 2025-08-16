import { useState } from 'react';
import { ApiService } from '../services/api';
import type { CreateLinkRequest } from '../types';

export default function Card() {
    const [formData, setFormData] = useState<CreateLinkRequest>({
        name: '',
        url: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const handleInputChange = (field: keyof CreateLinkRequest, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!formData.url.trim()) {
            setMessage({ type: 'error', text: 'Por favor, insira uma URL válida' });
            return;
        }

        if (!formData.name.trim()) {
            setMessage({ type: 'error', text: 'Por favor, insira um nome para o link' });
            return;
        }

        setIsLoading(true);
        setMessage(null);

        try {
            const response = await ApiService.createLink(formData);
            
            if (response.data?.id && response.data.id.trim() !== '') {
                setMessage({ type: 'success', text: 'Link criado com sucesso!' });
                setFormData({ name: '', url: '' });
            } else {
                console.log('Response completa:', response);
                const errorMessage = response.error || response.message || 'Erro ao criar link';
                setMessage({ type: 'error', text: errorMessage });
            }
        } catch (error) {
            console.log(error);
            setMessage({ type: 'error', text: 'Erro de conexão com a API' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col bg-white w-full max-w-md h-auto rounded-lg p-8 shadow-lg">
            <h1 className="text-2xl font-bold mb-8">Novo link</h1>
            
            {message && (
                <div className={`p-3 rounded-lg mb-4 text-sm ${
                    message.type === 'success' 
                        ? 'bg-green-100 text-green-800 border border-green-200' 
                        : 'bg-red-100 text-red-800 border border-red-200'
                }`}>
                    {message.text}
                </div>
            )}

            <div className="flex flex-col">
                <label htmlFor="name" className="text-sm text-gray-500 mb-2">Nome do link</label>
                <input 
                    type="text" 
                    id="name"
                    placeholder="meu-link" 
                    className="w-full p-2 rounded-lg border-2 border-gray-300 focus:border-[#2C46B1] focus:outline-none"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    required
                />
            </div>
            
            <div className="flex flex-col">
                <label htmlFor="url" className="text-sm text-gray-500 mt-4 mb-2">URL original</label>
                <input 
                    type="url" 
                    id="url"
                    placeholder="https://www.exemplo.com.br" 
                    className="w-full p-2 rounded-lg border-2 border-gray-300 focus:border-[#2C46B1] focus:outline-none"
                    value={formData.url}
                    onChange={(e) => handleInputChange('url', e.target.value)}
                    required
                />
            </div>
            
            <button 
                type="submit"
                disabled={isLoading}
                className={`bg-[#2C46B1] text-white p-2 h-12 rounded-lg mt-6 transition-all duration-300 ${
                    isLoading 
                        ? 'opacity-50 cursor-not-allowed' 
                        : 'hover:bg-[#2C46B1]/80'
                }`}
            >
                {isLoading ? 'Salvando...' : 'Salvar link'}
            </button>
        </form>
    );
}