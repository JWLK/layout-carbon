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
import { toRadian, toAngle } from '@objects/Tools/Cartesian'

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
    const [partsData, setPartsData] = useState([] as TWParts[])

    const [scaleViewBox, setScaleViewBox] = useState(
        `${ViewMargin * 3.5} ${25000} ${ViewSize / 1.5} ${ViewSize - 25000}`,
    )
    const [totalHeight, setTotalHeight] = useState(0)
    const [topUpperOutDia, setTopUpperOutDia] = useState(0)
    const [bottomLowerOutDia, setBottomLowerOutDia] = useState(0)
    const [divided, setDivided] = useState(0)

    const onChangeTotalHeight = useCallback(
        (e) => {
            const valueNumber = parseInt(
                e.imaginaryTarget.value !== '' ? e.imaginaryTarget.value : 0,
            )
            setTotalHeight(valueNumber)
            initData.totalHeight = valueNumber
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
        },
        [keyRawData, rawData, initData],
    )

    const onChangeDevided = useCallback(
        (e) => {
            setDivided(e.value)
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

    const onClickSetSectionsInitData = useCallback(
        (e) => {
            e.preventDefault()
            var sectionsObject = [] as TWSection[]
            var partsObject = [] as TWParts[]

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
                    divided: 1,
                }
            }

            initData.divided = divided
            rawData.initial = initData
            rawData.sectionData = sectionsObject
            rawData.partsData = partsObject
            localStorage.setItem(keyRawData, JSON.stringify(rawData))

            //개별 업데이터
            // setRawData(rawData)
            // setSectionData(sectionsObject)

            //한번에 업데이터
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
                    !v.tapered ? (v.section.top = v.section.bottom) : ''
                }
                return v
            })

            const updateSection = updateSectionsTaperedSync(section)

            setSectionData(updateSection)
            rawData.sectionData = updateSection
            localStorage.setItem(keyRawData, JSON.stringify(rawData))
        },
        [keyRawData, rawData, sectionData],
    )

    type typeObjSquare = 'top' | 'bottom' | 'height'
    const onChangeSectionData = useCallback(
        (e, index) => {
            const section = sectionData.map((v) => {
                const typeObject: typeObjSquare = e.target.name
                if (v.index === index) {
                    v.section[`${typeObject}`] = parseInt(
                        e.target.value !== '' ? e.target.value : 0,
                    )
                }
                return v
            })

            const updateInitial = updateInitialSync(section)
            const updateSection = updateSectionsTaperedSync(section)

            rawData.initial = updateInitial
            rawData.sectionData = updateSection
            localStorage.setItem(keyRawData, JSON.stringify(rawData))
            mutate()
        },
        [keyRawData, rawData, sectionData],
    )

    const updateInitialSync = (sections: TWSection[]) => {
        var totalHeight = 0
        for (var i = 0; i < sections.length; i++) {
            totalHeight += sections[i].section.height
        }
        initData.topUpperOutDia = sections[sections.length - 1].section.top
        initData.bottomLowerOutDia = sections[0].section.bottom
        initData.totalHeight = totalHeight

        return initData
    }
    const updateSectionsTaperedSync = (sections: TWSection[]) => {
        if (sections[0].tapered === false) {
            sections[0].section.top = sections[0].section.bottom
        }

        for (var i = 1; i < sections.length; i++) {
            if (sections[i].tapered) {
                sections[i] = {
                    index: sections[i].index,
                    section: {
                        top: sections[i].section.top,
                        bottom: sections[i - 1].section.top,
                        height: sections[i].section.height,
                    },
                    tapered: sections[i].tapered,
                }
            } else {
                sections[i] = {
                    index: sections[i].index,
                    section: {
                        top: sections[i - 1].section.top,
                        bottom: sections[i - 1].section.top,
                        height: sections[i].section.height,
                    },
                    tapered: sections[i].tapered,
                }
            }
        }
        return sections
    }

    const updatePartsSync = (sections: TWSection[], parts: TWParts[]) => {
        for (var i = 0; i < sections.length; i++) {
            parts[i] = {
                index: parts[i].index,
                parts: [
                    {
                        top: sections[i].section.top,
                        bottom: sections[i].section.bottom,
                        height: sections[i].section.height,
                    },
                ],
                divided: parts[i].divided,
            }
        }
        return parts
    }

    const onClickSetSectionsFinalData = useCallback(
        (e) => {
            e.preventDefault()
            const updateInitial = updateInitialSync(sectionData)
            const updateSection = updateSectionsTaperedSync(sectionData)
            const updateParts = updatePartsSync(updateSection, partsData)
            rawData.initial = updateInitial
            rawData.sectionData = updateSection
            rawData.partsData = updateParts
            localStorage.setItem(keyRawData, JSON.stringify(rawData))
            mutate()
        },
        [keyRawData, partsData, rawData, sectionData, updateInitialSync],
    )

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
            setTotalHeight(TD.initial.totalHeight)
            onChangeScale(TD.initial.totalHeight)
            setTopUpperOutDia(TD.initial.topUpperOutDia)
            setBottomLowerOutDia(TD.initial.bottomLowerOutDia)
            setDivided(TD.initial.divided)

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

    // console.log(
    //     'sectionData',
    //     sectionData.map((v) => v.section),
    // )
    return (
        <>
            <Row as="article" narrow>
                <Column sm={4} md={8} lg={6} style={{ marginBlock: '0.5rem' }}>
                    <Tile>
                        <svg viewBox={scaleViewBox} fill="#fff">
                            {sectionData.length && (
                                <Sections
                                    center={ViewCenter}
                                    draws={sectionData.map((v) => v.section)}
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
                                ariaLabelInput="Number of Tower Section"
                                id="initial-divided"
                                labelText="Number of Tower Sectionl"
                                max={10}
                                min={1}
                                step={1}
                                value={divided}
                                onChange={onChangeDevided}
                            />
                            <br />
                            <Button
                                renderIcon={SettingsCheck32}
                                onClick={onClickSetSectionsInitData}
                            >
                                Init Data Setting
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
                                                style={{ textAlign: 'center' }}
                                            >
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
                                                <TableCell>{initData.divided - v.index}</TableCell>
                                                <TableCell>
                                                    <TextInput
                                                        id={`section-height-${v.index}`}
                                                        labelText=""
                                                        name="height"
                                                        onChange={(e) =>
                                                            onChangeSectionData(e, v.index)
                                                        }
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
                                                        name="top"
                                                        onChange={(e) =>
                                                            onChangeSectionData(e, v.index)
                                                        }
                                                        value={v.section.top}
                                                        disabled={!v.tapered}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <TextInput
                                                        id={`section-bottom-${v.index}`}
                                                        labelText=""
                                                        name="bottom"
                                                        onChange={(e) =>
                                                            onChangeSectionData(e, v.index)
                                                        }
                                                        value={v.section.bottom}
                                                        disabled={
                                                            !v.tapered &&
                                                            v.index !== sectionData.length - 1
                                                        }
                                                    />
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                </TableBody>
                            </Table>
                            <br />
                            <Button
                                renderIcon={SettingsCheck32}
                                onClick={onClickSetSectionsFinalData}
                            >
                                SAVE Sections Data
                            </Button>
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
