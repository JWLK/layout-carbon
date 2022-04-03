import React, { FC } from 'react'
import { MX, MY } from '@objects/Base/AxisBase'

interface Props {
    at: { x: number; y: number }
    thickness: number
}

const Corner: FC<Props> = ({ at: { x, y }, thickness }) => {
    return (
        <>
            <circle
                cx={MX + x}
                cy={MY - y}
                r={thickness * 0.75}
                stroke="white"
                strokeWidth={thickness / 3}
                fill="rgba(64, 92, 176, 0.9)"
            />
            <text x={MX + x - 600} y={MY - y + 350} fill="Green" fontSize="200">
                ({x},{y})
            </text>
        </>
    )
}

export default Corner
