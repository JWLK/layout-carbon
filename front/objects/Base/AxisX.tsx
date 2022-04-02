import React from 'react'
import { ViewScale, ViewMargin, ViewSize } from '@objects/Base/AxisBase'

const DashX = (): JSX.Element => {
    var array = []
    for (var i = 0; i < ViewScale; i += 1000) {
        array.push(
            <>
                <line
                    x1={ViewMargin + i}
                    y1={ViewScale - 100}
                    x2={ViewMargin + i}
                    y2={ViewScale + 100}
                    stroke="white"
                    strokeWidth={10}
                />
                {i !== 0 ? (
                    <text x={ViewMargin + i - 200} y={ViewScale + 300} fill="white" fontSize="150">
                        {i / 1}
                    </text>
                ) : (
                    <></>
                )}
            </>,
        )
    }
    return <>{array}</>
}

const AxisX = () => {
    return (
        <>
            <line
                x1={0}
                y1={ViewScale}
                x2={ViewSize}
                y2={ViewScale}
                stroke="white"
                strokeWidth={30}
            />
            <DashX />
        </>
    )
}

export default AxisX
