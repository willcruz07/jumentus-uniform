import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { uniformSchema } from '../schemas/uniformSchema';
import type { UniformFormData } from '../types/uniform';
import { uniformService } from '../services/uniformService';
import { signInAnonymous } from '../config/firebase';
import { CheckCircle, AlertCircle, Loader2, XCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Button } from './ui/button';
import jogador1 from '../assets/jogador-1.jpg';
import jogador2 from '../assets/jogador-2.jpg';
import logo from '../assets/jumentus.png';
import Modal from './ui/modal';

const UniformForm: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [tipoSelecionado, setTipoSelecionado] = useState<'Jogador' | 'Goleiro' | null>(null);
  
  // Estados para validação do número
  const [numberValidation, setNumberValidation] = useState<{
    status: 'idle' | 'checking' | 'available' | 'unavailable';
    message: string;
    existingAthlete?: string;
  }>({ status: 'idle', message: '' });

  // Estados para o modal de confirmação
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [submittedData, setSubmittedData] = useState<UniformFormData | null>(null);

  // Debug das imagens
  useEffect(() => {
    console.log('Jogador 1:', jogador1);
    console.log('Jogador 2:', jogador2);
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<UniformFormData>({
    resolver: zodResolver(uniformSchema),
    mode: 'onChange',
    defaultValues: {
      tamanho: undefined,
      nome: '',
      tipo: undefined,
      numero: undefined,
    },
  });

  const watchedTipo = watch('tipo');
  const watchedNumero = watch('numero');
  const watchedNome = watch('nome');
  const watchedTamanho = watch('tamanho');

  useEffect(() => {
    setTipoSelecionado(watchedTipo || null);
  }, [watchedTipo]);

  // Validação em tempo real do número
  useEffect(() => {
    if (watchedNumero && watchedNumero > 0 && watchedNumero <= 99) {
      console.log(`🔄 Iniciando verificação do número: ${watchedNumero}`);
      
      const checkNumber = async () => {
        setNumberValidation({ status: 'checking', message: 'Verificando disponibilidade...' });
        
        try {
          console.log(`📡 Chamando API para verificar número ${watchedNumero}`);
          const result = await uniformService.checkNumberAvailability(watchedNumero, watchedNome);
          
          console.log(`📋 Resultado da verificação:`, result);
          
          if (result.available) {
            setNumberValidation({
              status: 'available',
              message: '✅ Número disponível!'
            });
          } else {
            setNumberValidation({
              status: 'unavailable',
              message: `❌ Número já escolhido por ${result.existingAthlete}`,
              existingAthlete: result.existingAthlete
            });
          }
        } catch (error) {
          console.error('❌ Erro na verificação:', error);
          setNumberValidation({
            status: 'unavailable',
            message: '❌ Erro ao verificar número'
          });
        }
      };

      // Debounce de 500ms para evitar muitas chamadas
      const timeoutId = setTimeout(checkNumber, 500);
      return () => clearTimeout(timeoutId);
    } else {
      setNumberValidation({ status: 'idle', message: '' });
    }
  }, [watchedNumero, watchedNome]);

  // Verificar se o formulário está válido
  const isFormValid = () => {
    return (
      watchedTamanho &&
      watchedNome &&
      watchedTipo &&
      watchedNumero &&
      numberValidation.status === 'available' &&
      Object.keys(errors).length === 0
    );
  };

  const onSubmit = async (data: UniformFormData) => {
    if (!isFormValid()) {
      return;
    }

    setIsLoading(true);
    setSubmitStatus('idle');
    setMessage('');

    try {
      // Fazer login anônimo
      await signInAnonymous();
      
      // Salvar uniforme
      await uniformService.saveUniform(data);
      
      setSubmitStatus('success');
      setMessage('Uniforme salvo com sucesso!');
      reset();
      setNumberValidation({ status: 'idle', message: '' });
      setSubmittedData(data); // Armazena os dados submetidos
      setShowSuccessModal(true); // Abre o modal de sucesso
    } catch (error) {
      console.error('Erro ao salvar:', error);
      setSubmitStatus('error');
      setMessage('Erro ao salvar uniforme. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const closeSuccessModal = () => {
    setShowSuccessModal(false);
    setSubmittedData(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">
      <div className="absolute inset-0 flex overflow-hidden">

        <div 
          className={`w-full md:w-1/2 transition-all duration-700 relative ${
            tipoSelecionado === 'Jogador' 
              ? 'filter-none opacity-100' 
              : 'filter grayscale blur-sm opacity-30 hidden md:block'
          } ${tipoSelecionado === null ? '!block' : ''}`}
        >
          <img 
            src={jogador1} 
            alt="Jogador" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent" />
        </div>
        
        <div 
          className={`w-full md:w-1/2 transition-all duration-700 relative ${
            tipoSelecionado === 'Goleiro' 
              ? 'filter-none opacity-100' 
              : 'filter grayscale blur-sm opacity-30 hidden md:block'
          } ${tipoSelecionado === null ? '!block' : ''}`}
        >
          <img 
            src={jogador2} 
            alt="Goleiro" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-l from-black/80 to-transparent" />
        </div>
      </div>

      <div className=" relative z-10 w-full max-w-2xl rounded-2xl bg-transparent">
        <Card className="border-0 bg-white/65 shadow-none">
          <CardHeader className="text-center -mt-2 md:-mt-8 pb-8 pt-8 flex flex-row items-center justify-center">
           <img src={logo}   alt="Jumentus SC" className="w-full h-32 md:h-64 object-contain" />
           <CardTitle className='md:text-4xl text-2xl font-bold text-gray-700'>Cadastro de Uniformes</CardTitle>
           <img src={logo}   alt="Jumentus SC" className="w-full h-32 md:h-64 object-contain" />
          </CardHeader>
           <CardTitle className='md:text-4xl -mt-8 mb-8 text-center text-2xl font-bold text-yellow-700'>Valor R$: 135,00</CardTitle>

          <CardContent className="px-8 pb-8 -mt-2 md:-mt-4">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="tipo" className="text-base font-semibold text-gray-700 text-start block">
                  Tipo de Uniforme
                </Label>
                <Select onValueChange={(value) => setValue('tipo', value as 'Jogador' | 'Goleiro')}>
                  <SelectTrigger className="w-full h-14 bg-[#f1f1ef] border-2 border-gray-300 focus:border-[#D4B301] focus:bg-white text-base font-medium transition-all duration-200">
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Jogador" className="text-base py-3">Jogador</SelectItem>
                    <SelectItem value="Goleiro" className="text-base py-3">Goleiro</SelectItem>
                  </SelectContent>
                </Select>
                {errors.tipo && (
                  <p className="text-sm text-red-600  font-medium">
                    {errors.tipo.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="tamanho" className="text-base font-semibold text-gray-700  block">
                  Tamanho
                </Label>
                <Select onValueChange={(value) => setValue('tamanho', value as 'PP' | 'P' | 'M' | 'G' | 'GG')}>
                  <SelectTrigger className="w-full h-14 bg-[#f1f1ef] border-2 border-gray-300 focus:border-[#D4B301] focus:bg-white text-base font-medium transition-all duration-200">
                    <SelectValue placeholder="Selecione o tamanho" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PP" className="text-base py-3">PP - 71cm X 52cm</SelectItem>
                    <SelectItem value="P" className="text-base py-3">P - 73cm X 55cm</SelectItem>
                    <SelectItem value="M" className="text-base py-3">M - 75cm X 58cm</SelectItem>
                    <SelectItem value="G" className="text-base py-3">G - 77cm X 60cm</SelectItem>
                    <SelectItem value="GG" className="text-base py-3">GG - 79cm X 63cm</SelectItem>
                  </SelectContent>
                </Select>
                {errors.tamanho && (
                  <p className="text-sm text-red-600  font-medium">
                    {errors.tamanho.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="nome" className="text-base font-semibold text-gray-700  block">
                  Nome (para o uniforme)
                </Label>
                <Input
                  id="nome"
                  {...register('nome')}
                  className="h-14 bg-[#f1f1ef] border-2 border-gray-300 focus:border-[#D4B301] focus:bg-white text-base font-medium placeholder:text-gray-500 transition-all duration-200"
                  placeholder="Digite o nome completo"
                />
                {errors.nome && (
                  <p className="text-sm text-red-600  font-medium">
                    {errors.nome.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="numero" className="text-base font-semibold text-gray-700  block">
                  Número
                </Label>
                <Select onValueChange={(value) => setValue('numero', parseInt(value))}>
                  <SelectTrigger className="w-full h-14 bg-[#f1f1ef] border-2 border-gray-300 focus:border-[#D4B301] focus:bg-white text-base font-medium transition-all duration-200">
                    <SelectValue placeholder="Selecione o número" />
                  </SelectTrigger>
                  <SelectContent className="max-h-60">
                    {Array.from({ length: 99 }, (_, i) => i + 1).map(num => (
                      <SelectItem key={num} value={num.toString()} className="text-base py-3">
                        {num}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                {numberValidation.status !== 'idle' && (
                  <div className={`flex items-center space-x-2 p-3 rounded-lg ${
                    numberValidation.status === 'available'
                      ? '  text-green-800'
                      : numberValidation.status === 'unavailable'
                      ? ' text-red-800'
                      : ' text-blue-800'
                  }`}>
                    {numberValidation.status === 'checking' && (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    )}
                    {numberValidation.status === 'available' && (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    )}
                    {numberValidation.status === 'unavailable' && (
                      <XCircle className="w-4 h-4 text-red-600" />
                    )}
                    <span className="text-sm font-medium ">
                      {numberValidation.message}
                    </span>
                  </div>
                )}
                
                {errors.numero && (
                  <p className="text-sm text-red-600  font-medium">
                    {errors.numero.message}
                  </p>
                )}
              </div>

              {submitStatus !== 'idle' && (
                <div className={`p-2 rounded-xl flex items-center space-x-2 border-2 ${
                  submitStatus === 'success' 
                    ? 'bg-green-50 text-green-800 border-green-200' 
                    : 'bg-red-50 text-red-800 border-red-200'
                }`}>
                  {submitStatus === 'success' ? (
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  ) : (
                    <AlertCircle className="w-6 h-6 text-red-600" />
                  )}
                  <span className=" font-medium text-base">{message}</span>
                </div>
              )}

              <Button
                type="submit"
                disabled={!isFormValid() || isLoading}
                className="w-full h-14 bg-[#D4B301] hover:bg-[#B89400] disabled:bg-gray-700 text-[#16181a] font-bold text-lg rounded-xl transition-all duration-200 transform hover:scale-105 disabled:transform-none shadow-lg hover:shadow-xl"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-3">
                    <Loader2 className="w-6 h-6 animate-spin" />
                    <span>Enviando...</span>
                  </div>
                ) : (
                  'Enviar'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Modal de Confirmação de Sucesso */}
      <Modal
        isOpen={showSuccessModal}
        onClose={closeSuccessModal}
        title="Uniforme Cadastrado!"
      >
        <div className="text-center">
          <div className="mb-4">
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto" />
          </div>
          
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            Cadastro realizado com sucesso!
          </h3>
          
          {submittedData && (
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <h4 className="font-medium text-gray-700 mb-2">Detalhes do Uniforme:</h4>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span className="font-medium">Atleta:</span>
                  <span>{submittedData.nome}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Número:</span>
                  <span>{submittedData.numero}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Tipo:</span>
                  <span>{submittedData.tipo}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Tamanho:</span>
                  <span>{submittedData.tamanho}</span>
                </div>
              </div>
            </div>
          )}
          
          <p className="text-gray-600 mb-6">
            O uniforme foi salvo no sistema e está disponível para consulta.
          </p>
          
          <Button
            onClick={closeSuccessModal}
            className="w-full bg-[#D4B301] hover:bg-[#B89400] text-[#2C2E30] font-bold py-3 rounded-xl transition-all duration-200"
          >
            Fechar
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default UniformForm;
