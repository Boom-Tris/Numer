import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
//LineChart: กราฟเส้น
//Line: เส้นในกราฟ
//XAxis และ YAxis: แกน X และ Y 
///CartesianGrid: แสดงGrid ในกราฟ
//Tooltip: แสดงข้อมูลตอนเอาเมาส์ไปชี้
//Legend: อธิบายเส้นในกราฟ
//ResponsiveContainer: ปรับขนาดตามขนาดของคอมโพเนนต์
//แกน X แสดงค่าจาก dataKey="iteration"
//type: ประเภทเส้น monotone 
const GraphComponent = ({ data }) => {
    return (
        <div className='row m-2'>
            <div className='col'>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart
                        data={data}
                        margin={{
                            top: 0,
                            right: 0,
                            left: 0,
                            bottom: 0
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="iteration" />  
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line
                            type="monotone"
                            dataKey="Xm"
                            stroke="#FF885B"
                            activeDot={{ r: 8 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default GraphComponent;
