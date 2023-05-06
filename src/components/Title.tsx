import { Typography } from '@mui/material';
import DoneIcon from '@mui/icons-material/Done';

export function Title(): JSX.Element {
    return (
        <Typography
            variant="h4"
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: 1,
            }}
        >
            Todos React App <DoneIcon fontSize="large" />
        </Typography>
    );
}
