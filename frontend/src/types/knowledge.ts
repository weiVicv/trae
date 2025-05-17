export interface Document {
  id: string
  name: string
  upload_path: string
  uploaded_at: string
  size: number
  processed?: boolean
}