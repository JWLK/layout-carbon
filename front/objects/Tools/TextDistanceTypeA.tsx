import React, { FC } from 'react'
import { MX, MY } from '@objects/Base/AxisBase'

import { ObjPoint, ObjSquare } from 'typings/db'

interface Props {
    draw: ObjSquare
    corner1: ObjPoint
    corner2: ObjPoint
    fontSize: number
}
const TextDistance: FC<Props> = ({ draw, corner1, corner2, fontSize }) => {
    const VeticalColor = '#2ee2fe'
    const VeticalLineOffset = 300
    const VeticalTextOffset = VeticalLineOffset + 300
    const HorizentalColor = '#ffff2f'
    const HorizentalLineOffset = 300
    const HorizentalLineWidth = HorizentalLineOffset + 500
    const HorizentalTextOffset = 100
    return (
        <>
            {corner1.y - corner2.y > 0 && (
                <>
                    <text
                        x={MX + (corner1.x + corner2.x) / 2 + VeticalTextOffset}
                        y={MY - (corner1.y + corner2.y) / 2 + 100}
                        fill={VeticalColor}
                        fontSize={fontSize}
                    >
                        {Math.abs(corner2.y - corner1.y)} m
                    </text>
                    <line
                        x1={MX + (corner1.x + corner2.x) / 2 + VeticalLineOffset}
                        y1={MY - corner1.y}
                        x2={MX + (corner1.x + corner2.x) / 2 + VeticalLineOffset}
                        y2={MY - corner2.y}
                        stroke={VeticalColor}
                        strokeWidth={10}
                        strokeDasharray={`200 100`}
                    />
                </>
            )}
            {Math.abs(corner1.x - corner2.x) > Math.abs(corner1.y - corner2.y) ? (
                <>
                    <text
                        x={
                            MX +
                            (corner1.x > corner2.x ? corner1.x : corner2.x) +
                            HorizentalLineWidth +
                            HorizentalTextOffset
                        }
                        y={MY - corner1.y + 100}
                        fill={HorizentalColor}
                        fontSize={fontSize}
                    >
                        𝜙 {Math.abs(corner1.x - corner2.x)}
                    </text>
                    <line
                        x1={
                            MX +
                            (draw.top > draw.bottom ? draw.top : draw.bottom) +
                            HorizentalLineOffset
                        }
                        y1={MY - corner1.y}
                        x2={
                            MX +
                            (draw.top > draw.bottom ? draw.top : draw.bottom) +
                            HorizentalLineWidth
                        }
                        y2={MY - corner2.y}
                        stroke={HorizentalColor}
                        strokeWidth={10}
                        strokeDasharray={`200 100`}
                    />
                </>
            ) : null}
        </>
    )
}

export default TextDistance
