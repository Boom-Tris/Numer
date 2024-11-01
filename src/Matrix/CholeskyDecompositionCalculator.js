import styled from 'styled-components';
import React, { useState } from 'react';
import { BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import ButtonFormatM from '../ButtonForm/button_M';

const StyledContainer = styled.div`
    max-width: 900px;
    margin: 0 auto;
    padding: 20px;
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

const ErrorText = styled.div`
    color: red;
    font-size: 1.2em;
    margin-top: 10px;
`;

const Form = styled.div`
    display: flex;
    flex-direction: column;
    margin-bottom: 20px;
`;

const StyledSelect = styled.select`
    padding: 5px;
    font-size: 1em;
    margin-bottom: 20px;
`;

const CholeskyDecompositionCalculator = () => {
    const [size, setSize] = useState(2);
    const [matrix, setMatrix] = useState(Array(size).fill().map(() => Array(size).fill('')));
    const [L, setL] = useState([]);
    const [LT, setLT] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [steps, setSteps] = useState([]);

    const calculateCholesky = () => {
        setErrorMessage('');
        setSteps([]); // Reset steps for new calculation

        const A = matrix.map(row => row.map(Number));
        const n = A.length;

        // Initialize L as a zero matrix
        const L = Array.from({ length: n }, () => Array(n).fill(0));

        // Cholesky Decomposition
        for (let i = 0; i < n; i++) {
            for (let j = 0; j <= i; j++) {
                let sum = 0;

                if (i === j) {
                    // Calculate diagonal element
                    for (let k = 0; k < j; k++) {
                        sum += L[j][k] * L[j][k];
                    }
                    L[j][j] = Math.sqrt(A[j][j] - sum);
                } else {
                    // Calculate non-diagonal element
                    for (let k = 0; k < j; k++) {
                        sum += L[i][k] * L[j][k];
                    }
                    L[i][j] = (A[i][j] - sum) / L[j][j];
                }
            }

            // Log the step for L
            const stepL = `L = \\begin{bmatrix}${L.map(row => row.join('&')).join('\\\\')}\\end{bmatrix}`;
            setSteps(prevSteps => [...prevSteps, stepL]);
        }

        setL(L);
        // Calculate L transpose
        const LT = L[0].map((_, colIndex) => L.map(row => row[colIndex]));
        setLT(LT);
    };

    const generateRandomMatrix = () => {
        const A = Array.from({ length: size }, () => Array(size).fill(0));
        
        // Fill the matrix with random values
        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                A[i][j] = Math.floor(Math.random() * 10) + 1; // Random values between 1 and 10
            }
        }

        // Make the matrix positive definite
        for (let i = 0; i < size; i++) {
            for (let j = i; j < size; j++) {
                A[i][j] += i === j ? 10 : 0; // Add diagonal dominance
            }
        }

        setMatrix(A);
    };

    const handleMatrixChange = (row, col) => (event) => {
        const newMatrix = [...matrix];
        newMatrix[row][col] = event.target.value;
        setMatrix(newMatrix);
    };

    const handleSizeChange = (event) => {
        const newSize = Number(event.target.value);
        setSize(newSize);
        setMatrix(Array(newSize).fill().map(() => Array(newSize).fill('')));
        setL([]); // Reset L when size changes
        setLT([]); // Reset LT when size changes
        setSteps([]); // Reset steps when size changes
    };

    return (
        <StyledContainer>
            <h2>Cholesky Decomposition Calculator</h2>
            <Form>
                <label>Matrix Size</label>
                <StyledSelect value={size} onChange={handleSizeChange}>
                    {[...Array(10).keys()].map(i => (
                        <option key={i + 1} value={i + 1}>{i + 1}</option>
                    ))}
                </StyledSelect>

                <StyledTable>
                    <thead>
                        <tr>
                            <th>Row / Column</th>
                            {[...Array(size).keys()].map(colIndex => (
                                <th key={colIndex}>A[{0}][{colIndex}]</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {Array.from({ length: size }).map((_, rowIndex) => (
                            <tr key={rowIndex}>
                                <td>{`Row ${rowIndex + 1}`}</td>
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
                            </tr>
                        ))}
                    </tbody>
                </StyledTable>
               
                <ButtonFormatM text='Generate' onClick={generateRandomMatrix} />
                <ButtonFormatM text='Calculate Cholesky' onClick={calculateCholesky} />
            </Form>

            {errorMessage && <ErrorText>{errorMessage}</ErrorText>}
            {L.length > 0 && (
                <div>
                    <h4>L:</h4>
                    <StyledTable>
                        <tbody>
                            {L.map((row, rowIndex) => (
                                <tr key={rowIndex}>
                                    {row.map((value, colIndex) => (
                                        <td key={colIndex}>{value.toFixed(4)}</td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </StyledTable>
                </div>
            )}

            {LT.length > 0 && (
                <div>
                    <h4>L Transpose:</h4>
                    <StyledTable>
                        <tbody>
                            {LT.map((row, rowIndex) => (
                                <tr key={rowIndex}>
                                    {row.map((value, colIndex) => (
                                        <td key={colIndex}>{value.toFixed(4)}</td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </StyledTable>
                </div>
            )}
            {steps.length > 0 && (
                <div>
                    <h3>Steps:</h3>
                    {steps.map((step, index) => (
                        <BlockMath key={index} math={step} />
                    ))}
                </div>
            )}
        </StyledContainer>
    );
};

export default CholeskyDecompositionCalculator;
