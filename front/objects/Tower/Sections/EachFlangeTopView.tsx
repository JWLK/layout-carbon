import React, { FC, useMemo } from 'react'

import { ObjPoint, ObjSquare, ObjFlange } from '@typings/object'
interface Props {
    flanges: ObjFlange[]
    currentFlange: number
}

/*IMPORT*/
import Circle from '@objects/Element/Circle'
import Guide from '@objects/Element/Guide'

/*CONSTANT*/
let INIT_CENTER: ObjPoint = { x: 0, y: 0 }

let LINE_COLOR = '#aaa'
let LINE_COLOR_ACTIVE = '#fff'
let LINE_WIDTH = 0
let LINE_WIDTH_ACTIVE = 0

const GUIDE_ENABLE = true
let GUIDE_MARGIN = 0
const GUIDE_POSITION = 'positive'
let GUIDE_COLOR = '#aaa'
let GUIDE_LINE_WIDTH = 0
let GUIDE_TEXT_SIZE = 0
let GUIDE_TEXT_MARGIN = 0

const EachFlangeTopView: FC<Props> = ({ flanges, currentFlange }) => {
    //diameter Parameter

    var outDiameter = flanges[currentFlange].outDia
    var outRadius = outDiameter / 2
    var pichCircleDiameter = flanges[currentFlange].pcDia
    var pichCircleRadius = pichCircleDiameter / 2
    var innerDiameter = flanges[currentFlange].inDia
    var innerRadius = innerDiameter / 2

    var screwWidth = flanges[currentFlange].screwWidth
    var screwNumberOf = flanges[currentFlange].screwNumberOf

    /*VIEW BOX*/
    var viewWidth = outDiameter * 1.2
    var viewHeight = outDiameter * 1.2
    const viewCenterMarginX = -viewWidth / 2
    const viewCenterMarginY = -viewHeight / 2

    /*Guide Text Line Element*/
    LINE_WIDTH = viewWidth * 0.001
    LINE_WIDTH_ACTIVE = LINE_WIDTH * 3
    //GUIDE
    GUIDE_MARGIN = LINE_WIDTH * 50
    GUIDE_LINE_WIDTH = LINE_WIDTH / 2
    GUIDE_TEXT_SIZE = LINE_WIDTH * 30
    GUIDE_TEXT_MARGIN = outRadius / 3

    return (
        <svg
            viewBox={`${viewCenterMarginX} ${viewCenterMarginY} ${viewWidth} ${viewHeight}`}
            fill="#fff"
        >
            <Circle
                center={INIT_CENTER}
                diameter={outDiameter}
                guideEnable={false}
                lineColor={LINE_COLOR}
                lineWidth={LINE_WIDTH}
            />
            <Circle
                center={INIT_CENTER}
                diameter={innerDiameter}
                guideEnable={false}
                lineColor={LINE_COLOR}
                lineWidth={LINE_WIDTH}
            />
            <Circle
                center={INIT_CENTER}
                diameter={pichCircleDiameter}
                guideEnable={false}
                lineColor={LINE_COLOR}
                lineWidth={LINE_WIDTH}
            />
            <g transform={`translate(${INIT_CENTER.x},${-INIT_CENTER.y}) rotate(${-60})`}>
                <Guide
                    pointStart={{ x: -outRadius, y: 0 }}
                    pointEnd={{ x: outRadius, y: 0 }}
                    guideMargin={0}
                    guidePositon={'positive'}
                    guideLineColor={GUIDE_COLOR}
                    guideLineWidth={GUIDE_LINE_WIDTH!}
                    guideTextSize={GUIDE_TEXT_SIZE!}
                    guideTextMargin={GUIDE_TEXT_MARGIN}
                    guideTextAlgin={'start'}
                    label={'∅'}
                    unit={'mm'}
                />
            </g>
            <g transform={`translate(${INIT_CENTER.x},${-INIT_CENTER.y}) rotate(${-30})`}>
                <Guide
                    pointStart={{ x: -pichCircleRadius, y: 0 }}
                    pointEnd={{ x: pichCircleRadius, y: 0 }}
                    guideMargin={0}
                    guidePositon={'positive'}
                    guideLineColor={GUIDE_COLOR}
                    guideLineWidth={GUIDE_LINE_WIDTH!}
                    guideTextSize={GUIDE_TEXT_SIZE!}
                    guideTextMargin={GUIDE_TEXT_MARGIN}
                    guideTextAlgin={'start'}
                    label={'∅'}
                    unit={'mm'}
                />
            </g>
            <g transform={`translate(${INIT_CENTER.x},${-INIT_CENTER.y}) rotate(${0})`}>
                <Guide
                    pointStart={{ x: -innerRadius, y: 0 }}
                    pointEnd={{ x: innerRadius, y: 0 }}
                    guideMargin={0}
                    guidePositon={'positive'}
                    guideLineColor={GUIDE_COLOR}
                    guideLineWidth={GUIDE_LINE_WIDTH!}
                    guideTextSize={GUIDE_TEXT_SIZE!}
                    guideTextMargin={GUIDE_TEXT_MARGIN}
                    guideTextAlgin={'start'}
                    label={'∅'}
                    unit={'mm'}
                />
            </g>
            {[...Array(screwNumberOf)].map((_, index) => {
                return (
                    <g
                        transform={`translate(${INIT_CENTER.x},${-INIT_CENTER.y}) rotate(${
                            (360 / screwNumberOf) * index
                        })`}
                    >
                        <Circle
                            center={{ x: pichCircleRadius, y: 0 }}
                            diameter={screwWidth}
                            guideEnable={false}
                            lineColor={LINE_COLOR}
                            lineWidth={LINE_WIDTH}
                        />
                    </g>
                )
            })}
        </svg>
    )
}

export default EachFlangeTopView
