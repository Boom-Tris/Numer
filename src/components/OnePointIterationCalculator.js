import React, { useState, useEffect } from "react";
import { Container, Form, Table } from "react-bootstrap";
import { evaluate, parse } from 'mathjs';
import ButtonFormat from "../ButtonForm/button_form";
import TextForm from "../ButtonForm/text_form";
import CustomLineChart from "../GrapForm/CustomLineChart"; 
import styled from 'styled-components';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import 'katex/dist/katex.min.css';
import { BlockMath, InlineMath } from 'react-katex';
import equations from './equations'; // นำเข้ารายการสมการ
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

const RestartButton = styled.button`
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

const FormContainer = styled.div`
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

const FormButtonContainer = styled.div`
    margin-top: 3vh;
    display: flex;
    gap: 1vh;
    align-items: center;  
    justify-content: center;
`;

const ResultDisplay = styled.div`
    display: flex;
    margin-top: 2vh;
    justify-content: center;
    align-items: center;  
    font-size: 3vh;
`;

const TableContainer = styled.div`
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
    const [Equation, setEquation] = useState("(x^4) - 13"); // Initial equation
    const [latexEquation, setLatexEquation] = useState(""); 
    const [X0, setX0] = useState(""); 
    const [errorTolerance, setErrorTolerance] = useState(0.00001);
    const [errorMessage, setErrorMessage] = useState("");
    const [buttonClicked, setButtonClicked] = useState(false);
    const [gEquation, setGEquation] = useState(""); // g(x) equation
    
    // Convert equation to LaTeX format
    const convertToLatex = (equation) => {
        try {
            const node = parse(equation);
            return node.toTex();
        } catch (error) {
            return equation; 
        }
    };

    useEffect(() => {
        setLatexEquation(convertToLatex(Equation));
        setGEquation(transformEquationToG(Equation)); // Update g(x)
    }, [Equation]);

    const error = (xold, xnew) => Math.abs((xnew - xold) / xnew) * 100;

    // Function to transform f(x) to g(x)
    const transformEquationToG = (equation) => {
        try {
            const parsedEquation = parse(equation);
            // Modify based on the equation structure
            if (parsedEquation) {
                // Assume transforming x^4 - 13 to x = sqrt[4]{13}
                // Adjust as needed for the iteration
            } 
            return equation; // Return original if no transformation
        } catch (error) {
            return equation; 
        }
    };

    // Calculate using One-Point Iteration method
    const calculateOnePointIteration = (x0) => {
        let xNew = x0;
        let ea = 100;
        let iter = 0;
        const MAX_ITERATIONS = 50;
        const e = parseFloat(errorTolerance);
        const results = [];
        const transformedEquation = gEquation; // g(x)
    
        do {
            const xOld = xNew;
            xNew = evaluate(transformedEquation, { x: xOld }); // Use g(x)
            ea = error(xOld, xNew);
            iter++;
            results.push({ iteration: iter, X: xNew, Error: ea });
    
            // Debugging: Print values for each iteration
            console.log(`Iteration: ${iter}, X: ${xNew}, Error: ${ea}`);
        } while (ea > e && iter < MAX_ITERATIONS);
        
        setX(xNew);
        setData(results);
        setErrorMessage("");
    };
    const fetchRandomEquation = () => {
        const randomIndex = Math.floor(Math.random() * equations.length);
        setEquation(equations[randomIndex]);
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
        setEquation("(x^4) - 13"); // Reset to initial equation
        setLatexEquation(convertToLatex("(x^4) - 13")); 
        setX0("");
        setErrorMessage("");
        setErrorTolerance(0.00001); 
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
            <h1 style={{ marginLeft: '15vh' }}>OnePointIterationCalculator</h1>
                <Form.Group className="mb-3">
                    <FormContainer>
                        <Inline_Math>
                            <InlineMath math={`g(x) = ${convertToLatex(gEquation)}`} />
                        </Inline_Math>
                        <TextForm
                            placeholderText="Input function f(x)"
                            value={Equation}
                            onValueChange={handleInputChange(setEquation)}
                        />
                    </FormContainer>
                    <FormInput>
                        <TextForm
                            placeholderText="Input X0"
                            value={X0}
                            onValueChange={handleInputChange(setX0)}
                        />
                    </FormInput>
                    <FormButtonContainer>
                        <ButtonFormat text='Calculate' onClick={calculateRoot} variant="dark" />
                        <ButtonFormat text='Fetch Random Equation' onClick={fetchRandomEquation} variant="info" />
                        <RestartButton $isClicked={buttonClicked} onClick={resetFields}>
                            <RestartAltIcon style={ColorIcon} />
                        </RestartButton>
                    </FormButtonContainer>
                    <ResultDisplay>
                        <BlockMath math={`X = ${X.toPrecision(7)}`} />
                    </ResultDisplay>
                    {errorMessage && <ErrorText>{errorMessage}</ErrorText>}
                    <TableContainer>
                        {renderTable()}
                    </TableContainer>
                    <CustomLineChart data={data} />
                </Form.Group>
            </Form>
        </Container>
    );
};  

export default OnePointIterationCalculator;
