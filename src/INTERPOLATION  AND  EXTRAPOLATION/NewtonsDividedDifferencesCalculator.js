import React, { useState } from 'react';
import styled from 'styled-components';
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

const Button = styled.button`
    margin-top: 10px;
    padding: 8px 16px;
    font-size: 1em;
    cursor: pointer;
`;

const NewtonsDividedDifferencesCalculator = () => {
    const [dataPoints, setDataPoints] = useState([{ x: '', y: '' }]);
    const [method, setMethod] = useState('linear');
    const [selectedPoints, setSelectedPoints] = useState('');
    const [result, setResult] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [xValue, setXValue] = useState('');
    const [fx0, setFx0] = useState('');
    const [error, setError] = useState('');

    const handleDataPointChange = (index, field, value) => {
        const newDataPoints = [...dataPoints];
        newDataPoints[index][field] = value;
        setDataPoints(newDataPoints);
    };

    const addDataPoint = () => {
        setDataPoints([...dataPoints, { x: '', y: '' }]);
    };

    const generateRandomDataPoints = (numPoints = 5) => {
        const newPoints = [];
        for (let i = 0; i < numPoints; i++) {
            const x = Math.floor(Math.random() * 100); // Random x value between 0 and 99
            const y = Math.floor(Math.random() * 100); // Random y value between 0 and 99
            newPoints.push({ x: x.toString(), y: y.toString() });
        }
        setDataPoints(newPoints);
    };

    const calculateNewton = () => {
        setErrorMessage('');
        setResult('');
        setFx0('');
        setError('');

        const selectedIndexes = selectedPoints
            .split(',')
            .map(index => parseInt(index.trim()) - 1)
            .filter(index => !isNaN(index) && index >= 0 && index < dataPoints.length);

        if (selectedIndexes.length < 2) {
            setErrorMessage('Please select at least 2 valid data points.');
            return;
        }

        const points = selectedIndexes.map(index => ({
            x: parseFloat(dataPoints[index].x),
            y: parseFloat(dataPoints[index].y),
        })).filter(point => !isNaN(point.x) && !isNaN(point.y));

        const n = points.length;
        const dividedDifferences = Array.from({ length: n }, () => Array(n).fill(0));

        for (let i = 0; i < n; i++) {
            dividedDifferences[i][0] = points[i].y;
        }

        for (let j = 1; j < n; j++) {
            for (let i = 0; i < n - j; i++) {
                dividedDifferences[i][j] = (dividedDifferences[i + 1][j - 1] - dividedDifferences[i][j - 1]) / (points[i + j].x - points[i].x);
            }
        }

        let polynomial = '';
        const x = points.map(p => p.x);
        const coeffs = dividedDifferences[0].slice(0, n);

        if (method === 'linear') {
            polynomial = `${points[0].y} + (${coeffs[1]} * (x - ${x[0]}))`;
        } else if (method === 'quadratic') {
            polynomial = `${points[0].y} + (${coeffs[1]} * (x - ${x[0]})) + (${coeffs[2]} * (x - ${x[0]}) * (x - ${x[1]}))`;
        } else if (method === 'polynomial') {
            polynomial = `${points[0].y}`;
            for (let i = 1; i < n; i++) {
                let term = `(${coeffs[i]})`;
                for (let j = 0; j < i; j++) {
                    term += ` * (x - ${x[j]})`;
                }
                polynomial += ` + ${term}`;
            }
        }

        const x0 = parseFloat(xValue);
        let evaluatedFx0 = coeffs[0];
        for (let i = 1; i < n; i++) {
            let term = coeffs[i];
            for (let j = 0; j < i; j++) {
                term *= (x0 - x[j]);
            }
            evaluatedFx0 += term;
        }

        setResult(polynomial);
        setFx0(evaluatedFx0);
        setError(`f(${x0}) = ${evaluatedFx0}`);
    };

    return (
        <StyledContainer>
            <h2>Newton's Divided Differences Calculator</h2>
            <Form>
                <label>Method</label>
                <StyledSelect value={method} onChange={(e) => setMethod(e.target.value)}>
                    <option value="linear">Linear Interpolation</option>
                    <option value="quadratic">Quadratic Interpolation</option>
                    <option value="polynomial">Polynomial Interpolation</option>
                </StyledSelect>

                <StyledTable>
                    <thead>
                        <tr>
                            <th>Point</th>
                            <th>x</th>
                            <th>y</th>
                        </tr>
                    </thead>
                    <tbody>
                        {dataPoints.map((point, index) => (
                            <tr key={index}>
                                <td>{`Point ${index + 1}`}</td>
                                <td>
                                    <input
                                        type="number"
                                        value={point.x}
                                        onChange={(e) => handleDataPointChange(index, 'x', e.target.value)}
                                        style={{ width: '80px' }}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="number"
                                        value={point.y}
                                        onChange={(e) => handleDataPointChange(index, 'y', e.target.value)}
                                        style={{ width: '80px' }}
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </StyledTable>
                <ButtonFormatM text='Add Data Point' onClick={addDataPoint} />
                <ButtonFormatM text='Generate Random Data Points' onClick={() => generateRandomDataPoints(5)} />
               

                <label>Select Points for Calculation (comma separated indexes, starting from 1)</label>
                <input
                    type="text"
                    value={selectedPoints}
                    onChange={(e) => setSelectedPoints(e.target.value)}
                    placeholder="e.g., 1, 2"
                />

                <label>Value of x to find y:</label>
                <input
                    type="number"
                    value={xValue}
                    onChange={(e) => setXValue(e.target.value)}
                    placeholder="e.g., 5"
                />
 <ButtonFormatM text='Calculate' onClick={calculateNewton} />
       
            </Form>

            {errorMessage && <ErrorText>{errorMessage}</ErrorText>}
            {result && <div><strong>Polynomial:</strong> {result}</div>}
            {error && <div><strong>{error}</strong></div>}
        </StyledContainer>
    );
};

export default NewtonsDividedDifferencesCalculator;
