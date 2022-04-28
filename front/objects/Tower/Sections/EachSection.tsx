import React, { FC, useMemo } from 'react'

interface Props {
    draws: ObjSquare[]
    currentPartIndex: number
    setCurrentPartIndex: (flag: number) => void
}

/*IMPORT*/
import { ObjPoint, ObjSquare } from '@typings/object'
import Square from '@objects/Element/Square'
import Guide from '@objects/Element/Guide'

/*CONSTANT*/
let INIT_CENTER: ObjPoint = { x: 0, y: 2000 }

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

let TOTAL_GUIDE_POINT: ObjPoint[] = [INIT_CENTER, { x: 0, y: 0 }]
let TOTAL_GUIDE_MARGIN = 0
const TOTAL_GUIDE_POSITION = 'positive'
let TOTAL_GUIDE_COLOR = '#ffff00'
let TOTAL_GUIDE_LINE_WIDTH = 0
let TOTAL_GUIDE_TEXT_SIZE = 0

const EachSection: FC<Props> = ({ draws, currentPartIndex, setCurrentPartIndex }) => {
    var totalHeight = INIT_CENTER.y
    draws.slice(0, draws.length).forEach((e) => {
        totalHeight += e.height
    })
    // console.log(`totalHeigh`, totalHeight)

    //TOTAL_GUIDE_POINT
    TOTAL_GUIDE_POINT[1].y = totalHeight

    const realPointStackArray: number[] = useMemo(
        () =>
            draws.map((draw, index) => {
                let stackHeight = 0
                draws.slice(0, index + 1).forEach((e) => {
                    stackHeight += e.height
                })
                return stackHeight
            }),
        [draws],
    )

    const centerPointStackArray: ObjPoint[] = useMemo(
        () =>
            draws.map((draw, index) => {
                let stackOffset = INIT_CENTER.y
                draws.slice(0, index).forEach((e) => {
                    stackOffset += e.height
                })
                return { x: INIT_CENTER.x, y: stackOffset }
            }),
        [draws],
    )

    /*VIEW BOX*/
    var viewHeight = 0
    var viewWidth = 0
    if (totalHeight / 3 > draws[0].bottom) {
        viewHeight = totalHeight * 1.1
        viewWidth = (viewHeight / 3) * 2
    } else {
        viewWidth = draws[0].bottom * 2.5
        viewHeight = (viewWidth / 2) * 3
    }
    const viewCenterMargin = -viewWidth * 0.5
    LINE_WIDTH = viewWidth * 0.001
    LINE_WIDTH_ACTIVE = LINE_WIDTH * 3
    //GUIDE
    GUIDE_MARGIN = LINE_WIDTH * 50
    GUIDE_LINE_WIDTH = LINE_WIDTH / 2
    GUIDE_TEXT_SIZE =
        (viewHeight / draws.length) * 0.1 > 500 ? 500 : (viewHeight / draws.length) * 0.15
    //TOTAL GUIDE
    TOTAL_GUIDE_MARGIN = draws[0].bottom / 2 + GUIDE_MARGIN + GUIDE_TEXT_SIZE * 3
    TOTAL_GUIDE_LINE_WIDTH = LINE_WIDTH / 2
    TOTAL_GUIDE_TEXT_SIZE =
        (viewHeight / draws.length) * 0.1 > 500 ? 500 : (viewHeight / draws.length) * 0.15

    // console.log(`totalHeight`, totalHeight)
    // console.log(`viewWidth`, viewWidth)
    // console.log(`Scale Height/Width`, `${Math.round(viewHeight / viewWidth)} : 1`)
    // console.log(`Mode`, `${totalHeight / 3 > draws[0].bottom ? 'Height/3 > Btm' : 'Height = Btm'}`)
    return (
        <svg viewBox={`${viewCenterMargin} ${-viewHeight} ${viewWidth} ${viewHeight}`} fill="#fff">
            {draws.map((draw, index) => (
                <g onClick={() => setCurrentPartIndex(index)}>
                    <Square
                        key={`each-section-${index}`}
                        center={centerPointStackArray[index]}
                        draw={draw}
                        lineColor={currentPartIndex === index ? LINE_COLOR_ACTIVE : LINE_COLOR}
                        lineWidth={currentPartIndex === index ? LINE_WIDTH_ACTIVE : LINE_WIDTH}
                        guideEnable={GUIDE_ENABLE}
                        guideMargin={GUIDE_MARGIN}
                        guidePositon={GUIDE_POSITION}
                        guideLineColor={GUIDE_COLOR}
                        guideLineWidth={GUIDE_LINE_WIDTH}
                        guideTextSize={GUIDE_TEXT_SIZE}
                        fixedMargin={(Math.abs(draw.top - draw.bottom) / 2) * index}
                        title={`Part-${index + 1}`}
                        indicator={(realPointStackArray[index] / 1000).toFixed(2)}
                        activeColor={
                            currentPartIndex === index ? 'rgba(0,0,0,0.8)' : 'rgba(0,0,0,0.0)'
                        }
                    />
                </g>
            ))}
            {GUIDE_ENABLE && (
                <>
                    <g>
                        {/* Height */}
                        <Guide
                            pointStart={TOTAL_GUIDE_POINT[1]}
                            pointEnd={TOTAL_GUIDE_POINT[0]}
                            guideMargin={TOTAL_GUIDE_MARGIN}
                            guidePositon={TOTAL_GUIDE_POSITION}
                            guideLineColor={TOTAL_GUIDE_COLOR}
                            guideLineWidth={TOTAL_GUIDE_LINE_WIDTH}
                            guideTextSize={TOTAL_GUIDE_TEXT_SIZE}
                        />

                        {/* Top */}
                        <Guide
                            pointStart={{
                                x: -draws[draws.length - 1].top / 2,
                                y: TOTAL_GUIDE_POINT[1].y,
                            }}
                            pointEnd={{
                                x: draws[draws.length - 1].top / 2,
                                y: TOTAL_GUIDE_POINT[1].y,
                            }}
                            guideMargin={GUIDE_MARGIN}
                            guidePositon={'positive'}
                            guideLineColor={TOTAL_GUIDE_COLOR}
                            guideLineWidth={TOTAL_GUIDE_LINE_WIDTH}
                            guideTextSize={TOTAL_GUIDE_TEXT_SIZE}
                        />

                        {/* Bottom */}
                        <Guide
                            pointStart={{ x: -draws[0].bottom / 2, y: INIT_CENTER.y }}
                            pointEnd={{ x: draws[0].bottom / 2, y: INIT_CENTER.y }}
                            guideMargin={GUIDE_MARGIN}
                            guidePositon={'negative'}
                            guideLineColor={TOTAL_GUIDE_COLOR}
                            guideLineWidth={TOTAL_GUIDE_LINE_WIDTH}
                            guideTextSize={TOTAL_GUIDE_TEXT_SIZE}
                        />
                    </g>
                </>
            )}
        </svg>
    )
}

export default EachSection
