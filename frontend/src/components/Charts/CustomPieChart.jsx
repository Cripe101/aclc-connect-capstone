import React from 'react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import CustomLegend from './CustomLegend'
import CustomToolTip from './CustomToolTip'

const CustomPieChart = ({ data, colors }) => {
    // Guard against undefined or non-array data
    if (!Array.isArray(data) || data.length === 0) {
        return <div className='text-center text-gray-500 py-16'>No data available</div>
    }

    return (
        <ResponsiveContainer width="100%" height={325}>
            <PieChart>
                <Pie
                    data={data}
                    dataKey="count"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={130}
                    innerRadius={80}
                    labelLine={false}
                >
                    {data.map((entry, index) => (
                        <Cell
                            key={`cell-${index}`}
                            fill={colors[index % colors.length]}
                        />
                    ))}
                </Pie>
                <Tooltip content={<CustomToolTip />} />
                <Legend content={<CustomLegend />} />
            </PieChart>
        </ResponsiveContainer>
    )
}

export default CustomPieChart