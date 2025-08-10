import { describe, it, expect, vi, beforeEach } from 'vitest'
import { FastifyRequest, FastifyReply } from 'fastify'
import { StoreUrlController } from '@/app/Http/Controller/StoreUrlController'
import { storeUrl } from '@/app/Repository/UrlRepository'

// Mock do repositório
vi.mock('@/app/Repository/UrlRepository', () => ({
    storeUrl: vi.fn()
}))

describe('StoreUrlController', () => {
    let controller: StoreUrlController
    let mockRequest: FastifyRequest
    let mockReply: FastifyReply

    beforeEach(() => {
        controller = new StoreUrlController()

        // Mock do request
        mockRequest = {
            body: {}
        } as FastifyRequest

        // Mock do reply
        mockReply = {
            status: vi.fn().mockReturnThis(),
            send: vi.fn().mockReturnThis()
        } as unknown as FastifyReply

        // Limpar mocks
        vi.clearAllMocks()
    })

    describe('handle', () => {
        it('should create URL successfully with valid data', async () => {
            // Arrange
            const validData = {
                name: 'google',
                url: 'https://www.google.com'
            }
            mockRequest.body = validData

            const mockResponse = {
                data: {
                    id: '1',
                    name: 'google',
                    url: 'https://www.google.com',
                    createdAt: new Date(),
                    count_access: 0
                }
            }

            vi.mocked(storeUrl).mockResolvedValue(mockResponse)

            // Act
            const result = await controller.handle(mockRequest, mockReply)

            // Assert
            expect(storeUrl).toHaveBeenCalledWith(validData)
            expect(result).toEqual({
                data: [mockResponse.data],
                message: 'URL criada com sucesso'
            })
        })

        it('should return 400 when URL is invalid', async () => {
            // Arrange
            const invalidData = {
                name: 'google',
                url: 'invalid-url'
            }
            mockRequest.body = invalidData

            // Act
            const result = await controller.handle(mockRequest, mockReply)

            // Assert
            expect(mockReply.status).toHaveBeenCalledWith(400)
            expect(mockReply.send).toHaveBeenCalledWith({
                message: 'Dados inválidos fornecidos',
                error: expect.stringContaining('Invalid URL format')
            })
        })

        it('should return 400 when name is empty', async () => {
            // Arrange
            const invalidData = {
                url: 'https://www.google.com',
                name: ''
            }
            mockRequest.body = invalidData

            // Act
            const result = await controller.handle(mockRequest, mockReply)

            // Assert
            expect(mockReply.status).toHaveBeenCalledWith(400)
            expect(mockReply.send).toHaveBeenCalledWith({
                message: 'Dados inválidos fornecidos',
                error: expect.stringContaining('Name is required')
            })
        })

        it('should return 400 when name is too long', async () => {
            // Arrange
            const invalidData = {
                url: 'https://www.google.com',
                name: 'a'.repeat(51) // Mais de 50 caracteres
            }
            mockRequest.body = invalidData

            // Act
            const result = await controller.handle(mockRequest, mockReply)

            // Assert
            expect(mockReply.status).toHaveBeenCalledWith(400)
            expect(mockReply.send).toHaveBeenCalledWith({
                message: 'Dados inválidos fornecidos',
                error: expect.stringContaining('Name must be less than 50 characters')
            })
        })

        it('should return 400 when name contains invalid characters', async () => {
            // Arrange
            const invalidData = {
                url: 'https://www.google.com',
                name: 'test@name' // Caracteres inválidos
            }
            mockRequest.body = invalidData

            // Act
            const result = await controller.handle(mockRequest, mockReply)

            // Assert
            expect(mockReply.status).toHaveBeenCalledWith(400)
            expect(mockReply.send).toHaveBeenCalledWith({
                message: 'Dados inválidos fornecidos',
                error: expect.stringContaining('Name can only contain letters, numbers, hyphens and underscores')
            })
        })

        it('should return 400 when repository throws error for duplicate name', async () => {
            // Arrange
            const validData = {
                name: 'google',
                url: 'https://www.google.com'
            }
            mockRequest.body = validData

            vi.mocked(storeUrl).mockRejectedValue(new Error('Name url already exists'))

            // Act
            const result = await controller.handle(mockRequest, mockReply)

            // Assert
            expect(mockReply.status).toHaveBeenCalledWith(400)
            expect(mockReply.send).toHaveBeenCalledWith({
                message: 'Falha ao armazenar URL',
                error: 'Name url already exists'
            })
        })

        it('should return 500 when unknown error occurs', async () => {
            // Arrange
            const validData = {
                name: 'google',
                url: 'https://www.google.com'
            }
            mockRequest.body = validData

            vi.mocked(storeUrl).mockRejectedValue('Unknown error')

            // Act
            const result = await controller.handle(mockRequest, mockReply)

            // Assert
            expect(mockReply.status).toHaveBeenCalledWith(500)
            expect(mockReply.send).toHaveBeenCalledWith({
                message: 'Erro interno do servidor',
                error: 'Ocorreu um erro inesperado'
            })
        })

        it('should return 400 when URL is missing', async () => {
            // Arrange
            const invalidData = {
                name: 'google'
                // URL missing
            }
            mockRequest.body = invalidData

            // Act
            const result = await controller.handle(mockRequest, mockReply)

            // Assert
            expect(mockReply.status).toHaveBeenCalledWith(400)
            expect(mockReply.send).toHaveBeenCalledWith({
                message: 'Dados inválidos fornecidos',
                error: expect.stringContaining('url: Required')
            })
        })

        it('should return 400 when name is missing', async () => {
            // Arrange
            const invalidData = {
                url: 'https://www.google.com'
                // name missing
            }
            mockRequest.body = invalidData

            // Act
            const result = await controller.handle(mockRequest, mockReply)

            // Assert
            expect(mockReply.status).toHaveBeenCalledWith(400)
            expect(mockReply.send).toHaveBeenCalledWith({
                message: 'Dados inválidos fornecidos',
                error: expect.stringContaining('name: Required')
            })
        })
    })
}) 