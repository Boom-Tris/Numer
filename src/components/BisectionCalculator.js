import React, { useState, useEffect } from "react";
import { Container, Form, Table } from "react-bootstrap";
import { evaluate ,parse } from 'mathjs';
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

const BisectionCalculator = () => {
    const [data, setData] = useState([]);
    const [X, setX] = useState(0);
    const [Equation, setEquation] = useState("(x^4) - 13");
    const [XL, setXL] = useState("");
    const [XR, setXR] = useState("");
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
    const fetchRandomEquation = () => {
        const randomIndex = Math.floor(Math.random() * equations.length);
        setEquation(equations[randomIndex]);
    };
    // เมื่อ Equation เปลี่ยน, ทำการแปลงสมการเป็น LaTeX
    useEffect(() => {
        setLatexEquation(convertToLatex(Equation));
    }, [Equation]);
    const error = (xold, xnew) => Math.abs((xnew - xold) / xnew) * 100;
    const isValidNumber = (value) => /^-?\d+(\.\d+)?$/.test(value);
    const calculateBisection = (xl, xr) => {
        let xm, fXm, fXr, ea = 100;
        let iter = 0;
        const MAX = 50;
        const e = parseFloat(errorTolerance);
        const results = [];

        do {
            xm = (xl + xr) / 2.0;
            fXr = evaluate(Equation, { x: xr });
            fXm = evaluate(Equation, { x: xm });

            ea = error(xr, xm);
            iter++;
            results.push({ iteration: iter, Xl: xl, Xm: xm, Xr: xr, Error: ea }); 

            if (fXm * fXr > 0) {
                xr = xm;
            } else {
                xl = xm;
            }
        } while (ea > e && iter < MAX);

        setX(xm);
        console.log(xm);
        setData(results);
        console.log(results);
        
    };

    const calculateRoot = () => {
        setErrorMessage(""); 

        const xlnum = parseFloat(XL);
        const xrnum = parseFloat(XR);
        const eNum = parseFloat(errorTolerance); 
        if (isNaN(xlnum) || isNaN(xrnum) ) {
            setErrorMessage("กรุณาใส่ค่า XL, XR");
            return;
        }
        if  (isNaN(eNum)) {
            setErrorMessage("กรุณาใส่ค่า e.");
            return;
        }
        if (!isValidNumber(XL) || !isValidNumber(XR)) {
            setErrorMessage("กรุณาใส่ตัวเลขที่ถูกต้องสำหรับ XL และ XR");
            return;
        }
        if (!isValidNumber(errorTolerance)) {
            setErrorMessage("กรุณาใส่ค่าให้ถูกต้อง e.");
            return;
        }
        if (eNum <= 0) { 
            setErrorMessage("ค่า e ต้องเป็นตัวเลขที่เป็นบวก.");
            return;
        }


        calculateBisection(xlnum, xrnum);
    };

    const handleInputChange = (setter) => (event) => {
        setter(event.target.value);
    };

    const resetFields = () => {
        setData([]);
        setX(0);
        setEquation("(x^4) - 13");
        setXL("");
        setXR("");
        setErrorMessage("");
        setErrorTolerance(0.0001); 
        setButtonClicked(true);
        setTimeout(() => setButtonClicked(false), 200);
    };

    const renderTable = () => (
        <Container>
            <StyledTable striped bordered hover variant="dark">
                <thead>
                    <tr>
                        <th width="10%">Iteration</th>
                        <th width="30%">XL</th>
                        <th width="30%">XM</th>
                        <th width="30%">XR</th>
                        <th width="30%">Error (%)</th> 
                    </tr>
                </thead>
                <tbody>
                    {data.map((element, index) => (
                        <TableRow key={index}>
                            <td>{element.iteration}</td>
                            <td>{element.Xl.toFixed(6)}</td>
                            <td>{element.Xm.toFixed(6)}</td>
                            <td>{element.Xr.toFixed(6)}</td>
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
            <h1 style={{ marginLeft: '15vh' }}>BisectionCalculator</h1>
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
                            placeholderText="Input XL"
                            value={XL}
                            onValueChange={handleInputChange(setXL)}
                        />
                        <TextForm
                            placeholderText="Input XR"
                            value={XR}
                            onValueChange={handleInputChange(setXR)}
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
                    <BlockMath math={`Xm = ${X.toPrecision(7)}`} />
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

export default BisectionCalculator;
