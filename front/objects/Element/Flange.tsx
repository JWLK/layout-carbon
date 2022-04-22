import React, { FC } from 'react'

import { ObjPoint, ObjSquare, ObjFlange } from '@typings/object'
import { polarToCartesian, toRadian, toAngle } from '@objects/Tools/Cartesian'
import Line from '@objects/Element/Line'
import Guide from '@objects/Element/Guide'
interface Props {
    center: ObjPoint
    flange: ObjFlange
    lineColor: string
    lineWidth: number
    guideEnable: boolean
    guideMargin?: number
    guidePositon?: 'positive' | 'negative'
    guideLineColor?: string
    guideLineWidth?: number
    guideTextSize?: number
}

const Flange: FC<Props> = ({
    center,
    flange,
    lineColor,
    lineWidth,
    guideEnable,
    guideMargin,
    guidePositon,
    guideLineColor,
    guideLineWidth,
    guideTextSize,
}) => {
    let innerR = polarToCartesian(100, 45)
    return (
        <>
            <g transform={`translate(${center.x}, ${-center.y})`}>
                {/* Inner Diameter */}
                {/* <Line
                    pointStart={{ x: -flange.flangeWidth * 8, y: 0 }}
                    pointEnd={{
                        x: flange.inDia - flange.flangeWidth * 8,
                        y: 0,
                    }}
                    lineColor={lineColor}
                    lineWidth={lineWidth * 2}
                    guideEnable={guideEnable}
                    guideMargin={guideMargin!}
                    guidePositon={'negative'}
                    guideLineColor={guideLineColor!}
                    guideLineWidth={guideLineWidth!}
                    guideTextSize={guideTextSize!}
                    label={'dᵢ :'}
                    unit={'mm'}
                /> */}
                {/* Pitch Circle Diameter */}
                <Line
                    pointStart={{
                        x: -(flange.neckWidth + flange.minScrewWidth) * 8,
                        y: (flange.flangeHeight + flange.neckHeight) * 10,
                    }}
                    pointEnd={{
                        x: flange.pcDia - (flange.neckWidth + flange.minScrewWidth) * 8,
                        y: (flange.flangeHeight + flange.neckHeight) * 10,
                    }}
                    lineColor={lineColor}
                    lineWidth={0}
                    guideEnable={guideEnable}
                    guideMargin={guideMargin!}
                    guidePositon={'positive'}
                    guideLineColor={'#fff'}
                    guideLineWidth={guideLineWidth!}
                    guideTextSize={guideTextSize!}
                    label={'PCD :'}
                    unit={'mm'}
                />
                {/* Out Diameter */}
                <Line
                    pointStart={{ x: 0, y: 0 }}
                    pointEnd={{ x: flange.outDia, y: 0 }}
                    lineColor={lineColor}
                    lineWidth={lineWidth * 2}
                    guideEnable={guideEnable}
                    guideMargin={guideMargin! * 3}
                    guidePositon={'negative'}
                    guideLineColor={'#fff'}
                    guideLineWidth={guideLineWidth!}
                    guideTextSize={guideTextSize!}
                    label={'dₒ :'}
                    unit={'mm'}
                />
                {/* Flange Width Bottom */}
                <Line
                    pointStart={{
                        x: flange.outDia - flange.flangeWidth * 10,
                        y: 0,
                    }}
                    pointEnd={{
                        x: flange.outDia,
                        y: 0,
                    }}
                    lineColor={lineColor}
                    lineWidth={lineWidth}
                    guideEnable={guideEnable}
                    guideMargin={guideMargin! * 2}
                    guidePositon={'negative'}
                    guideLineColor={guideLineColor!}
                    guideLineWidth={guideLineWidth!}
                    guideTextSize={guideTextSize!}
                    guideFloat={1}
                />
                {/* Flange Height */}
                <Line
                    pointEnd={{ x: flange.outDia, y: 0 }}
                    pointStart={{ x: flange.outDia, y: flange.flangeHeight * 10 }}
                    lineColor={lineColor}
                    lineWidth={lineWidth * 2}
                    guideEnable={guideEnable}
                    guideMargin={guideMargin!}
                    guidePositon={'positive'}
                    guideLineColor={guideLineColor!}
                    guideLineWidth={guideLineWidth!}
                    guideTextSize={guideTextSize!}
                    guideFloat={1}
                />
                {/* Neck Height */}
                <Line
                    pointEnd={{ x: flange.outDia, y: flange.flangeHeight * 10 }}
                    pointStart={{
                        x: flange.outDia,
                        y: (flange.flangeHeight + flange.neckHeight) * 10,
                    }}
                    lineColor={lineColor}
                    lineWidth={lineWidth}
                    guideEnable={guideEnable}
                    guideMargin={guideMargin!}
                    guidePositon={'positive'}
                    guideLineColor={guideLineColor!}
                    guideLineWidth={guideLineWidth!}
                    guideTextSize={guideTextSize!}
                    guideFloat={1}
                />
                {/* Neck Width :: TOP*/}
                <Line
                    pointStart={{
                        x: flange.outDia - flange.neckWidth * 10,
                        y: (flange.flangeHeight + flange.neckHeight) * 10,
                    }}
                    pointEnd={{
                        x: flange.outDia,
                        y: (flange.flangeHeight + flange.neckHeight) * 10,
                    }}
                    lineColor={lineColor}
                    lineWidth={lineWidth}
                    guideEnable={guideEnable}
                    guideMargin={guideMargin!}
                    guidePositon={'positive'}
                    guideLineColor={guideLineColor!}
                    guideLineWidth={guideLineWidth!}
                    guideTextSize={guideTextSize!}
                    guideFloat={1}
                />
                {/* Neck Height Inner */}
                <Line
                    pointStart={{
                        x: flange.outDia - flange.neckWidth * 10,
                        y: (flange.flangeHeight + flange.neckHeight) * 10,
                    }}
                    pointEnd={{
                        x: flange.outDia - flange.neckWidth * 10,
                        y: flange.flangeHeight * 10 + 50,
                    }}
                    lineColor={lineColor}
                    lineWidth={lineWidth}
                    guideEnable={false}
                    guideMargin={guideMargin!}
                    guidePositon={'positive'}
                    guideLineColor={guideLineColor!}
                    guideLineWidth={guideLineWidth!}
                    guideTextSize={guideTextSize!}
                    guideFloat={1}
                />
                {/* Neck - Flange Inner R */}
                {/* <circle
                    cx={flange.outDia - flange.neckWidth * 10 - 50}
                    cy={-flange.flangeHeight * 10 - 50}
                    r={100 / 2}
                    fill="none"
                    stroke={lineColor}
                    strokeWidth={lineWidth}
                /> */}
                <g
                    transform={`translate(${flange.outDia - flange.neckWidth * 10 - 100},${
                        -flange.flangeHeight * 10 - 100
                    }) rotate(${45})`}
                >
                    <Guide
                        pointStart={{
                            x: 0,
                            y: 0,
                        }}
                        pointEnd={{
                            x: 100,
                            y: 0,
                        }}
                        guideMargin={0}
                        guidePositon={'positive'}
                        guideLineColor={guideLineColor!}
                        guideLineWidth={guideLineWidth! / 2}
                        guideTextSize={guideTextSize! / 2}
                        guideTextAlgin={'start'}
                        guideTextMargin={-250}
                        guideFloat={1}
                        label={'R '}
                        unit={''}
                    />
                </g>
                <path
                    d={`
                        M${flange.outDia - flange.neckWidth * 10},${-flange.flangeHeight * 10 - 50}
                        A${50}, ${50}, 0, 0, 1, ${flange.outDia - flange.neckWidth * 10 - 50}, ${
                        -flange.flangeHeight * 10
                    }
                        
                    `}
                    // fill="rgba(255,255,255,0.5)"
                    // fill-opacity="0.5"
                    stroke={lineColor}
                    stroke-linecap="butt"
                    stroke-width={lineWidth}
                    fill="none"
                />
                {/* Flange crew minWidth */}
                {/* TEXT */}
                <Line
                    pointEnd={{
                        x: flange.outDia - flange.neckWidth * 10,
                        y: (flange.flangeHeight + flange.neckHeight) * 10,
                    }}
                    pointStart={{
                        x: flange.outDia - (flange.neckWidth + flange.minScrewWidth) * 10,
                        y: (flange.flangeHeight + flange.neckHeight) * 10,
                    }}
                    lineColor={lineColor}
                    lineWidth={0}
                    guideEnable={guideEnable}
                    guideMargin={guideMargin!}
                    guidePositon={'positive'}
                    guideLineColor={guideLineColor!}
                    guideLineWidth={guideLineWidth!}
                    guideTextSize={guideTextSize!}
                    guideFloat={1}
                />
                {/* LINE */}
                <Line
                    pointEnd={{
                        x: flange.outDia - flange.neckWidth * 10 - 50,
                        y: flange.flangeHeight * 10,
                    }}
                    pointStart={{
                        x: flange.outDia - (flange.neckWidth + flange.minScrewWidth) * 10,
                        y: flange.flangeHeight * 10,
                    }}
                    lineColor={lineColor}
                    lineWidth={lineWidth}
                    guideEnable={false}
                />
                {/* Flange Inner Width Margin*/}
                <Line
                    pointStart={{
                        x: flange.outDia - flange.flangeWidth * 10,
                        y: flange.flangeHeight * 10,
                    }}
                    pointEnd={{
                        x: flange.outDia - (flange.neckWidth + flange.minScrewWidth) * 10,
                        y: flange.flangeHeight * 10,
                    }}
                    lineColor={lineColor}
                    lineWidth={lineWidth}
                    guideEnable={false}
                    guideMargin={guideMargin!}
                    guidePositon={'positive'}
                    guideLineColor={guideLineColor!}
                    guideLineWidth={guideLineWidth!}
                    guideTextSize={guideTextSize!}
                    guideFloat={1}
                />
                {/* Flange Inner Height*/}
                <Line
                    pointStart={{
                        x: flange.outDia - flange.flangeWidth * 10,
                        y: 0,
                    }}
                    pointEnd={{
                        x: flange.outDia - flange.flangeWidth * 10,
                        y: flange.flangeHeight * 10,
                    }}
                    lineColor={lineColor}
                    lineWidth={lineWidth * 3}
                    guideEnable={guideEnable}
                    guideMargin={guideMargin!}
                    guidePositon={'positive'}
                    guideLineColor={guideLineColor!}
                    guideLineWidth={guideLineWidth!}
                    guideTextSize={guideTextSize!}
                    guideFloat={1}
                />
                {/* Flange Param a*/}
                <Line
                    pointStart={{
                        x: flange.outDia - flange.flangeWidth * 10,
                        y: 0,
                    }}
                    pointEnd={{
                        x: flange.outDia - (flange.neckWidth + flange.minScrewWidth) * 10,
                        y: 0,
                    }}
                    lineColor={'#b84468'}
                    lineWidth={lineWidth * 5}
                    guideEnable={guideEnable}
                    guideMargin={guideMargin!}
                    guidePositon={'negative'}
                    guideLineColor={'#b84468'!}
                    guideLineWidth={guideLineWidth!}
                    guideTextSize={guideTextSize!}
                    guideFloat={1}
                    label={'a :'}
                    unit={'mm'}
                />
                {/* Flange Param a*/}
                <Line
                    pointStart={{
                        x: flange.outDia - (flange.neckWidth + flange.minScrewWidth) * 10,
                        y: 0,
                    }}
                    pointEnd={{
                        x: flange.outDia - (flange.neckWidth / 2) * 10,
                        y: 0,
                    }}
                    lineColor={'#4765fc'}
                    lineWidth={lineWidth * 5}
                    guideEnable={guideEnable}
                    guideMargin={guideMargin!}
                    guidePositon={'negative'}
                    guideLineColor={'#4765fc'!}
                    guideLineWidth={guideLineWidth!}
                    guideTextSize={guideTextSize!}
                    guideFloat={1}
                    label={'b :'}
                    unit={'mm'}
                />
                {/* Flange Param a*/}
                {/* LINE */}
                <Line
                    pointStart={{
                        x:
                            flange.outDia -
                            (flange.neckWidth + flange.minScrewWidth) * 10 -
                            (flange.screwWidth / 2) * 10,
                        y: flange.flangeHeight * 10,
                    }}
                    pointEnd={{
                        x:
                            flange.outDia -
                            (flange.neckWidth + flange.minScrewWidth) * 10 +
                            (flange.screwWidth / 2) * 10,
                        y: flange.flangeHeight * 10,
                    }}
                    lineColor={'#25c451'}
                    lineWidth={lineWidth * 5}
                    guideEnable={guideEnable}
                    guideMargin={guideMargin!}
                    guidePositon={'positive'}
                    guideLineColor={'#25c451'!}
                    guideLineWidth={guideLineWidth!}
                    guideTextSize={guideTextSize!}
                    guideFloat={1}
                    label={'Hole :'}
                    unit={'mm'}
                />
                {/* Left */}
                <Line
                    pointStart={{
                        x:
                            flange.outDia -
                            (flange.neckWidth + flange.minScrewWidth) * 10 -
                            (flange.screwWidth / 2) * 10,
                        y: -guideMargin!,
                    }}
                    pointEnd={{
                        x:
                            flange.outDia -
                            (flange.neckWidth + flange.minScrewWidth) * 10 -
                            (flange.screwWidth / 2) * 10,
                        y: guideMargin! + flange.flangeHeight * 10,
                    }}
                    lineColor={'#25c451'}
                    lineWidth={lineWidth / 2}
                    guideEnable={false}
                    guideMargin={guideMargin!}
                    guidePositon={'positive'}
                    guideLineColor={'#25c451'!}
                    guideLineWidth={guideLineWidth!}
                    guideTextSize={guideTextSize!}
                    guideFloat={1}
                />
                {/* right */}
                <Line
                    pointStart={{
                        x:
                            flange.outDia -
                            (flange.neckWidth + flange.minScrewWidth) * 10 +
                            (flange.screwWidth / 2) * 10,
                        y: -guideMargin!,
                    }}
                    pointEnd={{
                        x:
                            flange.outDia -
                            (flange.neckWidth + flange.minScrewWidth) * 10 +
                            (flange.screwWidth / 2) * 10,
                        y: guideMargin! + flange.flangeHeight * 10,
                    }}
                    lineColor={'#25c451'}
                    lineWidth={lineWidth / 2}
                    guideEnable={false}
                    guideMargin={guideMargin!}
                    guidePositon={'positive'}
                    guideLineColor={'#25c451'!}
                    guideLineWidth={guideLineWidth!}
                    guideTextSize={guideTextSize!}
                    guideFloat={1}
                />
            </g>
        </>
    )
}

export default Flange
