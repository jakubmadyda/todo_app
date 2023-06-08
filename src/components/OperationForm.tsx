import { Dispatch, SetStateAction, useState } from 'react';
import { callOperationsApi, Operation, Task } from '../helpers/Api';
import { Box, Button, TextField } from '@mui/material';

interface OperationFormProps {
    onCancel: Dispatch<number | null>;
    taskId: number;
    setTasks: Dispatch<SetStateAction<Task[]>>;
}

function OperationForm({ onCancel, taskId, setTasks }: OperationFormProps) {
    const [value, setValue] = useState('');
    const [error, setError] = useState<boolean>(false);

    async function handleAddOperation() {
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

    function validateForm(): boolean {
        let formValid = true;

        if (value === '') {
            formValid = false;
            setError(true);
        }

        return formValid;
    }

    return (
        <form
            onSubmit={async e => {
                e.preventDefault();
                if (validateForm()) {
                    await handleAddOperation();
                }
            }}
        >
            <Box sx={{ display: 'flex', padding: 1 }}>
                <TextField
                    fullWidth
                    value={value}
                    label="subtask description"
                    type="text"
                    size="small"
                    sx={{ fontSize: '1rem' }}
                    onChange={e => setValue(e.target.value)}
                    error={error}
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

export default OperationForm;
