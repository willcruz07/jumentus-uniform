import * as React from 'react';
import { uniformService } from '../services/uniformService';
import { signInAnonymous } from '../config/firebase';
import type { UniformFormData } from '../types/uniform';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Loader2, Users, Trophy, Shirt } from 'lucide-react';

interface UniformsListProps {
  onBack: () => void;
}

const UniformsList: React.FC<UniformsListProps> = ({ onBack }) => {
  const [uniformes, setUniformes] = React.useState<UniformFormData[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchUniforms = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Fazer login anônimo se necessário
        await signInAnonymous();
        
        // Buscar todos os uniformes
        const data = await uniformService.getAllUniforms();
        
        // Ordenar por número da camisa
        const sortedData = data.sort((a, b) => a.numero - b.numero);
        
        setUniformes(sortedData);
      } catch (err) {
        console.error('Erro ao carregar uniformes:', err);
        setError('Erro ao carregar os uniformes. Tente novamente.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUniforms();
  }, []);

  const getStatsData = () => {
    const totalJogadores = uniformes.filter(u => u.tipo === 'Jogador').length;
    const totalGoleiros = uniformes.filter(u => u.tipo === 'Goleiro').length;
    const tamanhos = uniformes.reduce((acc, u) => {
      acc[u.tamanho] = (acc[u.tamanho] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return { totalJogadores, totalGoleiros, tamanhos };
  };

  const stats = getStatsData();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-[#D4B301] mx-auto mb-4" />
          <p className="text-white text-lg">Carregando uniformes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={onBack}
              className="px-4 py-2 bg-[#D4B301] text-[#16181a] rounded-lg font-medium hover:bg-[#B89400] transition-colors"
            >
              Voltar
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Uniformes Cadastrados</h1>
          <p className="text-gray-300">Total de {uniformes.length} uniformes</p>
          
          {/* Botão Voltar */}
          <button
            onClick={onBack}
            className="mt-4 px-6 py-2 bg-[#D4B301] text-[#16181a] rounded-xl font-bold hover:bg-[#B89400] transition-all duration-200 transform hover:scale-105"
          >
            ← Voltar ao Cadastro
          </button>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white/90">
            <CardContent className="p-6 text-center">
              <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <h3 className="text-2xl font-bold text-gray-800">{stats.totalJogadores}</h3>
              <p className="text-gray-600">Jogadores</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white/90">
            <CardContent className="p-6 text-center">
              <Trophy className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <h3 className="text-2xl font-bold text-gray-800">{stats.totalGoleiros}</h3>
              <p className="text-gray-600">Goleiros</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white/90">
            <CardContent className="p-6 text-center">
              <Shirt className="w-8 h-8 text-[#D4B301] mx-auto mb-2" />
              <h3 className="text-2xl font-bold text-gray-800">{uniformes.length}</h3>
              <p className="text-gray-600">Total</p>
            </CardContent>
          </Card>
        </div>

        {/* Lista de Uniformes */}
        {uniformes.length === 0 ? (
          <Card className="bg-white/90">
            <CardContent className="p-8 text-center">
              <Shirt className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">Nenhum uniforme cadastrado</h3>
              <p className="text-gray-500">Cadastre o primeiro uniforme para começar!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {uniformes.map((uniforme) => (
              <Card 
                key={`${uniforme.nome}-${uniforme.numero}`} 
                className={`bg-white/90 hover:bg-white/95 transition-all duration-200 transform hover:scale-105 border-2 ${
                  uniforme.tipo === 'Jogador' 
                    ? 'hover:border-blue-300' 
                    : 'hover:border-green-300'
                }`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg ${
                      uniforme.tipo === 'Jogador' ? 'bg-blue-600' : 'bg-green-600'
                    }`}>
                      {uniforme.numero}
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                      uniforme.tipo === 'Jogador' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {uniforme.tipo}
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <div className="space-y-2">
                    <div>
                      <h3 className="font-bold text-gray-800 text-lg leading-tight">
                        {uniforme.nome}
                      </h3>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Tamanho:</span>
                      <span className="font-semibold text-gray-800 bg-gray-100 px-2 py-1 rounded">
                        {uniforme.tamanho}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Distribuição de Tamanhos */}
        {uniformes.length > 0 && (
          <Card className="bg-white/90 mt-8">
            <CardHeader>
              <CardTitle className="text-center text-gray-800">Distribuição de Tamanhos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-5 gap-4">
                {(['PP', 'P', 'M', 'G', 'GG'] as const).map(tamanho => (
                  <div key={tamanho} className="text-center">
                    <div className="bg-[#D4B301] text-[#16181a] rounded-lg p-3 mb-2">
                      <div className="text-2xl font-bold">{stats.tamanhos[tamanho] || 0}</div>
                    </div>
                    <div className="text-sm font-medium text-gray-700">{tamanho}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default UniformsList;
