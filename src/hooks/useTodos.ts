import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useDataContext } from '../contexts/DataContext'
import { Todo } from '../types'

export const useTodos = () => {
  const queryClient = useQueryClient()
  const { setTodos } = useDataContext()

  useQuery<Todo[]>({
    queryKey: ['todos'],
    queryFn: () =>
      fetch('https://caab1a6b08f0cda2301b.free.beeceptor.com/api/todos/')
        .then(res => res.json())
        .then(data => {
          setTodos(data)
          return data
        })
  })

  const createTodo = useMutation<Todo, Error, Todo>({
    mutationFn: async (newTodo: Todo) => {
      const response = await fetch('https://caab1a6b08f0cda2301b.free.beeceptor.com/api/todos/', {
        method: 'POST',
        body: JSON.stringify(newTodo),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      })
      
      if (!response.ok) {
        throw new Error('Error creating post')
      }
      
      return response.json() as Promise<Todo>
    },
    onSuccess: (data: Todo) => {
      queryClient.setQueryData<Todo[]>(['todos'], (old) =>
        old ? [...old, data] : [data]
      )
    },
  })

  const updateTodo = useMutation<Todo, Error, Todo>({
    mutationFn: async (updatedPost: Todo) => {
      const response = await fetch(`https://caab1a6b08f0cda2301b.free.beeceptor.com/api/todos/${updatedPost.id}`, {
        method: 'PUT',
        body: JSON.stringify(updateTodo),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      })
      
      if (!response.ok) {
        throw new Error('Error updating post')
      }
      
      return response.json() as Promise<Todo>
    },
    onSuccess: (data: Todo) => {
      queryClient.setQueryData<Todo[]>(['posts'], (old) =>
        old ? old.map(todo => todo.id === data.id ? data : todo) : []
      )
    },
  })

  const deleteTodo = useMutation({
    mutationFn: (id: number) =>
      fetch(`https://caab1a6b08f0cda2301b.free.beeceptor.com/api/todos/${id}`, {
        method: 'DELETE',
      }),
    onSuccess: (_, id) => {
      queryClient.setQueryData<Todo[]>(['todos'], old =>
        old?.filter(todo => todo.id !== id)
      )
    }
  })

  return { createTodo, updateTodo, deleteTodo }
}
