import { Dispatch, FormEvent, SetStateAction, useState } from 'react';
import { callOperationsApi, Operation, Task } from '../helpers/Api';

interface AddSpentTimeProps {
    operation: Operation;
    setTasks: Dispatch<SetStateAction<Task[]>>;
    onCancel: Dispatch<number | null>;
}

function SpentTimeForm({ operation, setTasks, onCancel }: AddSpentTimeProps) {
    const [value, setValue] = useState(0);

    async function handleAddSpentTime(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        await callOperationsApi({
            data: { spentTime: operation.spentTime + value },
            id: operation.id,
            method: 'patch',
        });

        operation.spentTime += value;
        setTasks(prev => [...prev]);
        onCancel(null);
    }

    return (
        <form onSubmit={handleAddSpentTime}>
            <input
                type="number"
                value={value}
                onChange={e => setValue(+e.target.value)}
            />
            <button type="submit">Add time</button>
            <button type="button" onClick={() => onCancel(null)}>
                Cancel
            </button>
        </form>
    );
}

export default SpentTimeForm;
