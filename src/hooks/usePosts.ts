import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useDataContext } from '../contexts/DataContext'
import { Post } from '../types'

export const usePosts = () => {
  const queryClient = useQueryClient()
  const { setPosts } = useDataContext()

  useQuery<Post[]>({
    queryKey: ['posts'],
    queryFn: () =>
      fetch('https://ca2170d3a0958cbb6457.free.beeceptor.com/api/posts/')
        .then(res => res.json())
        .then(data => {
          setPosts(data)
          return data
        })
  })

  const createPost = useMutation<Post, Error, Post>({
    mutationFn: async (newPost: Post) => {
      const response = await fetch('https://ca2170d3a0958cbb6457.free.beeceptor.com/api/posts/', {
        method: 'POST',
        body: JSON.stringify(newPost),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      })
      
      if (!response.ok) {
        throw new Error('Error creating post')
      }
      
      return response.json() as Promise<Post>
    },
    onSuccess: (data: Post) => {
      queryClient.setQueryData<Post[]>(['posts'], (old) =>
        old ? [...old, data] : [data]
      )
    },
  })

  const updatePost = useMutation<Post, Error, Post>({
    mutationFn: async (updatedPost: Post) => {
      const response = await fetch(`https://ca2170d3a0958cbb6457.free.beeceptor.com/api/posts/${updatedPost.id}`, {
        method: 'PUT',
        body: JSON.stringify(updatedPost),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      })
      
      if (!response.ok) {
        throw new Error('Error updating post')
      }
      
      return response.json() as Promise<Post>
    },
    onSuccess: (data: Post) => {
      queryClient.setQueryData<Post[]>(['posts'], (old) =>
        old ? old.map(post => post.id === data.id ? data : post) : []
      )
    },
  })

  const deletePost = useMutation({
    mutationFn: (id: number) =>
      fetch(`https://ca2170d3a0958cbb6457.free.beeceptor.com/api/posts/${id}`, {
        method: 'DELETE',
      }),
    onSuccess: (_, id) => {
      queryClient.setQueryData<Post[]>(['posts'], old =>
        old?.filter(post => post.id !== id)
      )
    }
  })

  return { createPost, updatePost, deletePost }
}
