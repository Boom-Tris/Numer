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

const Button = styled.button`
    margin-top: 10px;
    padding: 10px;
    font-size: 1em;
`;

const LUDecompositionCalculator = () => {
    const [size, setSize] = useState(2);
    const [matrix, setMatrix] = useState(Array(size).fill().map(() => Array(size).fill('')));
    const [b, setB] = useState(Array(size).fill('')); // Array for vector b
    const [L, setL] = useState([]);
    const [U, setU] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [steps, setSteps] = useState([]);
    const [solution, setSolution] = useState([]);

    const generateRandomMatrix = () => {
        const newMatrix = Array.from({ length: size }, () => (
            Array.from({ length: size }, () => Math.floor(Math.random() * 10) + 1) // Random integers between 1 and 10
        ));
        const newB = Array.from({ length: size }, () => Math.floor(Math.random() * 10) + 1); // Random b values
        setMatrix(newMatrix);
        setB(newB);
    };

    const calculateLU = () => {
        setErrorMessage('');
        setSteps([]); // Reset steps for new calculation

        const A = matrix.map(row => row.map(Number));
        const bVector = b.map(Number); // Convert b to numbers
        const n = A.length;

        // Initialize L and U
        const L = Array.from({ length: n }, (_, i) => Array(n).fill(0));
        const U = Array.from({ length: n }, (_, i) => Array(n).fill(0));

        // LU Decomposition
        for (let i = 0; i < n; i++) {
            // Upper Triangular U
            for (let j = i; j < n; j++) {
                U[i][j] = A[i][j];
                for (let k = 0; k < i; k++) {
                    U[i][j] -= L[i][k] * U[k][j];
                }
            }

            // Lower Triangular L
            for (let j = i; j < n; j++) {
                if (i === j) {
                    L[i][i] = 1; // Diagonal elements are 1
                } else {
                    L[j][i] = A[j][i];
                    for (let k = 0; k < i; k++) {
                        L[j][i] -= L[j][k] * U[k][i];
                    }
                    L[j][i] /= U[i][i];
                }
            }

            // Log the steps for L and U
            const stepL = `L = \\begin{bmatrix}${L.map(row => row.join('&')).join('\\\\')}\\end{bmatrix}`;
            const stepU = `U = \\begin{bmatrix}${U.map(row => row.join('&')).join('\\\\')}\\end{bmatrix}`;
            setSteps(prevSteps => [...prevSteps, stepL, stepU]);
        }

        setL(L);
        setU(U);

        // Solve for y in Ly = b
        const y = Array(n).fill(0);
        for (let i = 0; i < n; i++) {
            y[i] = bVector[i];
            for (let j = 0; j < i; j++) {
                y[i] -= L[i][j] * y[j];
            }
        }

        // Solve for x in Ux = y
        const x = Array(n).fill(0);
        for (let i = n - 1; i >= 0; i--) {
            x[i] = y[i];
            for (let j = i + 1; j < n; j++) {
                x[i] -= U[i][j] * x[j];
            }
            x[i] /= U[i][i];
        }

        setSolution(x);
    };

    const handleMatrixChange = (row, col) => (event) => {
        const newMatrix = [...matrix];
        newMatrix[row][col] = event.target.value;
        setMatrix(newMatrix);
    };

    const handleBChange = (index) => (event) => {
        const newB = [...b];
        newB[index] = event.target.value;
        setB(newB);
    };

    const handleSizeChange = (event) => {
        const newSize = Number(event.target.value);
        setSize(newSize);
        setMatrix(Array(newSize).fill().map(() => Array(newSize).fill('')));
        setB(Array(newSize).fill('')); // Reset b when size changes
        setL([]); // Reset L when size changes
        setU([]); // Reset U when size changes
        setSteps([]); // Reset steps when size changes
        setSolution([]); // Reset solution when size changes
    };

    return (
        <Container>
            <h2>LU Decomposition Calculator</h2>
            <Form>
                <Label>Matrix Size</Label>
                <Select value={size} onChange={handleSizeChange}>
                    {[...Array(10).keys()].map(i => (
                        <option key={i + 1} value={i + 1}>{i + 1}</option>
                    ))}
                </Select>

               

                <StyledTable>
                    <thead>
                        <tr>
                            <th>Row / Column</th>
                            {[...Array(size).keys()].map(colIndex => (
                                <th key={colIndex}>A[{0}][{colIndex}]</th>
                            ))}
                            <th>B</th> {/* Column for vector b */}
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
                                <td>
                                    <input
                                        type="number"
                                        placeholder={`B[${rowIndex}]`}
                                        value={b[rowIndex]}
                                        onChange={handleBChange(rowIndex)}
                                        style={{ width: '80px' }}
                                    />
                                </td>
                            </tr>
                        ))}

                    </tbody>
                </StyledTable>

                <ButtonFormatM text='Generate' onClick={generateRandomMatrix} />
                <ButtonFormatM text='Calculate LU Decomposition' onClick={calculateLU} />
            </Form>

            {errorMessage && <ErrorText>{errorMessage}</ErrorText>}

            {L.length > 0 && (
                <div style={{ marginTop: '20px' }}>
                    <h4>Lower Triangular Matrix (L):</h4>
                    <StyledTable>
                        <tbody>
                            {L.map((row, rowIndex) => (
                                <tr key={rowIndex}>
                                    {row.map((value, colIndex) => (
                                        <td key={colIndex}>{value.toFixed(2)}</td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </StyledTable>
                </div>
            )}

            {U.length > 0 && (
                <div style={{ marginTop: '20px' }}>
                    <h4>Upper Triangular Matrix (U):</h4>
                    <StyledTable>
                        <tbody>
                            {U.map((row, rowIndex) => (
                                <tr key={rowIndex}>
                                    {row.map((value, colIndex) => (
                                        <td key={colIndex}>{value.toFixed(2)}</td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </StyledTable>
                </div>
            )}

            {steps.length > 0 && (
                <StepContainer>
                    <h4>Steps:</h4>
                    {steps.map((step, index) => (
                        <BlockMath key={index} math={step} />
                    ))}
                </StepContainer>
            )}

            {solution.length > 0 && (
                <div style={{ marginTop: '20px' }}>
                    <h4>Solution (x):</h4>
                    <div>{`x = [${solution.map(val => val.toFixed(2)).join(', ')}]`}</div>
                </div>
            )}
        </Container>
    );
};

export default LUDecompositionCalculator;
