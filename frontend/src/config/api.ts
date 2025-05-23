const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export interface Note {
  id: number
  title: string
  content: string
}

export interface NoteCreate {
  title: string
  content: string
}

class ApiService {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`
    
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    })

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`)
    }

    return response.json()
  }

  async getNotes(): Promise<Note[]> {
    return this.request<Note[]>('/notes')
  }

  async createNote(note: NoteCreate): Promise<Note> {
    return this.request<Note>('/notes', {
      method: 'POST',
      body: JSON.stringify(note),
    })
  }

  async updateNote(id: number, note: NoteCreate): Promise<Note> {
    return this.request<Note>(`/notes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(note),
    })
  }

  async deleteNote(id: number): Promise<{ ok: boolean }> {
    return this.request<{ ok: boolean }>(`/notes/${id}`, {
      method: 'DELETE',
    })
  }
}

export const apiService = new ApiService()