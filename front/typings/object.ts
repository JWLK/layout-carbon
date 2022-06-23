//object for svg maker
export interface ObjPoint {
    x: number
    y: number
}

export interface ObjSquare {
    top: number
    bottom: number
    height: number
}

export interface ObjFlange {
    outDia: number
    inDia: number
    flangeWidth: number
    flangeHeight: number
    neckWidth: number
    neckHeight: number
    minScrewWidth: number
    pcDia: number
    param_a: number
    param_b: number
    screwWidth: number
    screwNumberOf: number
}

export interface ObjSector {
    degree: number
    radian: number //6
    originConeHeight: number
    originConeHypo: number
    originConeArcLength: number // 5
    topConeHeight: number
    topConeHypo: number //3
    topConeArcLength: number //4
    trancatedConeHeight: number
    trancatedConeHypo: number // 2
    trancatedMargin: number
    paperOriginWidth: number // 7
    paperOriginHeight: number // 8
    paperMargin: number // 9
    paperSheetWidth: number // 10
    paperSheetHeight: number // 11
}

export interface TWRawData {
    initial: TWInitialValue
    sectionData: TWSection[]
    sectionSubData: TWSection[]
    partsData: TWParts[]
    sectorsData: TWSectors[]
    flangesData: TWFlanges[]
}

export interface TWInitialValue {
    topUpperOutDia: number
    bottomLowerOutDia: number
    totalHeight: number
    offset: number
    maxHeight: number
    custom: boolean
    divided: number
}

export interface TWSection {
    index: number
    section: ObjSquare
    tapered: boolean
}

export interface TWPart {
    index: number
    part: ObjSquare
    thickness: number
    weight: number
}

export interface TWParts {
    index: number
    parts: TWPart[]
    divided: number
}

export interface TWFlange {
    index: number
    flange: ObjFlange
    weight: number
    flangeWeight: number
    partWeight: number
}

export interface TWFlanges {
    index: number
    flanges: TWFlange[]
}

export interface TWSector {
    index: number //PartIndex
    sector: ObjSector //sector Data
}

export interface TWSectors {
    index: number //SectionIndex
    sectors: TWSector[] //Each Part Index => sector Data
}

export interface ObjFrequency {
    l: number
    flangeLWR: number
    flangeLWRAdd: number
    m_1: number
    i_1: number
    j_1: number
    m_2: number
    i_2: number
    j_2: number
    mExtra: number
    mExtraAdd: number
    flangeUPR: number
    flangeUPRAdd: number
}

export interface TWFrequency {
    index: number
    frequency: ObjFrequency
}
