import { DownloadIcon, Link } from "lucide-react";
import List from "./List";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import ListLink from "../utils/ListLink";

export default function CardList() {
    const hasLinks = true;

    const links = ListLink()
    console.log(links)
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
                    <ScrollArea.Root className="w-full">
                        <ScrollArea.Viewport className="h-[300px] w-full">
                            <div className="flex flex-col">
                                {links.map((item) => (
                                    <List key={item.id} id={item.id} shortLink={item.link} longLink={item.url} accessCount={item.accessCount} />
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