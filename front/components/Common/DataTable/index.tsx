import React from 'react'
import CustomDataTable from './CustomDataTable'
import {
    rowsMany as demoRowsMany,
    columnsProtocol as demoColumns,
    sortInfo as demoSortInfo,
} from './table-data'

const CustomTable = () => {
    return (
        <CustomDataTable
            columns={demoColumns}
            rows={demoRowsMany}
            sortInfo={demoSortInfo}
            hasSelection={true}
            pageSize={10}
            start={0}
        />
    )
}

export default CustomTable
