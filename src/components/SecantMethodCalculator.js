import React, { useState, useEffect } from "react";
import { Container, Form, Table } from "react-bootstrap";
import { evaluate, parse } from 'mathjs';
import ButtonFormat from "../ButtonForm/button_form";
import TextForm from "../ButtonForm/text_form";
import GraphComponent from "../GrapForm/GraphComponent";
import styled from 'styled-components';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';import equations from './equations'; // นำเข้ารายการสมการ
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

const SecantMethodCalculator = () => {
  const [data, setData] = useState([]);
  const [X, setX] = useState(0);
  const [Equation, setEquation] = useState("(x^4) - 13");
  const [X0, setX0] = useState("");
  const [X1, setX1] = useState("");
  const [errorTolerance, setErrorTolerance] = useState(0.00001);
  const [errorMessage, setErrorMessage] = useState("");
  const [buttonClicked, setButtonClicked] = useState(false);
  const [latexEquation, setLatexEquation] = useState(""); 

  const convertToLatex = (equation) => {
    try {
      const node = parse(equation); // ใช้ mathjs เพื่อ parse สมการ
      return node.toTex(); // แปลงเป็นรูปแบบ LaTeX
    } catch (error) {
      return equation; // ถ้าแปลงไม่สำเร็จ ให้แสดงสมการเดิม
    }
  };

  useEffect(() => {
    setLatexEquation(convertToLatex(Equation));
  }, [Equation]);

  const error = (xold, xnew) => Math.abs((xnew - xold) / xnew) * 100;

  const isValidNumber = (value) => /^-?\d+(\.\d+)?$/.test(value);

  const calculateSecant = (x0, x1) => {
    let x2, fX0, fX1, ea = 100;
    let iter = 0;
    const MAX = 50;
    const e = parseFloat(errorTolerance);
    const results = [];

    do {
      fX0 = evaluate(Equation, { x: x0 });
      fX1 = evaluate(Equation, { x: x1 });

      x2 = x1 - (fX1 * (x1 - x0)) / (fX1 - fX0); // Secant Method formula
      ea = error(x1, x2);
      iter++;

      results.push({ iteration: iter, X0: x0, X1: x1, X2: x2, Error: ea });

      // Prepare for next iteration
      x0 = x1;
      x1 = x2;

    } while (ea > e && iter < MAX);

    setX(x2);
    setData(results);
  };

  const calculateRoot = () => {
    setErrorMessage(""); 

    const x0num = parseFloat(X0);
    const x1num = parseFloat(X1);
    const eNum = parseFloat(errorTolerance); 

    if (isNaN(x0num) || isNaN(x1num)) {
      setErrorMessage("กรุณาใส่ค่า X0 และ X1");
      return;
    }
    if (isNaN(eNum)) {
      setErrorMessage("กรุณาใส่ค่า e.");
      return;
    }
    if (!isValidNumber(X0) || !isValidNumber(X1)) {
      setErrorMessage("กรุณาใส่ตัวเลขที่ถูกต้องสำหรับ X0 และ X1");
      return;
    }
    if (eNum <= 0) { 
      setErrorMessage("ค่า e ต้องเป็นตัวเลขที่เป็นบวก.");
      return;
    }

    calculateSecant(x0num, x1num);
  };

  const handleInputChange = (setter) => (event) => {
    setter(event.target.value);
  };
  const fetchRandomEquation = () => {
    const randomIndex = Math.floor(Math.random() * equations.length);
    setEquation(equations[randomIndex]);
};
  const resetFields = () => {
    setData([]);
    setX(0);
    setEquation("(x^4) - 13");
    setX0("");
    setX1("");
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
            <th width="10%">Iteration</th>
            <th width="30%">X0</th>
            <th width="30%">X1</th>
            <th width="30%">X2</th>
            <th width="30%">Error (%)</th>
          </tr>
        </thead>
        <tbody>
          {data.map((element, index) => (
            <TableRow key={index}>
              <td>{element.iteration}</td>
              <td>{element.X0.toFixed(6)}</td>
              <td>{element.X1.toFixed(6)}</td>
              <td>{element.X2.toFixed(6)}</td>
              <td>{element.Error.toFixed(5)}%</td>
            </TableRow>
          ))}
        </tbody>
      </StyledTable>
    </Container>
  );

  return (
    <Container>
      <Form>
      <h1 style={{ marginLeft: '15vh' }}>SecantMethodCalculator</h1>
        <Form.Group className="mb-3">
          <FormAsn>
            <Inline_Math>
              <InlineMath math={latexEquation} />
            </Inline_Math>
          </FormAsn>
          <FormCon>
            <TextForm
              placeholderText="Input function"
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
            <TextForm
              placeholderText="Input X1"
              value={X1}
              onValueChange={handleInputChange(setX1)}
            />
            <TextForm
              placeholderText="Input Error"
              value={errorTolerance}
              onValueChange={handleInputChange(setErrorTolerance)}
            />
          </FormInput>
          <FormButton>
            <ButtonFormat text='Calculate' onClick={calculateRoot} variant="dark" />
            <ButtonFormat text='Fetch Random Equation' onClick={fetchRandomEquation} variant="info" />
            <Restart $isClicked={buttonClicked} onClick={resetFields}>
              <RestartAltIcon style={ColorIcon} />
            </Restart>
          </FormButton>
          <FormAsn>
            <BlockMath math={`X2 = ${X.toPrecision(7)}`} />
          </FormAsn>
          {errorMessage && <ErrorText>{errorMessage}</ErrorText>}
          <FormTable>
            {renderTable()}
          </FormTable>
          <GraphComponent data={data} />
        </Form.Group>
      </Form>
    </Container>
  );
};

export default SecantMethodCalculator;
