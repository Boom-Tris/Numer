import React from 'react';
import { Button } from 'react-bootstrap'; // Make sure to import Button
import './button_form.css';

const ButtonFormat = ({ text, onClick, variant }) => {
    return (
        <Button className = 'format-button' variant={variant} onClick={onClick}>
            {text}
        </Button>
    );
};

export default ButtonFormat;
