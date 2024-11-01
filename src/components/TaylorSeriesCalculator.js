import React, { useState, useEffect } from "react";
import { Container, Form, Table } from "react-bootstrap";
import { evaluate, parse, derivative } from 'mathjs';
import ButtonFormat from "../ButtonForm/button_form";
import TextForm from "../ButtonForm/text_form";
import GraphComponent from "../GrapForm/GraphComponent";
import styled from 'styled-components';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import equations from './equations'; // นำเข้ารายการสมการ
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

const TaylorSeriesCalculator = () => {
  const [data, setData] = useState([]);
  const [X, setX] = useState(0);
  const [Equation, setEquation] = useState("x^4 - 13");
  const [nTerms, setNTerms] = useState("");
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
  const fetchRandomEquation = () => {
    const randomIndex = Math.floor(Math.random() * equations.length);
    setEquation(equations[randomIndex]);
};
  const factorial = (num) => {
    if (num === 0) return 1;
    return num * factorial(num - 1);
  };

  const calculateTaylorSeries = (equation, x, n) => {
    const results = [];
    let seriesSum = 0;

    // คำนวณค่า Taylor Series
    for (let i = 0; i < n; i++) {
      const term = evaluate(equation, { x }); // คำนวณค่าของสมการ
      results.push({ term: `Term ${i + 1}`, value: term }); // เก็บค่าผลลัพธ์
      seriesSum += term; // คำนวณผลรวม
      equation = derivative(equation, 'x').toString(); // ปรับสมการเป็นอนุพันธ์สำหรับเทอมถัดไป
    }

    setX(seriesSum); // อัปเดตค่า X
    setData(results);
  };

  const calculateRoot = () => {
    setErrorMessage(""); 

    // ไม่ตรวจสอบ nTerms แต่ใช้เป็นจำนวนเทอมตรง ๆ
    const numberOfTerms = parseInt(nTerms) || 0; // แปลงเป็นจำนวนเต็มถ้าเป็นไปได้

    if (numberOfTerms <= 0) {
      setErrorMessage("กรุณาใส่จำนวนที่ถูกต้องสำหรับจำนวนเทอม");
      return;
    }

    calculateTaylorSeries(Equation, X, numberOfTerms);
  };

  const handleInputChange = (setter) => (event) => {
    setter(event.target.value);
  };

  const resetFields = () => {
    setData([]);
    setX(0);
    setEquation("x^4 - 13");
    setNTerms("");
    setErrorMessage("");
    setButtonClicked(true);
    setTimeout(() => setButtonClicked(false), 200);
  };

  const renderTable = () => (
    <Container>
      <StyledTable striped bordered hover variant="dark">
        <thead>
          <tr>
            <th width="30%">Term</th>
            <th width="30%">Value</th>
          </tr>
        </thead>
        <tbody>
          {data.map((element, index) => (
            <TableRow key={index}>
              <td>{element.term}</td>
              <td>{element.value.toFixed(6)}</td>
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
            <TextForm
              placeholderText="Number of terms"
              value={nTerms}
              onValueChange={handleInputChange(setNTerms)}
            />
          </FormCon>
          <FormButton>
           
            <ButtonFormat text='Calculate' onClick={calculateRoot} variant="dark" />
            <ButtonFormat text='Fetch Random Equation' onClick={fetchRandomEquation} variant="info" />ห
            <Restart $isClicked={buttonClicked} onClick={resetFields}>
              <RestartAltIcon style={ColorIcon} />
            </Restart>
          </FormButton>
          <FormAsn>
            <BlockMath math={`f(x) = ${X.toPrecision(7)}`} />
          </FormAsn>
          {errorMessage && <ErrorText>{errorMessage}</ErrorText>}
          <FormTable>
            {renderTable()}
          </FormTable>
         
        </Form.Group>
      </Form>
    </Container>
  );
};

export default TaylorSeriesCalculator;
