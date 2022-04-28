import React, { FC } from 'react'
import { ObjPoint, ObjSquare } from '@typings/object'

import Guide from '@objects/Element/Guide'

interface Props {
    pointStart: ObjPoint
    pointEnd: ObjPoint
    lineColor: string
    lineWidth: number
    guideEnable: boolean
    guideMargin?: number
    guidePositon?: 'positive' | 'negative'
    guideLineColor?: string
    guideLineWidth?: number
    guideTextSize?: number
    guideFloat?: number
    guideTextMargin?: number
    guideTextAlgin?: 'middle' | 'start' | 'end'
    fixedMargin?: number
    label?: string
    value?: number
    unit?: string
    dashEnable?: boolean
}

const Line: FC<Props> = ({
    pointStart,
    pointEnd,
    lineColor,
    lineWidth,
    guideEnable,
    guideMargin,
    guidePositon,
    guideLineColor,
    guideLineWidth,
    guideTextSize,
    guideFloat,
    guideTextMargin,
    guideTextAlgin,
    fixedMargin,
    label,
    value,
    unit,
    dashEnable,
}) => {
    return (
        <>
            <g>
                <line
                    x1={pointStart.x}
                    y1={-pointStart.y}
                    x2={pointEnd.x}
                    y2={-pointEnd.y}
                    stroke={lineColor}
                    strokeWidth={lineWidth}
                    stroke-dasharray={dashEnable! && `${lineWidth * 10},${lineWidth * 5}`}
                />
            </g>
            {guideEnable && (
                <g>
                    <Guide
                        pointStart={
                            fixedMargin == undefined
                                ? pointStart
                                : { x: pointStart.x + fixedMargin!, y: pointStart.y }
                        }
                        pointEnd={
                            fixedMargin == undefined
                                ? pointEnd
                                : { x: pointStart.x + fixedMargin!, y: pointEnd.y }
                        }
                        guideMargin={guideMargin!}
                        guidePositon={guidePositon!}
                        guideLineColor={guideLineColor!}
                        guideLineWidth={guideLineWidth!}
                        guideTextSize={guideTextSize!}
                        guideFloat={guideFloat!}
                        guideTextMargin={guideTextMargin!}
                        guideTextAlgin={guideTextAlgin!}
                        label={label}
                        value={value}
                        unit={unit}
                    />
                </g>
            )}
            {/* <g transform={`translate(${VeticalLinePointX},${PointY1}) rotate(0)`}>
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
                    {text}
                </text>
            </g> */}
        </>
    )
}

export default Line
