import { Box, CardContent, IconButton, Typography } from '@mui/material';
import SportsScoreIcon from '@mui/icons-material/SportsScore';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

function TaskCardTitle({
    task,
    calculateTotalTime,
    setActiveTaskId,
    handleFinishTask,
    handleDeleteTask,
}) {
    return (
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
                            calculateTotalTime(task.operations)}
                    </Typography>
                    <Typography variant="subtitle2">
                        {task.description}
                    </Typography>
                </Box>
                <Box>
                    {task.status === 'open' && (
                        <>
                            <IconButton
                                onClick={() => setActiveTaskId(task.id)}
                            >
                                <AddIcon />
                            </IconButton>
                            <IconButton onClick={handleFinishTask(task)}>
                                <SportsScoreIcon />
                            </IconButton>
                        </>
                    )}
                    <IconButton onClick={handleDeleteTask(task)}>
                        <DeleteIcon />
                    </IconButton>
                </Box>
            </Box>
        </CardContent>
    );
}

export default TaskCardTitle;
