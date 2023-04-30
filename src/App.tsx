import { useEffect, useState } from 'react';
import { OperationForm } from './components/OperationForm';
import {
    callOperationsApi,
    callTasksApi,
    getOperationsApi,
    getTaskApi,
    Operation,
} from './helpers/Api';
import { SpentTimeForm } from './components/SpentTimeForm';
import {
    Container,
    Stack,
    TextField,
    Button,
    Typography,
    Card,
    CardContent,
    Box,
    CardActionArea,
    IconButton,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import SportsScoreIcon from '@mui/icons-material/SportsScore';
import AddIcon from '@mui/icons-material/Add';

export interface TaskStatus {
    status: 'open' | 'closed';
}

export interface Task extends TaskStatus {
    name: string;
    description: string;
    addedDate: Date;
    id: number;
    operations: Operation[];
}

function App() {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [tasks, setTasks] = useState<Task[]>([]);
    const [activeTaskId, setActiveTaskId] = useState<null | number>(null);
    const [activeOperationId, setActiveOperationId] = useState<null | number>(
        null
    );

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

    function handleFinishTask(task: Task) {
        return async function () {
            await callTasksApi({
                id: task.id,
                data: {
                    status: 'closed',
                },
                method: 'patch',
            });

            task.status = 'closed';
            setTasks([...tasks]);
        };
    }

    function handleDeleteTask(taskToDelete: Task) {
        return async function () {
            await callTasksApi({
                id: taskToDelete.id,
                method: 'delete',
            });

            //todo pamiętać, że poza json serwerem to może być konieczne!
            // for (const operation of taskToDelete.operations) {
            //     await callOperationsApi({
            //         id: operation.id,
            //         method: 'delete',
            //     });
            // }

            setTasks(tasks.filter(task => task.id !== taskToDelete.id));
        };
    }

    function handleDeleteOperation(operationToDelete: Operation) {
        return async function () {
            await callOperationsApi({
                id: operationToDelete.id,
                method: 'delete',
            });

            setTasks(
                tasks.map(task => ({
                    ...task,
                    operations: task.operations.filter(
                        operation => operation !== operationToDelete
                    ),
                }))
            );
        };
    }

    function calculateTotalTime(operations: Operation[]): string {
        const totalMinutes = operations.reduce(
            (acc, ce) => acc + ce.spentTime,
            0
        );
        if (totalMinutes > 0) {
            return `${~~(totalMinutes / 60)}h ${totalMinutes % 60}m`;
        }
        return '';
    }

    return (
        <Container maxWidth="md">
            <form
                onSubmit={async e => {
                    e.preventDefault();
                    await handleSubmit();
                }}
                style={{ marginBottom: 40 }}
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
            <Stack>
                {tasks.map(task => (
                    <Card
                        key={task.id}
                        style={{ marginBottom: 10, marginTop: 10 }}
                    >
                        <CardActionArea>
                            <CardContent
                                sx={{
                                    backgroundColor: 'whitesmoke',
                                    border: '1px solid lightgrey',
                                }}
                            >
                                <Box
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                    }}
                                >
                                    <Box>
                                        <Typography variant="h6">
                                            {task.name}{' '}
                                            {task.status === 'closed' &&
                                                calculateTotalTime(
                                                    task.operations
                                                )}
                                        </Typography>
                                        <Typography variant="subtitle1">
                                            {task.description}
                                        </Typography>
                                    </Box>
                                    <Box>
                                        {task.status === 'open' && (
                                            <>
                                                <IconButton
                                                    onClick={() =>
                                                        setActiveTaskId(task.id)
                                                    }
                                                >
                                                    <AddIcon />
                                                </IconButton>
                                                <IconButton
                                                    onClick={handleFinishTask(
                                                        task
                                                    )}
                                                >
                                                    <SportsScoreIcon />
                                                </IconButton>
                                            </>
                                        )}
                                        <IconButton
                                            onClick={handleDeleteTask(task)}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </Box>
                                </Box>
                            </CardContent>
                            <CardContent>
                                {task.id === activeTaskId && (
                                    <OperationForm
                                        taskId={task.id}
                                        onCancel={setActiveTaskId}
                                        setTasks={setTasks}
                                    />
                                )}
                                {task.operations.map(operation => (
                                    <div key={operation.id}>
                                        {operation.description}{' '}
                                        {~~(operation.spentTime / 60)}h{' '}
                                        {operation.spentTime % 60}m
                                        {operation.id === activeOperationId ? (
                                            <SpentTimeForm
                                                operation={operation}
                                                onCancel={setActiveOperationId}
                                                setTasks={setTasks}
                                            />
                                        ) : (
                                            task.status === 'open' && (
                                                <button
                                                    onClick={() =>
                                                        setActiveOperationId(
                                                            operation.id
                                                        )
                                                    }
                                                >
                                                    Add spent time
                                                </button>
                                            )
                                        )}
                                        {task.status === 'open' && (
                                            <button
                                                onClick={handleDeleteOperation(
                                                    operation
                                                )}
                                            >
                                                Delete
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </CardContent>
                        </CardActionArea>
                        <div></div>
                    </Card>
                ))}
            </Stack>
        </Container>
    );
}

export default App;
