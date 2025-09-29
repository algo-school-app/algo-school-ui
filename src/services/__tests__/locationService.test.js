import { describe, it, expect, beforeEach, vi } from 'vitest'
import { LocationService } from '../locationService.js'

// Mock fetch
global.fetch = vi.fn()

describe('LocationService Enum Integration', () => {
  let locationService

  beforeEach(() => {
    // Clear cache before each test
    LocationService.clearEnumCache()
    locationService = new LocationService()

    // Mock auth token
    vi.spyOn(locationService, 'getAuthToken').mockResolvedValue('mock-token')

    // Mock config
    locationService.baseUrl = 'http://localhost:8001'
    locationService.clientId = 'test-client'
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  describe('getEnumValues', () => {
    it('should fetch enum values from API successfully', async () => {
      const mockEnumData = {
        building_types: [
          { value: 'academic', label: 'Academic' },
          { value: 'administrative', label: 'Administrative' }
        ],
        room_types: [
          { value: 'classroom', label: 'Classroom' },
          { value: 'laboratory', label: 'Laboratory' }
        ]
      }

      fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockEnumData)
      })

      const result = await locationService.getEnumValues()

      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:8001/v1/locations/enums',
        expect.objectContaining({
          headers: expect.objectContaining({
            'Authorization': 'Bearer mock-token',
            'Content-Type': 'application/json'
          })
        })
      )

      expect(result).toEqual(mockEnumData)
      expect(LocationService.enumCache).toEqual(mockEnumData)
    })

    it('should return cached values on subsequent calls', async () => {
      const mockEnumData = {
        building_types: [{ value: 'academic', label: 'Academic' }],
        room_types: [{ value: 'classroom', label: 'Classroom' }]
      }

      // Set up cache
      LocationService.enumCache = mockEnumData
      LocationService.enumCacheTimestamp = Date.now()

      const result = await locationService.getEnumValues()

      expect(fetch).not.toHaveBeenCalled()
      expect(result).toEqual(mockEnumData)
    })

    it('should refresh cache after expiration', async () => {
      const oldData = { building_types: [], room_types: [] }
      const newData = {
        building_types: [{ value: 'academic', label: 'Academic' }],
        room_types: [{ value: 'classroom', label: 'Classroom' }]
      }

      // Set up expired cache
      LocationService.enumCache = oldData
      LocationService.enumCacheTimestamp = Date.now() - (6 * 60 * 1000) // 6 minutes ago

      fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(newData)
      })

      const result = await locationService.getEnumValues()

      expect(fetch).toHaveBeenCalled()
      expect(result).toEqual(newData)
      expect(LocationService.enumCache).toEqual(newData)
    })

    it('should return fallback values on API error', async () => {
      fetch.mockRejectedValueOnce(new Error('Network error'))

      const result = await locationService.getEnumValues()

      expect(result).toEqual(locationService.getFallbackEnumValues())
    })
  })

  describe('getBuildingTypes', () => {
    it('should return building types from API', async () => {
      const mockBuildingTypes = [
        { value: 'academic', label: 'Academic' },
        { value: 'administrative', label: 'Administrative' }
      ]

      fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          building_types: mockBuildingTypes,
          room_types: []
        })
      })

      const result = await locationService.getBuildingTypes()

      expect(result).toEqual(mockBuildingTypes)
    })

    it('should return fallback values on API error', async () => {
      fetch.mockRejectedValueOnce(new Error('Network error'))

      const result = await locationService.getBuildingTypes()

      expect(result).toEqual(locationService.getFallbackBuildingTypes())
    })
  })

  describe('getRoomTypes', () => {
    it('should return room types from API', async () => {
      const mockRoomTypes = [
        { value: 'classroom', label: 'Classroom' },
        { value: 'laboratory', label: 'Laboratory' }
      ]

      fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          building_types: [],
          room_types: mockRoomTypes
        })
      })

      const result = await locationService.getRoomTypes()

      expect(result).toEqual(mockRoomTypes)
    })

    it('should return fallback values on API error', async () => {
      fetch.mockRejectedValueOnce(new Error('Network error'))

      const result = await locationService.getRoomTypes()

      expect(result).toEqual(locationService.getFallbackRoomTypes())
    })
  })

  describe('Fallback methods', () => {
    it('should provide consistent fallback building types', () => {
      const fallbackTypes = locationService.getFallbackBuildingTypes()

      expect(Array.isArray(fallbackTypes)).toBe(true)
      expect(fallbackTypes.length).toBeGreaterThan(0)
      expect(fallbackTypes[0]).toHaveProperty('value')
      expect(fallbackTypes[0]).toHaveProperty('label')
    })

    it('should provide consistent fallback room types', () => {
      const fallbackTypes = locationService.getFallbackRoomTypes()

      expect(Array.isArray(fallbackTypes)).toBe(true)
      expect(fallbackTypes.length).toBeGreaterThan(0)
      expect(fallbackTypes[0]).toHaveProperty('value')
      expect(fallbackTypes[0]).toHaveProperty('label')
    })
  })

  describe('Cache management', () => {
    it('should clear cache when requested', () => {
      LocationService.enumCache = { test: 'data' }
      LocationService.enumCacheTimestamp = Date.now()

      LocationService.clearEnumCache()

      expect(LocationService.enumCache).toBeNull()
      expect(LocationService.enumCacheTimestamp).toBeNull()
    })
  })
})