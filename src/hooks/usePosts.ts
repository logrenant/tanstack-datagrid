import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { Post } from '../types'
import { useDataContext } from '../contexts/DataContext'

export const usePosts = () => {
  const queryClient = useQueryClient()
  const { setPosts } = useDataContext()

  useQuery<Post[]>({
    queryKey: ['posts'],
    queryFn: () =>
      fetch('https://ca181281759653a5d078.free.beeceptor.com/api/tanstack-posts/')
        .then(res => res.json())
        .then(data => {
          setPosts(data)
          return data
        })
  })

  const createPost = useMutation<Post, Error, Post>({
    mutationFn: async (newPost: Post) => {
      const response = await fetch('https://ca181281759653a5d078.free.beeceptor.com/api/tanstack-posts/', {
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
      const response = await fetch(`https://ca181281759653a5d078.free.beeceptor.com/api/tanstack-posts/${updatedPost.id}`, {
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
      fetch(`https://ca181281759653a5d078.free.beeceptor.com/api/tanstack-posts/${id}`, {
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
