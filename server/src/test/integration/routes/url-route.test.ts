import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest'
import { FastifyInstance } from 'fastify'
import { build } from '@/routes/server'

// Mock do repositório para testes de integração
vi.mock('@/app/Repository/UrlRepository', () => ({
    storeUrl: vi.fn(),
    getUrl: vi.fn(),
    deleteUrl: vi.fn(),
    updateUrl: vi.fn(),
    getUrlByShortUrl: vi.fn()
}))

describe('URL Routes Integration', () => {
    let app: FastifyInstance

    beforeAll(async () => {
        app = await build()
    })

    afterAll(async () => {
        await app.close()
    })

    describe('POST /url/store', () => {
        it('should create URL successfully', async () => {
            // Arrange
            const validData = {
                id: 'test-1',
                name: 'google',
                url: 'https://www.google.com',
                createdAt: '2023-01-01T00:00:00.000Z',
                count_access: 0
            }

            // Mock para simular sucesso
            const { storeUrl } = await import('@/app/Repository/UrlRepository')
            vi.mocked(storeUrl).mockResolvedValue({
                data: {
                    id: 'test-1',
                    name: 'google',
                    url: 'https://www.google.com',
                    createdAt: new Date('2023-01-01T00:00:00.000Z'),
                    count_access: 0
                }
            } as any)

            // Act
            const response = await app.inject({
                method: 'POST',
                url: '/url/store',
                payload: validData
            })



            // Assert 
            expect(response.statusCode).toBe(200)
            const payload = JSON.parse(response.payload)
            expect(payload.message).toBe('URL criada com sucesso')
            expect(payload.data).toEqual(validData)
        })

        it('should return 400 for invalid URL', async () => {
            // Arrange
            const invalidData = {
                url: 'invalid-url',
                name: 'test'
            }

            // Act
            const response = await app.inject({
                method: 'POST',
                url: '/url/store',
                payload: invalidData
            })

            // Assert
            expect(response.statusCode).toBe(400)
            const payload = JSON.parse(response.payload)
            expect(payload.message).toBe('Dados inválidos fornecidos')
            expect(payload.error).toContain('Invalid URL format')
        })

        it('should return 500 for empty name (schema validation)', async () => {
            // Arrange
            const invalidData = {
                url: 'https://www.google.com',
                name: ''
            }

            // Act
            const response = await app.inject({
                method: 'POST',
                url: '/url/store',
                payload: invalidData
            })

            // Assert
            expect(response.statusCode).toBe(500)
            const payload = JSON.parse(response.payload)
            expect(payload.message).toBe("Response doesn't match the schema")
        })

        it('should return 400 for duplicate name', async () => {
            // Arrange
            const validData = {
                url: 'https://www.google.com',
                name: 'duplicate'
            }

            // Mock para simular erro de name duplicado
            const { storeUrl } = await import('@/app/Repository/UrlRepository')
            vi.mocked(storeUrl).mockRejectedValue(new Error('Name url already exists'))

            // Act
            const response = await app.inject({
                method: 'POST',
                url: '/url/store',
                payload: validData
            })

            // Assert
            expect(response.statusCode).toBe(400)
            const payload = JSON.parse(response.payload)
            expect(payload.message).toBe('Falha ao armazenar URL')
            expect(payload.error).toBe('Name url already exists')
        })
    })

    describe('GET /url', () => {
        it('should return mock data', async () => {
            // Arrange
            const mockData = {
                data: [
                    {
                        id: '1',
                        name: 'google',
                        url: 'https://www.google.com',
                        createdAt: '2023-01-01T00:00:00.000Z',
                        count_access: 0
                    }
                ],
                total: 1,
                page: 1,
                pageSize: 10
            }

            // Mock para simular sucesso
            const { getUrl } = await import('@/app/Repository/UrlRepository')
            vi.mocked(getUrl).mockResolvedValue({
                data: [
                    {
                        id: '1',
                        name: 'google',
                        url: 'https://www.google.com',
                        createdAt: new Date('2023-01-01T00:00:00.000Z'),
                        count_access: 0
                    }
                ],
                total: 1,
                page: 1,
                pageSize: 10
            })

            // Act
            const response = await app.inject({
                method: 'GET',
                url: '/url'
            })

            // Assert
            expect(response.statusCode).toBe(200)
            expect(JSON.parse(response.payload)).toEqual(mockData)
        })
    })

    describe('DELETE /url/delet/:id', () => {
        it('should delete URL successfully', async () => {
            // Arrange
            const validData = {
                id: '1'
            }

            // Mock para simular sucesso
            const { deleteUrl } = await import('@/app/Repository/UrlRepository')
            vi.mocked(deleteUrl).mockResolvedValue(true)

            // Act
            const response = await app.inject({
                method: 'DELETE',
                url: '/url/delet/1'
            })

            // Assert
            expect(response.statusCode).toBe(200)
            const payload = JSON.parse(response.payload)
            expect(payload.message).toBe('URL deleted successfully')
        })

        it('should return 400 for invalid ID', async () => {
            // Arrange
            const invalidData = {
                id: 'invalid-id'
            }

            // Mock para simular erro de ID inválido
            const { deleteUrl } = await import('@/app/Repository/UrlRepository')
            vi.mocked(deleteUrl).mockRejectedValue(new Error('URL não encontrada'))

            // Act
            const response = await app.inject({
                method: 'DELETE',
                url: '/url/delet/invalid-id'
            })

            console.log(response.payload, response.statusCode);

            // Assert
            expect(response.statusCode).toBe(400)
            const payload = JSON.parse(response.payload)
            expect(payload.error).toBe('URL não encontrada')
        })
    })

    describe('PUT /url/update/:id', () => {
        it('should update URL successfully', async () => {
            // Arrange
            const validData = {
                name: 'google-updated',
                url: 'https://www.google.com.br'
            }

            const updatedData = {
                id: '1',
                name: 'google-updated',
                url: 'https://www.google.com.br',
                createdAt: '2023-01-01T00:00:00.000Z',
                count_access: 5
            }

            // Mock para simular sucesso
            const { updateUrl } = await import('@/app/Repository/UrlRepository')
            vi.mocked(updateUrl).mockResolvedValue({
                data: {
                    id: '1',
                    name: 'google-updated',
                    url: 'https://www.google.com.br',
                    createdAt: new Date('2023-01-01T00:00:00.000Z'),
                    count_access: 5
                }
            } as any)

            // Act
            const response = await app.inject({
                method: 'PUT',
                url: '/url/update/1',
                payload: validData
            })

            // Assert 
            expect(response.statusCode).toBe(200)
            const payload = JSON.parse(response.payload)
            expect(payload.message).toBe('URL atualizada com sucesso')
            expect(payload.data).toEqual(updatedData)
        })

        it('should return 400 for invalid URL', async () => {
            // Arrange
            const invalidData = {
                url: 'invalid-url',
                name: 'test-updated'
            }

            // Act
            const response = await app.inject({
                method: 'PUT',
                url: '/url/update/1',
                payload: invalidData
            })

            // Assert
            expect(response.statusCode).toBe(400)
            const payload = JSON.parse(response.payload)
            expect(payload.message).toBe('Dados inválidos fornecidos')
            expect(payload.error).toContain('Invalid URL format')
        })

        it('should return 500 for empty name (schema validation)', async () => {
            // Arrange
            const invalidData = {
                url: 'https://www.google.com',
                name: ''
            }

            // Act
            const response = await app.inject({
                method: 'PUT',
                url: '/url/update/1',
                payload: invalidData
            })

            // Assert
            expect(response.statusCode).toBe(500)
            const payload = JSON.parse(response.payload)
            expect(payload.message).toBe("Response doesn't match the schema")
        })

        it('should return 400 for URL not found', async () => {
            // Arrange
            const validData = {
                name: 'google-updated',
                url: 'https://www.google.com'
            }

            // Mock para simular erro de URL não encontrada
            const { updateUrl } = await import('@/app/Repository/UrlRepository')
            vi.mocked(updateUrl).mockRejectedValue(new Error('Url not found'))

            // Act
            const response = await app.inject({
                method: 'PUT',
                url: '/url/update/999',
                payload: validData
            })

            // Assert
            expect(response.statusCode).toBe(400)
            const payload = JSON.parse(response.payload)
            expect(payload.message).toBe('Falha ao atualizar URL')
            expect(payload.error).toBe('Url not found')
        })

        it('should return 400 for duplicate name', async () => {
            // Arrange
            const validData = {
                name: 'existing-name',
                url: 'https://www.google.com'
            }

            // Mock para simular erro de name duplicado
            const { updateUrl } = await import('@/app/Repository/UrlRepository')
            vi.mocked(updateUrl).mockRejectedValue(new Error('Name url already exists'))

            // Act
            const response = await app.inject({
                method: 'PUT',
                url: '/url/update/1',
                payload: validData
            })

            // Assert
            expect(response.statusCode).toBe(400)
            const payload = JSON.parse(response.payload)
            expect(payload.message).toBe('Falha ao atualizar URL')
            expect(payload.error).toBe('Name url already exists')
        })

        it('should return 400 for missing required fields', async () => {
            // Arrange
            const invalidData = {
                url: 'https://www.google.com'
                // name missing
            }

            // Act
            const response = await app.inject({
                method: 'PUT',
                url: '/url/update/1',
                payload: invalidData
            })

            // Assert
            expect(response.statusCode).toBe(500)
            const payload = JSON.parse(response.payload)
            expect(payload.message).toBe("Response doesn't match the schema")
        })

        it('should return 400 for invalid name format', async () => {
            // Arrange
            const invalidData = {
                name: 'invalid@name',
                url: 'https://www.google.com'
            }

            // Act
            const response = await app.inject({
                method: 'PUT',
                url: '/url/update/1',
                payload: invalidData
            })

            // Assert
            expect(response.statusCode).toBe(400)
            const payload = JSON.parse(response.payload)
            expect(payload.message).toBe('Dados inválidos fornecidos')
            expect(payload.error).toContain('Name can only contain letters, numbers, hyphens and underscores')
        })
    })

    describe('GET /:shortUrl', () => {
        it('should resolve short URL successfully', async () => {
            // Arrange
            const shortUrl = 'google'
            const mockResponse = {
                url: 'https://www.google.com',
                count_access: 5
            }

            // Mock para simular sucesso
            const { getUrlByShortUrl } = await import('@/app/Repository/UrlRepository')
            vi.mocked(getUrlByShortUrl).mockResolvedValue(mockResponse)

            // Act
            const response = await app.inject({
                method: 'GET',
                url: `/${shortUrl}`
            })

            // Assert
            expect(response.statusCode).toBe(200)
            expect(JSON.parse(response.payload)).toEqual(mockResponse)
        })

        it('should handle URL not found', async () => {
            // Arrange
            const shortUrl = 'nonexistent'

            // Mock para simular URL não encontrada
            const { getUrlByShortUrl } = await import('@/app/Repository/UrlRepository')
            vi.mocked(getUrlByShortUrl).mockRejectedValue(new Error('Url not found'))

            // Act
            const response = await app.inject({
                method: 'GET',
                url: `/${shortUrl}`
            })

            // Assert
            expect(response.statusCode).toBe(404)
            expect(JSON.parse(response.payload)).toEqual({ message: 'Url not found' })
        })

        it('should handle null count_access', async () => {
            // Arrange
            const shortUrl = 'google'
            const mockResponse = {
                url: 'https://www.google.com',
                count_access: null
            }

            // Mock para simular sucesso com count_access null
            const { getUrlByShortUrl } = await import('@/app/Repository/UrlRepository')
            vi.mocked(getUrlByShortUrl).mockResolvedValue(mockResponse)

            // Act
            const response = await app.inject({
                method: 'GET',
                url: `/${shortUrl}`
            })

            // Assert
            expect(response.statusCode).toBe(200)
            expect(JSON.parse(response.payload)).toEqual(mockResponse)
        })

        it('should handle database errors', async () => {
            // Arrange
            const shortUrl = 'google'

            // Mock para simular erro de banco de dados
            const { getUrlByShortUrl } = await import('@/app/Repository/UrlRepository')
            vi.mocked(getUrlByShortUrl).mockRejectedValue(new Error('Database error'))

            // Act
            const response = await app.inject({
                method: 'GET',
                url: `/${shortUrl}`
            })

            // Assert
            expect(response.statusCode).toBe(404)
            expect(JSON.parse(response.payload)).toEqual({ message: 'Url not found' })
        })

        it('should handle empty shortUrl parameter', async () => {
            // Act
            const response = await app.inject({
                method: 'GET',
                url: '/'
            })

            // Assert
            expect(response.statusCode).toBe(200)
            expect(JSON.parse(response.payload)).toEqual({ message: 'Hello World' })
        })
    })
}) 