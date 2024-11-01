import React, { useState } from 'react';
import styled from 'styled-components';
import { BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import ButtonFormatM from '../ButtonForm/button_M';
const StyledContainer = styled.div`
    max-width: 900px;
    margin: 0 auto;
    padding: 20px;
`;
const Form = styled.div`
    display: flex;
    flex-direction: column;
    margin-bottom: 20px;
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

const InverseMatrixContainer = styled.div`
    margin-top: 20px;
    padding: 10px;
    border: 1px solid #007bff;
    border-radius: 5px;
    background-color: #f8f9fa;
`;
const Select = styled.select`
    padding: 5px;
    font-size: 1em;
    margin-bottom: 20px;
`;
const StepContainer = styled.div`
   
`;

const MatrixInversionCalculator = () => {
    const [size, setSize] = useState(3);
    const [matrix, setMatrix] = useState(Array(size).fill().map(() => Array(size).fill('')));
    const [inverse, setInverse] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [steps, setSteps] = useState([]);

    const calculateInverse = () => {
        setErrorMessage('');
        setSteps([]);

        const A = matrix.map(row => row.map(Number));
        const n = A.length;

        const augmented = A.map((row, i) => {
            const identityRow = Array(n).fill(0);
            identityRow[i] = 1;
            return [...row, ...identityRow];
        });

        for (let i = 0; i < n; i++) {
            let maxRow = i;
            for (let k = i + 1; k < n; k++) {
                if (Math.abs(augmented[k][i]) > Math.abs(augmented[maxRow][i])) {
                    maxRow = k;
                }
            }
            [augmented[i], augmented[maxRow]] = [augmented[maxRow], augmented[i]];

            if (augmented[i][i] === 0) {
                setErrorMessage('Matrix is singular and cannot be inverted.');
                return;
            }

            const diag = augmented[i][i];
            for (let j = 0; j < 2 * n; j++) {
                augmented[i][j] /= diag;
            }

            const stepAfterDiagonal = `\\text{Step ${i * 2 + 1}: Make A[${i}][${i}] = 1} \\begin{bmatrix}${augmented.map(row => row.join('&')).join('\\\\')}\\end{bmatrix}`;
            setSteps(prevSteps => [...prevSteps, stepAfterDiagonal]);

            for (let k = 0; k < n; k++) {
                if (k !== i) {
                    const factor = augmented[k][i];
                    for (let j = 0; j < 2 * n; j++) {
                        augmented[k][j] -= factor * augmented[i][j];
                    }
                }
            }

            const stepAfterElimination = `\\text{Step ${i * 2 + 2}: Eliminate column ${i}} \\begin{bmatrix}${augmented.map(row => row.join('&')).join('\\\\')}\\end{bmatrix}`;
            setSteps(prevSteps => [...prevSteps, stepAfterElimination]);
        }

        const inv = augmented.map(row => row.slice(n));
        setInverse(inv);
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
        setInverse([]);
        setSteps([]);
    };

    return (
        <StyledContainer>
            <h2>Matrix Inversion Calculator</h2>
            <Form>
                <label htmlFor="matrixSize">Matrix Size</label>
                <Select  id="matrixSize" value={size} onChange={handleSizeChange}>
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

          
            <ButtonFormatM text='Calculate Inversion' onClick={calculateInverse} />
            </Form>
            {errorMessage && <ErrorText>{errorMessage}</ErrorText>}

            {inverse.length > 0 && (
                <InverseMatrixContainer>
                    <h4>Inverse Matrix:</h4>
                    <StyledTable>
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
                </InverseMatrixContainer>
            )}

            {steps.length > 0 && (
                <StepContainer>
                    <h4>Calculation Steps:</h4>
                    {steps.map((step, index) => (
                        <BlockMath key={index} math={step} />
                    ))}
                </StepContainer>
            )}
        </StyledContainer>
    );
};

export default MatrixInversionCalculator;
