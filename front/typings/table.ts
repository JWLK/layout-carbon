export interface column {
    id: string
    title: string
    sortCycle?: string | undefined
}

export interface sortInfo {
    columnId: string
    direction: string
}

/* Example DataTable Type */
export interface rowProtocol {
    id: number
    name: string
    protocol: string
    port: number
    selected?: boolean | undefined
    expanded?: boolean | undefined
    detail: string
}

export interface protocolList {
    selected: rowProtocol[]
    total: rowProtocol[]
}

/* Mfr DataTable Type */
export interface rowMfr {
    id: number
    name: string
    country: string
    length: number
    diameter: number
    weight: number
    extraWeight: number
    thickness: number
    remark?: string | undefined
    selected?: boolean | undefined
    expanded?: boolean | undefined
}

export interface dataListMfr {
    capacity: rowMfr[]
    selected: rowMfr[]
    total: rowMfr[]
}
