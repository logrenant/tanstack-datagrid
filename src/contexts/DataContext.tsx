import { createContext, useContext, ReactNode, useState } from 'react'

import { Post, Todo } from '../types'


type DataContextType = {
    posts: Post[]
    todos: Todo[]
    setPosts: (posts: Post[]) => void
    setTodos: (posts: Todo[]) => void
}

const DataContext = createContext<DataContextType>({
    posts: [],
    todos: [],
    setPosts: () => { },
    setTodos: () => { }
})

export const DataProvider = ({ children }: { children: ReactNode }) => {
    const [posts, setPosts] = useState<Post[]>([])
    const [todos, setTodos] = useState<Todo[]>([])

    return (
        <DataContext.Provider value={{ posts, setPosts, todos, setTodos }}>
            {children}
        </DataContext.Provider>
    )
}

export const useDataContext = () => useContext(DataContext)