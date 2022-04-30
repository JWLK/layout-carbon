export interface column {
    id: string
    title: string
    sortCycle?: string | undefined
}

export interface rowProtocol {
    id: number
    name: string
    protocol: string
    port: number
    selected?: boolean | undefined
}

export interface sortInfo {
    columnId: string
    direction: string
}

export interface protocolList {
    selected: rowProtocol[]
    total: rowProtocol[]
}

export interface CustomDataTable {
    id: string
    collator: Intl.Collator
    columns: column[]
    rows: rowProtocol[]
    hasSelection: boolean
    pageSize: number
    size: string
    start: number
    zebra: boolean
}
