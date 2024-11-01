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

const GraphComponent = ({ data = [] }) => {
    return (
        <ChartWrapper>
            <ResponsiveContainer width="100%" height="100%">
                <LineChart
                    data={data}
                    margin={{ top: 30, right: 70, left: 20, bottom: 50 }}
                >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                    
                    {/* กำหนด label แกน X เป็น Iteration */}
                    <XAxis 
                        dataKey="iteration" 
                        label={{ value: 'Iteration', position: 'insideBottomRight', offset: -10 }}
                    />
                     <XAxis 
                        dataKey="y" 
                        label={{ value: 'Iteration', position: 'insideBottomRight', offset: -10 }}
                    />
                    
                    {/* กำหนด label แกน Y เป็น Xm */}
                    <YAxis 
        yAxisId="left" // ID  Xm
        domain={['dataMin - 5', 'dataMax + 5']} 
        tickFormatter={formatDecimal}
        label={{ value: 'Xm', position: 'insideTop', offset: -25 }}
    />
   
    <Tooltip 
        wrapperStyle={{ backgroundColor: '#fff', border: '1px solid #ccc' }} 
    />
    <Legend />
    <Line
        type="monotone"
        dataKey="Xm"
        legendType="none"  
        stroke="#FF885B"
        strokeWidth={3} 
        dot={{ stroke: '#FF885B', strokeWidth: 2, r: 6 }} 
        activeDot={{ r: 8 }}
        yAxisId="left" //  Xm
    />
     <Line
        type="monotone"
        dataKey="x"
        legendType="none"  
        stroke="#FF885B"
        strokeWidth={3} 
        dot={{ stroke: '#FF885B', strokeWidth: 2, r: 6 }} 
        activeDot={{ r: 8 }}
        yAxisId="left" //  Xm
    />
     <Line
        type="monotone"
        dataKey="X2"
        legendType="none"  
        stroke="#FF885B"
        strokeWidth={3} 
        dot={{ stroke: '#FF885B', strokeWidth: 2, r: 6 }} 
        activeDot={{ r: 8 }}
        yAxisId="left" //  Xm
    />
    <Line
        type="monotone"
        dataKey="Error"
        stroke="#82ca9d"
        strokeWidth={3}
        legendType="none"  
        dot={{ stroke: '#82ca9d', strokeWidth: 2, r: 6 }}
        activeDot={{ r: 8 }}
        yAxisId="left" // Error
    />
                </LineChart>
            </ResponsiveContainer>
        </ChartWrapper>
    );
};

export default GraphComponent;
