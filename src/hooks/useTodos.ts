import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { Todo } from '../types'
import { useDataContext } from '../contexts/DataContext'

export const useTodos = () => {
  const queryClient = useQueryClient()
  const { setTodos } = useDataContext()

  useQuery<Todo[]>({
    queryKey: ['todos'],
    queryFn: () =>
      fetch('https://ca6cfec187b154566f22.free.beeceptor.com/api/tanstack-todo/')
        .then(res => res.json())
        .then(data => {
          setTodos(data)
          return data
        })
  })

  const createTodo = useMutation<Todo, Error, Todo>({
    mutationFn: async (newTodo: Todo) => {
      const response = await fetch('https://ca6cfec187b154566f22.free.beeceptor.com/api/tanstack-todo/', {
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
    mutationFn: async (updatedTodo: Todo) => {
      const response = await fetch(`https://ca6cfec187b154566f22.free.beeceptor.com/api/tanstack-todo/${updatedTodo.id}`, {
        method: 'PUT',
        body: JSON.stringify(updatedTodo),
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
      queryClient.setQueryData<Todo[]>(['todos'], (old) =>
        old ? old.map(todo => todo.id === data.id ? data : todo) : []
      )
    },
  })

  const deleteTodo = useMutation({
    mutationFn: (id: number) =>
      fetch(`https://ca6cfec187b154566f22.free.beeceptor.com/api/tanstack-todo/${id}`, {
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
