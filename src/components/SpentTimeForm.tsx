import { Dispatch, SetStateAction, useState } from 'react';
import { callOperationsApi, Operation, Task } from '../helpers/Api';
import { Box, IconButton, TextField } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';

interface AddSpentTimeProps {
    operation: Operation;
    setTasks: Dispatch<SetStateAction<Task[]>>;
    onCancel: Dispatch<number | null>;
}

function SpentTimeForm({ operation, setTasks, onCancel }: AddSpentTimeProps) {
    const [value, setValue] = useState(0);
    const [error, setError] = useState<boolean>(false);

    async function handleAddSpentTime() {
        await callOperationsApi({
            data: { spentTime: operation.spentTime + value },
            id: operation.id,
            method: 'patch',
        });

        operation.spentTime += value;
        setTasks(prev => [...prev]);
        onCancel(null);
    }

    function validateForm(): boolean {
        let formValid = true;

        if (value <= 0) {
            formValid = false;
            setError(true);
        }

        return formValid;
    }

    return (
        <form
            onSubmit={async e => {
                e.preventDefault();
                validateForm() && (await handleAddSpentTime());
            }}
        >
            <Box>
                <TextField
                    size="small"
                    type="number"
                    value={value}
                    onChange={e => setValue(+e.target.value)}
                    error={error}
                />
                <IconButton size="small" color="success" type="submit">
                    <AddCircleOutlineIcon fontSize="inherit" />
                </IconButton>
                <IconButton
                    size="small"
                    color="error"
                    type="button"
                    onClick={() => onCancel(null)}
                >
                    <HighlightOffIcon fontSize="inherit" />
                </IconButton>
            </Box>
        </form>
    );
}

export default SpentTimeForm;
