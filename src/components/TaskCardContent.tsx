import OperationForm from './OperationForm';
import { CardContent, List } from '@mui/material';
import { Task, Operation } from '../helpers/Api';
import { Dispatch, SetStateAction } from 'react';
import SingleOperation from './SingleOperation';

interface TaskCardContentProps {
    task: Task;
    setTasks: Dispatch<SetStateAction<Task[]>>;
    activeTaskId: null | number;
    setActiveTaskId: Dispatch<SetStateAction<null | number>>;
    activeOperationId: null | number;
    setActiveOperationId: Dispatch<SetStateAction<null | number>>;
    handleDeleteOperation: (
        operationToDelete: Operation
    ) => () => Promise<void>;
}

function TaskCardContent({
    task,
    setTasks,
    activeTaskId,
    setActiveTaskId,
    activeOperationId,
    setActiveOperationId,
    handleDeleteOperation,
}: TaskCardContentProps): JSX.Element {
    return (
        <CardContent sx={{ padding: '0' }}>
            <List sx={{ padding: '0' }}>
                {task.id === activeTaskId && (
                    <OperationForm
                        taskId={task.id}
                        onCancel={setActiveTaskId}
                        setTasks={setTasks}
                    />
                )}
                {task.operations.map(operation => (
                    <SingleOperation
                        key={operation.id}
                        operation={operation}
                        activeOperationId={activeOperationId}
                        setActiveOperationId={setActiveOperationId}
                        handleDeleteOperation={handleDeleteOperation}
                        task={task}
                        setTasks={setTasks}
                    />
                ))}
            </List>
        </CardContent>
    );
}

export default TaskCardContent;
