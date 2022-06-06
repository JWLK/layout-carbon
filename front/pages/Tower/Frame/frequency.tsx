import React, { useState, useCallback, useEffect } from 'react'

//Current Page Parameter
import { useParams } from 'react-router'
//Request
import useSWR from 'swr'
import fetchStore from '@utils/store'

/* @objects/Data */
import { RawData, FreqData } from '@objects/Data/InitValue'

/* @typings */
import { dataListMfr } from '@typings/table'
import {
    ObjPoint,
    ObjSquare,
    TWInitialValue,
    TWRawData,
    TWSection,
    TWParts,
    TWPart,
    TWFlanges,
    ObjFlange,
    TWSectors,
    ObjSector,
    TWSector,
    TWFrequency,
} from '@typings/object'

import { PageTypeWide, Header, Section, SectionDivider } from '@pages/Common/ContentsLayout/styles'
import {
    FlexWrap,
    GraphicWrap,
    SettingWrap,
    GraphicViewOrigin,
    GraphicViewHarf,
    SettingViewFit,
    SettingViewWide,
    SettingTitle,
    InputLabel,
    InputDivider,
    /* Custom Carbon Design Component */
    NumberInputCustom,
    SliderCustom,
    AccordionItemCustom,
    TextWrapTableCell,
} from '@pages/Tower/Frame/styles'

import {
    Fade32,
    ArrowUp32,
    ArrowDown32,
    ArrowLeft32,
    ArrowRight32,
    MathCurve32,
} from '@carbon/icons-react'
import {
    Grid,
    Row,
    Column,
    ButtonSet,
    Button,
    TextInput,
    NumberInput,
    Slider,
    ExpandableTile,
    TileAboveTheFoldContent,
    TileBelowTheFoldContent,
    AspectRatio,
    Accordion,
    AccordionItem,
    Table,
    TableHead,
    TableRow,
    TableHeader,
    TableBody,
    TableCell,
} from 'carbon-components-react'

const Frequency = () => {
    /* Param */
    const { workspace } = useParams<{ workspace?: string }>()
    /* Localstorage */
    const keyRawData = `${workspace}-towerData`
    const keyFreqData = `${workspace}-frequencyData`
    if (localStorage.getItem(keyRawData) === null) {
        localStorage.setItem(keyRawData, JSON.stringify(RawData))
    }
    if (localStorage.getItem(keyFreqData) === null) {
        localStorage.setItem(keyFreqData, JSON.stringify(FreqData))
    }
    /* SWR */
    const { data: TD, mutate } = useSWR<TWRawData>(keyRawData, fetchStore)
    const { data: FreqD, mutate: mutateFreq } = useSWR<TWFrequency[]>(keyFreqData, fetchStore)

    /*
     ** localStorage & SWR Data Sync useState
     */
    const [rawData, setRawData] = useState({} as TWRawData)
    const [initData, setInitData] = useState({} as TWInitialValue)
    const [sectionData, setSectionData] = useState([] as TWSection[])
    const [partsData, setPartsData] = useState([] as TWParts[])
    const [flangesData, setFlangesData] = useState([] as TWFlanges[])
    const [sectorsData, setSectorsData] = useState([] as TWSectors[])

    const [frequencyData, setFrequencyData] = useState([] as TWFrequency[])

    useEffect(() => {
        const ListAnyType = [] as any[]
        // const partsArray = [] as TWPart[]
        // const freqArray = [] as TWFrequency[]
        // partsArray.push()
        // partsData.map((v) => console.log(v.parts))
        // flangesData.map((v) => console.log(v.flanges))
        var indexCounter = 0
        partsData.map((v, vIndex) => {
            indexCounter += vIndex > 0 ? partsData[vIndex - 1].parts.length : 0
            flangesData[vIndex].flanges[0].index = indexCounter
            // console.log(flangesData[vIndex].flanges[0])
            ListAnyType.push(flangesData[vIndex].flanges[0])
            indexCounter += 1
            v.parts.map((e, index) => {
                e.index = index + indexCounter
                // partsArray.push(e)
                // console.log(e)
                ListAnyType.push(e)
            })
            flangesData[vIndex].flanges[1].index = v.parts.length + indexCounter
            // console.log(flangesData[vIndex].flanges[1])
            ListAnyType.push(flangesData[vIndex].flanges[1])
            indexCounter += 1
        })
        console.log(ListAnyType)
        // ListAnyType.forEach((e) =>
        //     e.flange == undefined ? console.log('part') : console.log('flange'),
        // )
        var flangeCounter = 0
        var massArray = ListAnyType.map((v) => {
            var freqElement = [] as TWFrequency[]
            if (v.flange == undefined) {
                freqElement = [
                    {
                        index: v.index,
                        frequency: {
                            l: v.part.height / 1000,
                            flangeLWR: 0,
                            flangeLWRAdd: 0,
                            m: calcFreqM(0, v.part.top, v.part.bottom, v.thickness, v.part.height),
                            i: calcFreqI(0, v.part.top, v.part.bottom, v.thickness),
                            j: calcFreqJ(0, v.part.top, v.part.bottom, v.thickness, v.part.height),
                            mExtra: 0,
                            mExtraAdd: 0,
                            flangeUPR: 0,
                            flangeUPRAdd: 0,
                        },
                    },
                    {
                        index: v.index,
                        frequency: {
                            l: v.part.height / 1000,
                            flangeLWR: 0,
                            flangeLWRAdd: 0,
                            m: calcFreqM(1, v.part.top, v.part.bottom, v.thickness, v.part.height),
                            i: calcFreqI(1, v.part.top, v.part.bottom, v.thickness),
                            j: calcFreqJ(1, v.part.top, v.part.bottom, v.thickness, v.part.height),
                            mExtra: 0,
                            mExtraAdd: 0,
                            flangeUPR: 0,
                            flangeUPRAdd: 0,
                        },
                    },
                ]
            } else {
                if (flangeCounter % 2 == 0) {
                    freqElement = [
                        {
                            index: v.index,
                            frequency: {
                                l: (v.flange.neckHeight + v.flange.flangeHeight) / 1000,
                                flangeLWR: calcFreqM(
                                    0,
                                    v.flange.outDia,
                                    v.flange.outDia,
                                    v.flange.neckWidth,
                                    v.flange.neckHeight + v.flange.flangeHeight,
                                ),
                                flangeLWRAdd: 0,
                                m: v.partWeight / 2000,
                                i: calcFreqI(
                                    0,
                                    v.flange.outDia,
                                    v.flange.outDia,
                                    v.flange.neckWidth,
                                ),
                                j: calcFreqJ(
                                    0,
                                    v.flange.outDia,
                                    v.flange.outDia,
                                    v.flange.neckWidth,
                                    v.flange.neckHeight + v.flange.flangeHeight,
                                ),
                                mExtra: 0,
                                mExtraAdd: 0,
                                flangeUPR: 0,
                                flangeUPRAdd: 0,
                            },
                        },
                        {
                            index: v.index,
                            frequency: {
                                l: (v.flange.neckHeight + v.flange.flangeHeight) / 1000,
                                flangeLWR: calcFreqM(
                                    1,
                                    v.flange.outDia,
                                    v.flange.outDia,
                                    v.flange.neckWidth,
                                    v.flange.neckHeight + v.flange.flangeHeight,
                                ),
                                flangeLWRAdd: 0,
                                m: v.partWeight / 2000,
                                i: calcFreqI(
                                    1,
                                    v.flange.outDia,
                                    v.flange.outDia,
                                    v.flange.neckWidth,
                                ),
                                j: calcFreqJ(
                                    1,
                                    v.flange.outDia,
                                    v.flange.outDia,
                                    v.flange.neckWidth,
                                    v.flange.neckHeight + v.flange.flangeHeight,
                                ),
                                mExtra: 0,
                                mExtraAdd: 0,
                                flangeUPR: 0,
                                flangeUPRAdd: 0,
                            },
                        },
                    ]
                } else {
                    freqElement = [
                        {
                            index: v.index,
                            frequency: {
                                l: (v.flange.neckHeight + v.flange.flangeHeight) / 1000,
                                flangeLWR: 0,
                                flangeLWRAdd: 0,
                                m: calcFreqM(
                                    0,
                                    v.flange.outDia,
                                    v.flange.outDia,
                                    v.flange.neckWidth,
                                    v.flange.neckHeight + v.flange.flangeHeight,
                                ),
                                i: calcFreqI(
                                    0,
                                    v.flange.outDia,
                                    v.flange.outDia,
                                    v.flange.neckWidth,
                                ),
                                j: calcFreqJ(
                                    0,
                                    v.flange.outDia,
                                    v.flange.outDia,
                                    v.flange.neckWidth,
                                    v.flange.neckHeight + v.flange.flangeHeight,
                                ),
                                mExtra: 0,
                                mExtraAdd: 0,
                                flangeUPR: v.flangeWeight / 1000,
                                flangeUPRAdd: 0,
                            },
                        },
                        {
                            index: v.index,
                            frequency: {
                                l: (v.flange.neckHeight + v.flange.flangeHeight) / 1000,
                                flangeLWR: 0,
                                flangeLWRAdd: 0,
                                m: calcFreqM(
                                    1,
                                    v.flange.outDia,
                                    v.flange.outDia,
                                    v.flange.neckWidth,
                                    v.flange.neckHeight + v.flange.flangeHeight,
                                ),
                                i: calcFreqI(
                                    1,
                                    v.flange.outDia,
                                    v.flange.outDia,
                                    v.flange.neckWidth,
                                ),
                                j: calcFreqJ(
                                    1,
                                    v.flange.outDia,
                                    v.flange.outDia,
                                    v.flange.neckWidth,
                                    v.flange.neckHeight + v.flange.flangeHeight,
                                ),
                                mExtra: 0,
                                mExtraAdd: 0,
                                flangeUPR: v.flangeWeight / 1000,
                                flangeUPRAdd: 0,
                            },
                        },
                    ]
                }
                flangeCounter++
            }
            return freqElement
        })
        console.log(massArray)
    }, [flangesData, partsData])

    const calcFreqM = (
        type: number,
        diaUPR: number,
        diaLWR: number,
        thickness: number,
        length: number,
    ) => {
        var result = 0
        var leng = length / 2000
        var thick = thickness / 1000
        var diaUPROut = diaUPR / 1000
        var diaUPRIn = diaUPROut - 2 * thick
        var diaLWROut = diaLWR / 1000
        var diaLWRIn = diaLWROut - 2 * thick

        var diaOut_type0 = (3 * diaUPROut + diaLWROut) / 4
        var diaIn_type0 = (3 * diaUPRIn + diaLWRIn) / 4

        var diaOut_type1 = (diaUPROut + 3 * diaLWROut) / 4
        var diaIn_type1 = (diaUPRIn + 3 * diaLWRIn) / 4

        if (type === 0) {
            result =
                ((Math.PI * (Math.pow(diaOut_type0, 2) - Math.pow(diaIn_type0, 2))) / 4) *
                leng *
                7.85 *
                Math.pow(10, 3)
        } else if (type === 1) {
            result =
                ((Math.PI * (Math.pow(diaOut_type1, 2) - Math.pow(diaIn_type1, 2))) / 4) *
                leng *
                7.85 *
                Math.pow(10, 3)
        }
        return result
    }

    const calcFreqI = (type: number, diaUPR: number, diaLWR: number, thickness: number) => {
        var result = 0
        var thick = thickness / 1000
        var diaUPROut = diaUPR / 1000
        var diaUPRIn = diaUPROut - 2 * thick
        var diaLWROut = diaLWR / 1000
        var diaLWRIn = diaLWROut - 2 * thick

        var diaOut_type0 = (3 * diaUPROut + diaLWROut) / 4
        var diaIn_type0 = (3 * diaUPRIn + diaLWRIn) / 4

        var diaOut_type1 = (diaUPROut + 3 * diaLWROut) / 4
        var diaIn_type1 = (diaUPRIn + 3 * diaLWRIn) / 4
        if (type === 0) {
            result = (Math.PI / 64) * (Math.pow(diaOut_type0, 4) - Math.pow(diaIn_type0, 4))
        } else if (type === 1) {
            result = (Math.PI / 64) * (Math.pow(diaOut_type1, 4) - Math.pow(diaIn_type1, 4))
        }
        return result
    }

    const calcFreqJ = (
        type: number,
        diaUPR: number,
        diaLWR: number,
        thickness: number,
        length: number,
    ) => {
        var result = 0
        var leng = length / 2000
        var thick = thickness / 1000
        var diaUPROut = diaUPR / 1000
        var diaUPRIn = diaUPROut - 2 * thick
        var diaLWROut = diaLWR / 1000
        var diaLWRIn = diaLWROut - 2 * thick

        var diaOut_type0 = (3 * diaUPROut + diaLWROut) / 4
        var diaIn_type0 = (3 * diaUPRIn + diaLWRIn) / 4

        var diaOut_type1 = (diaUPROut + 3 * diaLWROut) / 4
        var diaIn_type1 = (diaUPRIn + 3 * diaLWRIn) / 4

        if (type === 0) {
            result =
                (1 / 12) *
                (((Math.PI * Math.pow(diaOut_type0, 2)) / 4) *
                    leng *
                    7.85 *
                    Math.pow(10, 3) *
                    (3 * Math.pow(diaOut_type0 / 2, 2) + Math.pow(leng, 2)) -
                    ((Math.PI * Math.pow(diaIn_type0, 2)) / 4) *
                        leng *
                        7.85 *
                        Math.pow(10, 3) *
                        (3 * Math.pow(diaIn_type0 / 2, 2) + Math.pow(leng, 2)))
        } else if (type === 1) {
            result =
                (1 / 12) *
                (((Math.PI * Math.pow(diaOut_type1, 2)) / 4) *
                    leng *
                    7.85 *
                    Math.pow(10, 3) *
                    (3 * Math.pow(diaOut_type1 / 2, 2) + Math.pow(leng, 2)) -
                    ((Math.PI * Math.pow(diaIn_type1, 2)) / 4) *
                        leng *
                        7.85 *
                        Math.pow(10, 3) *
                        (3 * Math.pow(diaIn_type1 / 2, 2) + Math.pow(leng, 2)))
        }
        return result
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
            //SectionData
            setSectionData(TD.sectionData)
            //PartsData
            setPartsData(TD.partsData)

            //SectorsData
            setSectorsData(TD.sectorsData)
            //FlangesData
            setFlangesData(TD.flangesData)
        }
        if (FreqD !== undefined) {
            setFrequencyData(FreqD)
        }
    }, [TD, FreqD])

    if (TD === undefined && FreqD === undefined) {
        return <div>Loading...</div>
    }

    return (
        <>
            <PageTypeWide>
                <Grid fullWidth>
                    <Row>
                        <Column sm={2} md={6} lg={10}>
                            <Header>
                                Natural Frequency Check
                                <p>Project Detail</p>
                            </Header>
                        </Column>
                        <Column sm={2} md={2} lg={2}>
                            <br />
                            <br />
                            <br />
                            <Button renderIcon={MathCurve32}>Find Natural Frequency</Button>
                        </Column>
                    </Row>
                    <SectionDivider />
                    <Section>
                        <h3>First STEP : Set Base data</h3>
                        <Button renderIcon={Fade32}> Add First Component</Button>
                        <Row as="article" narrow>
                            <Column sm={4} md={8} lg={6} style={{ marginBlock: '0.5rem' }}>
                                Project Components
                            </Column>
                        </Row>
                    </Section>
                </Grid>
            </PageTypeWide>
        </>
    )
}

export default Frequency
