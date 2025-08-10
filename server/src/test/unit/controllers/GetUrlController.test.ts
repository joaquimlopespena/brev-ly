import { describe, it, expect, vi, beforeEach } from 'vitest'
import { GetUrlController } from '@/app/Http/Controller/GetUrlController'
import { getUrl } from '@/app/Repository/UrlRepository'

// Mock do repositório
vi.mock('@/app/Repository/UrlRepository', () => ({
    getUrl: vi.fn()
}))

describe('GetUrlController', () => {
    beforeEach(() => {
        // Limpar mocks
        vi.clearAllMocks()
    })

    describe('GetUrlController function', () => {
        it('should return URLs successfully with default parameters', async () => {
            // Arrange
            const mockData = {
                data: [
                    {
                        id: '1',
                        name: 'google',
                        url: 'https://www.google.com',
                        createdAt: new Date('2024-01-01'),
                        count_access: 10
                    }
                ],
                total: 1,
                page: 1,
                pageSize: 10
            }

            vi.mocked(getUrl).mockResolvedValue(mockData)

            const input = {
                page: 1,
                pageSize: 10
            }

            // Act
            const result = await new GetUrlController().handle(input)

            // Assert
            expect(getUrl).toHaveBeenCalledWith({
                search: undefined,
                page: 1,
                pageSize: 10
            })
            expect(result).toEqual({
                data: mockData.data,
                total: mockData.total,
                page: 1,
                pageSize: 10
            })
        })

        it('should return URLs successfully with custom parameters', async () => {
            // Arrange
            const mockData = {
                data: [
                    {
                        id: '1',
                        name: 'google',
                        url: 'https://www.google.com',
                        createdAt: new Date('2024-01-01'),
                        count_access: 10
                    },
                    {
                        id: '2',
                        name: 'facebook',
                        url: 'https://www.facebook.com',
                        createdAt: new Date('2024-01-02'),
                        count_access: 5
                    }
                ],
                total: 2,
                page: 2,
                pageSize: 5
            }

            vi.mocked(getUrl).mockResolvedValue(mockData)

            const input = {
                search: 'google',
                page: 2,
                pageSize: 5
            }

            // Act
            const result = await new GetUrlController().handle(input)

            // Assert
            expect(getUrl).toHaveBeenCalledWith({
                search: 'google',
                page: 2,
                pageSize: 5
            })
            expect(result).toEqual({
                data: mockData.data,
                total: mockData.total,
                page: 2,
                pageSize: 5
            })
        })

        it('should handle empty search parameter', async () => {
            // Arrange
            const mockData = {
                data: [],
                total: 0,
                page: 1,
                pageSize: 10
            }

            vi.mocked(getUrl).mockResolvedValue(mockData)

            const input = {
                search: '',
                page: 1,
                pageSize: 10
            }

            // Act
            const result = await new GetUrlController().handle(input)

            // Assert
            expect(getUrl).toHaveBeenCalledWith({
                search: '',
                page: 1,
                pageSize: 10
            })
            expect(result).toEqual({
                data: [],
                total: 0,
                page: 1,
                pageSize: 10
            })
        })

        it('should handle repository errors', async () => {
            // Arrange
            const error = new Error('Database connection failed')
            vi.mocked(getUrl).mockRejectedValue(error)

            const input = {
                search: 'test',
                page: 1,
                pageSize: 10
            }

            // Act & Assert
            await expect(new GetUrlController().handle(input)).rejects.toThrow('Database connection failed')
            expect(getUrl).toHaveBeenCalledWith({
                search: 'test',
                page: 1,
                pageSize: 10
            })
        })

        it('should handle validation errors for invalid page number', async () => {
            // Arrange
            const input = {
                page: -1, // Invalid page number
                pageSize: 10
            }

            // Act & Assert
            await expect(new GetUrlController().handle(input)).rejects.toThrow()
        })

        it('should handle validation errors for invalid page size', async () => {
            // Arrange
            const input = {
                page: 1,
                pageSize: 0 // Invalid page size
            }

            // Act & Assert
            await expect(new GetUrlController().handle(input)).rejects.toThrow()
        })

        it('should handle validation errors for invalid search type', async () => {
            // Arrange
                  const input = {
        search: '123', // Invalid search type (should be string)
        page: 1,
        pageSize: 10
      }

            // Act & Assert
            await expect(new GetUrlController().handle(input)).rejects.toThrow()
        })

        it('should handle unknown errors', async () => {
            // Arrange
            vi.mocked(getUrl).mockRejectedValue('Unknown error')

            const input = {
                search: 'test',
                page: 1,
                pageSize: 10
            }

            // Act & Assert
            await expect(new GetUrlController().handle(input)).rejects.toThrow('Unknown error')
        })

        it('should handle null count_access values', async () => {
            // Arrange
            const mockData = {
                data: [
                    {
                        id: '1',
                        name: 'google',
                        url: 'https://www.google.com',
                        createdAt: new Date('2024-01-01'),
                        count_access: null
                    }
                ],
                total: 1,
                page: 1,
                pageSize: 10
            }

            vi.mocked(getUrl).mockResolvedValue(mockData)

            const input = {
        page: 1,
        pageSize: 10
      }

            // Act
            const result = await new GetUrlController().handle(input)

            // Assert
            expect(result.data[0].count_access).toBeNull()
            expect(result).toEqual({
                data: mockData.data,
                total: mockData.total,
                page: 1,
                pageSize: 10
            })
        })

        it('should handle large page numbers', async () => {
            // Arrange
            const mockData = {
                data: [],
                total: 0,
                page: 100,
                pageSize: 10
            }

            vi.mocked(getUrl).mockResolvedValue(mockData)

            const input = {
                page: 100,
                pageSize: 10
            }

            // Act
            const result = await new GetUrlController().handle(input)

            // Assert
            expect(getUrl).toHaveBeenCalledWith({
                search: undefined,
                page: 100,
                pageSize: 10
            })
            expect(result.page).toBe(100)
        })

        it('should handle large page sizes', async () => {
            // Arrange
            const mockData = {
                data: [],
                total: 0,
                page: 1,
                pageSize: 100
            }

            vi.mocked(getUrl).mockResolvedValue(mockData)

            const input = {
                page: 1,
                pageSize: 100
            }

            // Act
            const result = await new GetUrlController().handle(input)

            // Assert
            expect(getUrl).toHaveBeenCalledWith({
                search: undefined,
                page: 1,
                pageSize: 100
            })
            expect(result.pageSize).toBe(100)
        })
    })
}) 