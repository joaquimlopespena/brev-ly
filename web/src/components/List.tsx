import { Copy, Trash2 } from "lucide-react";

type ListProps = {
    id: string;
    shortLink: string;
    longLink: string;
    accessCount: number;
}

export default function List({ id, shortLink, longLink, accessCount }: ListProps) {
    return (
        <div className="grid grid-cols-[1fr_auto] gap-8 items-center w-full border-b border-gray-200 py-3" id={id}>
            <div className="min-w-0">
                <a href={`${import.meta.env.VITE_API_URL}/${shortLink}`} className="text-sm text-blue-600 font-semibold underline block truncate">{shortLink}</a>
                <p className="text-sm text-gray-500 block truncate">{longLink}</p>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0 mr-2">
                <p className="text-sm text-gray-500 whitespace-nowrap">{accessCount} acessos</p>
                <button className="bg-gray-200 text-gray-500 p-2 h-8 w-8 rounded-lg hover:bg-gray-300 transition-all duration-300 flex items-center justify-center">
                    <Copy className="w-4 h-4" />
                </button>
                <button className="bg-gray-200 text-gray-500 p-2 h-8 w-8 rounded-lg hover:bg-gray-300 transition-all duration-300 flex items-center justify-center">
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>
        </div>
    )
}