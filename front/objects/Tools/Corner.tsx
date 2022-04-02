import React, { FC } from 'react'
import { ViewScale, ViewMargin } from '@objects/Base/AxisBase'

interface Props {
    at: { x: number; y: number }
    thickness: number
}

const Corner: FC<Props> = ({ at: { x, y }, thickness }) => {
    return (
        <>
            <circle
                cx={ViewMargin + x}
                cy={ViewScale - y}
                r={thickness * 0.75}
                stroke="white"
                strokeWidth={thickness / 3}
                fill="rgba(64, 92, 176, 0.9)"
            />
            <text x={ViewMargin + x - 600} y={ViewScale - y + 350} fill="Green" fontSize="200">
                ({x},{y})
            </text>
        </>
    )
}

export default Corner
