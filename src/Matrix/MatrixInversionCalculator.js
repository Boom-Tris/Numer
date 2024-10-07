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

const MatrixInversionCalculator = () => {
    const [size, setSize] = useState(3); // Matrix size for a 3x3 matrix
    const [matrix, setMatrix] = useState(Array(size).fill().map(() => Array(size).fill('')));
    const [identity, setIdentity] = useState(Array(size).fill().map(() => Array(size).fill('')));
    const [steps, setSteps] = useState([]);
    const [inverse, setInverse] = useState([]);

    const calculateInverse = () => {
        setSteps([]);  // Reset steps for new calculation

        const A = matrix.map(row => row.map(Number));
        const I = identity.map((row, i) => row.map((_, j) => (i === j ? 1 : 0))); // Identity matrix
        const n = A.length;

        // Combine A and I into an augmented matrix [A|I]
        let augmented = A.map((row, i) => [...row, ...I[i]]);

        // Gauss-Jordan elimination process
        for (let i = 0; i < n; i++) {
            // Make the diagonal element 1
            const factor = augmented[i][i];
            for (let j = 0; j < 2 * n; j++) {
                augmented[i][j] /= factor;
            }

            // Make all elements in the current column except for the diagonal element 0
            for (let k = 0; k < n; k++) {
                if (i !== k) {
                    const factor = augmented[k][i];
                    for (let j = 0; j < 2 * n; j++) {
                        augmented[k][j] -= factor * augmented[i][j];
                    }
                }
            }

            // Log the current step
            const step = `\\text{Step ${i + 1}:} \\begin{bmatrix}${augmented.map(row => row.slice(0, n).join('&')).join('\\\\')}\\end{bmatrix} \\quad | \\quad \\begin{bmatrix}${augmented.map(row => row.slice(n).join('&')).join('\\\\')}\\end{bmatrix}`;
            setSteps(prevSteps => [...prevSteps, step]);
        }

        // Extract inverse from the augmented matrix
        const inv = augmented.map(row => row.slice(n));
        setInverse(inv);
    };

    const handleMatrixChange = (row, col) => (event) => {
        const newMatrix = [...matrix];
        newMatrix[row][col] = event.target.value;
        setMatrix(newMatrix);
    };

    return (
        <Container>
            <h2>Matrix Inversion Calculator</h2>
            <Form>
                <Form.Group controlId="formMatrixSize">
                    <Form.Label>Matrix Size (Number of Equations)</Form.Label>
                    <Form.Control as="select" value={size} onChange={(e) => setSize(Number(e.target.value))}>
                        {[2, 3, 4].map(i => (
                            <option key={i} value={i}>{i}</option>
                        ))}
                    </Form.Control>
                </Form.Group>

                <StyledTable striped bordered>
                    <thead>
                        <tr>
                            {[...Array(size).keys()].map(colIndex => (
                                <th key={colIndex}>A[{colIndex}]</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {Array.from({ length: size }).map((_, rowIndex) => (
                            <tr key={rowIndex}>
                                {Array.from({ length: size }).map((_, colIndex) => (
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

                <Button variant="primary" onClick={calculateInverse}>
                    Calculate Inversion
                </Button>
            </Form>

            {steps.length > 0 && (
                <div style={{ marginTop: '20px' }}>
                    <h4>Calculation Steps:</h4>
                    {steps.map((step, index) => (
                        <BlockMath key={index} math={step} />
                    ))}
                </div>
            )}

            {inverse.length > 0 && (
                <div style={{ marginTop: '20px' }}>
                    <h4>Inverse Matrix:</h4>
                    <StyledTable striped bordered hover>
                        <tbody>
                            {inverse.map((row, index) => (
                                <tr key={index}>
                                    {row.map((value, colIndex) => (
                                        <td key={colIndex}>{value.toFixed(4)}</td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </StyledTable>
                </div>
            )}
        </Container>
    );
};

export default MatrixInversionCalculator;
