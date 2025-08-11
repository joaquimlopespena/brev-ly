import { Copy, DownloadIcon, Trash2, Link } from "lucide-react";

export default function CardList() {
    const hasLinks = true;
    return (
        <div className="flex flex-col items-center justify-center bg-white w-full max-w-md h-auto rounded-lg p-4 md:p-8 shadow-lg">
            <div className="flex flex-row items-center justify-between w-full mb-6 border-b border-gray-200 pb-4">
                <h1 className="text-2xl font-bold">Meus links</h1>
                <button className="bg-gray-200 text-gray-500 p-2 h-10 rounded-lg text-sm hover:bg-gray-300 transition-all duration-300 flex items-center gap-2">
                    <DownloadIcon className="w-4 h-4" /> Baixar CSV
                </button>
            </div>
            <div className="flex flex-col items-center justify-center w-full">
                {hasLinks ? (
                    <>
                        <div className="flex flex-row items-center justify-between w-full border-b border-gray-200 my-3 pb-4">
                            <div className="flex flex-col flex-1 min-w-0">
                                <a href="#" className="text-sm text-blue-600 font-semibold underline text-ellipsis overflow-hidden whitespace-nowrap">brev.ly/Portfolio-Dev</a>
                                <p className="text-sm text-gray-500 text-ellipsis overflow-hidden whitespace-nowrap">devsite.portfolio.com.br/Portfolio-Dev</p>
                            </div>
                            <div className="flex flex-row items-center gap-3 ml-4">
                                <p className="text-sm text-gray-500">30 acessos</p>
                                <button className="bg-gray-200 text-gray-500 p-2 h-8 w-8 rounded-lg hover:bg-gray-300 transition-all duration-300 flex items-center justify-center">
                                    <Copy className="w-4 h-4" />
                                </button>
                                <button className="bg-gray-200 text-gray-500 p-2 h-8 w-8 rounded-lg hover:bg-gray-300 transition-all duration-300 flex items-center justify-center">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                        <div className="flex flex-row items-center justify-between w-full border-b border-gray-200 my-3 pb-4">
                            <div className="flex flex-col flex-1 min-w-0">
                                <a href="#" className="text-sm text-blue-600 font-semibold underline text-ellipsis overflow-hidden whitespace-nowrap">brev.ly/Portfolio-Dev</a>
                                <p className="text-sm text-gray-500 text-ellipsis overflow-hidden whitespace-nowrap">devsite.portfolio.com.br/Portfolio-Dev</p>
                            </div>
                            <div className="flex flex-row items-center gap-3 ml-4">
                                <p className="text-sm text-gray-500">30 acessos</p>
                                <button className="bg-gray-200 text-gray-500 p-2 h-8 w-8 rounded-lg hover:bg-gray-300 transition-all duration-300 flex items-center justify-center">
                                    <Copy className="w-4 h-4" />
                                </button>
                                <button className="bg-gray-200 text-gray-500 p-2 h-8 w-8 rounded-lg hover:bg-gray-300 transition-all duration-300 flex items-center justify-center">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center">
                        <Link className="w-10 h-10 mb-4 text-gray-500" />
                        <p className="text-sm text-gray-500">
                            Ainda não existem links cadastrados
                        </p>
                    </div>
                )}

            </div>
        </div>
    )
}