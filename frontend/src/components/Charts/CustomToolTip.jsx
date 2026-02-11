import React from 'react'

const CustomToolTip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        // Safe access to nested payload structure
        const data = payload[0].payload || {}
        const name = data.name || "Unknown"
        const value = payload[0].value || 0

        return (
            <div className='bg-white shadow-md rounded-lg p-2 border border-gray-300'>
                <p className='text-xs font-semibold text-sky-800 mb-1'>{name}</p>
                <p className='text-sm text-gray-600'>
                    Count: <span className='text-sm font-medium text-gray-900'>{value}</span>
                </p>
            </div>
        )
    }
    return null
}

export default CustomToolTip