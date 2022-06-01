import React, { FC, useEffect, useMemo, useState } from 'react'

interface Props {
    draws: ObjSquare[]
    currentIndex: number
    setCurrentIndex: (flag: number) => void
}

/*IMPORT*/
import { useGlobal } from '@hooks/useGlobal'
import { ObjPoint, ObjSquare } from '@typings/object'
import Square from '@objects/Element/Square'
import Guide from '@objects/Element/Guide'

/*CONSTANT*/
let INIT_CENTER: ObjPoint = { x: 20, y: 50 }

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

let TOTAL_GUIDE_POINT: ObjPoint[] = [INIT_CENTER, { x: INIT_CENTER.x, y: 0 }]
let TOTAL_GUIDE_MARGIN = 0
const TOTAL_GUIDE_POSITION = 'positive'
let TOTAL_GUIDE_COLOR = '#ffff00'
let TOTAL_GUIDE_LINE_WIDTH = 0
let TOTAL_GUIDE_TEXT_SIZE = 0

const View: FC<Props> = ({ draws, currentIndex, setCurrentIndex }) => {
    /*SIZE CHECK*/
    const { windowWidth, windowHeight } = useGlobal()
    /*VIEW BOX*/
    const [viewHeight, setViewHeight] = useState(0)
    const [viewWidth, setViewWidth] = useState(0)
    const [viewCenterMarginX, setViewCenterMarginX] = useState(0)
    const [viewCenterMarginY, setViewCenterMarginY] = useState(0)
    /*OBJECT SIZE*/
    const [objHeight, setObjHeight] = useState(0)
    const [objWidth, setObjWidth] = useState(0)
    useEffect(() => {
        if (windowWidth > 1000) {
            if (windowHeight > 1000) {
                setViewHeight(900)
            } else {
                setViewHeight(windowHeight > 600 ? windowHeight * 0.9 : 560)
            }
        } else {
            setViewHeight(560)
        }

        setViewWidth(320)
        setViewCenterMarginX(-viewWidth * 0.5)
        setViewCenterMarginY(-viewHeight)
        // console.log(windowHeight)
        setObjHeight(viewHeight * 0.8)
        setObjWidth(130)
    }, [windowWidth, windowHeight, viewWidth, viewHeight])

    /*Element Calc*/
    var totalHeight = 0
    var totalHeightText = 0
    var getDivided = draws.length
    var [eachObject, setEachObject] = useState([] as ObjSquare[])

    //Get totalHeight
    draws.slice(0, draws.length).forEach((e) => {
        if (e.height < 8000) {
            totalHeight += 8000
        } else {
            totalHeight += e.height
        }
        totalHeightText += e.height
    })
    useEffect(() => {
        var object = draws.map((v) => {
            var top = (v.top / draws[0].bottom) * objWidth
            var bottom = (v.bottom / draws[0].bottom) * objWidth
            var height = 0
            if (v.height < 8000) {
                height = (8000 / totalHeight) * objHeight
            } else {
                height = (v.height / totalHeight) * objHeight
            }
            return { top, bottom, height }
        })
        setEachObject(object)
    }, [draws, objHeight, objWidth, totalHeight, windowHeight])

    // console.log('eachObject', eachObject)

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
            eachObject.map((draw, index) => {
                let stackOffset = INIT_CENTER.y
                eachObject.slice(0, index).forEach((e) => {
                    stackOffset += e.height
                })
                return { x: INIT_CENTER.x, y: stackOffset }
            }),
        [eachObject],
    )

    /* Total Guide */
    TOTAL_GUIDE_POINT[1].y = TOTAL_GUIDE_POINT[0].y + objHeight

    if (eachObject.length === 0 || eachObject[0].top === 0) {
        return <div>Loading...</div>
    }

    /*GRAPHIC VALUE*/
    LINE_WIDTH = viewWidth * 0.002
    LINE_WIDTH_ACTIVE = LINE_WIDTH * 3
    //GUIDE
    GUIDE_MARGIN = LINE_WIDTH * 30
    GUIDE_LINE_WIDTH = LINE_WIDTH / 2
    GUIDE_TEXT_SIZE = getDivided < 15 ? LINE_WIDTH * 20 : LINE_WIDTH * 15
    //TOTAL GUIDE
    TOTAL_GUIDE_MARGIN = eachObject[0].bottom / 2 + GUIDE_MARGIN + GUIDE_TEXT_SIZE * 2
    TOTAL_GUIDE_LINE_WIDTH = LINE_WIDTH / 2
    TOTAL_GUIDE_TEXT_SIZE = LINE_WIDTH * 20

    return (
        <svg viewBox={`${viewCenterMarginX} ${viewCenterMarginY} ${viewWidth} ${viewHeight}`}>
            {/* View Guide */}
            {/* <Square
                center={{ x: 0, y: 0 }}
                draw={{ top: 320, bottom: 320, height: viewHeight }}
                lineColor={LINE_COLOR}
                lineWidth={LINE_WIDTH}
                guideEnable={false}
            /> */}
            {/* Element */}
            {/* <Square
                center={{ x: 0, y: 0 }}
                draw={eachObject[0]}
                lineColor={LINE_COLOR}
                lineWidth={LINE_WIDTH}
                guideEnable={GUIDE_ENABLE}
                guideTextSize={GUIDE_TEXT_SIZE}
            /> */}
            {eachObject.map((draw, index) => (
                <g onClick={() => setCurrentIndex(index)}>
                    <Square
                        key={`each-section-${index}`}
                        center={centerPointStackArray[index]}
                        draw={eachObject[index]}
                        lineColor={currentIndex === index ? LINE_COLOR_ACTIVE : LINE_COLOR}
                        lineWidth={currentIndex === index ? LINE_WIDTH_ACTIVE : LINE_WIDTH}
                        guideEnable={GUIDE_ENABLE}
                        guideMargin={GUIDE_MARGIN}
                        guidePositon={GUIDE_POSITION}
                        guideLineColor={GUIDE_COLOR}
                        guideLineWidth={GUIDE_LINE_WIDTH}
                        guideTextSize={GUIDE_TEXT_SIZE}
                        fixedMargin={eachObject[0].bottom / 2 + 20}
                        title={`Section ${index + 1}`}
                        indicator={(realPointStackArray[index] / 1000).toFixed(2)}
                        activeColor={currentIndex === index ? 'rgba(0,0,0,0.8)' : 'rgba(0,0,0,0.0)'}
                        label={''}
                        value={draws[index]?.height / 1000}
                        unit={''}
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
                            value={totalHeightText / 1000}
                            unit={'m'}
                        />

                        {/* Top */}
                        <Guide
                            pointStart={{
                                x:
                                    TOTAL_GUIDE_POINT[1].x -
                                    eachObject[eachObject.length - 1].top / 2,
                                y: TOTAL_GUIDE_POINT[1].y,
                            }}
                            pointEnd={{
                                x:
                                    TOTAL_GUIDE_POINT[1].x +
                                    eachObject[eachObject.length - 1].top / 2,
                                y: TOTAL_GUIDE_POINT[1].y,
                            }}
                            guideMargin={GUIDE_MARGIN}
                            guidePositon={'positive'}
                            guideLineColor={'#42be65'}
                            guideLineWidth={TOTAL_GUIDE_LINE_WIDTH}
                            guideTextSize={TOTAL_GUIDE_TEXT_SIZE}
                            value={draws[draws.length - 1]?.top / 1000}
                            unit={'m'}
                        />

                        {/* Bottom */}
                        <Guide
                            pointStart={{
                                x: TOTAL_GUIDE_POINT[0].x - eachObject[0].bottom / 2,
                                y: TOTAL_GUIDE_POINT[0].y,
                            }}
                            pointEnd={{
                                x: TOTAL_GUIDE_POINT[0].x + eachObject[0].bottom / 2,
                                y: TOTAL_GUIDE_POINT[0].y,
                            }}
                            guideMargin={GUIDE_MARGIN}
                            guidePositon={'negative'}
                            guideLineColor={'#be95ff'}
                            guideLineWidth={TOTAL_GUIDE_LINE_WIDTH}
                            guideTextSize={TOTAL_GUIDE_TEXT_SIZE}
                            value={draws[0]?.bottom / 1000}
                            unit={'m'}
                        />
                    </g>
                </>
            )}
        </svg>
    )
}

export default View
