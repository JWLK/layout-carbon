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
}

export interface TWSection {
    index: number
    section: ObjSquare
    tapered: boolean
}

export interface TWParts {
    index: number
    parts: ObjSquare[]
    divided: number
}

export interface TWRevalidyData {
    initial: TWInitialValue
    section: number[]
    parts: Array<ObjSquare[]>
}
