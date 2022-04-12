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
import { ViewSize, ViewMargin, ViewCenter, AxisX, AxisY } from '@objects/Base/AxisSections'

import Sections from '@objects/Tower/Sections'

const SectionOutline = () => {
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

    const [scaleViewBox, setScaleViewBox] = useState(
        `${ViewMargin * 3.5} ${25000} ${ViewSize / 1.5} ${ViewSize - 25000}`,
    )
    const [totalHeight, setTotalHeight] = useState(0)
    const [topUpperOutDia, setTopUpperOutDia] = useState(0)
    const [bottomLowerOutDia, setBottomLowerOutDia] = useState(0)
    const [divided, setDivided] = useState(0)

    const onChangeTotalHeight = useCallback(
        (e) => {
            setTotalHeight(e.imaginaryTarget.value)
            initData.totalHeight = e.imaginaryTarget.value
            rawData.initial = initData
            localStorage.setItem(keyRawData, JSON.stringify(rawData))
        },
        [keyRawData, rawData, initData],
    )

    const onChangeTopUpperOutDia = useCallback(
        (e) => {
            setTopUpperOutDia(e.value)
            initData.topUpperOutDia = e.value
            rawData.initial = initData
            localStorage.setItem(keyRawData, JSON.stringify(rawData))
        },
        [keyRawData, rawData, initData],
    )

    const onChangeBottomLowerOutDia = useCallback(
        (e) => {
            setBottomLowerOutDia(e.value)
            initData.bottomLowerOutDia = e.value
            rawData.initial = initData
            localStorage.setItem(keyRawData, JSON.stringify(rawData))
            // mutate()
        },
        [keyRawData, rawData, initData],
    )

    const onChangeDevided = useCallback(
        (e) => {
            setDivided(e.value)
            initData.divided = e.value
            rawData.initial = initData
            localStorage.setItem(keyRawData, JSON.stringify(rawData))
            // mutate()
        },
        [keyRawData, rawData, initData],
    )

    const onChangeScale = useCallback((value) => {
        if (value > 180000) {
            setScaleViewBox(`${ViewMargin} ${-65000} ${ViewSize} ${ViewSize + 65000}`)
        } else if (value > 140000) {
            setScaleViewBox(`${ViewMargin * 2.5} ${-45000} ${ViewSize / 1.2} ${ViewSize + 45000}`)
        } else if (value > 110000) {
            setScaleViewBox(`${ViewMargin * 3} ${-5000} ${ViewSize / 1.3} ${ViewSize + 5000}`)
        } else {
            setScaleViewBox(`${ViewMargin * 3.5} ${25000} ${ViewSize / 1.5} ${ViewSize - 25000}`)
        }
    }, [])

    const onClickSetSections = useCallback(
        (e) => {
            var sectionsObject = [] as TWSection[]
            var partsObject = [] as TWParts[]

            for (var i = 0; i < divided; i++) {
                /* Init Value */
                var eachHeight = Math.round(totalHeight / divided)
                var triBottom = Math.abs(topUpperOutDia - bottomLowerOutDia) / 2
                var eachHypo =
                    Math.sqrt(Math.pow(triBottom, 2) + Math.pow(totalHeight, 2)) / divided
                var angle = Math.PI / 2 - Math.atan(totalHeight / triBottom)

                // console.log('eachHeight', eachHeight)
                // console.log('triBottom', triBottom)
                // console.log('eachHypo', eachHypo)
                // console.log('angle', (180 / Math.PI) * angle)

                /* Calc Value */
                var sectionWidthTop = Math.round(
                    topUpperOutDia + eachHypo * i * Math.sin(angle) * 2,
                )
                var sectionWidthBottom = Math.round(
                    topUpperOutDia + eachHypo * (i + 1) * Math.sin(angle) * 2,
                )
                // console.log(
                //     `sectionWidthTop : ${sectionWidthTop} / sectionWidthBottom : ${sectionWidthBottom}`,
                // )

                //Inser Reverse
                sectionsObject[divided - 1 - i] = {
                    index: i,
                    section: {
                        top: sectionWidthTop,
                        bottom: sectionWidthBottom,
                        height: eachHeight,
                    },
                    tapered: true,
                }
                partsObject[divided - 1 - i] = {
                    index: i,
                    parts: [
                        { top: sectionWidthTop, bottom: sectionWidthBottom, height: eachHeight },
                    ],
                    valid: true,
                }
            }

            rawData.sectionData = sectionsObject
            rawData.partsData = partsObject
            localStorage.setItem(keyRawData, JSON.stringify(rawData))
            mutate()
        },
        [keyRawData, rawData, topUpperOutDia, bottomLowerOutDia, totalHeight, divided],
    )

    /*
     ** Detail Tab
     */
    const onClickTypeToggle = useCallback(
        (index) => {
            const section = sectionData.map((v) => {
                if (v.index === index) {
                    v.tapered = !v.tapered
                }
                return v
            })
            rawData.sectionData = section
            localStorage.setItem(keyRawData, JSON.stringify(rawData))
            mutate()
        },
        [keyRawData, rawData, sectionData],
    )

    /*
     ** Data Renewal
    *
    SWR에 LocalStorage 데이터를 반영하여 최신으로 업데이트
    useState를 통해 LocalStorage 1차 저장(useState == LocalStorage -> 자동 저장을 위해)
    => 반영 mutate() => useEffect(~, [TD])를 통해 SWR(==ServerData) 최신 데이터 Front에 반영
    Front 환경에서 보여주는 데이터는 임시저장한 LocalStorage 데이터가 아닌
    SWR 데이터를 기준으로 보여줄 수 있도록 함.
     */
    useEffect(() => {
        if (TD !== undefined) {
            // console.log(TD)
            setRawData(TD)
            setInitData(TD.initial)
            setTotalHeight(TD.initial.totalHeight)
            onChangeScale(TD.initial.totalHeight)
            setTopUpperOutDia(TD.initial.topUpperOutDia)
            setBottomLowerOutDia(TD.initial.bottomLowerOutDia)
            setDivided(TD.initial.divided)

            setSectionData(TD.sectionData)
            // onCreateTypeData(TD.sectionData.length)
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
            <Row as="article" narrow>
                <Column sm={4} md={8} lg={6} style={{ marginBlock: '0.5rem' }}>
                    <Tile>
                        <svg viewBox={scaleViewBox} fill="#fff">
                            {TD.sectionData && (
                                <Sections
                                    center={ViewCenter}
                                    draws={TD.sectionData.map((v) => v.section)}
                                    margin={0}
                                />
                            )}
                        </svg>
                    </Tile>
                </Column>
                <Column sm={4} md={8} lg={6} style={{ marginBlock: '0.5rem' }}>
                    <Tabs>
                        <Tab label="Default">
                            <br />
                            <NumberInput
                                id="totalHeight"
                                label="Total Height"
                                invalidText="This value cannot be used. (Valid Value = 5,000mm~200,000mm)"
                                min={5000}
                                max={200000}
                                onChange={onChangeTotalHeight}
                                size="lg"
                                step={100}
                                value={totalHeight}
                                warnText="A high threshold may impact performance"
                            />
                            <br />
                            <br />
                            <Slider
                                ariaLabelInput="Top Upper Outside Diameter"
                                id="topUpperOutDia"
                                labelText="Top Upper Outside Diameter"
                                max={8000}
                                min={3000}
                                step={50}
                                value={topUpperOutDia}
                                onChange={onChangeTopUpperOutDia}
                            />
                            <br />
                            <br />
                            <Slider
                                ariaLabelInput="Bottom Lower Outside Diameter"
                                id="bottomLowerOutDia"
                                labelText="Bottom Lower Outside Diameter"
                                max={8000}
                                min={3000}
                                step={50}
                                value={bottomLowerOutDia}
                                onChange={onChangeBottomLowerOutDia}
                            />
                            <br />
                            <br />
                            <Slider
                                ariaLabelInput="Number of Tower Sectionl"
                                id="initial-divided"
                                labelText="Number of Tower Sectionl"
                                max={6}
                                min={1}
                                step={1}
                                value={divided}
                                onChange={onChangeDevided}
                            />
                            <br />
                            <br />
                            <Button renderIcon={SettingsCheck32} onClick={onClickSetSections}>
                                Set
                            </Button>
                            <br />
                            <br />
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        {headers.map((header) => (
                                            <TableHeader
                                                key={header.key}
                                                style={{ textAlign: 'center' }}
                                            >
                                                {header.header}
                                            </TableHeader>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {TD.sectionData
                                        .slice(0)
                                        .reverse()
                                        .map((v) => (
                                            <TableRow
                                                key={`section-${v.index}`}
                                                style={{ textAlign: 'end' }}
                                            >
                                                <TableCell>{v.index + 1}</TableCell>
                                                <TableCell>
                                                    <TextInput
                                                        id={`section-height-${v.index}`}
                                                        labelText=""
                                                        value={v.section.height}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Button
                                                        kind="ghost"
                                                        onClick={(e) => onClickTypeToggle(v.index)}
                                                        style={{
                                                            width: '5rem',
                                                            fontSize: '0.8rem',
                                                            textAlign: 'center',

                                                            color: v.tapered
                                                                ? '#00fe33'
                                                                : '#ffff00',
                                                        }}
                                                    >
                                                        {v.tapered ? 'Tapered' : 'Linear'}
                                                    </Button>
                                                </TableCell>
                                                <TableCell>
                                                    <TextInput
                                                        id={`section-top-${v.index}`}
                                                        labelText=""
                                                        value={v.section.top}
                                                        disabled={!v.tapered}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <TextInput
                                                        id={`section-bottom-${v.index}`}
                                                        labelText=""
                                                        value={v.section.bottom}
                                                        disabled={!v.tapered}
                                                    />
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                </TableBody>
                            </Table>
                        </Tab>
                        <Tab label="Detail">
                            <br />
                        </Tab>
                    </Tabs>
                </Column>
            </Row>
        </>
    )
}

export default SectionOutline
