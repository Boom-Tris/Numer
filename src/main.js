import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Form, Table } from "react-bootstrap";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import ButtonFormat from './ButtonForm/button_form';
import styled from 'styled-components';
const FormSelect = styled.div`
 width: 30%;
 margin-top: 10vh;
   position: absolute;
 left: 50%;
    transform: translate(-50%, 0);

`;
const FormButton = styled.div`
    margin-top: 3vh;
    display: flex;
    gap: 1vh;
    align-items: center;  
    justify-content: center;
`;
const MultipleSelect = () => {
  const [calculator, setCalculator] = React.useState('');
  const navigate = useNavigate(); 

  const handleChange = (event) => {
    setCalculator(event.target.value);
  };

  const handleGo = () => {
    if (calculator) {
      navigate(`/${calculator}`); 
    }
  };

  return (
    <Container>
    <FormSelect> 
      <FormControl fullWidth>
        
        <InputLabel id="calculator-select-label">Select Calculator</InputLabel>
       
        <Select
          labelId="calculator-select-label"
          id="calculator-select"
          value={calculator}
          label="Select Calculator"
          onChange={handleChange}
        >
          
          <MenuItem value="GraphicalCalculator">Graphical กำลังแก้</MenuItem>
          <MenuItem value="BisectionCalculator">Bisection</MenuItem>
          <MenuItem value="FalsePositionCalculator">False Position</MenuItem>
          <MenuItem value="OnePointIterationCalculator">One Point Iteration</MenuItem>
        </Select>
       
       
        <FormButton>
            <ButtonFormat text='GO' onClick={handleGo} />
            </FormButton>
      </FormControl> </FormSelect>
  
      
        
      </Container>
    
  );
}

export default MultipleSelect;
