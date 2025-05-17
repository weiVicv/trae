export type AudioStyle = 'conversation' | 'narration' | 'interview'

export interface AudioRequest {
  documentIds: string[]
  style: string
  name: string
}

export interface AudioGeneration {
  id: string
  name: string
  documentIds: string[]
  style: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  audioUrl?: string
  createdAt: string
  duration?: number // in seconds
  error?: string
}