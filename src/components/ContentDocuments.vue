<template>
  <div class="h-full flex flex-col bg-gray-50 dark:bg-gray-900">
    <!-- Header -->
    <div class="flex-shrink-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 sm:px-6 py-4">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="flex-shrink-0 h-10 w-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
            <HandDrawnIcon name="document" size="md" class="text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h2 class="text-xl font-bold text-gray-900 dark:text-white">Course Documents</h2>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              {{ filteredDocuments.length }} of {{ documents.length }} document{{ documents.length !== 1 ? 's' : '' }} {{ searchQuery ? 'matching search' : 'available' }}
            </p>
          </div>
        </div>
        <button 
          v-if="hasUploadDownloadPermission"
          @click="showUploadModal = true"
          class="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors flex items-center gap-2 text-sm font-medium"
        >
          <HandDrawnIcon name="upload" size="xs" />
          Upload Document
        </button>
      </div>
    </div>

    <!-- Content -->
    <div class="flex-1 overflow-auto p-4 sm:p-6">
      <!-- Search Box -->
      <div v-if="documents.length > 0" class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6">
        <div class="flex items-center gap-3">
          <div class="flex-shrink-0">
            <HandDrawnIcon name="search" size="sm" class="text-gray-400 dark:text-gray-500" />
          </div>
          <div class="flex-1">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search documents by name, type, filename, or status..."
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
          </div>
          <div v-if="searchQuery" class="flex-shrink-0">
            <button
              @click="searchQuery = ''"
              class="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-all duration-200"
              title="Clear search"
            >
              <HandDrawnIcon name="close" size="xs" />
            </button>
          </div>
        </div>
      </div>
      
      <!-- Loading State -->
      <div v-if="loading" class="flex items-center justify-center py-12">
        <div class="text-center">
          <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
          <p class="text-gray-600 dark:text-gray-400">Loading documents...</p>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="flex items-center justify-center py-12">
        <div class="text-center max-w-md">
          <div class="w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <HandDrawnIcon name="alert" size="xl" class="text-red-600 dark:text-red-400" />
          </div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Error Loading Documents</h3>
          <p class="text-gray-600 dark:text-gray-400 mb-4">{{ error }}</p>
          <button 
            @click="loadDocuments"
            class="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else-if="documents.length === 0" class="flex items-center justify-center py-12">
        <div class="text-center max-w-md">
          <div class="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <HandDrawnIcon name="document" size="xl" class="text-gray-400 dark:text-gray-500" />
          </div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">No Documents Yet</h3>
          <p class="text-gray-600 dark:text-gray-400 mb-6">Upload your first course document to get started.</p>
          <button 
            v-if="hasUploadDownloadPermission"
            @click="showUploadModal = true"
            class="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors flex items-center gap-2 mx-auto"
          >
            <HandDrawnIcon name="upload" size="sm" />
            Upload First Document
          </button>
          <p v-else class="text-sm text-gray-500 dark:text-gray-400">
            You don't have permission to upload documents.
          </p>
        </div>
      </div>

      <!-- Documents Table -->
      <div v-else class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Document
                </th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Type
                </th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Size
                </th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              <!-- No results found state -->
              <tr v-if="filteredDocuments.length === 0 && documents.length > 0" class="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td colspan="6" class="px-6 py-12 text-center">
                  <div class="flex flex-col items-center gap-3">
                    <HandDrawnIcon name="search" size="2xl" class="text-gray-300 dark:text-gray-600" />
                    <div>
                      <h3 class="text-lg font-medium text-gray-900 dark:text-white">No documents found</h3>
                      <p class="text-sm text-gray-500 dark:text-gray-400">
                        No documents match "{{ searchQuery }}"
                      </p>
                    </div>
                    <button
                      @click="searchQuery = ''"
                      class="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors text-sm"
                    >
                      Clear search
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-else v-for="document in filteredDocuments" :key="document.id" class="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td class="px-4 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-10 w-10 rounded-lg flex items-center justify-center" :class="getFileTypeClass(document.file_type)">
                      <HandDrawnIcon :name="getFileTypeIcon(document.file_type)" size="md" />
                    </div>
                    <div class="ml-3">
                      <div class="text-sm font-medium text-gray-900 dark:text-white">{{ document.document_name }}</div>
                      <div class="text-xs text-gray-500 dark:text-gray-400">{{ document.original_filename }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-4 py-4 whitespace-nowrap">
                  <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full" :class="getDocumentTypeClass(document.document_type)">
                    {{ formatDocumentType(document.document_type) }}
                  </span>
                </td>
                <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {{ formatFileSize(document.file_size) }}
                </td>
                <td class="px-4 py-4 whitespace-nowrap">
                  <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full" :class="getStatusClass(document.processing_status)">
                    {{ formatStatus(document.processing_status) }}
                  </span>
                </td>
                <td class="px-4 py-4 whitespace-nowrap text-sm font-medium">
                  <div class="flex items-center gap-2">
                    <button 
                      v-if="hasUploadDownloadPermission"
                      @click="downloadDocument(document)"
                      class="px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors flex items-center gap-2 text-sm font-medium"
                      title="Download"
                    >
                      <HandDrawnIcon name="download" size="xs" />
                      <span>Download</span>
                    </button>
                    <button 
                      v-if="hasDeletePermission"
                      @click="deleteDocument(document)"
                      class="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-md transition-colors flex items-center gap-2 text-sm font-medium"
                      title="Delete"
                    >
                      <HandDrawnIcon name="trash" size="xs" />
                      <span>Delete</span>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Upload Modal -->
    <div v-if="showUploadModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" @click="handleOverlayClick">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md" @click.stop>
        <div class="p-6">
          <!-- Header -->
          <div class="flex items-center justify-between mb-6">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                <HandDrawnIcon name="upload" size="md" class="text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Upload Document</h3>
                <p class="text-sm text-gray-500 dark:text-gray-400">Add a new document to this course</p>
              </div>
            </div>
            <button @click="closeUploadModal" class="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <HandDrawnIcon name="close" size="sm" />
            </button>
          </div>

          <!-- Upload Form -->
          <form @submit.prevent="handleUpload" class="space-y-4">
            <!-- Document Name -->
            <div>
              <label for="document_name" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Document Name <span class="text-red-500">*</span>
              </label>
              <input
                id="document_name"
                v-model="uploadForm.document_name"
                type="text"
                required
                placeholder="Enter document name"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
            </div>

            <!-- Document Type -->
            <div>
              <label for="document_type" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Document Type <span class="text-red-500">*</span>
              </label>
              <select
                id="document_type"
                v-model="uploadForm.document_type"
                required
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select type</option>
                <option value="Curriculum">Curriculum</option>
                <option value="Assignment">Assignment</option>
                <option value="Reference Material">Reference Material</option>
                <option value="Handout">Handout</option>
                <option value="Worksheet">Worksheet</option>
                <option value="Presentation">Presentation</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <!-- File Upload -->
            <div>
              <label for="file" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                File <span class="text-red-500">*</span>
              </label>
              <div class="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 text-center hover:border-blue-400 dark:hover:border-blue-500 transition-colors">
                <input
                  id="file"
                  ref="fileInput"
                  type="file"
                  @change="handleFileSelect"
                  class="hidden"
                  accept=".pdf,.doc,.docx,.txt"
                >
                <div v-if="!uploadForm.file" @click="$refs.fileInput.click()" class="cursor-pointer">
                  <HandDrawnIcon name="upload" size="xl" class="text-gray-400 mb-2" />
                  <p class="text-sm text-gray-600 dark:text-gray-400">Click to select file</p>
                  <p class="text-xs text-gray-500 dark:text-gray-500 mt-1">PDF, TXT, DOC (max 10MB)</p>
                </div>
                <div v-else class="flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <HandDrawnIcon :name="getFileTypeIcon(getFileExtension(uploadForm.file.name))" size="md" />
                    <div>
                      <p class="text-sm font-medium text-gray-900 dark:text-white">{{ uploadForm.file.name }}</p>
                      <p class="text-xs text-gray-500 dark:text-gray-400">{{ formatFileSize(uploadForm.file.size) }}</p>
                    </div>
                  </div>
                  <button type="button" @click="clearFile" class="p-1 text-red-500 hover:text-red-700 transition-colors">
                    <HandDrawnIcon name="close" size="sm" />
                  </button>
                </div>
              </div>
            </div>

            <!-- Upload Progress -->
            <div v-if="uploading" class="space-y-2">
              <div class="flex justify-between text-sm">
                <span class="text-gray-600 dark:text-gray-400">Uploading...</span>
                <span class="text-gray-600 dark:text-gray-400">{{ uploadProgress }}%</span>
              </div>
              <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div class="bg-blue-500 h-2 rounded-full transition-all duration-300" :style="{ width: uploadProgress + '%' }"></div>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex gap-3 pt-4">
              <button
                type="button"
                @click="closeUploadModal"
                class="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                :disabled="uploading"
              >
                Cancel
              </button>
              <button
                type="submit"
                class="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white rounded-lg transition-colors"
                :disabled="!isUploadFormValid || uploading"
              >
                <span v-if="uploading">Uploading...</span>
                <span v-else>Upload</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Confirmation Dialog -->
    <ConfirmationDialog
      ref="confirmDialog"
      title="Delete Document"
      :message="`Are you sure you want to delete '${deletingDocument?.document_name}'? This action cannot be undone.`"
      confirm-text="Delete"
      cancel-text="Cancel"
      confirm-icon="trash"
      @confirm="confirmDelete"
      @cancel="handleDeleteCancel"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { supabase } from '../services/supabase.js'
import { UserService } from '../services/userService.js'
import ConfirmationDialog from './ConfirmationDialog.vue'
import HandDrawnIcon from './HandDrawnIcon.vue'

const props = defineProps({
  classId: [String, Number],
  courseName: String
})

// State
const loading = ref(false)
const error = ref('')
const documents = ref([])
const searchQuery = ref('')
const showUploadModal = ref(false)
const deletingDocument = ref(null)
const uploading = ref(false)
const uploadProgress = ref(0)
const confirmDialog = ref(null)

// Upload form
const uploadForm = ref({
  document_name: '',
  document_type: 'Curriculum',  // Set first option as default
  file: null
})

// Computed
const isUploadFormValid = computed(() => {
  return uploadForm.value.document_name.trim() && 
         uploadForm.value.document_type && 
         uploadForm.value.file
})

// Filter documents based on search query
const filteredDocuments = computed(() => {
  if (!searchQuery.value.trim()) {
    return documents.value
  }
  
  const query = searchQuery.value.toLowerCase().trim()
  return documents.value.filter(document => 
    document.document_name?.toLowerCase().includes(query) ||
    document.document_type?.toLowerCase().includes(query) ||
    document.original_filename?.toLowerCase().includes(query) ||
    document.processing_status?.toLowerCase().includes(query)
  )
})

// Check if user has upload/download permissions
const hasUploadDownloadPermission = computed(() => {
  try {
    const profile = UserService.getStoredProfile()
    if (profile && profile.permissions && Array.isArray(profile.permissions)) {
      return profile.permissions.some(permission => 
        (permission.name === 'super_admin' || permission.name === 'documents_upload_class') && 
        permission.is_active
      )
    }
  } catch (error) {
    console.error('Error checking upload/download permission:', error)
  }
  return false
})

// Check if user has delete permissions
const hasDeletePermission = computed(() => {
  try {
    const profile = UserService.getStoredProfile()
    if (profile && profile.permissions && Array.isArray(profile.permissions)) {
      return profile.permissions.some(permission => 
        (permission.name === 'super_admin' || permission.name === 'documents_delete_class') && 
        permission.is_active
      )
    }
  } catch (error) {
    console.error('Error checking delete permission:', error)
  }
  return false
})

// Methods
const loadDocuments = async () => {
  try {
    loading.value = true
    error.value = ''
    
    const { data, error: rpcError } = await supabase.rpc('algo_get_class_documents', {
      p_class_id: props.classId
    })
    
    if (rpcError) {
      throw rpcError
    }
    
    if (data.success) {
      documents.value = data.documents || []
      console.log('ContentDocuments: Loaded documents with structure:', documents.value)
      if (documents.value.length > 0) {
        console.log('ContentDocuments: First document fields:', Object.keys(documents.value[0]))
        console.log('ContentDocuments: First document storage info:', {
          storage_bucket_id: documents.value[0].storage_bucket_id,
          storage_object_name: documents.value[0].storage_object_name,
          storage_object_id: documents.value[0].storage_object_id
        })
      }
    } else {
      error.value = data.error || 'Failed to load documents'
    }
  } catch (err) {
    console.error('Error loading documents:', err)
    error.value = err.message || 'Failed to load documents'
  } finally {
    loading.value = false
  }
}

const handleFileSelect = (event) => {
  const file = event.target.files[0]
  if (file) {
    // Check file type (only PDF, TXT, DOC, DOCX allowed)
    const allowedExtensions = ['pdf', 'txt', 'doc', 'docx']
    const fileExtension = file.name.split('.').pop().toLowerCase()
    
    if (!allowedExtensions.includes(fileExtension)) {
      if (window.toast) {
        window.toast.error('Invalid File Type', 'Only PDF, TXT, and DOC files are supported')
      }
      // Clear the file input
      if (event.target) {
        event.target.value = ''
      }
      return
    }
    
    // Check file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      if (window.toast) {
        window.toast.error('File Too Large', 'File size must be less than 10MB')
      }
      return
    }
    uploadForm.value.file = file
  }
}

const clearFile = () => {
  uploadForm.value.file = null
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

const handleUpload = async () => {
  if (!isUploadFormValid.value) return
  
  try {
    uploading.value = true
    uploadProgress.value = 0
    
    // Get user profile data for path construction
    const profile = UserService.getStoredProfile()
    if (!profile) {
      throw new Error('User profile not found')
    }
    
    const tenantName = profile.current_tenant?.name
    const academicYearName = profile.current_academic_year?.name
    const classId = props.classId
    
    if (!tenantName || !academicYearName || !classId) {
      throw new Error('Missing required path components: tenant name, academic year name, or class ID')
    }
    
    // Find the course that contains this class
    let courseName = 'Course'
    for (const course of profile.courses || []) {
      if (course.classes && Array.isArray(course.classes)) {
        const foundClass = course.classes.find(c => c.id === parseInt(classId))
        if (foundClass) {
          courseName = course.name
          break
        }
      }
    }
    
    // Format document type: lowercase and replace spaces with dashes
    const documentType = uploadForm.value.document_type.toLowerCase().replace(/\s+/g, '-')
    
    // Get original filename
    const filename = uploadForm.value.file.name
    
    // Construct file path: tenant-name/academic-year-name/course-name-classId/document_type/filename
    const filePath = `${tenantName}/${academicYearName}/${courseName}-${classId}/${documentType}/${filename}`
    
    console.log('Uploading file with path:', filePath)
    console.log('File details:', {
      name: filename,
      size: uploadForm.value.file.size,
      type: uploadForm.value.file.type
    })
    
    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('algo-class-bucket')
      .upload(filePath, uploadForm.value.file, {
        cacheControl: '3600',
        upsert: false // Set to true to overwrite existing files
      })
    
    if (error) {
      throw error
    }
    
    console.log('Upload successful!', data)
    
    // Create document record in database
    const { data: documentData, error: documentError } = await supabase.rpc('algo_create_class_document', {
      p_class_id: classId,
      p_document_type: uploadForm.value.document_type,
      p_file_extension: uploadForm.value.file.name.split('.').pop(),
      p_original_filename: uploadForm.value.file.name,
      p_storage_bucket_id: 'algo-class-bucket',
      p_storage_object_name: data.path,
      p_document_name: uploadForm.value.document_name,
      p_file_size: uploadForm.value.file.size,
      p_storage_object_id: data.id
    })
    
    if (documentError) {
      console.error('Document record creation failed:', documentError)
      // File was uploaded but database record failed - should we delete the file?
      throw new Error(`File uploaded but failed to create database record: ${documentError.message}`)
    }
    
    console.log('Document record created successfully:', documentData)
    
    // Show success toast notification
    if (window.toast) {
      window.toast.success('Upload Successful', `${filename} has been successfully uploaded`)
    }
    
    closeUploadModal()
    await loadDocuments() // Refresh list
    
  } catch (err) {
    console.error('Upload error:', err)
    
    // Show error toast notification
    if (window.toast) {
      window.toast.error('Upload Failed', err.message || 'An error occurred while uploading the document')
    }
    
    console.log('Error details:', {
      success: false,
      error: err.message,
      timestamp: new Date().toISOString()
    })
  } finally {
    uploading.value = false
    uploadProgress.value = 0
  }
}

const downloadDocument = async (doc) => {
  try {
    console.log('Starting download for document:', {
      id: doc.id,
      name: doc.document_name,
      filename: doc.original_filename,
      bucket: doc.storage_bucket_id,
      objectName: doc.storage_object_name
    })
    
    if (!doc.storage_bucket_id || !doc.storage_object_name) {
      throw new Error('Document storage information is missing')
    }
    
    // Show loading toast
    if (window.toast) {
      window.toast.info('Download Started', `Preparing ${doc.original_filename} for download...`)
    }
    
    // Download the file from Supabase Storage
    const { data, error } = await supabase.storage
      .from(doc.storage_bucket_id)
      .download(doc.storage_object_name)
    
    if (error) {
      console.error('Supabase storage download error:', error)
      throw new Error(`Download failed: ${error.message}`)
    }
    
    if (!data) {
      throw new Error('No data received from storage')
    }
    
    console.log('Download successful, creating blob and download link')
    
    // Create a blob URL and trigger download
    const blob = new Blob([data], { 
      type: data.type || 'application/octet-stream' 
    })
    const url = window.URL.createObjectURL(blob)
    
    // Create temporary download link and trigger download
    const link = document.createElement('a')
    link.href = url
    link.download = doc.original_filename || `document_${doc.id}`
    document.body.appendChild(link)
    link.click()
    
    // Cleanup
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
    
    // Show success toast
    if (window.toast) {
      window.toast.success('Download Complete', `${doc.original_filename} has been downloaded`)
    }
    
    console.log('Document download completed successfully')
    
  } catch (err) {
    console.error('Download error:', {
      error: err,
      message: err.message,
      document: {
        id: doc.id,
        name: doc.document_name,
        bucket: doc.storage_bucket_id,
        objectName: doc.storage_object_name
      }
    })
    
    // Show error toast
    if (window.toast) {
      window.toast.error('Download Failed', err.message || 'An error occurred while downloading the document')
    }
  }
}

const deleteDocument = (doc) => {
  deletingDocument.value = doc
  confirmDialog.value?.open()
}

const confirmDelete = async () => {
  try {
    if (!deletingDocument.value) {
      throw new Error('No document selected for deletion')
    }

    console.log('Starting document deletion process:', {
      documentId: deletingDocument.value.id,
      documentName: deletingDocument.value.document_name,
      storageBucket: deletingDocument.value.storage_bucket_id,
      storageObjectName: deletingDocument.value.storage_object_name,
      storageObjectId: deletingDocument.value.storage_object_id
    })

    let storageDeleteSuccess = false
    let storageDeleteError = null

    // Step 1: Delete file from Supabase Storage
    if (deletingDocument.value.storage_bucket_id && deletingDocument.value.storage_object_name) {
      console.log('Attempting storage deletion:', {
        bucket: deletingDocument.value.storage_bucket_id,
        path: deletingDocument.value.storage_object_name
      })

      try {
        const storageResult = await supabase.storage
          .from(deletingDocument.value.storage_bucket_id)
          .remove([deletingDocument.value.storage_object_name])

        console.log('Storage deletion result:', storageResult)

        if (storageResult.error) {
          console.error('Storage deletion failed:', {
            error: storageResult.error,
            message: storageResult.error.message,
            statusCode: storageResult.error.statusCode,
            details: storageResult.error
          })
          storageDeleteError = storageResult.error
          // STOP HERE - do not proceed to database deletion if storage fails
          throw new Error(`Storage deletion failed: ${storageResult.error.message}. Database record preserved to prevent orphaned files.`)
        } else {
          console.log('Storage deletion successful:', storageResult.data)
          storageDeleteSuccess = true
        }
      } catch (storageException) {
        console.error('Storage deletion exception:', storageException)
        storageDeleteError = storageException
        // STOP HERE - do not proceed to database deletion if storage fails
        throw new Error(`Storage deletion failed: ${storageException.message}. Database record preserved to prevent orphaned files.`)
      }
    } else {
      console.warn('Document missing storage information:', {
        hasBucket: !!deletingDocument.value.storage_bucket_id,
        hasObjectName: !!deletingDocument.value.storage_object_name,
        document: deletingDocument.value
      })
      storageDeleteSuccess = true // Consider it successful if no storage info
    }

    // Step 2: Delete record from database (ONLY if storage deletion was successful)
    if (storageDeleteSuccess) {
      console.log('Storage deletion successful, proceeding with database deletion for document ID:', deletingDocument.value.id)
      
      const { data, error: rpcError } = await supabase.rpc('algo_delete_documents', {
        p_document_ids: [deletingDocument.value.id],
        p_course_id: null,
        p_class_id: props.classId
      })

      console.log('Database deletion result:', { data, error: rpcError })

      if (rpcError) {
        console.error('Database deletion RPC error:', rpcError)
        throw new Error(`Database deletion failed: ${rpcError.message}`)
      }

      if (data && !data.success) {
        console.error('Database deletion failed with response:', data)
        throw new Error(data.error || 'Failed to delete document from database')
      }

      // Success - both storage and database deleted
      console.log('Document completely deleted from both storage and database')
      if (window.toast) {
        window.toast.success('Document Deleted', `${deletingDocument.value.document_name} has been completely removed`)
      }
      
      deletingDocument.value = null
      await loadDocuments() // Refresh list
    }
    
  } catch (err) {
    console.error('Delete operation failed:', {
      error: err,
      message: err.message,
      stack: err.stack,
      document: deletingDocument.value
    })
    
    // Show error toast
    if (window.toast) {
      window.toast.error('Delete Failed', err.message || 'Failed to delete document')
    }
  }
}

const handleDeleteCancel = () => {
  deletingDocument.value = null
}

const closeUploadModal = () => {
  showUploadModal.value = false
  uploadForm.value = {
    document_name: '',
    document_type: 'Curriculum',  // Reset to default first option
    file: null
  }
  uploading.value = false
  uploadProgress.value = 0
}

const handleOverlayClick = (event) => {
  if (event.target === event.currentTarget) {
    closeUploadModal()
  }
}

// Helper functions
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const getFileExtension = (filename) => {
  return filename.split('.').pop().toLowerCase()
}

const getFileTypeIcon = (fileType) => {
  const extensions = {
    pdf: 'pdf',
    doc: 'doc',
    docx: 'doc',
    txt: 'txt'
  }
  return extensions[fileType] || 'document'
}

const getFileTypeClass = (fileType) => {
  const classes = {
    pdf: 'bg-red-50 dark:bg-red-900/20',
    doc: 'bg-blue-50 dark:bg-blue-900/20',
    docx: 'bg-blue-50 dark:bg-blue-900/20',
    ppt: 'bg-orange-50 dark:bg-orange-900/20',
    pptx: 'bg-orange-50 dark:bg-orange-900/20',
    jpg: 'bg-green-50 dark:bg-green-900/20',
    jpeg: 'bg-green-50 dark:bg-green-900/20',
    png: 'bg-green-50 dark:bg-green-900/20',
    gif: 'bg-green-50 dark:bg-green-900/20',
    txt: 'bg-gray-50 dark:bg-gray-700'
  }
  return classes[fileType] || 'bg-gray-50 dark:bg-gray-700'
}

const getDocumentTypeClass = (type) => {
  const classes = {
    curriculum: 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200',
    assignment: 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200',
    reference: 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200',
    handout: 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200',
    worksheet: 'bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200',
    presentation: 'bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200'
  }
  return classes[type] || 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
}

const getStatusClass = (status) => {
  const classes = {
    completed: 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200',
    processing: 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200',
    failed: 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
  }
  return classes[status] || 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
}

const formatDocumentType = (type) => {
  return type.charAt(0).toUpperCase() + type.slice(1)
}

const formatStatus = (status) => {
  return status.charAt(0).toUpperCase() + status.slice(1)
}

// Lifecycle
onMounted(() => {
  if (props.classId) {
    loadDocuments()
  }
})
</script>