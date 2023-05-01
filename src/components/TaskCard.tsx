import { Card, CardActionArea } from '@mui/material';
import { useState } from 'react';
import {
    callOperationsApi,
    callTasksApi,
    Operation,
    Task,
} from '../helpers/Api';
import TaskCardTitle from './TaskCardTitle';
import TaskCardContent from './TaskCardContent';

function TaskCard({ task, setTasks, tasks }) {
    const [activeTaskId, setActiveTaskId] = useState<null | number>(null);
    const [activeOperationId, setActiveOperationId] = useState<null | number>(
        null
    );

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
        <Card sx={{ marginBottom: 1, marginTop: 1 }}>
            <CardActionArea>
                <TaskCardTitle
                    task={task}
                    calculateTotalTime={calculateTotalTime}
                    activeOperationId={activeOperationId}
                    setActiveTaskId={setActiveTaskId}
                    handleFinishTask={handleFinishTask}
                    handleDeleteTask={handleDeleteTask}
                />
                <TaskCardContent
                    task={task}
                    setTasks={setTasks}
                    activeTaskId={activeTaskId}
                    setActiveTaskId={setActiveTaskId}
                    activeOperationId={activeOperationId}
                    setActiveOperationId={setActiveOperationId}
                    handleDeleteOperation={handleDeleteOperation}
                />
            </CardActionArea>
        </Card>
    );
}

export default TaskCard;
