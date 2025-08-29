import { z } from 'zod';
import type { UniformFormData } from '../types/uniform';

export const uniformSchema = z.object({
  tamanho: z.enum(['P', 'M', 'G', 'GG']),
  nome: z.string()
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .max(50, 'Nome deve ter no máximo 50 caracteres')
    .regex(/^[a-zA-ZÀ-ÿ\s]+$/, 'Nome deve conter apenas letras e espaços'),
  tipo: z.enum(['Jogador', 'Goleiro']),
  numero: z.number()
    .min(1, 'Número deve ser entre 1 e 99')
    .max(99, 'Número deve ser entre 1 e 99'),
});

export type { UniformFormData };
