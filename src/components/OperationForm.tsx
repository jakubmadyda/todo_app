import { Dispatch, FormEvent, SetStateAction, useState } from 'react';
import { callOperationsApi, Operation } from '../helpers/Api';
import { Task } from '../App';

interface OperationFormProps {
    onCancel: Dispatch<number | null>;
    taskId: number;
    setTasks: Dispatch<SetStateAction<Task[]>>;
}

export function OperationForm({
    onCancel,
    taskId,
    setTasks,
}: OperationFormProps) {
    const [value, setValue] = useState('');

    async function handleAddOperation(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

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
    }

    return (
        <form onSubmit={handleAddOperation}>
            <input
                value={value}
                type="text"
                onChange={e => setValue(e.target.value)}
            />
            <button type="submit">Add</button>
            <button onClick={() => onCancel(null)}>Cancel</button>
        </form>
    );
}
