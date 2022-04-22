//Tower Element
import {
    ObjPoint,
    ObjSquare,
    TWInitialValue,
    TWRawData,
    TWSection,
    TWPart,
    TWParts,
    TWFlanges,
    ObjSector,
    TWSector,
    TWSectors,
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

export const InitFlnage: TWFlanges = {
    index: 0,
    flange: [
        {
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
        {
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
    flangeData: [InitFlnage],
}
