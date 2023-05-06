import { Button, Card, CardContent, Stack, TextField } from '@mui/material';
import { Dispatch, SetStateAction, useState } from 'react';

interface TaskFormProps {
    setName: Dispatch<SetStateAction<string>>;
    name: string;
    description: string;
    setDescription: Dispatch<SetStateAction<string>>;
    handleSubmit: () => Promise<void>;
}

function TaskForm({
    setName,
    name,
    description,
    setDescription,
    handleSubmit,
}: TaskFormProps) {
    const [errors, setErrors] = useState<string[]>([]);

    function validateForm() {
        let formValid = true;
        const newErrors = [];

        if (name === '') {
            formValid = false;
            newErrors.push('name');
        }

        setErrors(newErrors);
        console.log(errors);
        return formValid;
    }

    return (
        <Card sx={{ marginBottom: 3 }}>
            <CardContent>
                <form
                    onSubmit={async e => {
                        e.preventDefault();
                        if (validateForm()) {
                            await handleSubmit();
                        }
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
                            error={errors.includes('name')}
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
