import React, { useState, useCallback, useEffect } from 'react'
import CalcMatrix from '@calc/Matrix'
import { multiply, inv } from 'mathjs'

/* Chart Data */
import { LineChart } from '@carbon/charts-react'
import { LineChartOptions } from '@carbon/charts/interfaces'
import { ScaleTypes } from '@carbon/charts/interfaces/enums'
// import { options } from '@carbon/charts/configuration'
/* Example Data */
const chartScaleData = [
    {
        group: 'Max',
        height: 0,
        value: 1,
    },
    {
        group: 'MIN',
        height: 0,
        value: -1,
    },
]
const chartOption: LineChartOptions = {
    title: 'Height',
    axes: {
        left: {
            title: 'Height',
            mapsTo: 'height',
            scaleType: 'linear' as ScaleTypes,
        },
        bottom: {
            title: 'Value',
            mapsTo: 'value',
            scaleType: 'linear' as ScaleTypes,
            ticks: {
                values: [-1, -0.5, 0, 0.5, 1],
                min: -1,
                max: 1,
            },
            includeZero: true,
            thresholds: [
                {
                    label: 'Center Line',
                    value: 0,
                    fillColor: 'orange',
                },
            ],
        },
    },
    curve: 'curveMonotoneX',
    height: '1000px',
    legend: {
        clickable: false,
    },
}

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
    Loading,
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

    /* Chart Data */
    const [eigenData, setEigenData] = useState(
        [] as { group: string; height: number; value: number }[],
    )

    /* Matix Calc State */
    const [w, setW] = useState(1)
    const [deter, setDeter] = useState(0.0)
    const [calcCount, setCalcCount] = useState(0)
    const [graphRowVector, setGraphRowVector] = useState([[0], [0], [0], [0]] as number[][])
    const [graphRowResult, setGraphRowResult] = useState([[0], [0], [0], [0]] as number[][])
    const [loading, setLoading] = useState(false)

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
        // ListAnyType.forEach((e) =>
        //     e.flange == undefined ? console.log('part') : console.log('flange'),
        // )
        var flangeCounter = 0
        var massArray = ListAnyType.map((v) => {
            var freqElement = {} as TWFrequency
            if (v.flange == undefined) {
                freqElement = {
                    index: v.index,
                    frequency: {
                        l: v.part.height / 1000,
                        flangeLWR: 0,
                        flangeLWRAdd: 0,
                        m_1: calcFreqM(0, v.part.top, v.part.bottom, v.thickness, v.part.height),
                        i_1: calcFreqI(0, v.part.top, v.part.bottom, v.thickness),
                        j_1: calcFreqJ(0, v.part.top, v.part.bottom, v.thickness, v.part.height),
                        m_2: calcFreqM(1, v.part.top, v.part.bottom, v.thickness, v.part.height),
                        i_2: calcFreqI(1, v.part.top, v.part.bottom, v.thickness),
                        j_2: calcFreqJ(1, v.part.top, v.part.bottom, v.thickness, v.part.height),
                        mExtra: 0,
                        mExtraAdd: 0,
                        flangeUPR: 0,
                        flangeUPRAdd: 0,
                    },
                }
                return freqElement
            } else {
                if (flangeCounter % 2 == 0) {
                    freqElement = {
                        index: v.index,
                        frequency: {
                            l: (v.flange.neckHeight + v.flange.flangeHeight) / 1000,
                            flangeLWR: v.flangeWeight / 1000,
                            flangeLWRAdd: 0,
                            m_1: calcFreqM(
                                0,
                                v.flange.outDia,
                                v.flange.outDia,
                                v.flange.neckWidth,
                                v.flange.neckHeight + v.flange.flangeHeight,
                            ),
                            i_1: calcFreqI(0, v.flange.outDia, v.flange.outDia, v.flange.neckWidth),
                            j_1: calcFreqJ(
                                0,
                                v.flange.outDia,
                                v.flange.outDia,
                                v.flange.neckWidth,
                                v.flange.neckHeight + v.flange.flangeHeight,
                            ),
                            m_2: calcFreqM(
                                1,
                                v.flange.outDia,
                                v.flange.outDia,
                                v.flange.neckWidth,
                                v.flange.neckHeight + v.flange.flangeHeight,
                            ),
                            i_2: calcFreqI(1, v.flange.outDia, v.flange.outDia, v.flange.neckWidth),
                            j_2: calcFreqJ(
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
                    }
                } else {
                    freqElement = {
                        index: v.index,
                        frequency: {
                            l: (v.flange.neckHeight + v.flange.flangeHeight) / 1000,
                            flangeLWR: 0,
                            flangeLWRAdd: 0,
                            m_1: calcFreqM(
                                0,
                                v.flange.outDia,
                                v.flange.outDia,
                                v.flange.neckWidth,
                                v.flange.neckHeight + v.flange.flangeHeight,
                            ),
                            i_1: calcFreqI(0, v.flange.outDia, v.flange.outDia, v.flange.neckWidth),
                            j_1: calcFreqJ(
                                0,
                                v.flange.outDia,
                                v.flange.outDia,
                                v.flange.neckWidth,
                                v.flange.neckHeight + v.flange.flangeHeight,
                            ),
                            m_2: calcFreqM(
                                1,
                                v.flange.outDia,
                                v.flange.outDia,
                                v.flange.neckWidth,
                                v.flange.neckHeight + v.flange.flangeHeight,
                            ),
                            i_2: calcFreqI(1, v.flange.outDia, v.flange.outDia, v.flange.neckWidth),
                            j_2: calcFreqJ(
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
                    }
                }
                flangeCounter++
                return freqElement
            }
        })
        ListAnyType.length &&
            massArray.push({
                index: massArray.length,
                frequency: {
                    l: 3.31224619239327,
                    flangeLWR: 0,
                    flangeLWRAdd: 0,
                    m_1: 0,
                    i_1: 4908738.52123405,
                    j_1: 0,
                    m_2: 0,
                    i_2: 4908738.52123405,
                    j_2: 0,
                    mExtra: 0,
                    mExtraAdd: 0,
                    flangeUPR: 673052.5,
                    flangeUPRAdd: 0,
                },
            })
        // console.log(massArray)
        localStorage.setItem(keyFreqData, JSON.stringify(massArray))
        mutateFreq()
    }, [flangesData, keyFreqData, partsData])

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
    const MR = (value: number) => {
        return Math.round(value * 1000) / 1000
    }

    const matChainCalc = (w: number, param: TWFrequency[], number: number) => {
        console.log('Chain Calc')
        var matResult = [CalcMatrix({ w, ...param[0].frequency })]

        for (var i = 0; i < number; i++) {
            matResult[i + 1] = multiply(CalcMatrix({ w, ...param[i + 1].frequency }), matResult[i])
        }
        return matResult
    }

    const matChainCalc2 = (
        freqData: number[][][],
        result: number[][],
        vector: number[][],
        number: number,
    ) => {
        console.log('Chain Calc 2')
        var matResult = [] as number[][][]
        for (var i = 0; i < number; i++) {
            matResult[i] = multiply(freqData[i], result)
        }
        if (number < 70) {
            for (i = number; i < 69; i++) {
                matResult[i] = matResult[number - 1]
            }
        }
        matResult[69] = vector

        return matResult.map((v) => v[0][0])
    }

    /**
     * Matrix Calc Unit Test
     * */
    // frequencyData.length &&
    //     console.log(
    //         'result - 24',
    //         CalcMatrix({ w, ...frequencyData[23].frequency }).map((col) => col.map((v) => MR(v))),
    //     )

    // const mulResult = () => {
    //     var matMul = multiply(
    //         CalcMatrix({ w, ...frequencyData[1].frequency }),
    //         CalcMatrix({ w, ...frequencyData[0].frequency }),
    //     )
    //     return matMul
    // }
    // frequencyData.length && console.log('result - Multifly', mulResult())

    /**
     * Matirx Data Calc
     */
    useEffect(() => {
        /* Data Chain Matrix Calc Test */
        if (frequencyData.length) {
            var matixResult = matChainCalc(w, frequencyData, frequencyData.length - 1)
            console.log(
                'Chain Calc Result ',
                matixResult.map((e) => e.map((col) => col.map((v) => MR(v)))),
            )
            console.log('Last Calc Result ', matixResult[frequencyData.length - 1])

            var determinant =
                matixResult[frequencyData.length - 1][2][2] *
                    matixResult[frequencyData.length - 1][3][3] -
                matixResult[frequencyData.length - 1][2][3] *
                    matixResult[frequencyData.length - 1][3][2]
            setDeter(determinant)
            // console.log('Determinant', determinant)
            var garaphData = calcEvent2(matixResult)
            var heightArray = [20, ...frequencyData.map((v) => v.frequency.l)]
            if (frequencyData.length < garaphData.length) {
                for (var i = frequencyData.length; i < garaphData.length; i++) {
                    heightArray[i] = 0
                }
            }
            console.log('heightArray', heightArray)

            for (var j = 1; j < garaphData.length - 1; j++) {
                var sumOf =
                    Math.round(heightArray.slice(0, j).reduce((prev, next) => prev + next) * 1000) /
                    1000
                console.log(sumOf)
            }

            setEigenData(
                garaphData.map((v, index) => {
                    var dataElement = {
                        group: 'Eigen Vector',
                        height:
                            Math.round(
                                heightArray
                                    .slice(0, index + 1)
                                    .reduce((prev, next) => prev + next) * 1000,
                            ) / 1000,
                        // height: index,
                        value: v,
                    }
                    return dataElement
                }),
            )
            // console.log('garaphData', garaphData)
        }
    }, [frequencyData, w])

    /* Eigen Data Check */
    // useEffect(() => {
    //     console.log('eigenData', eigenData)
    // }, [eigenData])

    const calcEvent = (freqData: TWFrequency[], w: number, deter: number) => {
        console.log('Calc Event')
        var resultMat = [] as number[][][]
        var cnt = 0
        setLoading(true)
        // do {
        //     resultMat = matChainCalc(w, freqData, freqData.length - 1)
        //     deter =
        //         resultMat[frequencyData.length - 1][2][2] *
        //             resultMat[frequencyData.length - 1][3][3] -
        //         resultMat[frequencyData.length - 1][2][3] *
        //             resultMat[frequencyData.length - 1][3][2]
        //     cnt++
        //     w += 0.0001
        // } while (deter > 0.0001)
        while (deter > 0.0001) {
            resultMat = matChainCalc(w, freqData, freqData.length - 1)
            deter =
                resultMat[frequencyData.length - 1][2][2] *
                    resultMat[frequencyData.length - 1][3][3] -
                resultMat[frequencyData.length - 1][2][3] *
                    resultMat[frequencyData.length - 1][3][2]
            cnt++
            w += 0.001
        }
        setW(w)
        setDeter(deter)
        setCalcCount(cnt)
        setLoading(false)
    }
    const calcEvent2 = (freqData: number[][][]) => {
        console.log('Calc Event2')
        var seta = 1
        var resultMat = multiply(inv(freqData[frequencyData.length - 1]), [[1], [seta], [0], [0]])
        while (resultMat[1][0] > 0.000005) {
            resultMat = multiply(inv(freqData[frequencyData.length - 1]), [[1], [seta], [0], [0]])
            seta -= 0.00001
        }
        console.log(resultMat)
        console.log(seta)
        setGraphRowVector([[1], [seta], [0], [0]])
        setGraphRowResult(resultMat)

        var matixResult2 = matChainCalc2(
            freqData,
            resultMat,
            [[1], [seta], [0], [0]],
            frequencyData.length - 1,
        )
        // console.log('Chain Calc2 Result', [0, ...matixResult2])

        return [0, ...matixResult2]
        // var result = multiply(freqData[0], resultMat)
        // console.log('result row 1 graph vector', result)
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
            {loading && (
                <Loading description="Active loading indicator" withOverlay={true} small={false} />
            )}
            {sectionData.length && partsData.length && flangesData.length && frequencyData.length && (
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
                                <Button kind="tertiary" renderIcon={Fade32}>
                                    Reset Parameter
                                </Button>
                            </Column>
                        </Row>
                        <SectionDivider />
                        <Section>
                            <h3>Natural Frequency Calculator</h3>
                            <Button
                                renderIcon={MathCurve32}
                                onClick={() => calcEvent(frequencyData, w, deter)}
                            >
                                Find Natural Frequency
                            </Button>
                            <Row>
                                <Column sm={4} md={2} lg={2}>
                                    <LineChart
                                        data={[...chartScaleData, ...eigenData]}
                                        options={chartOption}
                                    ></LineChart>
                                </Column>
                                <Column sm={4} md={4} lg={10}>
                                    <Row as="article" narrow>
                                        <Column
                                            sm={1}
                                            md={2}
                                            lg={4}
                                            style={{ marginBlock: '0.5rem' }}
                                        >
                                            W = {Math.round(w * 1000) / 1000}
                                        </Column>
                                        <Column
                                            sm={1}
                                            md={4}
                                            lg={4}
                                            style={{ marginBlock: '0.5rem' }}
                                        >
                                            Natural Frequency ={' '}
                                            {Math.round((w / (2 * Math.PI)) * 1000) / 1000} Hz
                                        </Column>
                                        <Column
                                            sm={1}
                                            md={4}
                                            lg={4}
                                            style={{ marginBlock: '0.5rem' }}
                                        >
                                            Determinent = {Math.round(deter * 1000) / 1000}
                                        </Column>
                                    </Row>
                                    <Row as="article" narrow>
                                        <Column
                                            sm={1}
                                            md={2}
                                            lg={4}
                                            style={{ marginBlock: '0.5rem' }}
                                        >
                                            Count = {calcCount}
                                        </Column>
                                    </Row>
                                    <Row>
                                        <Table size="sm">
                                            <TableBody>
                                                <TableRow>
                                                    <TableCell>y</TableCell>
                                                    <TableCell>{graphRowVector[0][0]}</TableCell>
                                                    <TableCell>{`=>`}</TableCell>
                                                    <TableCell>{graphRowResult[0][0]}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell>θ</TableCell>
                                                    <TableCell>{graphRowVector[1][0]}</TableCell>
                                                    <TableCell>{`=>`}</TableCell>
                                                    <TableCell>{graphRowResult[1][0]}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell>M</TableCell>
                                                    <TableCell>{graphRowVector[2][0]}</TableCell>
                                                    <TableCell>{`=>`}</TableCell>
                                                    <TableCell>{graphRowResult[2][0]}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell>V</TableCell>
                                                    <TableCell>{graphRowVector[3][0]}</TableCell>
                                                    <TableCell>{`=>`}</TableCell>
                                                    <TableCell>{graphRowResult[3][0]}</TableCell>
                                                </TableRow>
                                            </TableBody>
                                        </Table>
                                    </Row>
                                </Column>
                            </Row>
                        </Section>
                        <SectionDivider />
                        <>
                            <InputLabel>Section Body Mass Table</InputLabel>
                            <Table size="lg">
                                <TableHead>
                                    <TableRow>
                                        <TableHeader>
                                            <div style={{ color: '#fff', marginLeft: '0px' }}>
                                                No.
                                            </div>
                                        </TableHeader>
                                        <TableHeader>
                                            <div style={{ color: '#fff', marginLeft: '0px' }}>
                                                L [m]
                                            </div>
                                        </TableHeader>
                                        <TableHeader>
                                            <div style={{ color: '#fff', marginLeft: '0px' }}>
                                                M_Flange_LWR [kg]
                                            </div>
                                        </TableHeader>
                                        <TableHeader>
                                            <div style={{ color: '#fff', marginLeft: '0px' }}>
                                                M_1 [kg]
                                            </div>
                                        </TableHeader>
                                        <TableHeader>
                                            <div style={{ color: '#fff', marginLeft: '0px' }}>
                                                I_1 [m^4]
                                            </div>
                                        </TableHeader>
                                        <TableHeader>
                                            <div style={{ color: '#fff', marginLeft: '0px' }}>
                                                J_1_CG [kgm^2]
                                            </div>
                                        </TableHeader>
                                        <TableHeader>
                                            <div style={{ color: '#fff', marginLeft: '0px' }}>
                                                M_2 [kg]
                                            </div>
                                        </TableHeader>
                                        <TableHeader>
                                            <div style={{ color: '#fff', marginLeft: '0px' }}>
                                                I_2 [m^4]
                                            </div>
                                        </TableHeader>
                                        <TableHeader>
                                            <div style={{ color: '#fff', marginLeft: '0px' }}>
                                                J_2_CG [kgm^2]
                                            </div>
                                        </TableHeader>
                                        <TableHeader>
                                            <div style={{ color: '#fff', marginLeft: '0px' }}>
                                                M_Flange_UPR [kg]
                                            </div>
                                        </TableHeader>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {/* Tower Parts */}
                                    {frequencyData.map((v, index) => {
                                        return (
                                            <TableRow key={`frequencyData-${index}`}>
                                                <TableCell>
                                                    <TextWrapTableCell width={1}>
                                                        <div
                                                            style={{
                                                                fontSize: '0.7rem',
                                                                color: '#fff',
                                                            }}
                                                        >
                                                            {index + 1}
                                                        </div>
                                                    </TextWrapTableCell>
                                                </TableCell>
                                                <TableCell>
                                                    <TextWrapTableCell width={2}>
                                                        <div
                                                            style={{
                                                                fontSize: '0.7rem',
                                                                color: '#FF7700',
                                                            }}
                                                        >
                                                            {v.frequency.l}
                                                        </div>
                                                    </TextWrapTableCell>
                                                </TableCell>
                                                <TableCell>
                                                    <TextWrapTableCell width={4}>
                                                        <div
                                                            style={{
                                                                fontSize: '0.7rem',
                                                                color:
                                                                    v.frequency.flangeLWR > 0
                                                                        ? '#FFcc22'
                                                                        : '#fff',
                                                            }}
                                                        >
                                                            {v.frequency.flangeLWR}
                                                        </div>
                                                    </TextWrapTableCell>
                                                </TableCell>
                                                <TableCell>
                                                    <TextWrapTableCell width={8}>
                                                        <div
                                                            style={{
                                                                fontSize: '0.7rem',
                                                                color: '#9BBB59',
                                                            }}
                                                        >
                                                            {v.frequency.m_1}
                                                        </div>
                                                    </TextWrapTableCell>
                                                </TableCell>
                                                <TableCell>
                                                    <TextWrapTableCell width={8}>
                                                        <div
                                                            style={{
                                                                fontSize: '0.7rem',
                                                                color: '#538DD5',
                                                            }}
                                                        >
                                                            {v.frequency.i_1}
                                                        </div>
                                                    </TextWrapTableCell>
                                                </TableCell>
                                                <TableCell>
                                                    <TextWrapTableCell width={8}>
                                                        <div
                                                            style={{
                                                                fontSize: '0.7rem',
                                                                color: '#B1A0C7',
                                                            }}
                                                        >
                                                            {v.frequency.j_1}
                                                        </div>
                                                    </TextWrapTableCell>
                                                </TableCell>
                                                <TableCell>
                                                    <TextWrapTableCell width={8}>
                                                        <div
                                                            style={{
                                                                fontSize: '0.7rem',
                                                                color: '#9BBB59',
                                                            }}
                                                        >
                                                            {v.frequency.m_2}
                                                        </div>
                                                    </TextWrapTableCell>
                                                </TableCell>
                                                <TableCell>
                                                    <TextWrapTableCell width={8}>
                                                        <div
                                                            style={{
                                                                fontSize: '0.7rem',
                                                                color: '#538DD5',
                                                            }}
                                                        >
                                                            {v.frequency.i_2}
                                                        </div>
                                                    </TextWrapTableCell>
                                                </TableCell>
                                                <TableCell>
                                                    <TextWrapTableCell width={8}>
                                                        <div
                                                            style={{
                                                                fontSize: '0.7rem',
                                                                color: '#B1A0C7',
                                                            }}
                                                        >
                                                            {v.frequency.j_2}
                                                        </div>
                                                    </TextWrapTableCell>
                                                </TableCell>
                                                <TableCell>
                                                    <TextWrapTableCell width={4}>
                                                        <div
                                                            style={{
                                                                fontSize: '0.7rem',
                                                                color:
                                                                    v.frequency.flangeUPR > 0
                                                                        ? '#FFcc22'
                                                                        : '#fff',
                                                            }}
                                                        >
                                                            {v.frequency.flangeUPR}
                                                        </div>
                                                    </TextWrapTableCell>
                                                </TableCell>
                                            </TableRow>
                                        )
                                    })}
                                </TableBody>
                            </Table>
                        </>
                    </Grid>
                </PageTypeWide>
            )}
        </>
    )
}

export default Frequency
