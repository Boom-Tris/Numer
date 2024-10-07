import React, { useState } from 'react';
import { Container, Form, Button, Table } from 'react-bootstrap';
import styled from 'styled-components';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';

const StyledTable = styled(Table)`
    text-align: center;
    margin-top: 20px;
`;

const ErrorText = styled.div`
    color: red;
    font-size: 1.2em;
    margin-top: 10px;
`;

const CramerCalculator = () => {
    const [size, setSize] = useState(2);
    const [matrixA, setMatrixA] = useState(Array(size).fill().map(() => Array(size).fill('')));
    const [vectorB, setVectorB] = useState(Array(size).fill(''));
    const [results, setResults] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [steps, setSteps] = useState([]);

    const calculateCramer = () => {
        setErrorMessage('');
        setSteps([]); // Reset steps for new calculation

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

            // Add steps for displaying calculation
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
        setSteps([]); // Reset steps when size changes
    };

    return (
        <Container>
            <h2>Cramer's Rule Calculator</h2>
            <Form>
                <Form.Group controlId="formMatrixSize">
                    <Form.Label>Matrix Size (Number of Equations)</Form.Label>
                    <Form.Control as="select" value={size} onChange={handleSizeChange}>
                        {[...Array(10).keys()].map(i => (
                            <option key={i + 1} value={i + 1}>{i + 1}</option>
                        ))}
                    </Form.Control>
                </Form.Group>

                {Array.from({ length: size }).map((_, rowIndex) => (
                    <div key={rowIndex} style={{ display: 'flex', marginBottom: '10px' }}>
                        {Array.from({ length: size }).map((_, colIndex) => (
                            <Form.Control
                                key={colIndex}
                                type="number"
                                placeholder={`A[${rowIndex}][${colIndex}]`}
                                value={matrixA[rowIndex][colIndex]}
                                onChange={handleMatrixChange(rowIndex, colIndex)}
                                style={{ width: '60px', marginRight: '10px' }}
                            />
                        ))}
                        <Form.Control
                            type="number"
                            placeholder={`B[${rowIndex}]`}
                            value={vectorB[rowIndex]}
                            onChange={handleVectorChange(rowIndex)}
                            style={{ width: '60px' }}
                        />
                    </div>
                ))}

                <Button variant="primary" onClick={calculateCramer}>
                    Calculate
                </Button>
            </Form>

            {errorMessage && <ErrorText>{errorMessage}</ErrorText>}

            {results.length > 0 && (
                <StyledTable striped bordered hover>
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
