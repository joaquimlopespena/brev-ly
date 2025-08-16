import { useState, useEffect } from 'react';
import { ApiService } from '../services/api';
import type { CreateLinkRequest } from '../types';

type CardFormProps = {
    onLinkCreated?: () => void;
};

export default function Card({ onLinkCreated }: CardFormProps) {
    const [formData, setFormData] = useState<CreateLinkRequest>({
        name: '',
        url: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [existingLinks, setExistingLinks] = useState<string[]>([]);
    const [isCheckingName, setIsCheckingName] = useState(false);

    const handleInputChange = (field: keyof CreateLinkRequest, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
        
        // Se o campo alterado for o nome, verificar duplicatas
        if (field === 'name' && value.trim()) {
            checkNameAvailability(value.trim());
        }
    };

    // Função para verificar se o nome já existe
    const checkNameAvailability = async (name: string) => {
        if (name.length < 2) return;
        
        setIsCheckingName(true);
        try {
            const response = await ApiService.getLinks();
            if (response.data && Array.isArray(response.data)) {
                const existingNames = response.data.map(link => link.name);
                setExistingLinks(existingNames);
            }
        } catch (error) {
            console.error('Erro ao verificar nomes existentes:', error);
        } finally {
            setIsCheckingName(false);
        }
    };

    // Validação de formato do nome (encurtamento)
    const validateNameFormat = (name: string): boolean => {
        // Deve conter apenas letras, números, hífens e underscores
        // Deve ter entre 2 e 50 caracteres
        const nameRegex = /^[a-zA-Z0-9_-]{2,50}$/;
        return nameRegex.test(name);
    };

    // Verificar se o nome já existe
    const isNameTaken = (name: string): boolean => {
        return existingLinks.includes(name);
    };

    // Carregar links existentes quando o componente for montado
    useEffect(() => {
        const loadExistingLinks = async () => {
            try {
                const response = await ApiService.getLinks();
                if (response.data && Array.isArray(response.data)) {
                    const existingNames = response.data.map(link => link.name);
                    setExistingLinks(existingNames);
                }
            } catch (error) {
                console.error('Erro ao carregar links existentes:', error);
            }
        };
        
        loadExistingLinks();
    }, []);

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

        // Validação de formato do nome
        if (!validateNameFormat(formData.name.trim())) {
            setMessage({ 
                type: 'error', 
                text: 'O nome deve conter apenas letras, números, hífens e underscores (2-50 caracteres)' 
            });
            return;
        }

        // Verificação de duplicatas
        if (isNameTaken(formData.name.trim())) {
            setMessage({ 
                type: 'error', 
                text: 'Este nome já está em uso. Escolha outro nome para o link.' 
            });
            return;
        }

        setIsLoading(true);
        setMessage(null);

        try {
            const response = await ApiService.createLink(formData);
            
            if (response.data?.id && response.data.id.trim() !== '') {
                setMessage({ type: 'success', text: 'Link criado com sucesso!' });
                setFormData({ name: '', url: '' });
                
                // Limpar a lista de nomes existentes para incluir o novo
                setExistingLinks(prev => [...prev, formData.name.trim()]);
                
                // Chamar o callback para atualizar a lista de links
                if (onLinkCreated) {
                    onLinkCreated();
                }
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
        <form onSubmit={handleSubmit} className="flex flex-col bg-white w-full md:w-1/2 h-auto rounded-lg p-8 shadow-lg">
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
                <div className="relative">
                    <input 
                        type="text" 
                        id="name"
                        placeholder="meu-link" 
                        className={`w-full p-2 rounded-lg border-2 focus:outline-none transition-colors ${
                            formData.name.trim() && !validateNameFormat(formData.name.trim())
                                ? 'border-red-300 focus:border-red-500'
                                : formData.name.trim() && isNameTaken(formData.name.trim())
                                ? 'border-red-300 focus:border-red-500'
                                : 'border-gray-300 focus:border-[#2C46B1]'
                        }`}
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        required
                    />
                    {isCheckingName && (
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#2C46B1]"></div>
                        </div>
                    )}
                </div>
                {formData.name.trim() && (
                    <div className="mt-1 text-xs">
                        {!validateNameFormat(formData.name.trim()) ? (
                            <span className="text-red-500">
                                Formato inválido. Use apenas letras, números, hífens e underscores (2-50 caracteres)
                            </span>
                        ) : isNameTaken(formData.name.trim()) ? (
                            <span className="text-red-500">
                                Este nome já está em uso
                            </span>
                        ) : (
                            <span className="text-green-500">
                                Nome disponível ✓
                            </span>
                        )}
                    </div>
                )}
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