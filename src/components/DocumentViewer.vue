<template>
  <div class="document-viewer h-full flex flex-col">
    <!-- Header with navigation controls -->
    <div class="viewer-header bg-gray-100 border-b p-2 flex items-center justify-between">
      <div class="flex items-center space-x-2">
        <button 
          @click="goBack" 
          class="px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded"
        >
          ← Back
        </button>
        <h2 class="text-lg font-semibold">{{ documentTitle }}</h2>
      </div>
      
      <div class="flex items-center space-x-2">
        <!-- Page navigation -->
        <button 
          @click="previousPage" 
          :disabled="currentPage <= 1"
          class="px-2 py-1 text-sm bg-blue-500 text-white rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span class="text-sm">
          Page {{ currentPage }} / {{ totalPages }}
        </span>
        <button 
          @click="nextPage" 
          :disabled="currentPage >= totalPages"
          class="px-2 py-1 text-sm bg-blue-500 text-white rounded disabled:opacity-50"
        >
          Next
        </button>
        
        <!-- Search within document -->
        <input 
          v-model="searchQuery"
          @keyup.enter="searchInDocument"
          type="text" 
          placeholder="Search in document..."
          class="px-2 py-1 border rounded text-sm w-48"
        >
        <button 
          @click="searchInDocument"
          class="px-3 py-1 text-sm bg-green-500 text-white rounded"
        >
          Search
        </button>
      </div>
    </div>

    <!-- Main content area -->
    <div class="viewer-content flex flex-1 overflow-hidden">
      <!-- Sidebar with TOC -->
      <div class="toc-sidebar w-64 bg-gray-50 border-r overflow-y-auto p-4" v-if="toc.length > 0">
        <h3 class="font-semibold mb-2">Table of Contents</h3>
        <ul class="space-y-1">
          <li 
            v-for="item in toc" 
            :key="item.toc_id"
            :class="getTocItemClass(item)"
          >
            <a 
              @click="navigateToSection(item)"
              class="block py-1 px-2 hover:bg-gray-200 rounded cursor-pointer text-sm"
              :class="{ 'font-semibold': item.level === 'H1' }"
            >
              {{ item.title }}
              <span class="text-gray-500 text-xs ml-1" v-if="item.start_book_page">
                (p. {{ item.start_book_page }})
              </span>
            </a>
          </li>
        </ul>
      </div>

      <!-- PDF viewer -->
      <div class="pdf-container flex-1 overflow-auto bg-gray-100 p-4">
        <div v-if="loading" class="text-center py-8">
          <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          <p class="mt-2">Loading document...</p>
        </div>
        
        <div v-else-if="error" class="text-center py-8 text-red-600">
          <p>Error: {{ error }}</p>
        </div>
        
        <!-- PDF.js canvas or iframe for PDF display -->
        <div v-else class="pdf-viewer bg-white shadow-lg mx-auto" style="max-width: 850px;">
          <!-- Option 1: Using iframe (simpler) -->
          <iframe 
            v-if="pdfUrl"
            :src="pdfViewerUrl"
            class="w-full"
            style="height: 800px; border: none;"
          ></iframe>
          
          <!-- Option 2: Using canvas with PDF.js (more control) -->
          <canvas 
            v-else
            ref="pdfCanvas"
            class="w-full"
          ></canvas>
        </div>

        <!-- Search results overlay -->
        <div v-if="searchResults.length > 0" class="search-results mt-4 bg-white p-4 rounded shadow">
          <h4 class="font-semibold mb-2">Search Results ({{ searchResults.length }})</h4>
          <ul class="space-y-2">
            <li 
              v-for="result in searchResults" 
              :key="result.chunk_id"
              class="border-b pb-2"
            >
              <a 
                @click="navigateToResult(result)"
                class="block hover:bg-gray-100 p-2 rounded cursor-pointer"
              >
                <div class="text-sm font-medium">{{ result.section || 'No section' }}</div>
                <div class="text-xs text-gray-600">Pages: {{ result.pages }}</div>
                <div class="text-sm mt-1">{{ truncateText(result.text, 150) }}</div>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { configService } from '@/services/configService'

export default {
  name: 'DocumentViewer',
  setup() {
    const route = useRoute()
    const router = useRouter()
    
    // State
    const loading = ref(true)
    const error = ref(null)
    const document = ref(null)
    const toc = ref([])
    const currentPage = ref(1)
    const totalPages = ref(0)
    const searchQuery = ref('')
    const searchResults = ref([])
    const pdfUrl = ref('')
    const highlightedChunk = ref(null)
    
    // Canvas ref for PDF.js
    const pdfCanvas = ref(null)
    
    // Computed
    const documentId = computed(() => route.params.id)
    const documentTitle = computed(() => document.value?.title || 'Document')
    
    // Build PDF viewer URL with navigation parameters
    const pdfViewerUrl = computed(() => {
      if (!pdfUrl.value) return ''
      
      // Get navigation parameters from route hash
      const hash = route.hash.substring(1)
      const params = new URLSearchParams(hash)
      const page = params.get('page') || currentPage.value
      
      // Using PDF.js viewer
      return `/pdfjs/web/viewer.html?file=${encodeURIComponent(pdfUrl.value)}#page=${page}`
    })
    
    // Methods
    const loadDocument = async () => {
      try {
        loading.value = true
        error.value = null
        
        // Build URL with hash parameters
        // Get API URL from configService
        const apiUrl = configService.getServerUrl()
        const baseUrl = `${apiUrl}/v1/documents/${documentId.value}`
        const hashParams = new URLSearchParams(route.hash.substring(1))
        
        // Add query parameters from hash
        const queryParams = new URLSearchParams()
        for (const [key, value] of hashParams) {
          queryParams.append(key, value)
        }
        
        const url = queryParams.toString() 
          ? `${baseUrl}?${queryParams}` 
          : baseUrl
        
        const response = await fetch(url, {
          headers: {
            'Authorization': `Bearer ${await getAuthToken()}`,
            'X-Tenant-Domain': window.location.hostname
          }
        })
        
        if (!response.ok) {
          throw new Error(`Failed to load document: ${response.statusText}`)
        }
        
        const data = await response.json()
        document.value = data.document
        toc.value = data.toc || []
        totalPages.value = data.document?.page_count || 0
        pdfUrl.value = data.pdf_url
        
        // Handle navigation from URL
        if (data.navigation) {
          if (data.navigation.page) {
            currentPage.value = data.navigation.page
          }
          if (data.navigation.chunk) {
            highlightedChunk.value = data.navigation.chunk
            // Scroll to and highlight the chunk
            setTimeout(() => highlightChunk(data.navigation.chunk), 500)
          }
        }
        
        // Handle section navigation
        if (data.section_info) {
          const startPage = data.section_info.start_book_page
          if (startPage) {
            currentPage.value = startPage
          }
        }
        
      } catch (err) {
        console.error('Error loading document:', err)
        error.value = err.message
      } finally {
        loading.value = false
      }
    }
    
    const navigateToSection = (tocItem) => {
      if (tocItem.start_book_page) {
        currentPage.value = tocItem.start_book_page
        updateUrlHash()
      }
    }
    
    const navigateToResult = (result) => {
      // Parse the citation URL
      const url = new URL(result.citation_url, window.location.origin)
      const hash = url.hash.substring(1)
      const params = new URLSearchParams(hash)
      
      // Update route with new hash
      router.push({
        name: 'document-viewer',
        params: { id: documentId.value },
        hash: `#${params.toString()}`
      })
      
      // Highlight the result
      if (result.chunk_id) {
        highlightChunk(result.chunk_id)
      }
    }
    
    const highlightChunk = (chunkId) => {
      // This would integrate with PDF.js to highlight specific text
      // For now, just store the highlighted chunk
      highlightedChunk.value = chunkId
      
      // If using PDF.js, you would:
      // 1. Find the text in the PDF
      // 2. Add highlight annotation
      // 3. Scroll to the location
    }
    
    const searchInDocument = async () => {
      if (!searchQuery.value.trim()) {
        searchResults.value = []
        return
      }
      
      try {
        // Get API URL from configService
        const apiUrl = configService.getServerUrl()
        
        const response = await fetch(
          `${apiUrl}/v1/documents/${documentId.value}/search`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${await getAuthToken()}`,
              'X-Tenant-Domain': window.location.hostname
            },
            body: JSON.stringify({
              query: searchQuery.value,
              page_range: null // Search all pages
            })
          }
        )
        
        if (!response.ok) {
          throw new Error('Search failed')
        }
        
        const data = await response.json()
        searchResults.value = data.results || []
        
      } catch (err) {
        console.error('Search error:', err)
        error.value = 'Search failed'
      }
    }
    
    const previousPage = () => {
      if (currentPage.value > 1) {
        currentPage.value--
        updateUrlHash()
      }
    }
    
    const nextPage = () => {
      if (currentPage.value < totalPages.value) {
        currentPage.value++
        updateUrlHash()
      }
    }
    
    const updateUrlHash = () => {
      const params = new URLSearchParams()
      params.set('page', currentPage.value)
      
      if (highlightedChunk.value) {
        params.set('highlight', highlightedChunk.value)
      }
      
      router.replace({
        name: 'document-viewer',
        params: { id: documentId.value },
        hash: `#${params.toString()}`
      })
    }
    
    const goBack = () => {
      router.back()
    }
    
    const getAuthToken = async () => {
      // Get token from localStorage (should be set after login)
      return localStorage.getItem('algo_token') || ''
    }
    
    const getTocItemClass = (item) => {
      const classes = []
      if (item.level === 'H2') classes.push('ml-4')
      if (item.level === 'H3') classes.push('ml-8')
      return classes.join(' ')
    }
    
    const truncateText = (text, maxLength) => {
      if (!text) return ''
      if (text.length <= maxLength) return text
      return text.substring(0, maxLength) + '...'
    }
    
    // Watch for route changes
    watch(() => route.hash, () => {
      if (route.name === 'document-viewer') {
        loadDocument()
      }
    })
    
    // Load document on mount
    onMounted(() => {
      loadDocument()
    })
    
    return {
      loading,
      error,
      document,
      toc,
      currentPage,
      totalPages,
      searchQuery,
      searchResults,
      pdfUrl,
      pdfCanvas,
      documentTitle,
      pdfViewerUrl,
      highlightedChunk,
      loadDocument,
      navigateToSection,
      navigateToResult,
      searchInDocument,
      previousPage,
      nextPage,
      goBack,
      getTocItemClass,
      truncateText
    }
  }
}
</script>

<style scoped>
.document-viewer {
  height: 100vh;
}

.toc-sidebar {
  min-width: 16rem;
}

.pdf-container {
  background: #e5e5e5;
}

.search-results {
  max-height: 300px;
  overflow-y: auto;
}

/* Highlight animation */
@keyframes highlight-fade {
  0% { background-color: yellow; }
  100% { background-color: transparent; }
}

.highlight {
  animation: highlight-fade 2s ease-in-out;
}
</style>