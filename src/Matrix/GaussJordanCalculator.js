import React, { useState } from 'react';
import { Container, Form, Button, Table } from 'react-bootstrap';
import styled from 'styled-components';
import { BlockMath } from 'react-katex';
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

    return (
        <Container>
            <h2>Gauss-Jordan Elimination Calculator</h2>
            <Form>
                <Form.Group controlId="formMatrixSize">
                    <Form.Label>Matrix Size (Number of Equations)</Form.Label>
                    <Form.Control as="select" value={size} onChange={handleSizeChange}>
                        {[...Array(10).keys()].map(i => (
                            <option key={i + 1} value={i + 1}>{i + 1}</option>
                        ))}
                    </Form.Control>
                </Form.Group>

                <StyledTable striped bordered>
                    <thead>
                        <tr>
                            <th>Row / Column</th>
                            {[...Array(size + 1).keys()].map(colIndex => (
                                <th key={colIndex}>A[{0}][{colIndex}]</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {Array.from({ length: size }).map((_, rowIndex) => (
                            <tr key={rowIndex}>
                                <td>{`Equation ${rowIndex + 1}`}</td>
                                {Array.from({ length: size + 1 }).map((_, colIndex) => (
                                    <td key={colIndex}>
                                        <Form.Control
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

                <Button variant="primary" onClick={calculateGaussJordan}>
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
                                <td>{result.toFixed(4)}</td>
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

export default GaussJordanCalculator;
