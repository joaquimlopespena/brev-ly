import { Copy, Trash2, Check } from "lucide-react";
import Button from "./Button";
import { useState } from "react";
import { ApiService } from "../services/api";

type ListProps = {
    id: string;
    shortLink: string;
    longLink: string;
    accessCount: number;
    onDelete: (id: string) => void;
}

export default function List({ id, shortLink, longLink, accessCount, onDelete }: ListProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        const baseUrl = window.location.origin;
        await navigator.clipboard.writeText(`${baseUrl}/${shortLink}`);
        
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleDelete = async () => {
        try {
            await ApiService.deleteLink(id);
            onDelete(id); // Remove o item da lista após deletar com sucesso
        } catch (error) {
            console.error('Erro ao deletar link:', error);
        }
    };

    return (
        <div className="grid grid-cols-[1fr_auto] gap-8 items-center w-full border-b border-gray-200 py-3" id={id}>
            <div className="min-w-0">
                <a href={`/${shortLink}`} className="text-sm text-blue-600 font-semibold underline block truncate" target="_blank">{shortLink}</a>
                <p className="text-sm text-gray-500 block truncate">{longLink}</p>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0 mr-2">
                <p className="text-sm text-gray-500 whitespace-nowrap">{accessCount} acessos</p>
                <Button 
                    className={`p-2 h-8 w-8 rounded-lg transition-all duration-300 flex items-center justify-center ${
                        copied 
                            ? 'bg-green-500 text-white' 
                            : 'bg-gray-200 text-gray-500 hover:bg-gray-300'
                    }`}
                    onClick={handleCopy}
                >
                    {copied ? <Check size={16} /> : <Copy size={16} />}
                </Button>
                <Button 
                    className="bg-gray-200 text-gray-500 p-2 h-8 w-8 rounded-lg hover:bg-gray-300 transition-all duration-300 flex items-center justify-center"
                    onClick={handleDelete}
                >
                    <Trash2 size={16} />
                </Button>
            </div>
        </div>
    )
}