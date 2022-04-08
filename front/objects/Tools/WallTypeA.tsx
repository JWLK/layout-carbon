import React, { FC } from 'react'
import { ViewScale, ViewMargin } from '@objects/Base/AxisBase'

import { ObjPoint, ObjSquare } from 'typings/object'

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
                stroke="#fff"
                strokeWidth={thickness}
            />
            {/* <line
                x1={ViewMargin + corner1.x}
                y1={ViewScale - corner1.y}
                x2={ViewMargin + corner2.x}
                y2={ViewScale - corner2.y}
                stroke=" rgba(64, 92, 176, 1)"
                strokeWidth={thickness / 2}
                strokeDasharray={`${thickness * 15} ${thickness * 7}`}
            /> */}
        </g>
    )
}

export default Wall
