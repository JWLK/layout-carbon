import React, { FC } from 'react'
import { ObjPoint, ObjSquare } from '@typings/object'
interface Props {
    center: ObjPoint
    diameter: number
    lineColor: string
    lineWidth: number
    guideEnable: boolean
    guideMargin?: number
    guidePositon?: 'positive' | 'negative'
    guideLineColor?: string
    guideLineWidth?: number
    guideTextSize?: number
}
const Circle: FC<Props> = ({
    center,
    diameter,
    lineColor,
    lineWidth,
    guideEnable,
    guideMargin,
    guidePositon,
    guideLineColor,
    guideLineWidth,
    guideTextSize,
}) => {
    return (
        <g>
            <circle
                cx={center.x}
                cy={center.y}
                r={diameter / 2}
                fill="none"
                stroke={lineColor}
                strokeWidth={lineWidth}
            />
        </g>
    )
}

export default Circle
