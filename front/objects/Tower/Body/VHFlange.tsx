import React, { FC } from 'react'

/*IMPORT*/
import { ObjPoint, ObjSquare, ObjFlange, TWFlange } from '@typings/object'
import Flange from '@objects/Element/Flange'

interface Props {
    flanges: TWFlange[]
    currentFlange: number
}

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

const VHFlange: FC<Props> = ({ flanges, currentFlange }) => {
    /*VIEW BOX*/
    var viewWidth = flanges[currentFlange].flange.outDia * 1 // 1
    var viewCalc =
        (flanges[currentFlange].flange.flangeHeight + flanges[currentFlange].flange.neckHeight) *
            10 +
        1500
    var viewHeight = viewCalc * 2 // 2
    // const viewCenterMarginX = -viewWidth * 0 + flanges[currentFlange].outDia / 6
    const viewCenterMarginX = -viewWidth * 0 + flanges[currentFlange].flange.outDia / 6
    const viewCenterMarginY = -viewCalc * 1.3
    /*Guide Text Line Element*/
    LINE_WIDTH = viewWidth * 0.002
    LINE_WIDTH_ACTIVE = LINE_WIDTH * 3
    //GUIDE
    GUIDE_MARGIN = LINE_WIDTH * 50
    GUIDE_LINE_WIDTH = LINE_WIDTH / 2
    GUIDE_TEXT_SIZE = 200

    return (
        <svg
            viewBox={`${viewCenterMarginX} ${viewCenterMarginY} ${viewWidth} ${viewHeight}`}
            fill="none"
        >
            <Flange
                center={{ x: 0, y: 300 }}
                flange={flanges[currentFlange].flange}
                lineColor={LINE_COLOR}
                lineWidth={LINE_WIDTH}
                guideEnable={GUIDE_ENABLE}
                guideMargin={GUIDE_MARGIN}
                guidePositon={GUIDE_POSITION}
                guideLineColor={GUIDE_COLOR}
                guideLineWidth={GUIDE_LINE_WIDTH}
                guideTextSize={GUIDE_TEXT_SIZE}
            />
        </svg>
    )
}

export default VHFlange
