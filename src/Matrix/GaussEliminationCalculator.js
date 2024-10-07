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

const GaussEliminationCalculator = () => {
    const [size, setSize] = useState(2);
    const [matrix, setMatrix] = useState(Array(size).fill().map(() => Array(size + 1).fill('')));
    const [results, setResults] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [steps, setSteps] = useState([]);

    const calculateGauss = () => {
        setErrorMessage('');
        setSteps([]); // Reset steps for new calculation

        const A = matrix.map(row => row.map(Number));
        const n = A.length;

        // Gauss Elimination process
        for (let i = 0; i < n; i++) {
            // Partial Pivoting
            for (let k = i + 1; k < n; k++) {
                if (A[k][i] === 0) continue; // Skip if the element is zero
                const factor = A[k][i] / A[i][i];
                for (let j = i; j <= n; j++) {
                    A[k][j] -= factor * A[i][j];
                }
            }

            // Log the step as a LaTeX formatted string
            const step = `\\text{Step ${i + 1}:} \\begin{bmatrix}${A.map(row => row.join('&')).join('\\\\')}\\end{bmatrix}`;
            setSteps(prevSteps => [...prevSteps, step]);
        }

        // Back substitution to find results
        const x = new Array(n).fill(0);
        for (let i = n - 1; i >= 0; i--) {
            x[i] = A[i][n] / A[i][i];
            for (let k = i - 1; k >= 0; k--) {
                A[k][n] -= A[k][i] * x[i];
            }
        }

        // Log final result as a LaTeX formatted string with rounding
        const roundedResults = x.map(result => Math.round(result)); // ปัดเศษผลลัพธ์
          const finalResult = `\\text{Final Result: } \\begin{bmatrix}${x.map(result => result.toFixed(2)).join('&')}</bmatrix}`;
    setSteps(prevSteps => [...prevSteps, finalResult]);

        setResults(x);
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
            <h2>Gauss Elimination Calculator</h2>
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

                <Button variant="primary" onClick={calculateGauss}>
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

export default GaussEliminationCalculator;
