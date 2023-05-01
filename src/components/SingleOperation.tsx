import SpentTimeForm from './SpentTimeForm';
import { Box, IconButton, ListItem, Typography } from '@mui/material';
import MoreTimeIcon from '@mui/icons-material/MoreTime';
import DeleteIcon from '@mui/icons-material/Delete';

function SingleOperation({
    operation,
    activeOperationId,
    setActiveOperationId,
    handleDeleteOperation,
    task,
    setTasks,
}) {
    return (
        <ListItem
            sx={{
                border: '1px solid whitesmoke',
                display: 'flex',
                justifyContent: 'space-between',
                flexWrap: 'no-wrap',
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                }}
            >
                <Typography variant="body1">{operation.description}</Typography>
                <Typography variant="body2">
                    {operation.spentTime > 60 &&
                        ~~(operation.spentTime / 60) + 'h'}{' '}
                    {operation.spentTime > 0 &&
                        (operation.spentTime % 60) + 'm'}
                </Typography>
            </Box>
            <Box>
                {operation.id === activeOperationId ? (
                    <SpentTimeForm
                        operation={operation}
                        onCancel={setActiveOperationId}
                        setTasks={setTasks}
                    />
                ) : (
                    task.status === 'open' && (
                        <IconButton
                            size="small"
                            sx={{
                                color: 'green',
                            }}
                            onClick={() => setActiveOperationId(operation.id)}
                        >
                            <MoreTimeIcon fontSize="inherit" />
                        </IconButton>
                    )
                )}
                {task.status === 'open' && (
                    <IconButton
                        size="small"
                        sx={{
                            color: 'tomato',
                        }}
                        onClick={handleDeleteOperation(operation)}
                    >
                        <DeleteIcon fontSize="inherit" />
                    </IconButton>
                )}
            </Box>
        </ListItem>
    );
}

export default SingleOperation;
