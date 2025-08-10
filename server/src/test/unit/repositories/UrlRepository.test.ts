import { describe, it, expect, beforeEach, vi } from 'vitest'
import { storeUrl, updateUrl, getUrlByShortUrl } from '@/app/Repository/UrlRepository'

// Mock do banco de dados
vi.mock('@/infra/db', () => ({
  db: {
    select: vi.fn(),
    insert: vi.fn(),
    delete: vi.fn(),
    update: vi.fn()
  }
}))

vi.mock('drizzle-orm', () => ({
  eq: vi.fn(),
  and: vi.fn(),
  notInArray: vi.fn(),
  sql: vi.fn()
}))

describe('UrlRepository', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('storeUrl', () => {
    it('should store URL successfully with valid data', async () => {
      // Arrange
      const validData = {
        url: 'https://www.google.com',
        name: 'google'
      }

      // Mock para simular que não existe URL com esse name
      const mockSelectChain = {
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue([])
          })
        })
      }

      const mockInsertChain = {
        values: vi.fn().mockReturnValue({
          returning: vi.fn().mockResolvedValue([{
            id: '1',
            url: 'https://www.google.com',
            name: 'google',
            count_access: 0,
            createdAt: new Date()
          }])
        })
      }

      const { db } = await import('@/infra/db')
      vi.mocked(db.select).mockReturnValue(mockSelectChain as any)
      vi.mocked(db.insert).mockReturnValue(mockInsertChain as any)

      // Act
      const result = await storeUrl(validData)

      // Assert
      expect(db.select).toHaveBeenCalled()
      expect(db.insert).toHaveBeenCalled()
      expect(result).toEqual({
        data: {
          id: '1',
          url: 'https://www.google.com',
          name: 'google',
          count_access: 0,
          createdAt: expect.any(Date)
        }
      })
    })

    it('should throw error when name already exists', async () => {
      // Arrange
      const validData = {
        url: 'https://www.google.com',
        name: 'google'
      }

      const existingUrl = [{
        id: '1',
        url: 'https://existing.com',
        name: 'google',
        count_access: 0,
        createdAt: new Date()
      }]

      const mockSelectChain = {
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue(existingUrl)
          })
        })
      }

      const { db } = await import('@/infra/db')
      vi.mocked(db.select).mockReturnValue(mockSelectChain as any)

      // Act & Assert
      await expect(storeUrl(validData)).rejects.toThrow('Name url already exists')
    })

    it('should handle database errors gracefully', async () => {
      // Arrange
      const validData = {
        url: 'https://www.google.com',
        name: 'google'
      }

      const mockSelectChain = {
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            limit: vi.fn().mockRejectedValue(new Error('Database connection failed'))
          })
        })
      }

      const { db } = await import('@/infra/db')
      vi.mocked(db.select).mockReturnValue(mockSelectChain as any)

      // Act & Assert
      await expect(storeUrl(validData)).rejects.toThrow('Database connection failed')
    })
  })

  describe('updateUrl', () => {
    it('should update URL successfully with valid data', async () => {
      // Arrange
      const validData = {
        id: '1',
        url: 'https://www.google.com.br',
        name: 'google-updated'
      }

      // Mock para simular que a URL existe
      const mockSelectChain = {
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue([{ id: '1' }]) // URL existe
          })
        })
      }

      // Mock para simular que não existe conflito de nome
      const mockSelectNameChain = {
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue([]) // Nenhum conflito
          })
        })
      }

      const mockUpdateChain = {
        set: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            returning: vi.fn().mockResolvedValue([{
              id: '1',
              url: 'https://www.google.com.br',
              name: 'google-updated',
              count_access: 5,
              createdAt: new Date()
            }])
          })
        })
      }

      const { db } = await import('@/infra/db')
      const { eq, and, notInArray } = await import('drizzle-orm')
      
      vi.mocked(db.select)
        .mockReturnValueOnce(mockSelectChain as any) // Primeira chamada - verificar se existe
        .mockReturnValueOnce(mockSelectNameChain as any) // Segunda chamada - verificar conflito
      vi.mocked(db.update).mockReturnValue(mockUpdateChain as any)
      vi.mocked(eq).mockReturnValue('eq-condition' as any)
      vi.mocked(and).mockReturnValue('and-condition' as any)
      vi.mocked(notInArray).mockReturnValue('not-in-array-condition' as any)

      // Act
      const result = await updateUrl(validData)

      // Assert
      expect(db.select).toHaveBeenCalledTimes(2) // Uma vez para verificar se existe, outra para verificar conflito
      expect(db.update).toHaveBeenCalled()
      expect(result).toEqual({
        data: {
          id: '1',
          url: 'https://www.google.com.br',
          name: 'google-updated',
          count_access: 5,
          createdAt: expect.any(Date)
        }
      })
    })

    it('should throw error when URL not found', async () => {
      // Arrange
      const validData = {
        id: '999',
        url: 'https://www.google.com',
        name: 'google-updated'
      }

      // Mock para simular que a URL não existe
      const mockSelectChain = {
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue([]) // URL não existe
          })
        })
      }

      const { db } = await import('@/infra/db')
      vi.mocked(db.select).mockReturnValue(mockSelectChain as any)

      // Act & Assert
      await expect(updateUrl(validData)).rejects.toThrow('Url not found')
    })

    it('should throw error when name already exists for different URL', async () => {
      // Arrange
      const validData = {
        id: '1',
        url: 'https://www.google.com',
        name: 'existing-name'
      }

      // Mock para simular que a URL existe
      const mockSelectChain = {
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue([{ id: '1' }]) // URL existe
          })
        })
      }

      // Mock para simular conflito de nome
      const mockSelectNameChain = {
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue([{ id: '2', name: 'existing-name' }]) // Conflito de nome
          })
        })
      }

      const { db } = await import('@/infra/db')
      const { eq, and, notInArray } = await import('drizzle-orm')
      
      vi.mocked(db.select)
        .mockReturnValueOnce(mockSelectChain as any) // Primeira chamada - verificar se existe
        .mockReturnValueOnce(mockSelectNameChain as any) // Segunda chamada - verificar conflito
      vi.mocked(eq).mockReturnValue('eq-condition' as any)
      vi.mocked(and).mockReturnValue('and-condition' as any)
      vi.mocked(notInArray).mockReturnValue('not-in-array-condition' as any)

      // Act & Assert
      await expect(updateUrl(validData)).rejects.toThrow('Name url already exists')
    })

    it('should allow updating same URL with same name', async () => {
      // Arrange
      const validData = {
        id: '1',
        url: 'https://www.google.com.br',
        name: 'google'
      }

      // Mock para simular que a URL existe
      const mockSelectChain = {
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue([{ id: '1' }]) // URL existe
          })
        })
      }

      // Mock para simular que não existe conflito (mesmo nome, mesmo ID)
      const mockSelectNameChain = {
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue([]) // Nenhum conflito
          })
        })
      }

      const mockUpdateChain = {
        set: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            returning: vi.fn().mockResolvedValue([{
              id: '1',
              url: 'https://www.google.com.br',
              name: 'google',
              count_access: 5,
              createdAt: new Date()
            }])
          })
        })
      }

      const { db } = await import('@/infra/db')
      const { eq, and, notInArray } = await import('drizzle-orm')
      
      vi.mocked(db.select)
        .mockReturnValueOnce(mockSelectChain as any) // Primeira chamada - verificar se existe
        .mockReturnValueOnce(mockSelectNameChain as any) // Segunda chamada - verificar conflito
      vi.mocked(db.update).mockReturnValue(mockUpdateChain as any)
      vi.mocked(eq).mockReturnValue('eq-condition' as any)
      vi.mocked(and).mockReturnValue('and-condition' as any)
      vi.mocked(notInArray).mockReturnValue('not-in-array-condition' as any)

      // Act
      const result = await updateUrl(validData)

      // Assert
      expect(db.select).toHaveBeenCalledTimes(2)
      expect(db.update).toHaveBeenCalled()
      expect(result).toEqual({
        data: {
          id: '1',
          url: 'https://www.google.com.br',
          name: 'google',
          count_access: 5,
          createdAt: expect.any(Date)
        }
      })
    })

    it('should handle database errors gracefully', async () => {
      // Arrange
      const validData = {
        id: '1',
        url: 'https://www.google.com',
        name: 'google-updated'
      }

      // Mock para simular erro de banco de dados
      const mockSelectChain = {
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            limit: vi.fn().mockRejectedValue(new Error('Database connection failed'))
          })
        })
      }

      const { db } = await import('@/infra/db')
      vi.mocked(db.select).mockReturnValue(mockSelectChain as any)

      // Act & Assert
      await expect(updateUrl(validData)).rejects.toThrow('Database connection failed')
    })

    it('should handle update database errors gracefully', async () => {
      // Arrange
      const validData = {
        id: '1',
        url: 'https://www.google.com',
        name: 'google-updated'
      }

      // Mock para simular que a URL existe
      const mockSelectChain = {
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue([{ id: '1' }]) // URL existe
          })
        })
      }

      // Mock para simular que não existe conflito
      const mockSelectNameChain = {
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue([]) // Nenhum conflito
          })
        })
      }

      // Mock para simular erro na atualização
      const mockUpdateChain = {
        set: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            returning: vi.fn().mockRejectedValue(new Error('Update failed'))
          })
        })
      }

      const { db } = await import('@/infra/db')
      const { eq, and, notInArray } = await import('drizzle-orm')
      
      vi.mocked(db.select)
        .mockReturnValueOnce(mockSelectChain as any) // Primeira chamada - verificar se existe
        .mockReturnValueOnce(mockSelectNameChain as any) // Segunda chamada - verificar conflito
      vi.mocked(db.update).mockReturnValue(mockUpdateChain as any)
      vi.mocked(eq).mockReturnValue('eq-condition' as any)
      vi.mocked(and).mockReturnValue('and-condition' as any)
      vi.mocked(notInArray).mockReturnValue('not-in-array-condition' as any)

      // Act & Assert
      await expect(updateUrl(validData)).rejects.toThrow('Update failed')
    })
  })

  describe('getUrlByShortUrl', () => {
    it('should return URL and increment access count when found', async () => {
      // Arrange
      const shortUrl = 'google'
      const existingUrl = [{
        id: '1',
        url: 'https://www.google.com',
        name: 'google',
        count_access: 5,
        createdAt: new Date()
      }]

      // Mock para buscar a URL
      const mockSelectChain = {
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue(existingUrl)
          })
        })
      }

      // Mock para atualizar o contador
      const mockUpdateChain = {
        set: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            returning: vi.fn().mockResolvedValue([{
              id: '1',
              url: 'https://www.google.com',
              name: 'google',
              count_access: 6,
              createdAt: new Date()
            }])
          })
        })
      }

      const { db } = await import('@/infra/db')
      const { eq, sql } = await import('drizzle-orm')
      
      vi.mocked(db.select).mockReturnValue(mockSelectChain as any)
      vi.mocked(db.update).mockReturnValue(mockUpdateChain as any)
      vi.mocked(eq).mockReturnValue('eq-condition' as any)
      vi.mocked(sql).mockReturnValue('sql-condition' as any)

      // Act
      const result = await getUrlByShortUrl(shortUrl)

      // Assert
      expect(db.select).toHaveBeenCalled()
      expect(db.update).toHaveBeenCalled()
      expect(result).toEqual({
        url: 'https://www.google.com',
        count_access: 6
      })
    })

    it('should throw error when URL not found', async () => {
      // Arrange
      const shortUrl = 'nonexistent'

      // Mock para simular URL não encontrada
      const mockSelectChain = {
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue([])
          })
        })
      }

      const { db } = await import('@/infra/db')
      const { eq } = await import('drizzle-orm')
      
      vi.mocked(db.select).mockReturnValue(mockSelectChain as any)
      vi.mocked(eq).mockReturnValue('eq-condition' as any)

      // Act & Assert
      await expect(getUrlByShortUrl(shortUrl)).rejects.toThrow('Url not found')
    })

    it('should handle database errors gracefully', async () => {
      // Arrange
      const shortUrl = 'google'

      // Mock para simular erro de banco de dados
      const mockSelectChain = {
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            limit: vi.fn().mockRejectedValue(new Error('Database connection failed'))
          })
        })
      }

      const { db } = await import('@/infra/db')
      const { eq } = await import('drizzle-orm')
      
      vi.mocked(db.select).mockReturnValue(mockSelectChain as any)
      vi.mocked(eq).mockReturnValue('eq-condition' as any)

      // Act & Assert
      await expect(getUrlByShortUrl(shortUrl)).rejects.toThrow('Database connection failed')
    })

    it('should handle update errors gracefully', async () => {
      // Arrange
      const shortUrl = 'google'
      const existingUrl = [{
        id: '1',
        url: 'https://www.google.com',
        name: 'google',
        count_access: 5,
        createdAt: new Date()
      }]

      // Mock para buscar a URL
      const mockSelectChain = {
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue(existingUrl)
          })
        })
      }

      // Mock para simular erro na atualização
      const mockUpdateChain = {
        set: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            returning: vi.fn().mockRejectedValue(new Error('Update failed'))
          })
        })
      }

      const { db } = await import('@/infra/db')
      const { eq, sql } = await import('drizzle-orm')
      
      vi.mocked(db.select).mockReturnValue(mockSelectChain as any)
      vi.mocked(db.update).mockReturnValue(mockUpdateChain as any)
      vi.mocked(eq).mockReturnValue('eq-condition' as any)
      vi.mocked(sql).mockReturnValue('sql-condition' as any)

      // Act & Assert
      await expect(getUrlByShortUrl(shortUrl)).rejects.toThrow('Update failed')
    })

    it('should handle null count_access correctly', async () => {
      // Arrange
      const shortUrl = 'google'
      const existingUrl = [{
        id: '1',
        url: 'https://www.google.com',
        name: 'google',
        count_access: null,
        createdAt: new Date()
      }]

      // Mock para buscar a URL
      const mockSelectChain = {
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue(existingUrl)
          })
        })
      }

      // Mock para atualizar o contador
      const mockUpdateChain = {
        set: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            returning: vi.fn().mockResolvedValue([{
              id: '1',
              url: 'https://www.google.com',
              name: 'google',
              count_access: 1,
              createdAt: new Date()
            }])
          })
        })
      }

      const { db } = await import('@/infra/db')
      const { eq, sql } = await import('drizzle-orm')
      
      vi.mocked(db.select).mockReturnValue(mockSelectChain as any)
      vi.mocked(db.update).mockReturnValue(mockUpdateChain as any)
      vi.mocked(eq).mockReturnValue('eq-condition' as any)
      vi.mocked(sql).mockReturnValue('sql-condition' as any)

      // Act
      const result = await getUrlByShortUrl(shortUrl)

      // Assert
      expect(db.select).toHaveBeenCalled()
      expect(db.update).toHaveBeenCalled()
      expect(result).toEqual({
        url: 'https://www.google.com',
        count_access: 1
      })
    })
  })
}) 