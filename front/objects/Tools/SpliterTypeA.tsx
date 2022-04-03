import React, { FC, useMemo } from 'react'
import { ViewScale, ViewMargin, ViewSize } from '@objects/Base/AxisBase'

import { ObjPoint, ObjSquare } from 'typings/db'

interface Props {
    zero: ObjPoint
    draw: ObjSquare
}
const elements: { [key: string]: number } = {
    'sec-1': 2450,
    'sec-2': 2250,
    'sec-3': 2250,
    'sec-4': 2250,
    'sec-5': 2250,
    'sec-6': 2100,
    'sec-7': 2100,
    'sec-8': 2100,
    'sec-9': 2100,
}

const Parts: FC<Props> = ({ zero, draw }) => {
    var array = []
    var partCurrent = 0
    var partNext = 0
    var partSum = elements[`sec-1`]
    for (var i = 1; i <= Object.keys(elements).length; i++) {
        partCurrent = elements[`sec-${i}`]
        partNext = elements[`sec-${i + 1}`]
        array.push(
            <>
                <line
                    x1={ViewMargin + zero.x - (draw.top + draw.bottom) * 0.4}
                    y1={ViewScale - zero.y - partSum}
                    x2={ViewMargin + zero.x + (draw.top + draw.bottom) * 0.4}
                    y2={ViewScale - zero.y - partSum}
                    stroke="white"
                    strokeWidth={10}
                    strokeDasharray={'500 400'}
                />
                <text
                    x={ViewMargin + zero.x + (draw.top + draw.bottom) * 0.43}
                    y={ViewScale - zero.y - partSum + partCurrent / 2}
                    fill="white"
                    fontSize="350"
                >
                    {partCurrent}
                </text>
                ,
            </>,
        )
        partSum += elements[`sec-${i}`]
        // console.log(partSum)
    }

    return <>{array}</>
}

const DashY: FC<Props> = ({ zero, draw }) => {
    var array = []
    for (var i = 0; i < draw.height; i += 2300) {
        array.push(
            <>
                <line
                    x1={ViewMargin + zero.x - (draw.top + draw.bottom) * 0.4}
                    y1={ViewScale - zero.y - i}
                    x2={ViewMargin + zero.x + (draw.top + draw.bottom) * 0.4}
                    y2={ViewScale - zero.y - i}
                    stroke="white"
                    strokeWidth={10}
                    strokeDasharray={'500 400'}
                />
                <text
                    x={ViewMargin + zero.x + (draw.top + draw.bottom) * 0.43}
                    y={ViewScale - zero.y - i + 130}
                    fill="white"
                    fontSize="350"
                >
                    {i / 1}
                </text>
                ,
            </>,
        )
    }
    return <>{array}</>
}

const Spliter: FC<Props> = ({ zero, draw }) => {
    return (
        <>
            <line
                x1={ViewMargin + zero.x}
                y1={0}
                x2={ViewMargin + zero.x}
                y2={ViewSize}
                stroke="white"
                strokeWidth={30}
                strokeDasharray={'500 400'}
            />
            {/* <DashY zero={zero} draw={draw} /> */}
            <Parts zero={zero} draw={draw} />
        </>
    )
}

export default Spliter
