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
    DataTable,
    TableContainer,
    Table,
    TableHead,
    TableHeader,
    TableBody,
    TableRow,
    TableCell,
} from 'carbon-components-react'

/*Tower Element*/
//Type
import { ObjPoint, ObjSquare, TWInitialValue, TWRawData, TWSection, TWParts } from 'typings/object'
//Data
import { RawData } from '@objects/Data/InitValue'
//Element
import {
    ViewSize,
    ViewMargin,
    ViewCenter,
    AxisX,
    AxisY,
    onChangeScale,
} from '@objects/Base/AxisSections'

import Sections from '@objects/Tower/Sections'
import Parts from '@objects/Tower/Parts'

const PartsOutline = () => {
    /* Param */
    const { workspace } = useParams<{ workspace?: string }>()
    /* Localstorage */
    const keyRawData = `${workspace}-towerData`
    if (localStorage.getItem(keyRawData) === null) {
        localStorage.setItem(keyRawData, JSON.stringify(RawData))
    }
    /* SWR */
    const { data: TD, mutate } = useSWR<TWRawData>(keyRawData, fetchStore)

    /*
     ** Init Tab
     */
    const [rawData, setRawData] = useState({} as TWRawData)
    const [initData, setInitData] = useState({} as TWInitialValue)
    const [sectionData, setSectionData] = useState([] as TWSection[])
    const [partsData, setPartsData] = useState([] as TWParts[])

    const [scaleViewBox, setScaleViewBox] = useState(
        `${ViewMargin * 3.5} ${25000} ${ViewSize / 1.5} ${ViewSize - 25000}`,
    )

    const [currentTapIndex, setCurrentTapIndex] = useState(0)

    const onChaneTabIndex = useCallback((value) => {
        setCurrentTapIndex(value)
    }, [])

    useEffect(() => {
        if (currentTapIndex == 0) {
            setScaleViewBox(onChangeScale(initData.totalHeight))
        } else {
            sectionData.map((v, index) => {
                if (index == currentTapIndex - 1) {
                    setScaleViewBox(onChangeScale(v.section.height))
                }
            })
        }
    }, [currentTapIndex, initData.totalHeight, onChangeScale, sectionData])
    /*
    ** Data Renewal
    *
    SWR를 활용하여 LocalStorage 데이터를 반영해 useState의 Value를 최신으로 업데이트
    onChange를 통해 useState, LocalStorage 1차 저장(useState == LocalStorage -> 선택적으로 자동저장 활용)
    [Server 반영 방법]
    - useState : set() Method를 이용해서 개별적인 데이터 업데이트
    - SWR : mutate() => useEffect(~, [TD])를 통해 useState Value를 최신데이터로 업데이트해 Front에 반영
    [Front 표현]
    - useState : object를 이용해서 데이터 반영
    */
    useEffect(() => {
        if (TD !== undefined) {
            // console.log(TD)
            setRawData(TD)
            setInitData(TD.initial)
            setSectionData(TD.sectionData)
            setPartsData(TD.partsData)
        }
    }, [TD])

    if (TD === undefined) {
        return <div>Loading...</div>
    }

    const headers = [
        {
            key: 'no',
            header: 'No.',
        },
        {
            key: 'height',
            header: 'Height',
        },
        {
            key: 'type',
            header: 'Type',
        },
        {
            key: 'top',
            header: 'Top',
        },
        {
            key: 'bottom',
            header: 'Bottom',
        },
    ]

    return (
        <>
            <Tabs onSelectionChange={onChaneTabIndex}>
                <Tab label="Section Info">
                    <Row as="article" narrow>
                        <Column sm={4} md={8} lg={6} style={{ marginBlock: '0.5rem' }}>
                            <Tile>
                                <svg viewBox={scaleViewBox} fill="#fff">
                                    {sectionData.length && (
                                        <Parts
                                            center={ViewCenter}
                                            draws={sectionData.map((v) => v.section)}
                                            margin={0}
                                        />
                                    )}
                                </svg>
                            </Tile>
                        </Column>
                        <Column sm={4} md={8} lg={6} style={{ marginBlock: '0.5rem' }}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        {headers.map((header) => (
                                            <TableHeader key={header.key}>
                                                {header.header}
                                            </TableHeader>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {sectionData
                                        .slice(0)
                                        .reverse()
                                        .map((v) => (
                                            <TableRow
                                                key={`section-${v.index}`}
                                                style={{ textAlign: 'end' }}
                                            >
                                                <TableCell>{v.index + 1}</TableCell>
                                                <TableCell>{v.section.height}</TableCell>
                                                <TableCell>
                                                    <div
                                                        style={{
                                                            fontSize: '0.8rem',
                                                            color: v.tapered
                                                                ? '#00fe33'
                                                                : '#ffff00',
                                                        }}
                                                    >
                                                        {v.tapered ? 'Tapered' : 'Linear'}
                                                    </div>
                                                </TableCell>
                                                <TableCell>{v.section.top}</TableCell>
                                                <TableCell>{v.section.bottom}</TableCell>
                                            </TableRow>
                                        ))}
                                </TableBody>
                            </Table>
                        </Column>
                    </Row>
                </Tab>
                {partsData.map((v) => {
                    return (
                        <Tab label={`section ${v.index + 1}`}>
                            <Row as="article" narrow>
                                <Column sm={4} md={8} lg={6} style={{ marginBlock: '0.5rem' }}>
                                    <Tile>
                                        <svg viewBox={scaleViewBox} fill="#fff">
                                            {partsData.length && (
                                                <Parts
                                                    center={ViewCenter}
                                                    draws={v.parts}
                                                    margin={0}
                                                />
                                            )}
                                        </svg>
                                    </Tile>
                                </Column>
                                <Column sm={4} md={8} lg={6} style={{ marginBlock: '0.5rem' }}>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                {headers.map((header) => (
                                                    <TableHeader key={header.key}>
                                                        {header.header}
                                                    </TableHeader>
                                                ))}
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {sectionData
                                                .slice(0)
                                                .reverse()
                                                .map((v) => (
                                                    <TableRow
                                                        key={`section-${v.index}`}
                                                        style={{ textAlign: 'end' }}
                                                    >
                                                        <TableCell>{v.index + 1}</TableCell>
                                                        <TableCell>{v.section.height}</TableCell>
                                                        <TableCell>
                                                            <div
                                                                style={{
                                                                    fontSize: '0.8rem',
                                                                    color: v.tapered
                                                                        ? '#00fe33'
                                                                        : '#ffff00',
                                                                }}
                                                            >
                                                                {v.tapered ? 'Tapered' : 'Linear'}
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>{v.section.top}</TableCell>
                                                        <TableCell>{v.section.bottom}</TableCell>
                                                    </TableRow>
                                                ))}
                                        </TableBody>
                                    </Table>
                                </Column>
                            </Row>
                        </Tab>
                    )
                })}
            </Tabs>
        </>
    )
}

export default PartsOutline
