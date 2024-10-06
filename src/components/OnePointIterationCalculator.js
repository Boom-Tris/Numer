import React, { useState, useEffect } from "react";
import { Container, Form, Table } from "react-bootstrap";
import { evaluate, parse, derivative } from 'mathjs';
import ButtonFormat from "../ButtonForm/button_form";
import TextForm from "../ButtonForm/text_form";
import CustomLineChart from "../GrapForm/CustomLineChart"; 
import styled from 'styled-components';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import 'katex/dist/katex.min.css';
import { BlockMath, InlineMath } from 'react-katex';

// Styled components
const Inline_Math = styled.div`
    font-size: 5vh; 
    background-color: #f9f9f9; 
    border-radius: 10px; 
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); 
    padding: 20px; 
    height: 100%;
`;

const ColorIcon = {
    color: 'white',
    fontSize: 40 
};

const Restart = styled.button`
    cursor: pointer;
    background-color: ${({ $isClicked }) => ($isClicked ? '#C96868' : '#FF8A8A')};
    border: none;
    border-radius: 1.5vh;
    height: 6vh;
    width: 20%;
`;

const StyledTable = styled(Table)`
    text-align: center;
    font-size: 2vh; 
`;

const TableRow = styled.tr`
    &:nth-child(even) { 
        background-color: #f2f2f2; 
    }
`;

const FormCon = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;  
    justify-content: center;  
`;

const FormInput = styled.div`
    display: flex;
    align-items: center;  
    justify-content: center;  
`;

const FormButton = styled.div`
    margin-top: 3vh;
    display: flex;
    gap: 1vh;
    align-items: center;  
    justify-content: center;
`;

const FormAsn = styled.div`
    display: flex;
    margin-top: 2vh;
    justify-content: center;
    align-items: center;  
    font-size: 3vh;
`;

const FormTable = styled.div`
    font-size: 2vh;
    margin: 5vh;
`;

const ErrorText = styled.div`
    color: red;
    font-size: 1.5vh;
`;

const OnePointIterationCalculator = () => {
    const [data, setData] = useState([]);
    const [X, setX] = useState(0);
    const [Equation, setEquation] = useState("(x^4 - 13)"); // Input equation
    const [latexEquation, setLatexEquation] = useState(""); 
    const [X0, setX0] = useState(""); 
    const [errorTolerance, setErrorTolerance] = useState(0.00001);
    const [errorMessage, setErrorMessage] = useState("");
    const [buttonClicked, setButtonClicked] = useState(false);
    const [currentFormula, setCurrentFormula] = useState(""); // Store the formula for display
    const [errors, setErrors] = useState([]);
    // Convert equation to LaTeX format
    const convertToLatex = (equation) => {
        try {
            const node = parse(equation);
            return node.toTex();
        } catch (error) {
            return equation; 
        }
    };

    // Update LaTeX equation when Equation changes
    useEffect(() => {
        setLatexEquation(convertToLatex(Equation));
    }, [Equation]);

    const error = (xold, xnew) => Math.abs((xnew - xold) / xnew) * 100;

    const calculateOnePointIteration = (x0) => {
        let xNew = x0;
        let ea = 100;
        let iter = 0;
        const MAX = 50;
        const e = parseFloat(errorTolerance);
        const results = [];
        const errorsList = [];
        // Calculate the derivative of the equation
        const derivativeEquation = derivative(Equation, 'x').toString();

        do {
            const xOld = xNew; 
            xNew = evaluate(`x - (${Equation}) / (${derivativeEquation})`, { x: xOld });
            ea = error(xOld, xNew);
            iter++;
            results.push({ iteration: iter, X: xNew, Error: ea });
          
        } while (ea > e && iter < MAX);
    
        setX(xNew);
        setData(results);
        setCurrentFormula(`X = ${xNew.toFixed(6)} - \\frac{${Equation}}{${derivativeEquation}}`);
        setErrors(errorsList); // Store errors
        console.log(xNew);
        console.log(results);
    };

    const isValidNumber = (value) => /^-?\d+(\.\d+)?$/.test(value);

    const calculateRoot = () => {
        setErrorMessage("");
        const x0num = parseFloat(X0);

        if (isNaN(x0num)) {
            setErrorMessage("กรุณาใส่ค่า X0.");
            return;
        }
        if (!isValidNumber(x0num)) {
            setErrorMessage("กรุณาใส่ตัวเลขที่ถูกต้องสำหรับ X0.");
            return;
        }
        calculateOnePointIteration(x0num);
    };

    const handleInputChange = (setter) => (event) => {
        setter(event.target.value);
    };

    const resetFields = () => {
        setData([]);
        setX(0);
        setEquation("(x^4 - 13)"); // Reset to default equation
        setLatexEquation(convertToLatex("(x^4 - 13)")); // Reset LaTeX
        setX0("");
        setErrorMessage("");
        setErrorTolerance(0.00001); 
        setCurrentFormula(""); // Reset current formula
        setButtonClicked(true);
        setTimeout(() => setButtonClicked(false), 200);
    };

    const renderTable = () => (
        <Container>
            <StyledTable striped bordered hover variant="dark">
                <thead>
                    <tr>
                        <th width="20%">Iteration</th>
                        <th width="80%">X</th>
                        <th width="20%">Error(%)</th> 
                    </tr>
                </thead>
                <tbody>
                    {data.map((element, index) => (
                        <TableRow key={index}>
                            <td>{element.iteration}</td>
                            <td>{element.X.toFixed(6)}</td>
                            <td>{element.Error.toFixed(6)}%</td>
                           
                        </TableRow>
                    ))}
                </tbody>
            </StyledTable>
        </Container>
    );

    return (
        <Container>
            <Form>
                <Form.Group className="mb-3">
                    <FormCon>
                        <Inline_Math>
                            {/* แสดงสมการที่ได้จากการคำนวณ */}
                            <InlineMath math={`x - \\frac{${Equation}}{${derivative(Equation, 'x')}}`} />
                        </Inline_Math>
                        <TextForm
                            placeholderText="Input function (in terms of x)"
                            value={Equation}
                            onValueChange={handleInputChange(setEquation)}
                        />
                    </FormCon>
                    <FormInput>
                        <TextForm
                            placeholderText="Input X0"
                            value={X0}
                            onValueChange={handleInputChange(setX0)}
                        />
                    </FormInput>
                    <FormButton>
                        <ButtonFormat text='Calculate' onClick={calculateRoot} variant="dark" />
                        <Restart isClicked={buttonClicked} onClick={resetFields}>
                            <RestartAltIcon style={ColorIcon} />
                        </Restart>
                    </FormButton>
                    <FormAsn>
                        <BlockMath math={`X = ${X.toPrecision(7)}`} />
                    </FormAsn>
                    {errorMessage && <ErrorText>{errorMessage}</ErrorText>}
                    <FormTable>
                        {renderTable()}
                    </FormTable>
                    <CustomLineChart data={ data}/>
                </Form.Group>
            </Form>
        </Container>
    );
};

export default OnePointIterationCalculator;
