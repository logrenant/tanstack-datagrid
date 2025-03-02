import { useEffect, useState } from 'react'
import { DataGrid, GridColDef, GridRowId, useGridApiRef } from '@mui/x-data-grid'
import { Button, Box, Dialog, DialogTitle, DialogContent, TextField } from '@mui/material'

import { Post } from '../types'
import { usePosts } from '../hooks/usePosts'
import { useDataContext } from '../contexts/DataContext'


export const PostsPage = () => {
    const { posts, setPosts } = useDataContext()
    const { createPost, updatePost, deletePost } = usePosts()
    const [open, setOpen] = useState(false)
    const [newPost, setNewPost] = useState({ title: '', body: '' })
    const [dataGridKey, setDataGridKey] = useState(0)
    const apiRef = useGridApiRef();


    useEffect(() => {
        setDataGridKey(prevKey => prevKey + 1)
    }, [posts])

    const columns: GridColDef[] = [
        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'title', headerName: 'Title', width: 250, editable: true },
        { field: 'body', headerName: 'Content', width: 400, editable: true },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 200,
            renderCell: (params) => (
                <div>
                    <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        onClick={() => handleEditClick(params.id)}
                        style={{ marginRight: 8 }}
                    >
                        Update
                    </Button>
                    <Button
                        variant="contained"
                        color="secondary"
                        size="small"
                        onClick={async () => {
                            try {
                                await deletePost.mutateAsync(params.row.id);
                                setPosts(posts.filter((post) => post.id !== params.row.id));
                            } catch (error) {
                                console.error('Delete operation failed:', error);
                            }
                        }}
                    >
                        Delete
                    </Button>
                </div>
            ),
        },
    ];


    const handleProcessRowUpdate = async (newRow: Post, oldRow: Post) => {
        try {
            const updatedRow = await updatePost.mutateAsync(newRow);
            setPosts(posts.map(post => post.id === updatedRow.id ? updatedRow : post));
            return updatedRow;
        } catch (error) {
            console.error('Güncelleme işlemi başarısız:', error);
            return oldRow;
        }
    };

    const handleEditClick = (id: GridRowId) => {
        apiRef.current.startRowEditMode({ id });
    };

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
                rows={posts}
                editMode="row"
                apiRef={apiRef}
                columns={columns}
                key={dataGridKey}
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