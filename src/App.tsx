import { useEffect, useState } from 'react';
import { OperationForm } from './components/OperationForm';
import {
    callTasksApi,
    getOperationsApi,
    getTaskApi,
    Operation,
} from './helpers/Api';

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

    function handleDeleteTask(id: number) {
        return async function () {
            await callTasksApi({
                id,
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
                                <button
                                    onClick={() => setActiveTaskId(task.id)}
                                >
                                    Add operation
                                </button>
                                <button onClick={handleFinishTask(task)}>
                                    Finish
                                </button>
                            </>
                        )}
                        <button onClick={handleDeleteTask(task.id)}>
                            Delete
                        </button>
                        {task.id === activeTaskId && (
                            <OperationForm
                                taskId={task.id}
                                onCancel={setActiveTaskId}
                                setTasks={setTasks}
                            />
                        )}
                        <div>
                            <hr />
                            {task.operations.map(operation => (
                                <div key={operation.id}>
                                    {operation.description}{' '}
                                    {operation.spentTime}
                                    <button>Add spent time</button>
                                    <button>Delete</button>
                                </div>
                            ))}
                            <br />
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}

export default App;
