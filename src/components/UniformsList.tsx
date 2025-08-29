import * as React from 'react';
import { uniformService } from '../services/uniformService';
import { signInAnonymous } from '../config/firebase';
import type { UniformFormData } from '../types/uniform';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Loader2, Users, Trophy, Shirt, FileText, Download, Printer } from 'lucide-react';
import { downloadSimpleUniformsPDF, printSimpleUniformsPDF, generateSimpleUniformsPDF } from '../utils/simplePdfGenerator';

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

  const handleDownloadPDF = () => {
    downloadSimpleUniformsPDF(uniformes);
  };

  const handlePrintPDF = () => {
    printSimpleUniformsPDF(uniformes);
  };

  const handleDownloadJogadoresOnly = () => {
    const jogadores = uniformes.filter(u => u.tipo === 'Jogador');
    const doc = generateSimpleUniformsPDF(jogadores, { 
      title: 'Lista de Jogadores - Jumentus SC',
      showStats: false 
    });
    doc.save('jogadores-jumentus.pdf');
  };

  const handleDownloadGoleirosOnly = () => {
    const goleiros = uniformes.filter(u => u.tipo === 'Goleiro');
    const doc = generateSimpleUniformsPDF(goleiros, { 
      title: 'Lista de Goleiros - Jumentus SC',
      showStats: false 
    });
    doc.save('goleiros-jumentus.pdf');
  };

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
          
          {/* Botões de Ação */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-6">
            <button
              onClick={onBack}
              className="px-6 py-2 bg-[#D4B301] text-[#16181a] rounded-xl font-bold hover:bg-[#B89400] transition-all duration-200 transform hover:scale-105"
            >
              ← Voltar ao Cadastro
            </button>
            
            {uniformes.length > 0 && (
              <div className="flex gap-3">
                <Button
                  onClick={handleDownloadPDF}
                  variant="outline"
                  className="bg-white/90 hover:bg-white text-gray-800 border-gray-300 font-medium"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Baixar PDF
                </Button>
                
                <Button
                  onClick={handlePrintPDF}
                  variant="outline"
                  className="bg-white/90 hover:bg-white text-gray-800 border-gray-300 font-medium"
                >
                  <Printer className="w-4 h-4 mr-2" />
                  Imprimir
                </Button>
              </div>
            )}
          </div>
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

        {/* Opções de Exportação Avançadas */}
        {uniformes.length > 0 && (
          <Card className="bg-white/90 mt-8">
            <CardHeader>
              <CardTitle className="text-center text-gray-800 flex items-center justify-center">
                <FileText className="w-5 h-5 mr-2" />
                Opções de Exportação
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <h4 className="font-semibold text-gray-700 mb-2">Lista Completa</h4>
                  <p className="text-sm text-gray-600 mb-4">
                    Todos os uniformes em uma única lista
                  </p>
                  <div className="flex gap-2 justify-center">
                    <Button
                      onClick={handleDownloadPDF}
                      size="sm"
                      className="bg-[#D4B301] hover:bg-[#B89400] text-[#16181a]"
                    >
                      <Download className="w-3 h-3 mr-1" />
                      PDF
                    </Button>
                    <Button
                      onClick={handlePrintPDF}
                      size="sm"
                      variant="outline"
                      className="border-[#D4B301] text-[#D4B301] hover:bg-[#D4B301] hover:text-[#16181a]"
                    >
                      <Printer className="w-3 h-3 mr-1" />
                      Imprimir
                    </Button>
                  </div>
                </div>

                <div className="text-center">
                  <h4 className="font-semibold text-blue-700 mb-2">Apenas Jogadores</h4>
                  <p className="text-sm text-gray-600 mb-4">
                    Lista contendo apenas jogadores ({stats.totalJogadores})
                  </p>
                  <Button
                    onClick={handleDownloadJogadoresOnly}
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    disabled={stats.totalJogadores === 0}
                  >
                    <Download className="w-3 h-3 mr-1" />
                    PDF Jogadores
                  </Button>
                </div>

                <div className="text-center">
                  <h4 className="font-semibold text-green-700 mb-2">Apenas Goleiros</h4>
                  <p className="text-sm text-gray-600 mb-4">
                    Lista contendo apenas goleiros ({stats.totalGoleiros})
                  </p>
                  <Button
                    onClick={handleDownloadGoleirosOnly}
                    size="sm"
                    className="bg-green-600 hover:bg-green-700 text-white"
                    disabled={stats.totalGoleiros === 0}
                  >
                    <Download className="w-3 h-3 mr-1" />
                    PDF Goleiros
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default UniformsList;
