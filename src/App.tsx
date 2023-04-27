import { useEffect, useState } from 'react';
import axios from 'axios';

interface TaskStatus {
    status: 'open' | 'closed';
}

interface Task extends TaskStatus {
    name: string;
    description: string;
    addedDate: Date;
    id: number;
}

type TaskApiArgs = {
    endpoint: string;
    data: Omit<Task, 'id'> | TaskStatus;
    method: 'post' | 'patch' | 'put';
};

type TaskApiArgsWithoutData = {
    method: 'get' | 'delete';
    endpoint: string;
};

function App() {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [tasks, setTasks] = useState<Task[]>([]);

    useEffect(() => {
        getTasksApi('tasks').then(setTasks);
    }, []);

    async function getTasksApi(endpoint: string): Promise<Task[]> {
        const response = await axios.get<Task[]>(
            `http://localhost:3000/${endpoint}`
        );
        return response.data;
    }

    async function sendTaskApi(
        config: TaskApiArgs | TaskApiArgsWithoutData
    ): Promise<Task> {
        const { method, endpoint } = config;
        const requestConfig: {
            method: string;
            url: string;
            data?: Task | TaskStatus;
        } = {
            method,
            url: `http://localhost:3000/api/v1/${endpoint}`,
        };

        if (!['get', 'delete'].includes(method)) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            requestConfig.data = config.data;
        }

        try {
            const response = await axios(requestConfig);
            return response.data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async function handleSubmit() {
        const data = await sendTaskApi({
            data: {
                addedDate: new Date(),
                description,
                name,
                status: 'open',
            },
            endpoint: 'tasks',
            method: 'post',
        });
        setTasks([...tasks, data]);
        setName('');
        setDescription('');
    }

    function handleFinishTask(task: Task) {
        return async function () {
            await sendTaskApi({
                endpoint: `tasks/${task.id}`,
                data: {
                    status: 'closed',
                },
                method: 'patch',
            });

            task.status = 'closed';
            setTasks([...tasks]);
        };
    }

    function handleDeleteTask(id: number) {
        return async function () {
            await sendTaskApi({
                endpoint: `tasks/${id}`,
                method: 'delete',
            });

            setTasks(tasks.filter(task => task.id !== id));
        };
    }

    return (
        <>
            <form
                onSubmit={async e => {
                    e.preventDefault();
                    await handleSubmit();
                }}
            >
                <label htmlFor="task">Task</label>
                <input
                    id="task"
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                />
                <label htmlFor="description">Description</label>
                <textarea
                    id="description"
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                ></textarea>
                <button type="submit">Add</button>
            </form>
            <div>
                {tasks.map(task => (
                    <div key={task.id}>
                        <b>{task.name} </b>
                        <span>{task.description} </span>
                        {task.status === 'open' && (
                            <>
                                <button>Add operation</button>
                                <button onClick={handleFinishTask(task)}>
                                    Finish
                                </button>
                            </>
                        )}
                        <button onClick={handleDeleteTask(task.id)}>
                            Delete
                        </button>
                    </div>
                ))}
            </div>
        </>
    );
}

export default App;
