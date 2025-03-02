export interface Post {
    id: number
    title: string
    body: string
    userId: number
  }
  
  export interface Todo {
    id: number
    title: string
    completed: boolean
    userId: number
  }
  
  export interface User {
    email: string
    token: string
  }
  
  export interface ApiError {
    message: string
    statusCode: number
  }