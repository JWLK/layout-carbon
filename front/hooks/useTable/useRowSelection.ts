import { useCallback } from 'react'
import doesRowMatchSearchString from './misc/doesRowMatchSearchString'

/**
 * @param {object[]} rows The table rows.
 * @param {string} searchString The search string.
 * @param {Function} setRows The setter for the table rows.
 * @returns {Array} The setter for the table row selection.
 */
const useRowSelection = (rows: any, searchString: string, setRows: any) => {
    const setRowSelection = useCallback(
        (rowId, selected) => {
            setRows(
                rows.map((row: any) => {
                    const doChange =
                        rowId >= 0
                            ? rowId === row.id
                            : !searchString || doesRowMatchSearchString(row, searchString)
                    // console.log(doChange, rowId, row.id)
                    return !doChange ? row : { ...row, selected }
                }),
            )
        },
        [rows, searchString, setRows],
    )
    return [setRowSelection]
}

export default useRowSelection
