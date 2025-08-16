import { DownloadIcon, Link as LinkIcon } from "lucide-react";
import List from "./List";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import { ApiService } from "../services/api";
import { useEffect, useState } from "react";
import type { Link } from "../types";
import Button from "./Button";

export default function CardList() {
    const [links, setLinks] = useState<Link[]>([]);
    const [refreshKey, setRefreshKey] = useState(0);
    const hasLinks = links.length > 0;

    const handleDelete = (id: string) => {
        setLinks(prevLinks => prevLinks.filter(link => link.id !== id));
    };

    // Função para forçar atualização da lista
    const refreshLinks = () => {
        setRefreshKey(prev => prev + 1);
    };

    const handleDownloadCSV = async () => {
        try {
            const response = await ApiService.downloadCSV();
            console.log(response);
            
            if (response.url) {
                // Abre o link de download em uma nova aba
                window.open(response.url, '_blank');
            } else {
                console.error('Erro ao exportar CSV:', response.error || response.message);
                // Aqui você pode adicionar uma notificação de erro para o usuário
            }
        } catch (error) {
            console.error('Erro ao exportar CSV:', error);
        }
    }

    useEffect(() => {
        const fetchLinks = async () => {
            try {
                const response = await ApiService.getLinks();
                
                if (response.data && Array.isArray(response.data) && response.data.length > 0) {
                    setLinks(response.data);
                } else {
                    console.log('Response completa:', response);
                }
            } catch (error) {
                console.log(error);
            }
                
            console.log(links);
        };
        
        fetchLinks();
    }, [refreshKey]); // Adicionar refreshKey como dependência
    
    return (
        <div className="flex flex-col items-center justify-center bg-white w-full md:w-1/2 h-auto rounded-lg p-4 md:p-8 shadow-lg">
            <div className="flex flex-row items-center justify-between w-full mb-6 border-b border-gray-200 pb-4">
                <h1 className="text-2xl font-bold">Meus links</h1>
                <Button variant="secondary" size="md" onClick={handleDownloadCSV} >
                    <DownloadIcon className="w-4 h-4 mr-2" />
                    Baixar CSV
                </Button>
            </div>
            <div className="flex flex-col items-center justify-center w-full">
                {hasLinks ? (
                    <ScrollArea.Root className="w-full">
                        <ScrollArea.Viewport className="h-[300px] w-full">
                            <div className="flex flex-col">
                                {links.map((item) => (
                                    <List 
                                        key={item.id} 
                                        id={item.id} 
                                        shortLink={item.name} 
                                        longLink={item.url} 
                                        accessCount={item.count_access}
                                        onDelete={handleDelete}
                                    />
                                ))}
                            </div>
                        </ScrollArea.Viewport>
                        <ScrollArea.Scrollbar 
                            orientation="vertical" 
                            className="!flex !w-2 !touch-none !select-none !bg-gray-100 !rounded-full !p-0.5 hover:!bg-gray-200 !transition-colors !duration-200"
                        >
                            <ScrollArea.Thumb className="!flex-1 !bg-gray-300 !rounded-full hover:!bg-gray-400 !transition-colors !duration-200" />
                        </ScrollArea.Scrollbar>
                        <ScrollArea.Corner className="!bg-gray-100" />
                    </ScrollArea.Root>
                    
                ) : (
                    <div className="flex flex-col items-center justify-center">
                        <LinkIcon className="w-10 h-10 mb-4 text-gray-500" />
                        <p className="text-sm text-gray-500">
                            Ainda não existem links cadastrados
                        </p>
                    </div>
                )}

            </div>
        </div>
    )
}