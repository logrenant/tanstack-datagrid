import { create } from "zustand"

interface ApiStore {
  token: string | null
  setToken: (token: string | null) => void
  apiFetch: <T = any>(url: string, options?: RequestInit) => Promise<T>
}

export const useApiStore = create<ApiStore>((set, get) => ({
  token: null,
  setToken: (token: string | null) => set({ token }),
  apiFetch: async (url: string, options: RequestInit = {}) => {
    const token = get().token
    const baseURL = import.meta.env.VITE_API_BASE_URL

    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(options.headers as Record<string, string> || {})
      }
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }

    const response = await fetch(`${baseURL}${url}`, {
      ...options,
      headers,
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'An error occurred')
    }

    return response.json()
  },
}))
