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

const StyledTable = styled.table`
    width: 100%;
    border-collapse: collapse;
    text-align: center;
    margin-top: 20px;

    th, td {
        border: 1px solid #ddd;
        padding: 8px;
    }

    th {
        background-color: #f2f2f2;
    }
`;

const StyledButton = styled.button`
    background-color: #3A6D8C;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    margin-top: 10px;

    &:hover {
        background-color: white;
        border: 1px solid #3A6D8C;
        color: #3A6D8C;
    }
`;

const Select = styled.select`
    padding: 5px;
    font-size: 1em;
    margin-bottom: 20px;
`;

const ErrorText = styled.div`
    color: red;
    font-size: 1.2em;
    margin-top: 10px;
`;

const StepContainer = styled.div`
    margin-top: 20px;
`;

// Gauss-Jordan Calculator Component
const GaussJordanCalculator = () => {
    const [size, setSize] = useState(2);
    const [matrix, setMatrix] = useState(Array(size).fill().map(() => Array(size + 1).fill('')));
    const [results, setResults] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [steps, setSteps] = useState([]);

    const calculateGaussJordan = () => {
        setErrorMessage('');
        setSteps([]); // Reset steps for new calculation

        const A = matrix.map(row => row.map(Number));
        const n = A.length;

        // Gauss-Jordan elimination process
        for (let i = 0; i < n; i++) {
            // Step 1: Make the diagonal contain all 1s
            const diag = A[i][i];
            if (diag === 0) {
                setErrorMessage('Division by zero detected, please check your matrix.');
                return;
            }
            for (let j = 0; j <= n; j++) {
                A[i][j] /= diag;
            }

            // Log the step after making the diagonal 1
            const stepAfterDiagonal = `\\text{Step ${i * 2 + 1}: Make A[${i}][${i}] = 1} \\begin{bmatrix}${A.map(row => row.join('&')).join('\\\\')}\\end{bmatrix}`;
            setSteps(prevSteps => [...prevSteps, stepAfterDiagonal]);

            // Step 2: Make all other rows contain 0 in this column
            for (let k = 0; k < n; k++) {
                if (k !== i) {
                    const factor = A[k][i];
                    for (let j = 0; j <= n; j++) {
                        A[k][j] -= factor * A[i][j];
                    }
                }
            }

            // Log the step after eliminating other rows
            const stepAfterElimination = `\\text{Step ${i * 2 + 2}: Eliminate column ${i}} \\begin{bmatrix}${A.map(row => row.join('&')).join('\\\\')}\\end{bmatrix}`;
            setSteps(prevSteps => [...prevSteps, stepAfterElimination]);
        }

        setResults(A.map(row => row[n])); // The last column contains the results
    };

    const handleMatrixChange = (row, col) => (event) => {
        const newMatrix = [...matrix];
        newMatrix[row][col] = event.target.value;
        setMatrix(newMatrix);
    };

    const handleSizeChange = (event) => {
        const newSize = Number(event.target.value);
        setSize(newSize);
        setMatrix(Array(newSize).fill().map(() => Array(newSize + 1).fill('')));
        setResults([]);
        setSteps([]); // Reset steps when size changes
    };

    const randomizeMatrix = () => {
        const newMatrix = Array(size).fill().map(() => 
            Array(size + 1).fill().map(() => Math.floor(Math.random() * 10) + 1) // Random values between 1 and 10
        );
        setMatrix(newMatrix);
    };

    return (
        <Container>
            <h2>Gauss-Jordan Elimination Calculator</h2>
            <Form>
                <Label>Matrix Size (Number of Equations)</Label>
                <Select value={size} onChange={handleSizeChange}>
                    {[...Array(10).keys()].map(i => (
                        <option key={i + 1} value={i + 1}>{i + 1}</option>
                    ))}
                </Select>

                <StyledTable>
                    <thead>
                        <tr>
                            <th>Equation / Variables</th>
                            {Array.from({ length: size }).map((_, colIndex) => (
                                <th key={colIndex}>{`X${colIndex + 1}`}</th>
                            ))}
                            <th>Constants</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Array.from({ length: size }).map((_, rowIndex) => (
                            <tr key={rowIndex}>
                                <td>{`Equation ${rowIndex + 1}`}</td>
                                {Array.from({ length: size }).map((_, colIndex) => (
                                    <td key={colIndex}>
                                        <input
                                            type="number"
                                            placeholder={`A[${rowIndex}][${colIndex}]`}
                                            value={matrix[rowIndex][colIndex]}
                                            onChange={handleMatrixChange(rowIndex, colIndex)}
                                            style={{ width: '80px' }}
                                        />
                                    </td>
                                ))}
                                <td>
                                    <input
                                        type="number"
                                        placeholder={`B[${rowIndex}]`}
                                        value={matrix[rowIndex][size]}
                                        onChange={handleMatrixChange(rowIndex, size)}
                                        style={{ width: '80px' }}
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </StyledTable>

                <ButtonFormatM text='Generate' onClick={randomizeMatrix} />
                <ButtonFormatM text='Calculate' onClick={calculateGaussJordan} />
              
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
                                <td>{result.toFixed(4)}</td>
                            </tr>
                        ))}
                    </tbody>
                </StyledTable>
            )}

            {steps.length > 0 && (
                <StepContainer>
                    <h4>Calculation Steps:</h4>
                    {steps.map((step, index) => (
                        <BlockMath key={index} math={step} />
                    ))}
                </StepContainer>
            )}
        </Container>
    );
};

export default GaussJordanCalculator;
