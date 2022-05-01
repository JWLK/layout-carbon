import { useCallback } from 'react'
import doesRowMatchSearchString from './misc/doesRowMatchSearchString'

/**
 * @param {object[]} rows The table rows.
 * @param {string} searchString The search string.
 * @param {Function} setRows The setter for the table rows.
 * @returns {Array} The setter for the table row selection.
 */
const useRowExpand = (rows: any, searchString: string, setRows: any) => {
    const setRowExpand = useCallback(
        (rowId, expanded) => {
            setRows(
                rows.map((row: any) => {
                    const doChange =
                        rowId >= 0
                            ? rowId === row.id
                            : !searchString || doesRowMatchSearchString(row, searchString)
                    // console.log(doChange, rowId, row.id)
                    return !doChange ? row : { ...row, expanded }
                }),
            )
        },
        [rows, searchString, setRows],
    )
    return [setRowExpand]
}

export default useRowExpand
