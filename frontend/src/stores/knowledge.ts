import { defineStore } from 'pinia'
import { ref } from 'vue'
import { Document } from '../types/knowledge'

export const useKnowledgeStore = defineStore('knowledge', () => {
  // State
  const documents = ref<Document[]>([])
  const selectedDocuments = ref<Document[]>([])
  const selectedDocument = ref<Document | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  
  // Get documents
  async function fetchDocuments() {
    loading.value = true
    error.value = null
    
    try {
      // In a real app, this would be an API call
      // For demo purposes, we'll simulate fetching documents
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // If no documents, add some sample ones
      if (documents.value.length === 0) {
        documents.value = [
          {
            id: '1',
            name: 'Introduction to Machine Learning.pdf',
            upload_path: '/uploads/intro-ml.pdf',
            uploaded_at: new Date('2023-12-10').toISOString(),
            size: 2500000
          },
          {
            id: '2',
            name: 'Data Science Fundamentals.pdf',
            upload_path: '/uploads/data-science.pdf',
            uploaded_at: new Date('2023-12-15').toISOString(),
            size: 3200000
          },
          {
            id: '3',
            name: 'Python Programming Guide.pdf',
            upload_path: '/uploads/python-guide.pdf',
            uploaded_at: new Date('2023-12-20').toISOString(),
            size: 1800000
          }
        ]
      }
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch documents'
    } finally {
      loading.value = false
    }
  }
  
  // Select a single document
  function selectDocument(document: Document) {
    selectedDocument.value = document
    selectedDocuments.value = [document]
  }
  
  // Toggle document selection
  function toggleDocumentSelection(document: Document) {
    const index = selectedDocuments.value.findIndex(doc => doc.id === document.id)
    if (index === -1) {
      selectedDocuments.value.push(document)
    } else {
      selectedDocuments.value.splice(index, 1)
    }
  }
  
  // Upload document
  async function uploadDocument(file: File) {
    loading.value = true
    error.value = null
    
    try {
      // In a real app, this would upload the file to a server
      // For demo purposes, we'll simulate a successful upload
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Create a new document
      const newDocument: Document = {
        id: Date.now().toString(),
        name: file.name,
        upload_path: `/uploads/${file.name.replace(/\s+/g, '-').toLowerCase()}`,
        uploaded_at: new Date().toISOString(),
        size: file.size
      }
      
      // Add to documents array
      documents.value.push(newDocument)
      
      return newDocument
    } catch (err: any) {
      error.value = err.message || 'Failed to upload document'
      throw err
    } finally {
      loading.value = false
    }
  }
  
  // Delete document
  async function deleteDocument(documentId: string) {
    loading.value = true
    error.value = null
    
    try {
      // In a real app, this would delete the file from the server
      // For demo purposes, we'll simulate a successful deletion
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Remove from documents array
      documents.value = documents.value.filter(doc => doc.id !== documentId)
      
      // Remove from selected documents if present
      selectedDocuments.value = selectedDocuments.value.filter(doc => doc.id !== documentId)
      
      // Clear selected document if it was deleted
      if (selectedDocument.value?.id === documentId) {
        selectedDocument.value = null
      }
      
      return true
    } catch (err: any) {
      error.value = err.message || 'Failed to delete document'
      return false
    } finally {
      loading.value = false
    }
  }
  
  // Rename document
  async function renameDocument(documentId: string, newName: string) {
    loading.value = true
    error.value = null
    
    try {
      // In a real app, this would update the file name on the server
      // For demo purposes, we'll simulate a successful rename
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Update the document name
      const documentIndex = documents.value.findIndex(doc => doc.id === documentId)
      if (documentIndex !== -1) {
        documents.value[documentIndex].name = newName
        
        // Update in selected documents if present
        const selectedIndex = selectedDocuments.value.findIndex(doc => doc.id === documentId)
        if (selectedIndex !== -1) {
          selectedDocuments.value[selectedIndex] = documents.value[documentIndex]
        }
        
        // Update selected document if it was renamed
        if (selectedDocument.value?.id === documentId) {
          selectedDocument.value = documents.value[documentIndex]
        }
      }
      
      return true
    } catch (err: any) {
      error.value = err.message || 'Failed to rename document'
      return false
    } finally {
      loading.value = false
    }
  }
  
  return {
    documents,
    selectedDocuments,
    selectedDocument,
    loading,
    error,
    fetchDocuments,
    selectDocument,
    toggleDocumentSelection,
    uploadDocument,
    deleteDocument,
    renameDocument
  }
})