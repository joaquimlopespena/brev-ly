import Main from "../components/Main";
import notFound from '../assets/404.svg'

export default function NotFound() {
    return (
        <Main align="center">
            <div className="flex flex-col bg-white w-full mt-28  md:mt-44 md:max-w-1/2 h-auto rounded-lg p-8 shadow-lg justify-center items-center">
                <img src={notFound} alt="Subtract" className="w-50 h-30 mb-4" />
                <h1 className="text-2xl font-bold mb-8 text-center">Link não encontrado</h1>
                <div className="flex flex-col">
                    <p className="text-sm text-gray-500 mb-2 text-center">
                        O link que você está tentando acessar não existe, foi removido ou é <br />
                        uma URL inválida. Saiba mais em <a href="#" className="text-blue-600 underline hover:text-blue-800">brev.ly</a>
                    </p>
                </div>
            </div>
        </Main>
    )
}