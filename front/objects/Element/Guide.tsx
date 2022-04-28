import React, { FC } from 'react'
import { ObjPoint, ObjSquare } from '@typings/object'
import { toRadian, toAngle } from '@objects/Tools/Cartesian'

interface Props {
    pointStart: ObjPoint
    pointEnd: ObjPoint
    guideMargin: number
    guidePositon: 'positive' | 'negative'
    guideLineColor: string
    guideLineWidth: number
    guideTextSize: number
    guideFloat?: number
    guideTextMargin?: number
    guideTextAlgin?: 'middle' | 'start' | 'end'
    label?: string
    value?: number
    unit?: string
}

const Guide: FC<Props> = ({
    pointStart,
    pointEnd,
    guideMargin,
    guidePositon,
    guideLineColor,
    guideLineWidth,
    guideTextSize,
    guideFloat,
    guideTextMargin,
    guideTextAlgin,
    label,
    value,
    unit,
}) => {
    if (guideFloat == undefined) {
        guideFloat = 1
    } else {
        guideFloat = Math.pow(10, guideFloat)
    }
    if (guideTextMargin == undefined) {
        guideTextMargin = 0
    }
    if (guideTextAlgin == undefined) {
        guideTextAlgin = 'middle'
    }
    if (label == undefined) {
        label = ''
    }
    if (unit == undefined) {
        unit = ''
    }
    let length = Math.round(
        Math.sqrt(Math.pow(pointStart.x - pointEnd.x, 2) + Math.pow(pointStart.y - pointEnd.y, 2)),
    )
    let angle = 0
    let x1_GuidePoint = 0
    let y1_GuidePoint = 0
    let x2_GuidePoint = 0
    let y2_GuidePoint = 0

    let arrowScale = guideLineWidth * 20
    let textPoint = {
        x: (pointStart.x + pointEnd.x) / 2,
        y: (pointStart.y + pointEnd.y) / 2,
    } as ObjPoint

    let lineAxis =
        Math.abs(pointStart.x - pointEnd.x) > Math.abs(pointStart.y - pointEnd.y)
            ? 'horizontal'
            : 'vertical'

    //Horizontal Line
    if (Math.abs(pointStart.x - pointEnd.x) !== 0 && Math.abs(pointStart.y - pointEnd.y) !== 0) {
        angle += toAngle(
            Math.PI / 2 -
                Math.atan(
                    Math.abs(pointStart.y - pointEnd.y) / Math.abs(pointStart.x - pointEnd.x),
                ),
        )
    }

    if (lineAxis == 'horizontal') {
        angle += 0
        if (pointStart.x - pointEnd.x < 0) {
            x1_GuidePoint = pointStart.x
            y1_GuidePoint =
                guidePositon === 'positive'
                    ? pointStart.y + guideMargin
                    : pointStart.y - guideMargin
            x2_GuidePoint = pointEnd.x
            y2_GuidePoint =
                guidePositon === 'positive' ? pointEnd.y + guideMargin : pointEnd.y - guideMargin

            textPoint.y =
                guidePositon === 'positive'
                    ? textPoint.y + guideMargin + guideTextSize
                    : textPoint.y - guideMargin - guideTextSize
        } else {
            x1_GuidePoint = pointStart.x
            y1_GuidePoint =
                guidePositon === 'positive'
                    ? pointStart.y - guideMargin
                    : pointStart.y + guideMargin
            x2_GuidePoint = pointEnd.x
            y2_GuidePoint =
                guidePositon === 'positive' ? pointEnd.y - guideMargin : pointEnd.y + guideMargin

            textPoint.y =
                guidePositon === 'positive'
                    ? textPoint.y - guideMargin - guideTextSize
                    : textPoint.y + guideMargin + guideTextSize
        }
    } else if (lineAxis == 'vertical') {
        //Vetical Line
        if (pointStart.y - pointEnd.y > 0) {
            x1_GuidePoint =
                guidePositon === 'positive'
                    ? pointStart.x + guideMargin
                    : pointStart.x - guideMargin
            y1_GuidePoint = pointStart.y
            x2_GuidePoint =
                guidePositon === 'positive' ? pointEnd.x + guideMargin : pointEnd.x - guideMargin
            y2_GuidePoint = pointEnd.y

            textPoint.x =
                guidePositon === 'positive'
                    ? textPoint.x + guideMargin + guideTextSize
                    : textPoint.x - guideMargin - guideTextSize
            angle += 90
        } else {
            x1_GuidePoint =
                guidePositon === 'positive'
                    ? pointStart.x - guideMargin
                    : pointStart.x + guideMargin
            y1_GuidePoint = pointStart.y
            x2_GuidePoint =
                guidePositon === 'positive' ? pointEnd.x - guideMargin : pointEnd.x + guideMargin
            y2_GuidePoint = pointEnd.y

            textPoint.x =
                guidePositon === 'positive'
                    ? textPoint.x - guideMargin - guideTextSize
                    : textPoint.x + guideMargin + guideTextSize
            angle += 270
        }
    }

    // console.log(angle)
    return (
        <>
            <g transform={`translate(${x1_GuidePoint},${-y1_GuidePoint}) rotate(${angle})`}>
                <path
                    d={`M0,0 v${arrowScale} l${-arrowScale / 2},${-arrowScale / 2} Z`}
                    fill={guideLineColor}
                    transform={`translate(${arrowScale / 2},${-arrowScale / 2})`}
                />
            </g>
            <g transform={`translate(${x2_GuidePoint},${-y2_GuidePoint}) rotate(${angle})`}>
                <path
                    d={`M0,0 v${arrowScale} l${arrowScale / 2},${-arrowScale / 2} Z`}
                    fill={guideLineColor}
                    transform={`translate(${-arrowScale / 2},${-arrowScale / 2})`}
                />
            </g>

            <g transform={`translate(${0},${0}) rotate(0)`}>
                <line
                    x1={x1_GuidePoint}
                    y1={-y1_GuidePoint}
                    x2={x2_GuidePoint}
                    y2={-y2_GuidePoint}
                    stroke={guideLineColor}
                    strokeWidth={guideLineWidth}
                />
            </g>
            <g
                transform={`translate(${
                    textPoint.x + guideTextMargin
                }, ${-textPoint.y}) rotate(${angle})`}
            >
                <text
                    fill={guideLineColor}
                    fontSize={guideTextSize}
                    dominant-baseline="middle"
                    text-anchor={guideTextAlgin}
                >
                    {label} {value == undefined ? length / guideFloat : value === 0 ? '' : value}
                    {unit}
                </text>
            </g>
        </>
    )
}

export default Guide
