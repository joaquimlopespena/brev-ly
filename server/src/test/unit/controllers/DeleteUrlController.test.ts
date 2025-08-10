import { describe, it, expect, vi, beforeEach } from 'vitest'
import { DeleteUrlController } from '@/app/Http/Controller/DeleteUrlController'
import { deleteUrl } from '@/app/Repository/UrlRepository'

// Mock do repositório
vi.mock('@/app/Repository/UrlRepository', () => ({
    deleteUrl: vi.fn()
}))

describe('DeleteUrlController', () => {
    let controller: DeleteUrlController

    beforeEach(() => {
        controller = new DeleteUrlController()
        // Limpar mocks
        vi.clearAllMocks()
    })

    describe('handle', () => {
        it('should delete URL successfully with valid ID', async () => {
            // Arrange
            const validData = {
                id: 'test-1'
            }

            vi.mocked(deleteUrl).mockResolvedValue(true)

            // Act
            const result = await controller.handle(validData)

            // Assert
            expect(deleteUrl).toHaveBeenCalledWith(validData.id)
            expect(result).toEqual({
                message: 'URL deleted successfully'
            })
        })

        it('should throw error when ID is missing', async () => {
            // Arrange
            const invalidData = {}

            // Act & Assert
            await expect(controller.handle(invalidData as any)).rejects.toThrow()
        })

        it('should handle empty string ID (current schema allows it)', async () => {
            // Arrange
            const validData = {
                id: ''
            }

            vi.mocked(deleteUrl).mockResolvedValue(true)

            // Act
            const result = await controller.handle(validData)

            // Assert
            expect(deleteUrl).toHaveBeenCalledWith('')
            expect(result).toEqual({
                message: 'URL deleted successfully'
            })
        })

        it('should throw error when repository throws error for URL not found', async () => {
            // Arrange
            const validData = {
                id: 'non-existent-id'
            }

            vi.mocked(deleteUrl).mockRejectedValue(new Error('Url not found'))

            // Act & Assert
            await expect(controller.handle(validData)).rejects.toThrow('Url not found')
        })

        it('should throw error when unknown error occurs', async () => {
            // Arrange
            const validData = {
                id: 'test-1'
            }

            vi.mocked(deleteUrl).mockRejectedValue('Unknown error')

            // Act & Assert
            await expect(controller.handle(validData)).rejects.toThrow()
        })

        it('should throw error when ID is not a string', async () => {
            // Arrange
            const invalidData = {
                id: 123 // ID como número
            }

            // Act & Assert
            await expect(controller.handle(invalidData as any)).rejects.toThrow()
        })

        it('should throw error when ID is null', async () => {
            // Arrange
            const invalidData = {
                id: null
            }

            // Act & Assert
            await expect(controller.handle(invalidData as any)).rejects.toThrow()
        })

        it('should throw error when ID is undefined', async () => {
            // Arrange
            const invalidData = {
                id: undefined
            }

            // Act & Assert
            await expect(controller.handle(invalidData as any)).rejects.toThrow()
        })

        it('should validate ID format correctly', async () => {
            // Arrange
            const validData = {
                id: 'valid-id-123'
            }

            vi.mocked(deleteUrl).mockResolvedValue(true)

            // Act
            const result = await controller.handle(validData)

            // Assert
            expect(deleteUrl).toHaveBeenCalledWith('valid-id-123')
            expect(result).toEqual({
                message: 'URL deleted successfully'
            })
        })

        it('should handle special characters in ID', async () => {
            // Arrange
            const validData = {
                id: 'test-id-with-special-chars_123'
            }

            vi.mocked(deleteUrl).mockResolvedValue(true)

            // Act
            const result = await controller.handle(validData)

            // Assert
            expect(deleteUrl).toHaveBeenCalledWith('test-id-with-special-chars_123')
            expect(result).toEqual({
                message: 'URL deleted successfully'
            })
        })
    })
}) 