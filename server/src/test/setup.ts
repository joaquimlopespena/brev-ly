import { beforeAll, afterAll, beforeEach, afterEach } from 'vitest'
import { db } from '@/infra/db'
import { schema } from '@/infra/db/schemas'

// Configuração global para testes
beforeAll(async () => {
  // Aqui você pode configurar o banco de dados de teste
  console.log('🚀 Configurando ambiente de testes...')
})

afterAll(async () => {
  // Limpeza final
  console.log('🧹 Finalizando testes...')
})

beforeEach(async () => {
  // Limpar dados antes de cada teste
  try {
    await db.delete(schema.link_shorteners)
  } catch (error) {
    // Ignora erro se a tabela não existir
  }
})

afterEach(async () => {
  // Limpeza após cada teste
  try {
    await db.delete(schema.link_shorteners)
  } catch (error) {
    // Ignora erro se a tabela não existir
  }
})

// Configuração global do Vitest
export const testUtils = {
  // Utilitários para testes
  createTestUrl: (data: { url: string; name: string }) => {
    return {
      url: data.url,
      name: data.name,
      count_access: 0,
      createdAt: new Date()
    }
  }
} 