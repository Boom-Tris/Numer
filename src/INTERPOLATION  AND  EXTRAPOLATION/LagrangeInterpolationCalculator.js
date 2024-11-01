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

const LagrangeInterpolationCalculator = () => {
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

    const randomizeDataPoints = () => {
        const newDataPoints = Array.from({ length: 5 }, () => ({
            x: (Math.random() * 10).toFixed(2),
            y: (Math.random() * 10).toFixed(2),
        }));
        setDataPoints(newDataPoints);
    };

    const calculateLagrange = () => {
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

        let polynomial = '';

        const n = points.length;

        if (method === 'linear') {
            const x0 = points[0].x;
            const x1 = points[1].x;
            const y0 = points[0].y;
            const y1 = points[1].y;
            polynomial = `${y0} + (${y1 - y0}) / (${x1 - x0}) * (x - ${x0})`;
        } else if (method === 'quadratic' && n >= 3) {
            polynomial = `${points[0].y}`;
            for (let i = 0; i < n; i++) {
                let term = `(${points[i].y})`;
                for (let j = 0; j < n; j++) {
                    if (i !== j) {
                        term += ` * (x - ${points[j].x}) / (${points[i].x} - ${points[j].x})`;
                    }
                }
                polynomial += ` + ${term}`;
            }
        } else if (method === 'polynomial') {
            polynomial = `${points[0].y}`;
            for (let i = 0; i < n; i++) {
                let term = `(${points[i].y})`;
                for (let j = 0; j < n; j++) {
                    if (i !== j) {
                        term += ` * (x - ${points[j].x}) / (${points[i].x} - ${points[j].x})`;
                    }
                }
                polynomial += ` + ${term}`;
            }
        }

        const x0 = parseFloat(xValue);
        let evaluatedFx0 = 0;
        for (let i = 0; i < n; i++) {
            let term = points[i].y;
            for (let j = 0; j < n; j++) {
                if (i !== j) {
                    term *= (x0 - points[j].x) / (points[i].x - points[j].x);
                }
            }
            evaluatedFx0 += term;
        }

        setResult(polynomial);
        setFx0(evaluatedFx0);
        setError(`f(${x0}) = ${evaluatedFx0}`);
    };

    return (
        <StyledContainer>
            <h2>Lagrange Interpolation Calculator</h2>
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
                <ButtonFormatM text='Randomize Data Points' onClick={randomizeDataPoints} />
               

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
 <ButtonFormatM text='Calculate' onClick={calculateLagrange} />
               
            </Form>

            {errorMessage && <ErrorText>{errorMessage}</ErrorText>}
            {result && <div><strong>Polynomial:</strong> {result}</div>}
            {error && <div><strong>{error}</strong></div>}
        </StyledContainer>
    );
};

export default LagrangeInterpolationCalculator;
