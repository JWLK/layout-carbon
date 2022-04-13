import React from 'react'

export const ViewMargin: any = 10000
export const ViewScale: any = 150000
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

export const onChangeScale = (value: number) => {
    if (value > 180000) {
        return `${ViewMargin} ${-65000} ${ViewSize} ${ViewSize + 65000}`
    } else if (value > 140000) {
        return `${ViewMargin * 2.5} ${-45000} ${ViewSize / 1.2} ${ViewSize + 45000}`
    } else if (value > 110000) {
        return `${ViewMargin * 3} ${-5000} ${ViewSize / 1.3} ${ViewSize + 5000}`
    }
    // New Scale : 30,000 => 110,000 ~ 80,001
    else if (value > 100000) {
        return `${ViewMargin * 3.5} ${30000} ${ViewSize / 1.5} ${ViewSize - 30000}`
    } else if (value > 90000) {
        return `${ViewMargin * 3.5} ${40000} ${ViewSize / 1.5} ${ViewSize - 40000}`
    } else if (value > 80000) {
        return `${ViewMargin * 3.5} ${50000} ${ViewSize / 1.5} ${ViewSize - 50000}`
    }
    // New Scale : 30,000 => 80,000 ~ 50,001
    else if (value > 70000) {
        return `${ViewMargin * 4} ${60000} ${ViewSize / 1.7} ${ViewSize - 60000}`
    } else if (value > 60000) {
        return `${ViewMargin * 4} ${70000} ${ViewSize / 1.7} ${ViewSize - 70000}`
    } else if (value > 50000) {
        return `${ViewMargin * 4} ${80000} ${ViewSize / 1.7} ${ViewSize - 80000}`
    }
    //
    // New Scale : 50,000 ~ 45,001
    else if (value > 45000) {
        return `${ViewMargin * 6} ${95000} ${ViewSize / 3} ${ViewSize - 100000}`
    }
    // Scale : 45,000 ~ 40,001
    else if (value > 40000) {
        return `${ViewMargin * 6} ${100000} ${ViewSize / 3} ${ViewSize - 105000}`
    }
    // Scale : 40,000 ~ 35,001
    else if (value > 35000) {
        return `${ViewMargin * 6} ${105000} ${ViewSize / 3} ${ViewSize - 110000}`
    }
    //
    // New Scale : 35,000 ~ 30,001
    else if (value > 30000) {
        return `${ViewMargin * 6.5} ${110000} ${ViewSize / 3.7} ${ViewSize - 115000}`
    }
    // Scale : 30,000 ~ 25,001
    else if (value > 25000) {
        return `${ViewMargin * 6.5} ${115000} ${ViewSize / 3.7} ${ViewSize - 120000}`
    }
    //
    // New Scale : 25,000 ~ 22,501
    else if (value > 22500) {
        return `${ViewMargin * 7} ${120000} ${ViewSize / 5} ${ViewSize - 128000}`
    }
    //  Scale : 22,500 ~ 20,001
    else if (value > 20000) {
        return `${ViewMargin * 7} ${122500} ${ViewSize / 5} ${ViewSize - 130000}`
    }
    //  Scale : 20,000 ~ 17,501
    else if (value > 17500) {
        return `${ViewMargin * 7} ${125000} ${ViewSize / 5} ${ViewSize - 135000}`
    }
    //  Scale : 17,500 ~ 15,001
    else if (value > 15000) {
        return `${ViewMargin * 7} ${128000} ${ViewSize / 5} ${ViewSize - 138000}`
    }
    //
    // New Scale : 15,000 ~ 10,000
    else if (value > 10000) {
        return `${ViewMargin * 7.5} ${132000} ${ViewSize / 7.5} ${ViewSize - 140000}`
    }
    // ETC
    else {
        return `${ViewMargin * 7.6} ${135000} ${ViewSize / 8} ${ViewSize - 143000}`
    }
}
