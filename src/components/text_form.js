import OutlinedInput from '@mui/material/OutlinedInput';
import FormControl from '@mui/material/FormControl';
import { useTheme } from '@mui/material/styles';

function TextForm({ placeholderText, onValueChange, value }) {
    const theme = useTheme();

    return (
        <FormControl
            sx={{
                width: '50%',
                marginTop: '5%',
                [theme.breakpoints.down('sm')]: {
                    marginTop: '5%',
                },
            }}
            variant="standard"
        >
            <OutlinedInput
                type='text'
                value={value} 
                placeholder={placeholderText}
                onChange={onValueChange} 
                sx={{
                    borderRadius: '20px',
                    
                    fontSize: '3vh',
                    height: '6vh',
                    [theme.breakpoints.down('sm')]: {
                        fontSize: '2vh',
                        height: '5vh',
                        borderRadius: '10px',
                    },
                    '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#604A45',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#BC7766',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#2160AA',
                    },
                }}
            />
        </FormControl>
    );
}

export default TextForm;
