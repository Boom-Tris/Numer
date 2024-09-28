import React, { useState } from "react"; 
import { Container, Form } from "react-bootstrap";
import { evaluate } from 'mathjs';
import ButtonFormat from "../ButtonForm/button_form";
import TextForm from "../ButtonForm/text_form";
import GraphComponent from "../GrapForm/GraphComponent";
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

const ErrorText = styled.div`
    color: red;
    font-size: 1.5vh;
`;

const GraphicalCalculator = () => {
    const [Equation, setEquation] = useState("(x^4) - 13");
    const [graphData, setGraphData] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");
    const [buttonClicked, setButtonClicked] = useState(false);

    const generateGraphData = () => {
        try {
            if (!Equation) {
                throw new Error("Equation cannot be empty.");
            }
            let points = [];
            for (let x = -10; x <= 10; x += 0.1) {
                const y = evaluate(Equation, { x });
                points.push({ iteration: x, Xm: y }); 

               
                if (Math.abs(y) < 0.01) {
                    break; 
                }
            }
            setGraphData(points);
            setErrorMessage(""); 
        } catch (error) {
            setErrorMessage(error.message || "Invalid function. Please check your input.");
            setGraphData([]); 
        }
    };

    const handleInputChange = (setter) => (event) => {
        setter(event.target.value);
    };

    const resetFields = () => {
        setEquation("(x^4) - 13");
        setGraphData([]);
        setErrorMessage("");
        setButtonClicked(true);
        setTimeout(() => setButtonClicked(false), 200);
    };

    return (
        <Container>
            <Form>
                <Form.Group className="mb-3">
                    <FormCon>
                        <TextForm
                            placeholderText="Input function"
                            value={Equation}
                            onValueChange={handleInputChange(setEquation)}
                        />
                    </FormCon>
                    <FormButton>
                        <ButtonFormat text='Plot Graph' onClick={generateGraphData} variant="dark" />
                        <Restart isClicked={buttonClicked} onClick={resetFields}>
                            <RestartAltIcon style={ColorIcon} />
                        </Restart>
                    </FormButton>
                    <FormAsn>
                        You can identify the root visually from the graph.
                    </FormAsn>
                    {errorMessage && <ErrorText>{errorMessage}</ErrorText>}
                    <div style={{ margin: "5vh" }}>
                        {graphData.length > 0 && <GraphComponent data={graphData} />}
                    </div>
                </Form.Group>
            </Form>
        </Container>
    );
};

export default GraphicalCalculator;
