import React, { useState } from "react";
import { Container, Form, Table } from "react-bootstrap";
import { evaluate } from 'mathjs';
import ButtonFormat from "../ButtonForm/button_form";
import TextForm from "../ButtonForm/text_form";
import CustomLineChart from "../GrapForm/CustomLineChart"; // Ensure correct path
import styled from 'styled-components';
import RestartAltIcon from '@mui/icons-material/RestartAlt';

// Styled components
const ColorIcon = {
    color: 'white',
    fontSize: 40 
};

const Restart = styled.button`
  cursor: pointer;
  background-color: ${({ isClicked }) => (isClicked ? '#C96868' : '#FF8A8A')};
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
    gap: 2vh; 
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

const NewtonRaphsonCalculator = () => {
    const [data, setData] = useState([]);
    const [X, setX] = useState(0);
    const [Equation, setEquation] = useState("x^4 - 13"); // Updated function
    const [Derivative, setDerivative] = useState("4*x^3"); // Updated derivative
    const [X0, setX0] = useState(""); // Initial guess
    const [errorMessage, setErrorMessage] = useState("");
    const [buttonClicked, setButtonClicked] = useState(false);

    const error = (xold, xnew) => Math.abs((xnew - xold) / xnew) * 100;

    const calculateNewtonRaphson = (x0) => {
        let xNew = x0;
        let ea = 100;
        let iter = 0;
        const MAX = 50;
        const e = 0.00001;
        const results = [];

        do {
            const xOld = xNew;
            const fOld = evaluate(Equation, { x: xOld });
            const fPrimeOld = evaluate(Derivative, { x: xOld });

            if (fPrimeOld === 0) {
                setErrorMessage("Derivative is zero. No solution found.");
                return;
            }

            xNew = xOld - fOld / fPrimeOld;
            ea = error(xOld, xNew);
            iter++;
            results.push({ iteration: iter, X: xNew });
        } while (ea > e && iter < MAX);

        setX(xNew);
        setData(results);
        console.log(xNew);
        console.log(results);
    };

    const isValidNumber = (value) => /^-?\d+(\.\d+)?$/.test(value);

    const calculateRoot = () => {
        setErrorMessage("");

        const x0num = parseFloat(X0);

        if (isNaN(x0num)) {
            setErrorMessage("กรุณาใส่ตัวเลขที่ถูกต้องสำหรับ X0.");
            return;
        }

        calculateNewtonRaphson(x0num);
    };

    const handleInputChange = (setter) => (event) => {
        setter(event.target.value);
    };

    const resetFields = () => {
        setData([]);
        setX(0);
        setEquation("x^4 - 13"); 
        setDerivative("4*x^3"); 
        setX0("");
        setErrorMessage("");
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
                    </tr>
                </thead>
                <tbody>
                    {data.map((element, index) => (
                        <TableRow key={index}>
                            <td>{element.iteration}</td>
                            <td>{element.X.toFixed(6)}</td>
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
                        <TextForm
                            placeholderText="Input function (in terms of x)"
                            value={Equation}
                            onValueChange={handleInputChange(setEquation)}
                        />
                        <TextForm
                            placeholderText="Input derivative (in terms of x)"
                            value={Derivative}
                            onValueChange={handleInputChange(setDerivative)}
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
                        Answer = {X.toFixed(6)}
                    </FormAsn>
                    {errorMessage && <ErrorText>{errorMessage}</ErrorText>}
                    <FormTable>
                        {renderTable()}
                    </FormTable>
                    <CustomLineChart data={data.map(item => ({ iteration: item.iteration, X: item.X }))} />
                </Form.Group>
            </Form>
        </Container>
    );
};

export default NewtonRaphsonCalculator;
