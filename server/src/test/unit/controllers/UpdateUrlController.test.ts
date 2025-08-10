import { describe, it, expect, vi, beforeEach } from 'vitest'
import { FastifyRequest, FastifyReply } from 'fastify'
import { UpdateUrlController } from '@/app/Http/Controller/UpdateUrlController'
import { updateUrl } from '@/app/Repository/UrlRepository'

// Mock do repositório
vi.mock('@/app/Repository/UrlRepository', () => ({
    updateUrl: vi.fn()
}))

describe('UpdateUrlController', () => {
    let controller: UpdateUrlController
    let mockRequest: FastifyRequest
    let mockReply: FastifyReply

    beforeEach(() => {
        controller = new UpdateUrlController()

        // Mock do request
        mockRequest = {
            body: {},
            params: {}
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
        it('should update URL successfully with valid data', async () => {
            // Arrange
            const validData = {
                name: 'google-updated',
                url: 'https://www.google.com.br'
            }
            const id = '1'
            
            mockRequest.body = validData
            mockRequest.params = { id }

            const mockResponse = {
                data: {
                    id: '1',
                    name: 'google-updated',
                    url: 'https://www.google.com.br',
                    createdAt: new Date(),
                    count_access: 5
                }
            }

            vi.mocked(updateUrl).mockResolvedValue(mockResponse)

            // Act
            const result = await controller.handle(mockRequest, mockReply)

            // Assert
            expect(updateUrl).toHaveBeenCalledWith({
                id,
                ...validData
            })
            expect(result).toEqual({
                data: [mockResponse.data],
                message: 'URL atualizada com sucesso'
            })
        })

        it('should return 400 when URL is invalid', async () => {
            // Arrange
            const invalidData = {
                name: 'google-updated',
                url: 'invalid-url'
            }
            const id = '1'
            
            mockRequest.body = invalidData
            mockRequest.params = { id }

            // Act
            const result = await controller.handle(mockRequest, mockReply)

            // Assert
            expect(mockReply.status).toHaveBeenCalledWith(400)
            expect(mockReply.send).toHaveBeenCalledWith({
                message: 'Dados inválidos fornecidos',
                error: expect.stringContaining('url:')
            })
        })

        it('should return 400 when name is empty', async () => {
            // Arrange
            const invalidData = {
                url: 'https://www.google.com',
                name: ''
            }
            const id = '1'
            
            mockRequest.body = invalidData
            mockRequest.params = { id }

            // Act
            const result = await controller.handle(mockRequest, mockReply)

            // Assert
            expect(mockReply.status).toHaveBeenCalledWith(400)
            expect(mockReply.send).toHaveBeenCalledWith({
                message: 'Dados inválidos fornecidos',
                error: expect.stringContaining('name:')
            })
        })

        it('should return 400 when id is missing', async () => {
            // Arrange
            const validData = {
                name: 'google-updated',
                url: 'https://www.google.com'
            }
            
            mockRequest.body = validData
            mockRequest.params = {}

            // Act
            const result = await controller.handle(mockRequest, mockReply)

            // Assert
            expect(mockReply.status).toHaveBeenCalledWith(400)
            expect(mockReply.send).toHaveBeenCalledWith({
                message: 'Dados inválidos fornecidos',
                error: expect.stringContaining('id:')
            })
        })

        it('should return 400 when name is missing', async () => {
            // Arrange
            const invalidData = {
                url: 'https://www.google.com'
                // name missing
            }
            const id = '1'
            
            mockRequest.body = invalidData
            mockRequest.params = { id }

            // Act
            const result = await controller.handle(mockRequest, mockReply)

            // Assert
            expect(mockReply.status).toHaveBeenCalledWith(400)
            expect(mockReply.send).toHaveBeenCalledWith({
                message: 'Dados inválidos fornecidos',
                error: expect.stringContaining('name:')
            })
        })

        it('should return 400 when url is missing', async () => {
            // Arrange
            const invalidData = {
                name: 'google-updated'
                // url missing
            }
            const id = '1'
            
            mockRequest.body = invalidData
            mockRequest.params = { id }

            // Act
            const result = await controller.handle(mockRequest, mockReply)

            // Assert
            expect(mockReply.status).toHaveBeenCalledWith(400)
            expect(mockReply.send).toHaveBeenCalledWith({
                message: 'Dados inválidos fornecidos',
                error: expect.stringContaining('url:')
            })
        })

        it('should return 400 when repository throws error for URL not found', async () => {
            // Arrange
            const validData = {
                name: 'google-updated',
                url: 'https://www.google.com'
            }
            const id = '999'
            
            mockRequest.body = validData
            mockRequest.params = { id }

            vi.mocked(updateUrl).mockRejectedValue(new Error('Url not found'))

            // Act
            const result = await controller.handle(mockRequest, mockReply)

            // Assert
            expect(mockReply.status).toHaveBeenCalledWith(400)
            expect(mockReply.send).toHaveBeenCalledWith({
                message: 'Falha ao atualizar URL',
                error: 'Url not found'
            })
        })

        it('should return 400 when repository throws error for duplicate name', async () => {
            // Arrange
            const validData = {
                name: 'existing-name',
                url: 'https://www.google.com'
            }
            const id = '1'
            
            mockRequest.body = validData
            mockRequest.params = { id }

            vi.mocked(updateUrl).mockRejectedValue(new Error('Name url already exists'))

            // Act
            const result = await controller.handle(mockRequest, mockReply)

            // Assert
            expect(mockReply.status).toHaveBeenCalledWith(400)
            expect(mockReply.send).toHaveBeenCalledWith({
                message: 'Falha ao atualizar URL',
                error: 'Name url already exists'
            })
        })

        it('should return 500 when unknown error occurs', async () => {
            // Arrange
            const validData = {
                name: 'google-updated',
                url: 'https://www.google.com'
            }
            const id = '1'
            
            mockRequest.body = validData
            mockRequest.params = { id }

            vi.mocked(updateUrl).mockRejectedValue('Unknown error')

            // Act
            const result = await controller.handle(mockRequest, mockReply)

            // Assert
            expect(mockReply.status).toHaveBeenCalledWith(500)
            expect(mockReply.send).toHaveBeenCalledWith({
                message: 'Erro interno do servidor',
                error: 'Erro desconhecido'
            })
        })

        it('should handle empty body gracefully', async () => {
            // Arrange
            mockRequest.body = {}
            mockRequest.params = { id: '1' }

            // Act
            const result = await controller.handle(mockRequest, mockReply)

            // Assert
            expect(mockReply.status).toHaveBeenCalledWith(400)
            expect(mockReply.send).toHaveBeenCalledWith({
                message: 'Dados inválidos fornecidos',
                error: expect.stringContaining('name:')
            })
        })
    })
}) 