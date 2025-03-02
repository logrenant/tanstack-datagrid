import React from 'react'
import ReactDOM from 'react-dom/client'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import './index.css'
import './App.css'
import App from './App'
import { AuthProvider } from './contexts/AuthContext'
import { DataProvider } from './contexts/DataContext'

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <DataProvider>
          <App />
          <ReactQueryDevtools initialIsOpen={false} />
        </DataProvider>
      </AuthProvider>
    </QueryClientProvider>
  </React.StrictMode>
)