export interface Message {
  id: string
  content: string
  sender: 'user' | 'ai' | 'system'
  timestamp: Date
  documentRefs?: string[] // References to documents used for this message
}