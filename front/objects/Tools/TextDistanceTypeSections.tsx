import React, { FC } from 'react'
import { MX, MY } from '@objects/Base/AxisSections'

import { ObjPoint, ObjSquare } from 'typings/object'

interface Props {
    corner1: ObjPoint
    corner2: ObjPoint
    guideX: number
    guideMargin: number
    text: number
    lineWidth: number
    fontSize: number
}

const TextDistance: FC<Props> = ({
    corner1,
    corner2,
    guideX,
    guideMargin,
    text,
    lineWidth,
    fontSize,
}) => {
    // Bottom Loggest Point of section = guide(x)
    const PointX1 = MX + (corner1.x < corner2.x ? corner1.x : corner2.x) // top
    const PointX2 = MX + (corner1.x > corner2.x ? corner1.x : corner2.x) // bottom
    const PointY1 = MY - corner1.y
    const PointY2 = MY - corner2.y

    const VeticalColor = '#aaa' //'#2ee2fe'
    const VeticalLineOffset = guideMargin
    const VeticalTextOffset = VeticalLineOffset - guideMargin * 0.1
    const HorizentalColor = '#aaa'
    const HorizentalLineOffset = guideMargin * 0.1

    const VeticalLinePointX = guideX + VeticalLineOffset
    const VeticalTextPointX = guideX + VeticalTextOffset
    const VeticalTextPointY = MY - (corner1.y + corner2.y) / 2 + fontSize

    const HorizentalLinePointX1 = PointX1 + HorizentalLineOffset
    const HorizentalLinePointX2 = PointX2 + HorizentalLineOffset
    const HorizentalLineLengthX1 = VeticalLinePointX
    const HorizentalLineLengthX2 = VeticalLinePointX

    const arrowSacle = lineWidth * 20
    return (
        <>
            <g transform={`translate(${VeticalLinePointX},${PointY1}) rotate(0)`}>
                <path
                    d={`M0,0 h${arrowSacle} l-${arrowSacle / 2},-${arrowSacle / 2} Z`}
                    fill={VeticalColor}
                    transform={`translate(-${arrowSacle / 2},${arrowSacle / 2})`}
                />
                <line
                    x1={0}
                    y1={0}
                    x2={0}
                    y2={Math.abs(corner2.y - corner1.y)}
                    stroke={VeticalColor}
                    strokeWidth={lineWidth}
                    // strokeDasharray={`500 300`}
                />
                <path
                    d={`M0,0 h${arrowSacle} l-${arrowSacle / 2},${arrowSacle / 2} Z`}
                    fill={VeticalColor}
                    transform={`translate(-${arrowSacle / 2},${
                        Math.abs(corner2.y - corner1.y) - arrowSacle / 2
                    })`}
                />
            </g>
            <g transform={`translate(${VeticalTextPointX}, ${VeticalTextPointY})`}>
                <text fill={VeticalColor} fontSize={fontSize} transform="rotate(-90)">
                    {text}
                </text>
            </g>
            <line
                x1={HorizentalLinePointX1}
                y1={PointY1}
                x2={HorizentalLineLengthX1}
                y2={PointY1}
                stroke={HorizentalColor}
                strokeWidth={lineWidth}
                // strokeDasharray={`200 100`}
            />
            <line
                x1={HorizentalLinePointX2}
                y1={PointY2}
                x2={HorizentalLineLengthX2}
                y2={PointY2}
                stroke={HorizentalColor}
                strokeWidth={lineWidth}
                // strokeDasharray={`200 100`}
            />
        </>
    )
}

export default TextDistance
