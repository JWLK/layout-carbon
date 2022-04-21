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

export interface TWInitialValue {
    topUpperOutDia: number
    bottomLowerOutDia: number
    totalHeight: number
    offset: number
    maxHeight: number
    custom: boolean
    divided: number
}

export interface TWRawData {
    initial: TWInitialValue
    sectionData: TWSection[]
    partsData: TWParts[]
    flangeData: TWFlanges[]
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
}

export interface TWParts {
    index: number
    parts: TWPart[]
    divided: number
}

export interface TWFlanges {
    index: number
    flange: ObjFlange[]
}
