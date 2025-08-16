import { useEffect, useState } from "react";
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

    useEffect(() => {
        const fetchAndRedirect = async () => {
            if (!shortUrl) {
                setError("URL curta não fornecida");
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const response = await ApiService.getLink(shortUrl);
                console.log(response);
                
                if (response.url && response.url.trim() !== '') {
                    setLink(response);
                    // Aguarda um momento para mostrar a mensagem de redirecionamento
                    setTimeout(() => {
                        // Redireciona para a URL longa
                        window.location.href = response.url;
                    }, 2000);
                } else {
                    setError("Link não encontrado");
                }
            } catch (err) {
                setError("Erro ao buscar o link");
            } finally {
                setLoading(false);
            }
        };

        fetchAndRedirect();
    }, [shortUrl]);

    if (loading) {
        return (
            <Main align="center">
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
            <Main align="center">
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