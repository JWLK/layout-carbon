import React, { FC, useMemo } from 'react'

import { ObjPoint, ObjSquare } from '@typings/object'
import Line from '@objects/Element/Line'

interface Props {
    center: ObjPoint
    draw: ObjSquare
    lineColor: string
    lineWidth: number
    guideEnable: boolean
    guideMargin?: number
    guidePositon?: 'positive' | 'negative'
    guideLineColor?: string
    guideLineWidth?: number
    guideTextSize?: number
    fixedMargin?: number
    label?: string
    indicator?: string
    activeColor?: string
}

const Square: FC<Props> = ({
    center,
    draw,
    lineColor,
    lineWidth,
    guideEnable,
    guideMargin,
    guidePositon,
    guideLineColor,
    guideLineWidth,
    guideTextSize,
    fixedMargin,
    label,
    indicator,
    activeColor,
}) => {
    // console.log(point)
    var point: ObjPoint[] = []

    // p1------p2
    // |        |
    // p4------p3
    var p1: ObjPoint = { x: 0, y: 0 },
        p2: ObjPoint = { x: 0, y: 0 },
        p3: ObjPoint = { x: 0, y: 0 },
        p4: ObjPoint = { x: 0, y: 0 }
    p1.x = center.x - draw.top / 2
    p1.y = center.y + draw.height
    p2.x = center.x + draw.top / 2
    p2.y = center.y + draw.height
    p3.x = center.x + draw.bottom / 2
    p3.y = center.y + 0
    p4.x = center.x - draw.bottom / 2
    p4.y = center.y + 0

    point.push(p1, p2, p3, p4)

    const pointArray = useMemo(
        () =>
            point.map((_, i) => {
                const start = point[i]
                const end = point[(i + 1) % point.length]
                return [start, end]
            }),
        [point],
    )
    return (
        <g>
            {pointArray.map(([a, b], index) => (
                <Line
                    key={`square-${a.x},${a.y}-${b.x},${b.y}`}
                    pointStart={a}
                    pointEnd={b}
                    lineColor={lineColor}
                    lineWidth={lineWidth}
                    guideEnable={guideEnable && index == 1 ? true : false}
                    guideMargin={guideMargin!}
                    guidePositon={guidePositon!}
                    guideLineColor={guideLineColor!}
                    guideLineWidth={guideLineWidth!}
                    guideTextSize={guideTextSize!}
                    fixedMargin={index == 1 ? fixedMargin! : undefined}
                    dashEnable={true}
                />
            ))}
            <g transform={`translate(${center.x}, ${-center.y})`}>
                <path
                    d={`M0,0 h${draw.bottom / 2} l${
                        -Math.abs(draw.top - draw.bottom) / 2
                    },${-draw.height} h${-draw.top} l${-Math.abs(draw.top - draw.bottom) / 2},${
                        draw.height
                    } Z`}
                    fill={activeColor !== undefined ? activeColor : 'rgba(0,0,0,0)'}
                />
            </g>
            <g transform={`translate(${center.x}, ${-(center.y + draw.height * 0.3)})`}>
                <text
                    fill={lineColor}
                    fontSize={guideTextSize! * 1.2}
                    dominant-baseline="bottom"
                    text-anchor="middle"
                >
                    {label}
                </text>
            </g>
            {indicator !== undefined && (
                <>
                    <line
                        x1={center.x - draw.bottom / 2 - guideMargin! / 2}
                        y1={-(center.y + draw.height)}
                        x2={center.x - draw.bottom / 2 - guideMargin! * 2}
                        y2={-(center.y + draw.height)}
                        stroke={'#00ffff'}
                        strokeWidth={guideLineWidth!}
                    />
                    <text
                        fill={'#00ffff'}
                        fontSize={guideTextSize}
                        transform={`translate(${
                            center.x - draw.bottom / 2 - guideMargin! * 2 - guideTextSize!
                        },${-(center.y + draw.height - guideTextSize! / 2)})`}
                        dominant-baseline="end"
                        text-anchor="end"
                    >
                        {indicator}m
                    </text>
                </>
            )}
        </g>
    )
}

export default Square
