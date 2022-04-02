import React, { FC } from 'react'
import { ViewScale, ViewMargin } from '@objects/Base/AxisBase'

import { ObjPoint, ObjSquare } from 'typings/db'

interface Props {
    corner1: ObjPoint
    corner2: ObjPoint
    fontSize: number
}
const TextDistance: FC<Props> = ({ corner1, corner2, fontSize }) => {
    return (
        <>
            {corner1.y - corner2.y > 0 ? (
                <>
                    <text
                        x={ViewMargin + (corner1.x + corner2.x) / 2 + 3800}
                        y={ViewScale - (corner1.y + corner2.y) / 2 + 200}
                        fill="white"
                        fontSize={fontSize}
                    >
                        {Math.abs(corner2.y - corner1.y)}
                    </text>
                    <line
                        x1={ViewMargin + (corner1.x + corner2.x) / 2 + 3500}
                        y1={ViewScale - corner1.y}
                        x2={ViewMargin + (corner1.x + corner2.x) / 2 + 3500}
                        y2={ViewScale - corner2.y}
                        stroke="#fff"
                        strokeWidth={10}
                        strokeDasharray={`200 100`}
                    />
                </>
            ) : null}
            {Math.abs(corner1.x - corner2.x) > Math.abs(corner1.y - corner2.y) ? (
                <>
                    <text
                        x={ViewMargin + (corner1.x + corner2.x) / 2 - 500}
                        y={ViewScale - (corner1.y + corner2.y) / 2 - 300}
                        fill="white"
                        fontSize={fontSize}
                    >
                        𝜙{Math.abs(corner1.x - corner2.x)}
                    </text>
                    <line
                        x1={ViewMargin + corner1.x}
                        y1={ViewScale - (corner1.y + corner2.y) / 2 - 100}
                        x2={ViewMargin + corner2.x}
                        y2={ViewScale - (corner1.y + corner2.y) / 2 - 100}
                        stroke="#fff"
                        strokeWidth={10}
                        strokeDasharray={`200 100`}
                    />
                </>
            ) : null}
        </>
    )
}

export default TextDistance
