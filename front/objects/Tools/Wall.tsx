import React, { FC } from 'react'
import { ViewScale, ViewMargin } from '@objects/Base/AxisBase'

import { ObjPoint, ObjSquare } from 'typings/db'

interface Props {
    corner1: ObjPoint
    corner2: ObjPoint
    thickness: number
}
const Wall: FC<Props> = ({ corner1, corner2, thickness }) => {
    return (
        <g>
            <line
                x1={ViewMargin + corner1.x}
                y1={ViewScale - corner1.y}
                x2={ViewMargin + corner2.x}
                y2={ViewScale - corner2.y}
                stroke="white"
                strokeWidth={thickness}
            />
            {/* <line
                x1={ViewMargin + corner1.x}
                y1={ViewScale - corner1.y}
                x2={ViewMargin + corner2.x}
                y2={ViewScale - corner2.y}
                stroke=" rgba(64, 92, 176, 0.9)"
                strokeWidth={thickness / 2}
                strokeDasharray={`${thickness * 3} ${thickness}`}
            /> */}
        </g>
    )
}

export default Wall
