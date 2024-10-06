import React, { useState, useEffect } from "react";
import { Container, Form, Table } from "react-bootstrap";
import { evaluate, parse } from 'mathjs';
import ButtonFormat from "../ButtonForm/button_form";
import TextForm from "../ButtonForm/text_form";
import GraphComponent from "../GrapForm/GraphComponent";
import styled from 'styled-components';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';

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



const GraphicalCalculator = () => {
    const [data, setData] = useState([]);
    const [X, setX] = useState(0);
    const [Equation, setEquation] = useState("(x^4) - 13");
    const [errorMessage, setErrorMessage] = useState("");
    const [buttonClicked, setButtonClicked] = useState(false);
    const [latexEquation, setLatexEquation] = useState(""); 

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
    }, [Equation]);

    const calculateGraphicalMethod = () => {
        const results = [];
        const stepSize = 0.1; 
        let xm, fXm;

        // กำหนดช่วงค่าตั้งแต่ 0 ถึง 10 (หรือช่วงอื่นที่คุณต้องการ)
        for (let i = 0; i <= 10; i += stepSize) { 
            fXm = evaluate(Equation, { x: i });
            results.push({ x: i, y: fXm });
        }

        // หาค่าที่ตัดกันกับแกน x (y = 0)
        for (let i = 0; i < results.length - 1; i++) {
            // เช็คการเปลี่ยนแปลงจากบวกเป็นลบ
            if ((results[i].y >= 0 && results[i + 1].y <= 0) || (results[i].y <= 0 && results[i + 1].y >= 0)) {
                xm = (results[i].x + results[i + 1].x) / 2;
                setX(xm);
                break;
            }
        }

        setData(results);
    };

    const calculateRoot = () => {
        setErrorMessage(""); 

        if (!Equation) {
            setErrorMessage("กรุณาใส่สมการ");
            return;
        }

        calculateGraphicalMethod();
    };

    const handleInputChange = (setter) => (event) => {
        setter(event.target.value);
    };

    const resetFields = () => {
        setData([]);
        setX(0);
        setEquation("(x^4) - 13");
        setErrorMessage("");
        setButtonClicked(true);
        setTimeout(() => setButtonClicked(false), 200);
    };

    const renderTable = () => (
        <Container>
            <StyledTable striped bordered hover variant="dark">
                <thead>
                    <tr>
                        <th width="10%">X</th>
                        <th width="10%">Y</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((element, index) => (
                        <TableRow key={index}>
                            <td>{element.x.toFixed(2)}</td>
                            <td>{element.y.toFixed(2)}</td>
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
                    </FormCon>
                    <FormButton>
                        <ButtonFormat text='Calculate' onClick={calculateRoot} variant="dark" />
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

export default GraphicalCalculator;
