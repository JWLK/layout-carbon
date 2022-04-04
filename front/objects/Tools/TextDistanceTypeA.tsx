import React, { FC } from 'react'
import { MX, MY } from '@objects/Base/AxisBase'

import { ObjPoint, ObjSquare } from 'typings/db'

interface Props {
    corner1: ObjPoint
    corner2: ObjPoint
    guideX: number
    fontSize: number
}
const TextDistance: FC<Props> = ({ corner1, corner2, guideX, fontSize }) => {
    // Bottom Loggest Point of section = guide(x)
    const PointX1 = MX + (corner1.x < corner2.x ? corner1.x : corner2.x) // top
    const PointX2 = MX + (corner1.x > corner2.x ? corner1.x : corner2.x) // bottom
    const PointY1 = MY - corner1.y
    const PointY2 = MY - corner2.y

    const VeticalColor = '#2ee2fe'
    const VeticalLineOffset = 2000
    const VeticalTextOffset = VeticalLineOffset - 300
    const HorizentalColor = '#ffff2f'
    const HorizentalLineOffset = 300

    const VeticalLinePointX = guideX + VeticalLineOffset
    const VeticalTextPointX = guideX + VeticalTextOffset
    const VeticalTextPointY = MY - (corner1.y + corner2.y) / 2 + fontSize

    const HorizentalLinePointX1 = PointX1 + HorizentalLineOffset
    const HorizentalLinePointX2 = PointX2 + HorizentalLineOffset
    const HorizentalLineLengthX1 = VeticalLinePointX
    const HorizentalLineLengthX2 = VeticalLinePointX

    return (
        <>
            <g transform={`translate(${VeticalLinePointX},${PointY1}) rotate(0)`}>
                <path
                    d={`M0,0 h300 l-150,-150 Z`}
                    fill={VeticalColor}
                    transform="translate(-150,150)"
                />
                <line
                    x1={0}
                    y1={0}
                    x2={0}
                    y2={Math.abs(corner2.y - corner1.y)}
                    stroke={VeticalColor}
                    strokeWidth={10}
                    // strokeDasharray={`500 300`}
                />
                <path
                    d={`M0,0 h300 l-150,150 Z`}
                    fill={VeticalColor}
                    transform={`translate(-150,${Math.abs(corner2.y - corner1.y) - 150})`}
                />
            </g>
            <g transform={`translate(${VeticalTextPointX}, ${VeticalTextPointY})`}>
                <text fill={VeticalColor} fontSize={fontSize} transform="rotate(-90)">
                    {Math.abs(corner2.y - corner1.y)}
                </text>
            </g>
            <line
                x1={HorizentalLinePointX1}
                y1={PointY1}
                x2={HorizentalLineLengthX1}
                y2={PointY1}
                stroke={HorizentalColor}
                strokeWidth={10}
                // strokeDasharray={`200 100`}
            />
            <line
                x1={HorizentalLinePointX2}
                y1={PointY2}
                x2={HorizentalLineLengthX2}
                y2={PointY2}
                stroke={HorizentalColor}
                strokeWidth={10}
                // strokeDasharray={`200 100`}
            />
        </>
    )
}

export default TextDistance
