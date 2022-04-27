import React, { FC, useMemo } from 'react'

import { toRadian, toAngle } from '@objects/Tools/Cartesian'

import Line from '@objects/Element/Line'
import Sector from '@objects/Element/Sector'
import PaperTCSector from '@objects/Element/PaperTCSector'
import PaperOrigin from '@objects/Element/PaperOrigin'
import PaperSheet from '@objects/Element/PaperSheet'
import { ObjPoint, ObjSquare, ObjSector, TWSector, TWSectors } from '@typings/object'
import Guide from '@objects/Element/Guide'

interface Props {
    draw: ObjSector
}

function MRound(v: number) {
    v = Math.round(v * 1000) / 1000
    return v
}

const EachPaperSector: FC<Props> = ({
    draw: {
        degree,
        radian,
        originConeHeight,
        originConeHypo,
        originConeArcLength,
        topConeHeight,
        topConeHypo,
        topConeArcLength,
        trancatedConeHeight,
        trancatedConeHypo,
        trancatedMargin,
        paperOriginWidth,
        paperOriginHeight,
        paperMargin,
        paperSheetWidth,
        paperSheetHeight,
    },
}) => {
    const _sectorAngle = 80
    const _sectorRange_Roai = 200
    const _sectorTCRange_Wi = 150
    const _sectorOffset = Math.cos(toRadian(40)) * _sectorRange_Roai
    const _sectorTCMargin_wi = _sectorRange_Roai - _sectorOffset

    const _paperOriginWidth = _sectorRange_Roai + _sectorTCRange_Wi - _sectorOffset
    const _paperOriginHieght = 2 * Math.sin(toRadian(40)) * (_sectorRange_Roai + _sectorTCRange_Wi)

    const _paperSheetMargin = 80
    const _paperSheetWidth = _paperOriginWidth + _paperSheetMargin
    const _paperSheetHeight = _paperOriginHieght + _paperSheetMargin

    var viewWidth = 750
    var viewHeight = 500

    const viewCenterMarginX = -viewWidth * 0.5
    const viewCenterMarginY = -20
    const textSize = viewWidth * 0.02

    const guideLineWidth = 0.5
    const guideMarginIn = 70
    const guideMarginOut = 70

    return (
        <svg
            viewBox={`${viewCenterMarginX} ${viewCenterMarginY} ${viewWidth} ${viewHeight}`}
            fill="#fff"
        >
            <g transform={`translate(0, 0) rotate(0)`}>
                <PaperTCSector
                    angle={_sectorAngle}
                    rangeTop={_sectorRange_Roai}
                    rangeBottom={_sectorRange_Roai + _sectorTCRange_Wi}
                    color={'#fff'}
                    strokeSize={1}
                />
                <Sector
                    angle={_sectorAngle}
                    range={_sectorRange_Roai}
                    color={'#eee'}
                    strokeSize={0.5}
                />
            </g>
            {/* Guide SheetMargin */}
            <g transform={`translate(0, 0) rotate(0)`}>
                <g transform={`translate(0, 0) rotate(-20)`}>
                    <Guide
                        pointStart={{
                            x: -30 * Math.sin(40),
                            y: -60,
                        }}
                        pointEnd={{
                            x: 30 * Math.sin(40),
                            y: -60,
                        }}
                        guideMargin={0}
                        guidePositon={'negative'}
                        guideLineColor={'#eee'}
                        guideLineWidth={guideLineWidth}
                        guideTextSize={textSize}
                        guideFloat={0}
                        label={'φ : '}
                        value={MRound(radian)}
                        unit={' rad'}
                    />
                </g>
                <Line
                    pointEnd={{
                        x: 0,
                        y: 0,
                    }}
                    pointStart={{
                        x: 0,
                        y: -(_sectorRange_Roai + _sectorTCRange_Wi),
                    }}
                    lineWidth={0.5}
                    lineColor={'#eee'}
                    guideEnable={false}
                    dashEnable={true}
                />
            </g>
            {/* Guide Hypo */}
            <g transform={`translate(0, 0) rotate(40)`}>
                <Guide
                    pointEnd={{
                        x: 0,
                        y: 0,
                    }}
                    pointStart={{
                        x: 0,
                        y: -_sectorRange_Roai,
                    }}
                    guideMargin={10}
                    guidePositon={'positive'}
                    guideLineColor={'#eee'}
                    guideLineWidth={guideLineWidth}
                    guideTextSize={textSize}
                    guideFloat={0}
                    label={'Ro.a.i : '}
                    value={MRound(topConeHypo / 1000)}
                    unit={'m'}
                />
                <Guide
                    pointEnd={{
                        x: 0,
                        y: -_sectorRange_Roai,
                    }}
                    pointStart={{
                        x: 0,
                        y: -(_sectorRange_Roai + _sectorTCRange_Wi),
                    }}
                    guideMargin={10}
                    guidePositon={'positive'}
                    guideLineColor={'#eee'}
                    guideLineWidth={guideLineWidth}
                    guideTextSize={textSize}
                    guideFloat={0}
                    label={'W_i : '}
                    value={MRound(trancatedConeHypo / 1000)}
                    unit={'m'}
                />
            </g>
            <g transform={`translate(0,${_sectorOffset + _paperOriginWidth}) rotate(0)`}>
                {/* LEFT */}
                <Line
                    pointStart={{ x: -_paperOriginHieght / 2, y: -_paperSheetMargin }}
                    pointEnd={{
                        x: -_paperOriginHieght / 2,
                        y: _paperOriginWidth + _paperSheetMargin,
                    }}
                    lineColor={'#eee'}
                    lineWidth={1}
                    guideEnable={false}
                    dashEnable={true}
                />
                {/* RIGHT */}
                <Line
                    pointStart={{ x: _paperOriginHieght / 2, y: -_paperSheetMargin }}
                    pointEnd={{
                        x: _paperOriginHieght / 2,
                        y: _paperOriginWidth + _paperSheetMargin,
                    }}
                    lineColor={'#eee'}
                    lineWidth={1}
                    guideEnable={false}
                    dashEnable={true}
                />
                {/* RIGHT - Guide - W_origin */}
                <Guide
                    pointEnd={{
                        x: _paperOriginHieght / 2,
                        y: 0,
                    }}
                    pointStart={{
                        x: _paperOriginHieght / 2,
                        y: _paperOriginWidth,
                    }}
                    guideMargin={guideMarginIn}
                    guidePositon={'positive'}
                    guideLineColor={'#eee'}
                    guideLineWidth={guideLineWidth}
                    guideTextSize={textSize}
                    guideFloat={0}
                    label={'H_org.i : '}
                    value={MRound(paperOriginHeight / 1000)}
                    unit={'m'}
                />
                {/* Right - paperMargin Uinit - Top */}
                <Guide
                    pointEnd={{
                        x: _paperOriginHieght / 2,
                        y: _paperOriginWidth,
                    }}
                    pointStart={{
                        x: _paperOriginHieght / 2,
                        y: _paperOriginWidth + _paperSheetMargin / 2,
                    }}
                    guideMargin={guideMarginIn}
                    guidePositon={'positive'}
                    guideLineColor={'#eee'}
                    guideLineWidth={guideLineWidth}
                    guideTextSize={textSize}
                    guideFloat={0}
                    label={'δ'}
                    value={0}
                />
                {/* Right - paperMargin Uinit - Bottom */}
                <Guide
                    pointEnd={{
                        x: _paperOriginHieght / 2,
                        y: -_paperSheetMargin / 2,
                    }}
                    pointStart={{
                        x: _paperOriginHieght / 2,
                        y: 0,
                    }}
                    guideMargin={guideMarginIn}
                    guidePositon={'positive'}
                    guideLineColor={'#eee'}
                    guideLineWidth={guideLineWidth}
                    guideTextSize={textSize}
                    guideFloat={0}
                    label={'δ'}
                    value={0}
                />

                {/* Top */}
                <Line
                    pointStart={{
                        x: -_paperOriginHieght / 2 - _paperSheetMargin,
                        y: _paperOriginWidth,
                    }}
                    pointEnd={{
                        x: _paperOriginHieght / 2 + _paperSheetMargin,
                        y: _paperOriginWidth,
                    }}
                    lineColor={'#eee'}
                    lineWidth={1}
                    guideEnable={false}
                    dashEnable={true}
                />

                {/* Bottom */}
                <Line
                    pointStart={{
                        x: -_paperOriginHieght / 2 - _paperSheetMargin,
                        y: 0,
                    }}
                    pointEnd={{
                        x: _paperOriginHieght / 2 + _paperSheetMargin,
                        y: 0,
                    }}
                    lineColor={'#eee'}
                    lineWidth={1}
                    guideEnable={false}
                    dashEnable={true}
                />
                {/* Bottom - Guide - H_origin */}
                <Guide
                    pointStart={{
                        x: -_paperOriginHieght / 2,
                        y: 0,
                    }}
                    pointEnd={{
                        x: _paperOriginHieght / 2,
                        y: 0,
                    }}
                    guideMargin={guideMarginIn}
                    guidePositon={'negative'}
                    guideLineColor={'#eee'}
                    guideLineWidth={guideLineWidth}
                    guideTextSize={textSize}
                    guideFloat={0}
                    label={'H_org.i : '}
                    value={MRound(paperOriginHeight / 1000)}
                    unit={'m'}
                />
                {/* Bottom - paperMargin Uinit - Left */}
                <Guide
                    pointStart={{
                        x: -_paperSheetHeight / 2,
                        y: 0,
                    }}
                    pointEnd={{
                        x: -_paperSheetHeight / 2 + _paperSheetMargin / 2,
                        y: 0,
                    }}
                    guideMargin={-guideMarginIn}
                    guidePositon={'positive'}
                    guideLineColor={'#eee'}
                    guideLineWidth={guideLineWidth}
                    guideTextSize={textSize}
                    guideFloat={0}
                    label={'δ'}
                    value={0}
                />
                {/* Bottom - paperMargin Value - Left */}
                <Guide
                    pointStart={{
                        x: -_paperSheetHeight / 2,
                        y: 0,
                    }}
                    pointEnd={{
                        x: -_paperSheetHeight / 2 + _paperSheetMargin / 2,
                        y: 0,
                    }}
                    guideMargin={guideMarginIn}
                    guidePositon={'negative'}
                    guideLineColor={'#eee'}
                    guideLineWidth={guideLineWidth}
                    guideTextSize={textSize}
                    guideFloat={0}
                    label={''}
                    value={MRound(paperMargin / 1000)}
                    unit={'m'}
                />

                {/* Bottom - paperMargin Uinit - Right */}
                <Guide
                    pointEnd={{
                        x: _paperSheetHeight / 2,
                        y: 0,
                    }}
                    pointStart={{
                        x: _paperSheetHeight / 2 - _paperSheetMargin / 2,
                        y: 0,
                    }}
                    guideMargin={-guideMarginIn}
                    guidePositon={'positive'}
                    guideLineColor={'#eee'}
                    guideLineWidth={guideLineWidth}
                    guideTextSize={textSize}
                    guideFloat={0}
                    label={'δ'}
                    value={0}
                />
                {/* Bottom - paperMargin Value - Right */}
                <Guide
                    pointEnd={{
                        x: _paperSheetHeight / 2,
                        y: 0,
                    }}
                    pointStart={{
                        x: _paperSheetHeight / 2 - _paperSheetMargin / 2,
                        y: 0,
                    }}
                    guideMargin={guideMarginIn}
                    guidePositon={'negative'}
                    guideLineColor={'#eee'}
                    guideLineWidth={guideLineWidth}
                    guideTextSize={textSize}
                    guideFloat={0}
                    label={''}
                    value={MRound(paperMargin / 1000)}
                    unit={'m'}
                />
            </g>
            <g
                transform={`translate(0,${
                    _sectorOffset + _paperOriginWidth + _paperSheetMargin / 2
                }) rotate(0)`}
            >
                <PaperSheet
                    center={{
                        x: 0,
                        y: 0,
                    }}
                    draw={{
                        top: _paperSheetHeight,
                        bottom: _paperSheetHeight,
                        height: _paperSheetWidth,
                    }}
                    lineColor={'#fff'}
                    lineWidth={1}
                    guideEnable={false}
                />
                {/* Right - Top - Horizontal */}
                <Line
                    pointStart={{ x: _paperSheetHeight / 2 + 5, y: _paperSheetWidth }}
                    pointEnd={{
                        x: _paperSheetHeight / 2 + guideMarginOut,
                        y: _paperSheetWidth,
                    }}
                    lineColor={'#eee'}
                    lineWidth={0.5}
                    guideEnable={false}
                />
                {/* Right - Bottom - Horizontal */}
                <Line
                    pointStart={{ x: _paperSheetHeight / 2 + 5, y: 0 }}
                    pointEnd={{
                        x: _paperSheetHeight / 2 + guideMarginOut,
                        y: 0,
                    }}
                    lineColor={'#eee'}
                    lineWidth={0.5}
                    guideEnable={false}
                />
                {/* Right -  H_sheet - Vetical */}
                <Guide
                    pointEnd={{
                        x: _paperSheetHeight / 2,
                        y: 0,
                    }}
                    pointStart={{
                        x: _paperSheetHeight / 2,
                        y: _paperSheetWidth,
                    }}
                    guideMargin={guideMarginOut}
                    guidePositon={'positive'}
                    guideLineColor={'#eee'}
                    guideLineWidth={guideLineWidth}
                    guideTextSize={textSize}
                    guideFloat={0}
                    label={'W_sheet.i : '}
                    value={MRound(paperSheetWidth / 1000)}
                    unit={'m'}
                />

                {/* Bottom - LEFT - Vetical */}
                <Line
                    pointStart={{ x: -_paperSheetHeight / 2, y: -5 }}
                    pointEnd={{
                        x: -_paperSheetHeight / 2,
                        y: -guideMarginOut,
                    }}
                    lineColor={'#eee'}
                    lineWidth={0.5}
                    guideEnable={false}
                />
                {/* Bottom - RIGHT - Vetical */}
                <Line
                    pointStart={{ x: _paperSheetHeight / 2, y: -5 }}
                    pointEnd={{
                        x: _paperSheetHeight / 2,
                        y: -guideMarginOut,
                    }}
                    lineColor={'#eee'}
                    lineWidth={0.5}
                    guideEnable={false}
                />
                {/* Bottom -  H_sheet - Horizontal */}
                <Guide
                    pointStart={{
                        x: -_paperSheetHeight / 2,
                        y: 0,
                    }}
                    pointEnd={{
                        x: _paperSheetHeight / 2,
                        y: 0,
                    }}
                    guideMargin={guideMarginOut}
                    guidePositon={'negative'}
                    guideLineColor={'#eee'}
                    guideLineWidth={guideLineWidth}
                    guideTextSize={textSize}
                    guideFloat={0}
                    label={'H_sheet.i : '}
                    value={MRound(paperSheetHeight / 1000)}
                    unit={'m'}
                />
            </g>
        </svg>
    )
}

export default EachPaperSector
