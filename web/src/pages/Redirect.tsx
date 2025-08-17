import { useEffect, useState, useRef, useCallback } from "react";
import { useParams } from "react-router-dom";
import Main from "../components/Main";
import subtract from '../assets/subtract.png';
import { ApiService } from "../services/api";
import type { Link } from "../types";
import NotFound from "./NotFound";

export default function Redirect() {
    const { shortUrl } = useParams<{ shortUrl: string }>();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [link, setLink] = useState<Link | null>(null);
    const [redirecting, setRedirecting] = useState(false);
    
    // Refs para controlar execução única
    const hasExecutedRef = useRef(false);
    const redirectAttemptedRef = useRef(false);
    const timeoutRef = useRef<number | null>(null);

    // Função de redirecionamento que só executa uma vez
    const performRedirect = useCallback((url: string) => {
        if (redirectAttemptedRef.current) return;
        
        redirectAttemptedRef.current = true;
        console.log('🔄 Redirecionando para:', url);
        
        // Aqui você pode descomentar para ativar o redirecionamento automático
        window.location.href = url;
    }, []);

    // Função principal que busca o link e configura o redirecionamento
    const fetchAndSetupRedirect = useCallback(async () => {
        if (!shortUrl || hasExecutedRef.current) {
            return;
        }

        hasExecutedRef.current = true;
        console.log('🔍 Buscando link:', shortUrl);

        try {
            setLoading(true);
            const response = await ApiService.getLink(shortUrl);
            console.log('📡 Resposta da API:', response);
            
            if (response.url && response.url.trim() !== '') {
                setLink(response);
                setRedirecting(true);
                
                // Configura o redirecionamento automático após 2 segundos
                timeoutRef.current = setTimeout(() => {
                    performRedirect(response.url);
                }, 2000);
            } else {
                setError("Link não encontrado");
            }
        } catch (err) {
            console.error('❌ Erro ao buscar link:', err);
            setError("Erro ao buscar o link");
        } finally {
            setLoading(false);
        }
    }, [shortUrl, performRedirect]);
    // useEffect principal - executa apenas uma vez
    useEffect(() => {
        fetchAndSetupRedirect();

        // Cleanup function
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [fetchAndSetupRedirect]);

    // Cleanup quando o componente é desmontado
    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    if (loading) {
        return (
            <Main>
                <div className="flex flex-col bg-white w-full mt-28 md:mt-44 md:max-w-1/2 h-auto rounded-lg p-8 shadow-lg justify-center items-center">
                    <img src={subtract} alt="Subtract" className="w-9 h-9 mb-8" />
                    <h1 className="text-2xl font-bold mb-8">Redirecionando...</h1>
                    <div className="flex flex-col">
                        <p className="text-sm text-gray-500 mb-2 text-center">
                            O link será aberto automaticamente em alguns instantes.
                        </p>
                    </div>
                </div>
            </Main>
        );
    }

    if (error) {
        return <NotFound />;
    }

    if (link) {
        return (
            <Main>
                <div className="flex flex-col bg-white w-full mt-28 md:mt-44 md:max-w-1/2 h-auto rounded-lg p-8 shadow-lg justify-center items-center">
                    <img src={subtract} alt="Subtract" className="w-9 h-9 mb-8" />
                    <h1 className="text-2xl font-bold mb-8">Redirecionando...</h1>
                    <div className="flex flex-col">
                        <p className="text-sm text-gray-500 mb-2 text-center">
                            Redirecionando para: <br />
                            <span className="text-blue-600 font-medium">{link.name}</span>
                        </p>
                        <p className="text-sm text-gray-500 mb-4 text-center">
                            O link será aberto automaticamente em alguns instantes. <br />
                            Não foi redirecionado? 
                            <a 
                                href={link.url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-blue-600 underline hover:text-blue-800 ml-1"
                            >
                                Acesse aqui
                            </a>
                        </p>
                    </div>
                </div>
            </Main>
        );
    }

    return null;
}