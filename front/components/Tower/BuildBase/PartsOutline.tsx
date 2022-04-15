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
import ConeWithOrigin from '@objects/Tower/Planar/ConeWithOrigin'
import SectorTrancatedOrigin from '@objects/Tower/Planar/SectorTrancatedOrigin'
import SectorTrancatedScaleUp from '@objects/Tower/Planar/SectorTrancatedScaleUp'

//TEST Object
import Sector from '@objects/Tools/Sector'

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

    const onChaneTabIndex = useCallback(
        (value) => {
            setCurrentTapIndex(value)
            setDivided(partsData[value].divided)
        },
        [partsData],
    )

    useEffect(() => {
        // if (currentTapIndex == 0) {
        //     setScaleViewBox(onChangeScale(initData.totalHeight))
        // } else {
        //     sectionData.map((v, index) => {
        //         if (index == currentTapIndex - 1) {
        //             setScaleViewBox(onChangeScale(v.section.height))
        //         }
        //     })
        // }
        sectionData.map((v, index) => {
            if (index == currentTapIndex) {
                setScaleViewBox(onChangeScale(v.section.height))
            }
        })
    }, [currentTapIndex, initData.totalHeight, sectionData])

    /*Setting State*/
    const [divided, setDivided] = useState(1)

    const onChangeDevided = useCallback(
        (e) => {
            setDivided(e.value)
        },
        [keyRawData, rawData, initData],
    )

    const onClickSetPartsData = useCallback(
        (e) => {
            e.preventDefault()
            var partsObject = [] as TWParts[]
            var parts = [] as ObjSquare[]
            var totalHeight = sectionData[currentTapIndex].section.height
            var topUpperOutDia = sectionData[currentTapIndex].section.top
            var bottomLowerOutDia = sectionData[currentTapIndex].section.bottom

            for (var i = 0; i < divided; i++) {
                /* Init Value */
                var eachHeight = Math.round(totalHeight / divided)
                var triBottom = Math.abs(topUpperOutDia - bottomLowerOutDia) / 2
                var eachHypo =
                    Math.sqrt(Math.pow(triBottom, 2) + Math.pow(totalHeight, 2)) / divided
                var radian = Math.PI / 2 - Math.atan(totalHeight / triBottom)

                // console.log('eachHeight', eachHeight)
                // console.log('triBottom', triBottom)
                // console.log('eachHypo', eachHypo)
                // console.log('angle', (180 / Math.PI) * angle)

                /* Calc Value */
                var sectionWidthTop = Math.round(
                    topUpperOutDia + eachHypo * i * Math.sin(radian) * 2,
                )
                var sectionWidthBottom = Math.round(
                    topUpperOutDia + eachHypo * (i + 1) * Math.sin(radian) * 2,
                )
                // console.log(
                //     `sectionWidthTop : ${sectionWidthTop} / sectionWidthBottom : ${sectionWidthBottom}`,
                // )

                //Inser Reverse
                parts[divided - 1 - i] = {
                    top: sectionWidthTop,
                    bottom: sectionWidthBottom,
                    height: eachHeight,
                }
            }

            rawData.partsData[currentTapIndex].divided = divided
            rawData.partsData[currentTapIndex].parts = parts
            localStorage.setItem(keyRawData, JSON.stringify(rawData))

            //개별 업데이터
            // setRawData(rawData)
            // setSectionData(sectionsObject)

            //한번에 업데이터
            mutate()
        },
        [sectionData, currentTapIndex, divided, rawData, keyRawData, mutate],
    )

    type typeObjSquare = 'top' | 'bottom' | 'height'
    const onChangePartsData = useCallback(
        (e, selected) => {
            console.log(e, selected)
            const parts = partsData[currentTapIndex].parts.map((v, index) => {
                const typeObject: typeObjSquare = e.target.name
                if (index === selected) {
                    v[`${typeObject}`] = parseInt(e.target.value !== '' ? e.target.value : 0)
                }
                return v
            })

            // const updateInitial = updateInitialSync(section)
            // const updateParts = updatePartsTaperedSync(section)

            localStorage.setItem(keyRawData, JSON.stringify(updateRawDatadSync(parts)))
            mutate()
        },
        [currentTapIndex, keyRawData, mutate, partsData, rawData],
    )

    const updateRawDatadSync = (parts: ObjSquare[]) => {
        var totalHeight = 0
        var sectionHeight = 0

        for (var i = 0; i < partsData[currentTapIndex].parts.length; i++) {
            sectionHeight += partsData[currentTapIndex].parts[i].height
        }
        sectionData[currentTapIndex].section.height = sectionHeight

        for (var l = 0; l < sectionData.length; l++) {
            totalHeight += sectionData[l].section.height
        }
        initData.totalHeight = totalHeight

        rawData.initial = initData
        rawData.sectionData = sectionData
        rawData.partsData[currentTapIndex].parts = parts

        return rawData
    }
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
            setDivided(TD.partsData[currentTapIndex].divided)
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
                {partsData.map((v) => {
                    return (
                        <Tab label={`section ${sectionData.length - v.index}`}>
                            <Row as="article" narrow>
                                <Column sm={8} md={8} lg={12} style={{ marginBlock: '0.5rem' }}>
                                    <Tile>
                                        <div style={{ marginBottom: '1.5rem' }}>Planar view</div>
                                        <Tabs type="container">
                                            <Tab label="Total">
                                                <Row as="article" narrow>
                                                    <Column
                                                        sm={4}
                                                        md={8}
                                                        lg={6}
                                                        style={{ marginBlock: '0.5rem' }}
                                                    >
                                                        <div
                                                            style={{
                                                                border: '1px solid #333',
                                                                marginRight: '1rem',
                                                            }}
                                                        >
                                                            <svg viewBox={scaleViewBox} fill="#fff">
                                                                {partsData.length && (
                                                                    <Parts
                                                                        center={ViewCenter}
                                                                        draws={v.parts}
                                                                        margin={0}
                                                                    />
                                                                )}
                                                            </svg>
                                                        </div>
                                                    </Column>
                                                    <Column
                                                        sm={4}
                                                        md={8}
                                                        lg={6}
                                                        style={{ marginBlock: '0.5rem' }}
                                                    >
                                                        <Slider
                                                            ariaLabelInput="Number of Part"
                                                            id="initial-divided"
                                                            labelText="Number of Tower Part"
                                                            max={20}
                                                            min={1}
                                                            step={1}
                                                            value={divided}
                                                            onChange={onChangeDevided}
                                                        />

                                                        <Button
                                                            renderIcon={SettingsCheck32}
                                                            onClick={onClickSetPartsData}
                                                        >
                                                            Set Parts
                                                        </Button>
                                                        <br />
                                                        <br />
                                                        <br />
                                                        <Table>
                                                            <TableHead>
                                                                <TableRow>
                                                                    {headers.map((header) => (
                                                                        <TableHeader
                                                                            key={header.key}
                                                                            style={{
                                                                                textAlign: 'center',
                                                                            }}
                                                                        >
                                                                            {header.header}
                                                                        </TableHeader>
                                                                    ))}
                                                                </TableRow>
                                                            </TableHead>
                                                            <TableBody>
                                                                {partsData[currentTapIndex].parts
                                                                    .slice(0)
                                                                    .reverse()
                                                                    .map((v, index) => (
                                                                        <TableRow
                                                                            key={`section-${index}`}
                                                                            style={{
                                                                                textAlign: 'end',
                                                                            }}
                                                                        >
                                                                            <TableCell>
                                                                                {partsData[
                                                                                    currentTapIndex
                                                                                ].divided - index}
                                                                            </TableCell>
                                                                            <TableCell>
                                                                                <TextInput
                                                                                    id={`section-height-${index}`}
                                                                                    labelText=""
                                                                                    name="height"
                                                                                    onChange={(e) =>
                                                                                        onChangePartsData(
                                                                                            e,
                                                                                            divided -
                                                                                                index -
                                                                                                1,
                                                                                        )
                                                                                    }
                                                                                    value={v.height}
                                                                                />
                                                                            </TableCell>
                                                                            <TableCell>
                                                                                <TextInput
                                                                                    id={`section-top-${index}`}
                                                                                    labelText=""
                                                                                    name="top"
                                                                                    value={v.top}
                                                                                    disabled={true}
                                                                                />
                                                                            </TableCell>
                                                                            <TableCell>
                                                                                <TextInput
                                                                                    id={`section-bottom-${index}`}
                                                                                    labelText=""
                                                                                    name="bottom"
                                                                                    value={v.bottom}
                                                                                    disabled={true}
                                                                                />
                                                                            </TableCell>
                                                                        </TableRow>
                                                                    ))}
                                                            </TableBody>
                                                        </Table>
                                                    </Column>
                                                </Row>
                                            </Tab>
                                            <Tab label="Each Part Setting">
                                                <Row as="article" narrow>
                                                    <Column
                                                        sm={8}
                                                        md={8}
                                                        lg={6}
                                                        style={{ marginBlock: '0.5rem' }}
                                                    >
                                                        <div
                                                            style={{
                                                                border: '1px solid #333',
                                                            }}
                                                        >
                                                            <SectorTrancatedOrigin
                                                                top={v.parts[0].top}
                                                                bottom={v.parts[0].bottom}
                                                                height={v.parts[0].height}
                                                            />
                                                        </div>
                                                    </Column>
                                                    <Column
                                                        sm={8}
                                                        md={8}
                                                        lg={6}
                                                        style={{ marginBlock: '0.5rem' }}
                                                    >
                                                        <div
                                                            style={{
                                                                border: '1px solid #333',
                                                            }}
                                                        >
                                                            <SectorTrancatedScaleUp
                                                                top={v.parts[0].top}
                                                                bottom={v.parts[0].bottom}
                                                                height={v.parts[0].height}
                                                            />
                                                        </div>
                                                    </Column>
                                                </Row>
                                            </Tab>
                                            {/* {v.parts.map((p, index) => {
                                                return (
                                                    <Tab label={`Part ${index + 1}`}>
                                                        <Row as="article" narrow>
                                                            <Column
                                                                sm={8}
                                                                md={8}
                                                                lg={6}
                                                                style={{ marginBlock: '0.5rem' }}
                                                            >
                                                                <div
                                                                    style={{
                                                                        border: '1px solid #333',
                                                                    }}
                                                                >
                                                                    <SectorTrancatedOrigin
                                                                        top={p.top}
                                                                        bottom={p.bottom}
                                                                        height={p.height}
                                                                    />
                                                                </div>
                                                            </Column>
                                                            <Column
                                                                sm={8}
                                                                md={8}
                                                                lg={6}
                                                                style={{ marginBlock: '0.5rem' }}
                                                            >
                                                                <div
                                                                    style={{
                                                                        border: '1px solid #333',
                                                                    }}
                                                                >
                                                                    <SectorTrancatedScaleUp
                                                                        top={p.top}
                                                                        bottom={p.bottom}
                                                                        height={p.height}
                                                                    />
                                                                </div>
                                                            </Column>
                                                        </Row>
                                                    </Tab>
                                                )
                                            })} */}
                                        </Tabs>
                                    </Tile>
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
