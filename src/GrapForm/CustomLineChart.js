import React from 'react';
import styled from 'styled-components';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const ChartWrapper = styled.div`
    max-width: 800px;
    height: 500px;
    background-color: #f9f9f9; 
    border-radius: 10px; 
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); 
    padding: 20px; 

    @media (max-width: 600px) {
        height: 300px;
    }
`;

const formatDecimal = (value) => {
    return value.toFixed(4); 
};

const CustomLineChart = ({ data = [] }) => {
    return (
        <ChartWrapper>
            <ResponsiveContainer width="100%" height="100%">
                <LineChart
                    data={data}
                    margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
                >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                    <XAxis dataKey="iteration" />
                    <YAxis 
                        domain={['dataMin - 0.5', 'dataMax + 0.5']} 
                        tickFormatter={formatDecimal}
                    />
                    <Tooltip 
                        wrapperStyle={{ backgroundColor: '#fff', border: '1px solid #ccc' }} 
                    />
                    <Legend />
                    <Line
                        type="monotone"
                        dataKey="X"
                        legendType="none"  
                        stroke="#FF885B"
                        strokeWidth={3} 
                        dot={{ stroke: '#FF885B', strokeWidth: 2, r: 6 }} 
                        activeDot={{ r: 8 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </ChartWrapper>
    );
};

export default CustomLineChart;
