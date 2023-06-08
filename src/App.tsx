import { useEffect, useState } from 'react';
import {
    callTasksApi,
    getOperationsApi,
    getTaskApi,
    Task,
} from './helpers/Api';
import { Container, Stack } from '@mui/material';
import { Title } from './components/Title';
import TaskForm from './components/TaskForm';
import TaskCard from './components/TaskCard';

function App(): JSX.Element {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [tasks, setTasks] = useState<Task[]>([]);

    useEffect(() => {
        const responses = Promise.all([getTaskApi(), getOperationsApi()]);

        responses.then(data => {
            const [tasks, operations] = data;

            setTasks(
                tasks.map(task => ({
                    ...task,
                    operations: operations.filter(
                        operation => operation.taskId === task.id
                    ),
                }))
            );
        });
    }, []);

    async function handleSubmit() {
        const data = await callTasksApi({
            data: {
                addedDate: new Date(),
                description,
                name,
                status: 'open',
            },
            method: 'post',
        });

        setTasks([...tasks, { ...data, operations: [] }]);
        setName('');
        setDescription('');
    }

    return (
        <Container maxWidth="md">
            <Title />
            <TaskForm
                setName={setName}
                name={name}
                description={description}
                setDescription={setDescription}
                handleSubmit={handleSubmit}
            />
            <Stack>
                {tasks.map(task => (
                    <TaskCard
                        key={task.id}
                        task={task}
                        setTasks={setTasks}
                        tasks={tasks}
                    />
                ))}
            </Stack>
        </Container>
    );
}

export default App;
