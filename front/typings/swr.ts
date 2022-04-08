export interface Cache<Data> {
    get(key: string): Data | undefined
    set(key: string, value: Data): void
    delete(key: string): void
}
