import React, { useState, useCallback, useEffect } from 'react'
//Current Page Parameter
import { useParams } from 'react-router'
//Request
import useSWR from 'swr'
import fetchStore from '@utils/store'

/* @typings */
import { rowMfr, dataListMfr } from '@typings/table'

import DataTableView from './MfrTableListCapcity'
import DataTableSelectedDelete from './MfrTableSelectedDelete'
import DataTableModal from './MfrTableModal'
import DataTableSelectedSave from './MfrTableSelectedSave'
import {
    rowsInit,
    columns as columnsDefault,
    columMaxInfo,
    sortInfo as sortInfoDefault,
} from './mfr-data'

const CustomTable = () => {
    /* Param */
    const { workspace } = useParams<{ workspace?: string }>()
    /* Localstorage */
    const keyRawData = `${workspace}-mfrData`
    if (localStorage.getItem(keyRawData) === null) {
        localStorage.setItem(keyRawData, JSON.stringify(rowsInit))
    }
    /* SWR */
    const { data: MfrD, mutate: mutateMfrD } = useSWR(keyRawData, fetchStore)

    /* Modal */
    const onCloseModal = useCallback(() => {
        setShowDataTableModal(false)
    }, [])

    const [showDataTableModal, setShowDataTableModal] = useState(false)
    const onClickAddDataTableModal = useCallback(() => {
        setShowDataTableModal(true)
    }, [])

    if (MfrD === undefined) {
        return <div>Loading...</div>
    }

    return (
        <>
            <DataTableView
                columns={columMaxInfo}
                rows={MfrD.capacity}
                sortInfo={sortInfoDefault}
                hasSelection={false}
                pageSize={10}
                start={0}
            />
        </>
    )
}

export default CustomTable
