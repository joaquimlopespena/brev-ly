import Button from './Button';
import { DownloadIcon, Copy, Trash2, Plus } from 'lucide-react';

export default function ButtonTest() {
    return (
        <div className="p-6 space-y-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800">Teste de Centralização - Button Component</h2>
            
            {/* Botão com ícone à esquerda e texto */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-700">Botão com Ícone à Esquerda + Texto</h3>
                <div className="flex gap-3 flex-wrap">
                    <Button variant="secondary" size="md" icon={<DownloadIcon />}>
                        Baixar CSV
                    </Button>
                    <Button variant="primary" size="md" icon={<Plus />}>
                        Adicionar
                    </Button>
                </div>
            </div>

            {/* Botão com ícone à direita e texto */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-700">Botão com Ícone à Direita + Texto</h3>
                <div className="flex gap-3 flex-wrap">
                    <Button variant="secondary" size="md" icon={<DownloadIcon />} iconPosition="right">
                        Baixar CSV
                    </Button>
                    <Button variant="primary" size="md" icon={<Plus />} iconPosition="right">
                        Adicionar
                    </Button>
                </div>
            </div>

            {/* Botões apenas com ícones (como na List) */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-700">Botões Apenas com Ícones</h3>
                <div className="flex gap-3 flex-wrap">
                    <Button 
                        icon={<Copy />}
                        className="bg-gray-200 text-gray-500 p-2 h-8 w-8 rounded-lg hover:bg-gray-300 transition-all duration-300 flex items-center justify-center"
                    />
                    <Button 
                        icon={<Trash2 />}
                        className="bg-gray-200 text-gray-500 p-2 h-8 w-8 rounded-lg hover:bg-gray-300 transition-all duration-300 flex items-center justify-center"
                    />
                </div>
            </div>

            {/* Comparação com layout original */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-700">Layout Original vs Novo</h3>
                <div className="grid grid-cols-2 gap-8">
                    <div>
                        <h4 className="font-medium text-gray-600 mb-2">Antes (HTML direto)</h4>
                        <button className="bg-gray-200 text-gray-500 p-2 h-8 w-8 rounded-lg hover:bg-gray-300 transition-all duration-300 flex items-center justify-center">
                            <Copy className="w-4 h-4" />
                        </button>
                    </div>
                    <div>
                        <h4 className="font-medium text-gray-600 mb-2">Agora (Componente Button)</h4>
                        <Button 
                            icon={<Copy />}
                            className="bg-gray-200 text-gray-500 p-2 h-8 w-8 rounded-lg hover:bg-gray-300 transition-all duration-300 flex items-center justify-center"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
