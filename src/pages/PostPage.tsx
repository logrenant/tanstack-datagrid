import { useEffect, useState } from 'react'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { Button, Box, Dialog, DialogTitle, DialogContent, TextField } from '@mui/material'
import { useDataContext } from '../contexts/DataContext'
import { usePosts } from '../hooks/usePosts'
import { Post } from '../types'

export const PostsPage = () => {
    const { posts, setPosts } = useDataContext()
    const { createPost, updatePost, deletePost } = usePosts()
    const [open, setOpen] = useState(false)
    const [newPost, setNewPost] = useState({ title: '', body: '' })
    const [dataGridKey, setDataGridKey] = useState(0)

    useEffect(() => {
        setDataGridKey(prevKey => prevKey + 1)
    }, [posts])

    const columns: GridColDef[] = [
        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'title', headerName: 'Title', width: 250, editable: true },
        { field: 'body', headerName: 'Body', width: 400, editable: true },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 150,
            renderCell: (params: { row: Post }) => (
                <Button
                    color="error"
                    onClick={async () => {
                        try {
                            await deletePost.mutateAsync(params.row.id)
                            setPosts(posts.filter(post => post.id !== params.row.id))
                        } catch (error) {
                            console.error('Silme işlemi başarısız:', error)
                        }
                    }}
                >
                    Delete
                </Button>
            )
        }
    ]

    const handleProcessRowUpdate = async (newRow: Post, oldRow: Post) => {
        try {
            const updatedRow = await updatePost.mutateAsync(newRow)
            setPosts(posts.map(post => post.id === updatedRow.id ? updatedRow : post))
            return updatedRow
        } catch (error) {
            return oldRow
        }
    }

    const handleCreatePost = async () => {
        const newId = posts.length > 0 ? Math.max(...posts.map(p => p.id)) + 1 : 1
        const createdPost = await createPost.mutateAsync({
            id: newId,
            ...newPost,
            userId: 1
        })
        setPosts([...posts, createdPost])
        setOpen(false)
        setNewPost({ title: '', body: '' })
    }

    return (
        <Box sx={{ height: 600, width: '100%' }}>
            <Button variant="contained" sx={{ mb: 2 }} onClick={() => setOpen(true)}>
                Add New Post
            </Button>

            <DataGrid
                key={dataGridKey}
                rows={posts}
                columns={columns}
                processRowUpdate={handleProcessRowUpdate}
            />

            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>Create New Post</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Title"
                        fullWidth
                        value={newPost.title}
                        onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        label="Body"
                        fullWidth
                        multiline
                        rows={4}
                        value={newPost.body}
                        onChange={(e) => setNewPost({ ...newPost, body: e.target.value })}
                    />
                    <Button
                        variant="contained"
                        sx={{ mt: 2 }}
                        onClick={handleCreatePost}
                    >
                        Create
                    </Button>
                </DialogContent>
            </Dialog>
        </Box>
    )
}