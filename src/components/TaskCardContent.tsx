import OperationForm from './OperationForm';
import { CardContent, List } from '@mui/material';
import SingleOperation from './SingleOperation';

function TaskCardContent({
    task,
    setTasks,
    activeTaskId,
    setActiveTaskId,
    activeOperationId,
    setActiveOperationId,
    handleDeleteOperation,
}) {
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
