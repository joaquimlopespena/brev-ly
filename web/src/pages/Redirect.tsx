import Main from "../components/Main";
import subtract from '../assets/subtract.png'

export default function Redirect() {
    return (
        <Main align="center">
            <div className="flex flex-col bg-white w-full mt-28  md:mt-44 max-w-1/2 h-auto rounded-lg p-8 shadow-lg justify-center items-center">
                <img src={subtract} alt="Subtract" className="w-9 h-9 mb-8" />
            
                <h1 className="text-2xl font-bold mb-8">Redirecionando...</h1>
                <div className="flex flex-col">
                    <p className="text-sm text-gray-500 mb-2 text-center">
                        O link será aberto automaticamente em alguns instantes. <br />
                        Não foi redirecionado? <a href="#" className="text-blue-600 underline hover:text-blue-800">Acesse aqui</a>
                    </p>
                </div>
            </div>
        </Main>
    )
}