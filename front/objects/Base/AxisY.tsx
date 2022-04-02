import React from 'react'
import { ViewScale, ViewMargin, ViewSize } from '@objects/Base/AxisBase'

const DashY = () => {
    var array = []
    for (var i = 0; i < ViewScale; i += 1000) {
        array.push(
            <>
                <line
                    x1={ViewMargin - 100}
                    y1={ViewScale - i}
                    x2={ViewMargin + 100}
                    y2={ViewScale - i}
                    stroke="white"
                    strokeWidth={10}
                />
                {i !== 0 ? (
                    <text x={ViewMargin - 600} y={ViewScale - i + 30} fill="white" fontSize="150">
                        {i / 1}
                    </text>
                ) : (
                    <></>
                )}
                ,
            </>,
        )
    }
    return <>{array}</>
}

const AxisY = () => {
    return (
        <>
            <line
                x1={ViewMargin}
                y1={0}
                x2={ViewMargin}
                y2={ViewSize}
                stroke="white"
                strokeWidth={30}
                // strokeDasharray={'100 100'}
            />
            <DashY />
        </>
    )
}

export default AxisY
