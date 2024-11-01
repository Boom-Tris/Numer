import React from 'react';
import { Button } from 'react-bootstrap'; // Make sure to import Button
import './button_M.css';

const ButtonFormatM = ({ text, onClick, variant }) => {
    return (
        <Button className = 'format-buttonM' variant={variant} onClick={onClick}>
            {text}
        </Button>
    );
};

export default ButtonFormatM;
