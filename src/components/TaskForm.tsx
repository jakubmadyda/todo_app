import { Button, Card, CardContent, Stack, TextField } from '@mui/material';
import { Dispatch, SetStateAction } from 'react';

interface TaskFormProps {
    setName: Dispatch<SetStateAction<string>>;
    name: string;
    description: string;
    setDescription: Dispatch<SetStateAction<string>>;
}

function TaskForm({
    setName,
    name,
    description,
    setDescription,
    handleSubmit,
}: TaskFormProps) {
    return (
        <Card sx={{ marginBottom: 3 }}>
            <CardContent>
                <form
                    onSubmit={async e => {
                        e.preventDefault();
                        await handleSubmit();
                    }}
                >
                    <Stack spacing={2} direction="column">
                        <TextField
                            label="New Task Title"
                            variant="outlined"
                            id="task"
                            type="text"
                            value={name}
                            onChange={e => setName(e.target.value)}
                        />

                        <TextField
                            label="Description"
                            variant="outlined"
                            id="description"
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                        />
                        <Button variant="contained" type="submit">
                            Add
                        </Button>
                    </Stack>
                </form>
            </CardContent>
        </Card>
    );
}

export default TaskForm;
