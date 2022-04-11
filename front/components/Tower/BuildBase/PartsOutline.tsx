import React, { useState, useCallback, useEffect } from 'react'
import { useParams } from 'react-router'

//Request
import useSWR from 'swr'
import fetchStore from '@utils/store'

import { Fade32, SettingsCheck32 } from '@carbon/icons-react'
import {
    Grid,
    Row,
    Column,
    Tile,
    AspectRatio,
    Accordion,
    AccordionItem,
    ContentSwitcher,
    Switch,
    Button,
    Toggle,
    TextInput,
    NumberInput,
    Slider,
    FormGroup,
    RadioButtonGroup,
    RadioButton,
    Dropdown,
    Tabs,
    Tab,
} from 'carbon-components-react'

/*Tower Element*/
//Type
import {
    ObjPoint,
    ObjSquare,
    TWInitialValue,
    TWRawData,
    TWSectionsData,
    TWPartsData,
} from 'typings/object'
//Data
import { SectionsValue, PartsValue } from '@objects/Data/InitValue'
//Element
import { ViewSize, ViewMargin, ViewCenter, AxisX, AxisY } from '@objects/Base/AxisSections'

import Parts from '@objects/Tower/Parts'

const PartsOutline = () => {
    /* Param */
    const { workspace } = useParams<{ workspace?: string }>()
    /* Localstorage */
    const keyRawData = `${workspace}-towerData`
    const keySectionsData = `${workspace}-SectionsData`
    const keyPartsData = `${workspace}-PartsData`

    if (localStorage.getItem(keySectionsData) === null) {
        localStorage.setItem(keySectionsData, JSON.stringify(SectionsValue))
    }
    if (localStorage.getItem(keyPartsData) === null) {
        localStorage.setItem(keyPartsData, JSON.stringify(PartsValue))
    }
    /* SWR */
    const { data: TD, mutate: mutateTD } = useSWR<TWRawData>(keyRawData, fetchStore)
    const { data: SD, mutate: mutateSD } = useSWR<TWSectionsData>(keySectionsData, fetchStore)
    const { data: PD, mutate: mutatePD } = useSWR<TWPartsData>(keyPartsData, fetchStore)

    /* State */
    //Initial Value State
    const [rawData, setRawData] = useState({} as TWRawData)
    const [sectionsObject, setSectionsObject] = useState([] as ObjSquare[])
    const [partsObject, setPartsObject] = useState([] as Array<ObjSquare[]>)

    const [scaleViewBox, setScaleViewBox] = useState(`${0} ${0} ${ViewSize} ${ViewSize}`)

    useEffect(() => {
        if (TD !== undefined && SD !== undefined) {
            // console.log(TD)
            setSectionsObject(TD.sections)
            setPartsObject(TD.parts)

            SD.sections = TD.sections
            SD.parts = TD.parts
            console.log(SD)
            localStorage.setItem(keySectionsData, JSON.stringify(SD))
            mutateSD()
        }
    }, [TD, SD])

    if (TD === undefined || SD === undefined) {
        return <div>Loading...</div>
    }

    return (
        <>
            <Tabs type="container">
                {SD.parts.map((v, index) => {
                    return (
                        <Tab label={`Section ${index}`}>
                            <Row as="article" narrow>
                                <Column sm={4} md={8} lg={6} style={{ marginBlock: '0.5rem' }}>
                                    <Tile>
                                        <svg viewBox={scaleViewBox} fill="#fff">
                                            {SD.parts && (
                                                <Parts
                                                    center={ViewCenter}
                                                    draws={SD.parts[index]}
                                                    margin={0}
                                                />
                                            )}
                                        </svg>
                                    </Tile>
                                </Column>
                                <Column
                                    sm={4}
                                    md={8}
                                    lg={6}
                                    style={{ marginBlock: '0.5rem' }}
                                ></Column>
                            </Row>
                        </Tab>
                    )
                })}
            </Tabs>
        </>
    )
}

export default PartsOutline
