import React, { useState } from 'react';
import styled from 'styled-components';
import { BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import ButtonFormatM from '../ButtonForm/button_M';

// Styled Components
const Container = styled.div`
    max-width: 900px;
    margin: 0 auto;
    padding: 20px;
`;

const Form = styled.div`
    display: flex;
    flex-direction: column;
    margin-bottom: 20px;
`;

const Label = styled.label`
    margin-bottom: 10px;
    font-size: 1.2em;
`;

const Select = styled.select`
    padding: 5px;
    font-size: 1em;
    margin-bottom: 20px;
`;

const Input = styled.input`
    margin-right: 10px;
    width: 60px;
    padding: 5px;
`;

const StyledTable = styled.table`
    width: 100%;
    margin-top: 20px;
    border-collapse: collapse;

    th, td {
        border: 1px solid #ddd;
        padding: 8px;
        text-align: center;
    }

    th {
        background-color: #f2f2f2;
    }
`;

const ErrorText = styled.div`
    color: red;
    font-size: 1.2em;
    margin-top: 10px;
`;

// Main Component
const CramerCalculator = () => {
    const [size, setSize] = useState(2);
    const [matrixA, setMatrixA] = useState(Array(size).fill().map(() => Array(size).fill('')));
    const [vectorB, setVectorB] = useState(Array(size).fill(''));
    const [results, setResults] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [steps, setSteps] = useState([]);

    const calculateCramer = () => {
        setErrorMessage('');
        setSteps([]);

        const A = matrixA.map(row => row.map(Number));
        const B = vectorB.map(Number);

        const determinant = (matrix) => {
            const size = matrix.length;
            if (size === 1) return matrix[0][0];
            if (size === 2) return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];

            let det = 0;
            for (let c = 0; c < size; c++) {
                det += Math.pow(-1, c) * matrix[0][c] * determinant(matrix.slice(1).map(row => row.filter((_, i) => i !== c)));
            }
            return det;
        };

        const detA = determinant(A);
        if (detA === 0) {
            setErrorMessage("Determinant is zero, the system has no unique solution.");
            return;
        }

        const sol = [];
        for (let i = 0; i < size; i++) {
            const tempMatrix = A.map((row, j) => row.map((value, k) => (k === i ? B[j] : value)));
            const detTemp = determinant(tempMatrix);
            sol.push(detTemp / detA);

            const step = `X_${i + 1} = \\frac{D_{${i + 1}}}{D} = \\frac{${detTemp}}{${detA}} = ${sol[i].toFixed(4)}`;
            setSteps(prevSteps => [...prevSteps, step]);
        }
        setResults(sol);
    };

    const handleMatrixChange = (row, col) => (event) => {
        const newMatrix = [...matrixA];
        newMatrix[row][col] = event.target.value;
        setMatrixA(newMatrix);
    };

    const handleVectorChange = (index) => (event) => {
        const newVector = [...vectorB];
        newVector[index] = event.target.value;
        setVectorB(newVector);
    };

    const handleSizeChange = (event) => {
        const newSize = Number(event.target.value);
        setSize(newSize);
        setMatrixA(Array(newSize).fill().map(() => Array(newSize).fill('')));
        setVectorB(Array(newSize).fill(''));
        setResults([]);
        setSteps([]);
    };

    // New function to generate random matrix and vector
    const generateRandomMatrix = () => {
        const newMatrix = Array(size).fill().map(() => Array(size).fill(0).map(() => Math.floor(Math.random() * 10)));
        const newVector = Array(size).fill(0).map(() => Math.floor(Math.random() * 10));
        setMatrixA(newMatrix);
        setVectorB(newVector);
    };

    return (
        <Container>
            <h2>Cramer's Rule Calculator</h2>
            <Form>
                <Label>Matrix Size (Number of Equations)</Label>
                <Select value={size} onChange={handleSizeChange}>
                    {[...Array(10).keys()].map(i => (
                        <option key={i + 1} value={i + 1}>{i + 1}</option>
                    ))}
                </Select>

                {Array.from({ length: size }).map((_, rowIndex) => (
                    <div key={rowIndex} style={{ display: 'flex', marginBottom: '10px' }}>
                        {Array.from({ length: size }).map((_, colIndex) => (
                            <Input
                                key={colIndex}
                                type="number"
                                placeholder={`A[${rowIndex}][${colIndex}]`}
                                value={matrixA[rowIndex][colIndex]}
                                onChange={handleMatrixChange(rowIndex, colIndex)}
                            />
                        ))}
                        <Input
                            type="number"
                            placeholder={`B[${rowIndex}]`}
                            value={vectorB[rowIndex]}
                            onChange={handleVectorChange(rowIndex)}
                        />
                    </div>
                ))}

               
                <ButtonFormatM text='Generate' onClick={generateRandomMatrix} /> {/* New Button */}
                <ButtonFormatM text='Calculate' onClick={calculateCramer} />
            </Form>

            {errorMessage && <ErrorText>{errorMessage}</ErrorText>}

            {results.length > 0 && (
                <StyledTable>
                    <thead>
                        <tr>
                            <th>Variable</th>
                            <th>Value</th>
                        </tr>
                    </thead>
                    <tbody>
                        {results.map((result, index) => (
                            <tr key={index}>
                                <td>X{index + 1}</td>
                                <td>{result}</td>
                            </tr>
                        ))}
                    </tbody>
                </StyledTable>
            )}

            {steps.length > 0 && (
                <div style={{ marginTop: '20px' }}>
                    <h4>Calculation Steps:</h4>
                    {steps.map((step, index) => (
                        <BlockMath key={index} math={step} />
                    ))}
                </div>
            )}
        </Container>
    );
};

export default CramerCalculator;
