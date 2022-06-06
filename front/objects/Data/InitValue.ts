//Tower Element
import {
    ObjPoint,
    ObjSquare,
    ObjSector,
    ObjFlange,
    ObjFrequency,
    TWInitialValue,
    TWRawData,
    TWSection,
    TWPart,
    TWParts,
    TWFlange,
    TWFlanges,
    TWSector,
    TWSectors,
    TWFrequency,
} from 'typings/object'
import { toRadian, toAngle } from '@objects/Tools/Cartesian'

export const InitSection: TWSection = {
    index: 0,
    section: { top: 4950, bottom: 7300, height: 100000 },
    tapered: true,
}

export const InitPart: TWPart = {
    index: 0,
    part: { top: 4950, bottom: 7300, height: 100000 },
    thickness: 50,
    weight: Math.abs(
        ((Math.pow(4950, 2) -
            Math.pow(4950 - 2 * 50, 2) +
            Math.pow(7300, 2) -
            Math.pow(7300 - 2 * 50, 2) +
            4950 * 7300 -
            (4950 - 2 * 50) * (7300 - 2 * 50)) *
            Math.PI *
            100000 *
            1000 *
            7.85 *
            Math.pow(10, -6)) /
            12,
    ),
    /*
    (Math.abs(
        ((Math.pow(TOP, 2) -
            Math.pow(TOP - 2 * THICKNESS, 2) +
            Math.pow(BOTTOM, 2) -
            Math.pow(BOTTOM - 2 * THICKNESS, 2) +
            TOP * BOTTOM -
            (TOP - 2 * THICKNESS) * (BOTTOM - 2 * THICKNESS)) *
            Math.PI *
            HEIGHT *
            1000 *
            7.85 *
            Math.pow(10, -6)) /
            12,
    ))
    */
}

export const InitParts: TWParts = {
    index: 0,
    parts: [InitPart],
    divided: 1,
}

export const InitSector: TWSector = {
    index: 0,
    sector: {
        degree: 0,
        radian: 0,
        originConeHeight: 0,
        originConeHypo: 0,
        originConeArcLength: 0,
        topConeHeight: 0,
        topConeHypo: 0,
        topConeArcLength: 0,
        trancatedConeHeight: 0,
        trancatedConeHypo: 0,
        trancatedMargin: 0,
        paperOriginWidth: 0,
        paperOriginHeight: 0,
        paperMargin: 0,
        paperSheetWidth: 0,
        paperSheetHeight: 0,
    },
}

export const InitSecotors: TWSectors = {
    index: 0,
    sectors: [InitSector],
}

export const InitFlnages: TWFlanges = {
    index: 0,
    flanges: [
        {
            index: 0,
            flange: {
                outDia: 0,
                inDia: 0,
                flangeWidth: 0,
                flangeHeight: 0,
                neckWidth: 0,
                neckHeight: 0,
                minScrewWidth: 0,
                pcDia: 0,
                param_a: 0,
                param_b: 0,
                screwWidth: 0,
                screwNumberOf: 0,
            },
            weight: 0,
            flangeWeight: 0,
            partWeight: 0,
        },
        {
            index: 1,
            flange: {
                outDia: 0,
                inDia: 0,
                flangeWidth: 0,
                flangeHeight: 0,
                neckWidth: 0,
                neckHeight: 0,
                minScrewWidth: 0,
                pcDia: 0,
                param_a: 0,
                param_b: 0,
                screwWidth: 0,
                screwNumberOf: 0,
            },
            weight: 0,
            flangeWeight: 0,
            partWeight: 0,
        },
    ],
}

export const RawData: TWRawData = {
    initial: {
        topUpperOutDia: 4950,
        bottomLowerOutDia: 7300,
        totalHeight: 100000,
        offset: 10,
        maxHeight: 110000,
        divided: 1,
        custom: false,
    },
    sectionData: [InitSection],
    partsData: [InitParts],
    sectorsData: [InitSecotors],
    flangesData: [InitFlnages],
}

export const InitFrequency: TWFrequency = {
    index: 0,
    frequency: {
        l: 0,
        flangeLWR: 0,
        flangeLWRAdd: 0,
        m_1: 0,
        i_1: 0,
        j_1: 0,
        m_2: 0,
        i_2: 0,
        j_2: 0,
        mExtra: 0,
        mExtraAdd: 0,
        flangeUPR: 0,
        flangeUPRAdd: 0,
    },
}

export const FreqData: TWFrequency[] = [InitFrequency]
