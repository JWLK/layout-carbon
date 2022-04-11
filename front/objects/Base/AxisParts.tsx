import React from 'react'

export const ViewMargin: any = 10000
export const ViewScale: any = 50000
export const MX: any = ViewMargin
export const MY: any = ViewScale
export const ViewSize: any = ViewScale + ViewMargin
export const ViewBox: string = `0 0 ${ViewSize} ${ViewSize}`
export const ViewCenter: any = { x: ViewScale / 2, y: 1000 }

const DashX = (): JSX.Element => {
    var array = []
    for (var i = 0; i < ViewScale; i += MX) {
        array.push(
            <>
                <line
                    x1={ViewMargin + i}
                    y1={ViewScale - MX * 0.1}
                    x2={ViewMargin + i}
                    y2={ViewScale + MX * 0.1}
                    stroke="white"
                    strokeWidth={MX * 0.01}
                />
                {i !== 0 ? (
                    <text
                        x={ViewMargin + i - MX * 0.2}
                        y={ViewScale + MX * 0.3}
                        fill="white"
                        fontSize={MX * 0.1}
                    >
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
const DashY = () => {
    var array = []
    for (var i = 0; i < ViewScale; i += MX) {
        array.push(
            <>
                <line
                    x1={ViewMargin - MX * 0.1}
                    y1={ViewScale - i}
                    x2={ViewMargin + MX * 0.1}
                    y2={ViewScale - i}
                    stroke="white"
                    strokeWidth={MX * 0.01}
                />
                {i !== 0 ? (
                    <text
                        x={ViewMargin - MX * 0.5}
                        y={ViewScale - i + MX * 0.05}
                        fill="white"
                        fontSize={MX * 0.1}
                    >
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

export const AxisX = () => {
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

export const AxisY = () => {
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
