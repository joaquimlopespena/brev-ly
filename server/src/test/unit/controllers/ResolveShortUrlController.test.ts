import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ResolveShortUrlController } from '@/app/Http/Controller/ResolveShortUrlController'
import { FastifyReply, FastifyRequest } from 'fastify'

// Mock do repositório
vi.mock('@/app/Repository/UrlRepository', () => ({
    getUrlByShortUrl: vi.fn()
}))

describe('ResolveShortUrlController', () => {
    let controller: ResolveShortUrlController
    let mockRequest: FastifyRequest<{ Params: { shortUrl: string } }>
    let mockReply: FastifyReply

    beforeEach(() => {
        controller = new ResolveShortUrlController()
        
        // Reset dos mocks
        vi.clearAllMocks()

        // Mock do request
        mockRequest = {
            params: {
                shortUrl: 'test-url'
            }
        } as any

        // Mock do reply
        mockReply = {
            status: vi.fn().mockReturnThis(),
            send: vi.fn().mockReturnThis()
        } as any
    })

    it('should resolve short URL successfully', async () => {
        // Arrange
        const mockResponse = {
            url: 'https://www.example.com',
            count_access: 5
        }

        const { getUrlByShortUrl } = await import('@/app/Repository/UrlRepository')
        vi.mocked(getUrlByShortUrl).mockResolvedValue(mockResponse)

        // Act
        const result = await controller.handle(mockRequest, mockReply)

        // Assert
        expect(getUrlByShortUrl).toHaveBeenCalledWith('test-url')
        expect(result).toEqual({
            url: 'https://www.example.com',
            count_access: 5
        })
    })

    it('should handle URL not found', async () => {
        // Arrange
        const { getUrlByShortUrl } = await import('@/app/Repository/UrlRepository')
        vi.mocked(getUrlByShortUrl).mockRejectedValue(new Error('Url not found'))

        // Act
        await controller.handle(mockRequest, mockReply)

        // Assert
        expect(mockReply.status).toHaveBeenCalledWith(404)
        expect(mockReply.send).toHaveBeenCalledWith({ message: 'Url not found' })
    })

    it('should handle null count_access', async () => {
        // Arrange
        const mockResponse = {
            url: 'https://www.example.com',
            count_access: null
        }

        const { getUrlByShortUrl } = await import('@/app/Repository/UrlRepository')
        vi.mocked(getUrlByShortUrl).mockResolvedValue(mockResponse)

        // Act
        const result = await controller.handle(mockRequest, mockReply)

        // Assert
        expect(getUrlByShortUrl).toHaveBeenCalledWith('test-url')
        expect(result).toEqual({
            url: 'https://www.example.com',
            count_access: null
        })
    })

    it('should handle repository errors', async () => {
        // Arrange
        const { getUrlByShortUrl } = await import('@/app/Repository/UrlRepository')
        vi.mocked(getUrlByShortUrl).mockRejectedValue(new Error('Database error'))

        // Act
        await controller.handle(mockRequest, mockReply)

        // Assert
        expect(mockReply.status).toHaveBeenCalledWith(404)
        expect(mockReply.send).toHaveBeenCalledWith({ message: 'Url not found' })
    })
})
