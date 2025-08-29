import { 
  doc, 
  setDoc, 
  getDoc, 
  collection,
  query,
  where,
  getDocs,
  updateDoc 
} from 'firebase/firestore';
import { db } from '../config/firebase';
import type { UniformFormData } from '../types/uniform';

export const uniformService = {
  generateId: (nome: string): string => {
    return nome.toLowerCase().replace(/\s+/g, '_');
  },

  checkNumberAvailability: async (numero: number, excludeNome?: string): Promise<{ available: boolean; existingAthlete?: string }> => {
    try {
      console.log(`🔍 Verificando disponibilidade do número: ${numero}, excluindo: ${excludeNome || 'ninguém'}`);
      
      const uniformsRef = collection(db, 'uniformes');
      const q = query(uniformsRef, where('numero', '==', numero));
      const querySnapshot = await getDocs(q);
      
      console.log(`📊 Encontrados ${querySnapshot.size} documentos com número ${numero}`);
      
      if (querySnapshot.empty) {
        console.log(`✅ Número ${numero} está disponível (nenhum documento encontrado)`);
        return { available: true };
      }
      
      // Verificar se há algum atleta usando este número
      for (const doc of querySnapshot.docs) {
        const data = doc.data();
        console.log(`📝 Documento encontrado: ${doc.id}, nome: ${data.nome}, número: ${data.numero}`);
        
        // Se não estamos editando (excludeNome é undefined) ou se é um atleta diferente
        if (!excludeNome || data.nome !== excludeNome) {
          console.log(`❌ Número ${numero} já está em uso por: ${data.nome}`);
          return { 
            available: false, 
            existingAthlete: data.nome 
          };
        }
      }
      
      console.log(`✅ Número ${numero} está disponível para ${excludeNome || 'novo atleta'}`);
      return { available: true };
    } catch (error) {
      console.error('❌ Erro ao verificar disponibilidade do número:', error);
      throw error;
    }
  },

  saveUniform: async (data: UniformFormData): Promise<void> => {
    try {
      const id = uniformService.generateId(data.nome);
      const uniformRef = doc(db, 'uniformes', id);
      
      const existingDoc = await getDoc(uniformRef);
      
      if (existingDoc.exists()) {
        // Atualizar documento existente
        await updateDoc(uniformRef, {
          ...data,
          updatedAt: new Date(),
        });
      } else {
        // Criar novo documento
        await setDoc(uniformRef, {
          ...data,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }
    } catch (error) {
      console.error('Erro ao salvar uniforme:', error);
      throw error;
    }
  },

  // Buscar uniforme por nome
  getUniformByName: async (nome: string): Promise<UniformFormData | null> => {
    try {
      const id = uniformService.generateId(nome);
      const uniformRef = doc(db, 'uniformes', id);
      const uniformDoc = await getDoc(uniformRef);
      
      if (uniformDoc.exists()) {
        return uniformDoc.data() as UniformFormData;
      }
      return null;
    } catch (error) {
      console.error('Erro ao buscar uniforme:', error);
      throw error;
    }
  },

  // Buscar todos os uniformes
  getAllUniforms: async (): Promise<UniformFormData[]> => {
    try {
      const uniformsRef = collection(db, 'uniformes');
      const uniformsSnapshot = await getDocs(uniformsRef);
      
      return uniformsSnapshot.docs.map(doc => doc.data() as UniformFormData);
    } catch (error) {
      console.error('Erro ao buscar uniformes:', error);
      throw error;
    }
  },
};
