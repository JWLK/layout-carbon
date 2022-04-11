import React, { FC } from 'react'

import { ObjPoint, ObjSquare } from 'typings/object'

interface Props {
    MX: number
    MY: number
    corner1: ObjPoint
    corner2: ObjPoint
    guideX: number
    guideMargin: number
    lineWidth: number
    fontSize: number
    text: number
}

const Spliter: FC<Props> = ({
    MX,
    MY,
    corner1,
    corner2,
    guideX,
    guideMargin,
    lineWidth,
    fontSize,
    text,
}) => {
    // Bottom Loggest Point of section = guide(x)
    const PointX1 = MX + (corner1.x > corner2.x ? corner1.x : corner2.x) // top : short
    const PointX2 = MX + (corner1.x < corner2.x ? corner1.x : corner2.x) // bottom : long
    const PointY1 = MY - corner1.y
    const PointY2 = MY - corner2.y

    const VeticalColor = '#2ee2fe'
    const VeticalLineOffset = -guideMargin
    const VeticalTextOffset = VeticalLineOffset - guideMargin * 0.1
    const HorizentalColor = '#ffff2f'
    const HorizentalLineOffset = -guideMargin * 0.1

    const VeticalLinePointX = guideX + VeticalLineOffset
    const VeticalTextPointX = guideX + VeticalTextOffset
    const VeticalTextPointY = PointY1 + fontSize / 3

    const HorizentalLinePointX1 = PointX1 + HorizentalLineOffset
    const HorizentalLinePointX2 = PointX2 + HorizentalLineOffset
    const HorizentalLineLengthX1 = VeticalLinePointX
    const HorizentalLineLengthX2 = VeticalLinePointX

    return (
        <>
            <line
                x1={HorizentalLinePointX1}
                y1={PointY1}
                x2={HorizentalLineLengthX1}
                y2={PointY1}
                stroke={HorizentalColor}
                strokeWidth={lineWidth}
                // strokeDasharray={`200 100`}
            />
            <g transform={`translate(${VeticalTextPointX}, ${VeticalTextPointY})`}>
                <text
                    fill={HorizentalColor}
                    fontSize={fontSize}
                    text-anchor="end"
                    transform="rotate(0)"
                >
                    {text.toLocaleString()}
                </text>
            </g>
        </>
    )
}

export default Spliter
