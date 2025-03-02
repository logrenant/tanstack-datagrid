import { useEffect, useState } from 'react'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { Button, Box, Dialog, DialogTitle, DialogContent, TextField } from '@mui/material'
import { useDataContext } from '../contexts/DataContext'
import { useTodos } from '../hooks/useTodos'
import { Todo } from '../types'

export const TodoPage = () => {
    const { todos, setTodos } = useDataContext()
    const { createTodo, updateTodo, deleteTodo } = useTodos()
    const [open, setOpen] = useState(false)
    const [newTodo, setNewTodo] = useState({ title: '', body: '' })
    const [dataGridKey, setDataGridKey] = useState(0)

    useEffect(() => {
        setDataGridKey(prevKey => prevKey + 1)
    }, [todos])

    const columns: GridColDef[] = [
        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'title', headerName: 'Title', width: 250, editable: true },
        { field: 'body', headerName: 'Body', width: 400, editable: true },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 150,
            renderCell: (params: { row: Todo }) => (
                <Button
                    color="error"
                    onClick={async () => {
                        try {
                            await deleteTodo.mutateAsync(params.row.id)
                            setTodos(todos.filter(todo => todo.id !== params.row.id))
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

    const handleProcessRowUpdate = async (newRow: Todo, oldRow: Todo) => {
        try {
            const updatedRow = await updateTodo.mutateAsync(newRow)
            setTodos(todos.map(todo => todo.id === updatedRow.id ? updatedRow : todo))
            return updatedRow
        } catch (error) {
            return oldRow
        }
    }

    const handleCreateTodo = async () => {
        const newId = todos.length > 0 ? Math.max(...todos.map(p => p.id)) + 1 : 1
        const createdTodo = await createTodo.mutateAsync({
            id: newId,
            ...newTodo,
            userId: 1,
            completed: false
        })
        setTodos([...todos, createdTodo])
        setOpen(false)
        setNewTodo({ title: '', body: '' })
    }

    return (
        <Box sx={{ height: 600, width: '100%' }}>
            <Button variant="contained" sx={{ mb: 2 }} onClick={() => setOpen(true)}>
                Add New Post
            </Button>

            <DataGrid
                key={dataGridKey}
                rows={todos}
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
                        value={newTodo.title}
                        onChange={(e) => setNewTodo({ ...newTodo, title: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        label="Body"
                        fullWidth
                        multiline
                        rows={4}
                        value={newTodo.body}
                        onChange={(e) => setNewTodo({ ...newTodo, body: e.target.value })}
                    />
                    <Button
                        variant="contained"
                        sx={{ mt: 2 }}
                        onClick={handleCreateTodo}
                    >
                        Create
                    </Button>
                </DialogContent>
            </Dialog>
        </Box>
    )
}