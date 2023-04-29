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
        return `${~~(totalMinutes / 60)}h ${totalMinutes % 60}m`;
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
                        {task.status === 'open' ? (
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
                        ) : (
                            <b>{calculateTotalTime(task.operations)}</b>
                        )}
                        <button onClick={handleDeleteTask(task)}>Delete</button>
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
                            <br />
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}

export default App;
