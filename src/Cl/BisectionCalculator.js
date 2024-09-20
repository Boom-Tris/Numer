import { useState } from "react";
import { Button, Container, Form, Table } from "react-bootstrap";
import { evaluate } from 'mathjs';

import TextForm from "../components/text_form";
import styled from 'styled-components';
import ButtonFormat from "../components/button_form";
const FormCon = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;  
    justify-content: center;  
   

`;

const FormInput =styled.div`
 display: flex;
 gap: 2vh; 
`;

const FormButton =styled.div`
margin-top:3vh;
 display: flex;
    flex-direction: column;
    align-items: center;  
    justify-content: center;
`;
const FormAsn =styled.div`
 display: flex;
 margin-top:2vh;
 justify-content: center;
 align-items: center;  
font-size: 3vh;
   
`;
const FormTable =styled.div`
margin:40vh 0 0 65vh ;


font-size: 2vh;
 
  
`;
const BisectionCalculator = () => {
    const [data, setData] = useState([]);
    const [X, setX] = useState(0);
    const [Equation, setEquation] = useState("(x^4)-13");
    const [XL, setXL] = useState("");
    const [XR, setXR] = useState("");

    const error = (xold, xnew) => Math.abs((xnew - xold) / xnew) * 100;

    const Calbisection = (xl, xr) => {
        let xm, fXm, fXr, ea = 100; // กำหนดค่าเริ่มต้น ea
        let iter = 0;
        const MAX = 50;
        const e = 0.00001;
        const results = [];

        do {
            xm = (xl + xr) / 2.0;
            const scopeXr = { x: xr };
            const scopeXm = { x: xm };
            fXr = evaluate(Equation, scopeXr);
            fXm = evaluate(Equation, scopeXm);

            ea = error(xr, xm); // คำนวณค่า ea
            iter++;
            results.push({ iteration: iter, Xl: xl, Xm: xm, Xr: xr }); // เก็บคำตอบ
            if (fXm * fXr > 0) {
                xr = xm; // เปลี่ยน xr
            } else {
                xl = xm; // เปลี่ยน xl
            }
        } while (ea > e && iter < MAX);

        setX(xm);
        setData(results);
    };

    const inputEquation = (event) => {
        setEquation(event.target.value);
    };

    const inputXL = (event) => {
        setXL(event.target.value);
    };

    const inputXR = (event) => {
        setXR(event.target.value);
    };

    const calculateRoot = () => {
        const xlnum = parseFloat(XL);
        const xrnum = parseFloat(XR);
        Calbisection(xlnum, xrnum);
    };

    const renderTable = () => {
        return (
            <Container>
                <Table striped bordered hover variant="dark">
                    <thead>
                        <tr>
                            <th width="10%">Iteration</th>
                            <th width="30%">XL</th>
                            <th width="30%">XM</th>
                            <th width="30%">XR</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((element, index) => (
                            <tr key={index}>
                                <td>{element.iteration}</td>
                                <td>{element.Xl}</td>
                                <td>{element.Xm}</td>
                                <td>{element.Xr}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Container>
        );
    };

    return (
        <Container>
            <Form>
                <Form.Group className="mb-3">
                    <FormCon >     

                         <TextForm
                        placeholderText="Input  function"
                        value={Equation}
                        onValueChange={inputEquation}
                    />
                    
                    </FormCon>
                    <FormInput>

                        <TextForm
                        placeholderText="Input XL"
                        value={XL}
                        onValueChange={inputXL}
                    />
                    <TextForm
                        placeholderText="Input XR"
                        value={XR}
                        onValueChange={inputXR}
                    />
                    </FormInput>
                    <FormButton>
                    <ButtonFormat text='Calculate' onClick={calculateRoot} variant="dark"/>
               
                </FormButton>

                <FormAsn>
               Answer = {X.toPrecision(7)}
                
            </FormAsn>
            
            
                </Form.Group>
                <FormTable>
                     <Container>
                    {renderTable()}
                </Container>
                </FormTable>
               
               
                 
               
                   
                
                
                
                
                    
                 
                
                
            </Form>
           
            
           
            
        </Container>
    );
};

export default BisectionCalculator;
