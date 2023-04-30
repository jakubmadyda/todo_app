import { Dispatch, FormEvent, SetStateAction, useState } from 'react';
import { callOperationsApi, Operation } from '../helpers/Api';
import { Task } from '../App';
import { Box, Button, TextField } from '@mui/material';

interface OperationFormProps {
    onCancel: Dispatch<number | null>;
    taskId: number;
    setTasks: Dispatch<SetStateAction<Task[]>>;
}

export function OperationForm({
    onCancel,
    taskId,
    setTasks,
}: OperationFormProps) {
    const [value, setValue] = useState('');

    async function handleAddOperation(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const operation: Operation = await callOperationsApi({
            data: {
                description: value,
                addedDate: new Date(),
                spentTime: 0,
                taskId,
            },
            method: 'post',
        });

        setTasks(prev =>
            prev.map(task => {
                if (task.id === taskId) {
                    task.operations.push(operation);
                }
                return task;
            })
        );
        onCancel(null);
    }

    return (
        <form onSubmit={handleAddOperation}>
            <Box sx={{ display: 'flex' }}>
                <TextField
                    fullWidth
                    value={value}
                    type="text"
                    size="small"
                    sx={{ fontSize: '1rem' }}
                    onChange={e => setValue(e.target.value)}
                />
                <Button variant="outlined" color="success" type="submit">
                    Add
                </Button>
                <Button
                    variant="outlined"
                    color="error"
                    onClick={() => onCancel(null)}
                >
                    Cancel
                </Button>
            </Box>
        </form>
    );
}
