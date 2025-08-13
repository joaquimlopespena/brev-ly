export default function Card() {
    return (
        <div className="flex flex-col bg-white w-full max-w-md h-auto rounded-lg p-8 shadow-lg">
            <h1 className="text-2xl font-bold mb-8">Novo link</h1>
            <div className="flex flex-col">
                <label htmlFor="url" className="text-sm text-gray-500 mb-2">Link original</label>
                <input type="text" placeholder="www.exemplo.com.br" className="w-full p-2 rounded-lg border-2 border-gray-300" />
            </div>
            <div className="flex flex-col">
                <label htmlFor="url" className="text-sm text-gray-500 mt-4 mb-2">Link encurtado </label>
                <input type="text" placeholder="brev.ly/" className="w-full p-2 rounded-lg border-2 border-gray-300" />
            </div>
            <button className="bg-[#2C46B1] text-white p-2 h-12 rounded-lg mt-6 hover:bg-[#2C46B1]/80 transition-all duration-300">Salvar link</button>
        </div>
    )
}