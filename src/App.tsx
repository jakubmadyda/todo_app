import { useEffect, useState } from 'react';
import axios, { AxiosResponse } from 'axios';

interface Task {
    name: string;
    description: string;
    addedDate: Date;
    status: 'open' | 'closed';
    id: number;
}

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
        endpoint: string,
        data: Omit<Task, 'id'>
    ): Promise<Task> {
        try {
            const response = await axios.post(
                `http://localhost:3000/api/v1/${endpoint}`,
                data
            );
            return response.data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async function handleSubmit() {
        const data = await sendTaskApi('tasks', {
            addedDate: new Date(),
            description,
            name,
            status: 'open',
        });
        setTasks([...tasks, data]);
        setName('');
        setDescription('');
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
                        <button>Add operation</button>
                        <button>Finish</button>
                    </div>
                ))}
            </div>
        </>
    );
}

export default App;
