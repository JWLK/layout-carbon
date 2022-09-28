import React, { useState, useCallback, useEffect } from 'react'

//Current Page Parameter
import { useParams, useNavigate } from 'react-router'
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
    ObjExtreme,
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
    FileUploader,
    Tile,
} from 'carbon-components-react'

const ExLoad = () => {
    /* Param */
    const { workspace } = useParams<{ workspace?: string }>()
    let navigate = useNavigate()
    /* Localstorage */
    const keyRawData = `${workspace}-towerData`
    const keyFreqData = `${workspace}-frequencyData`
    const keyExLoadOriginData = `${workspace}-exloadOriginData`
    const keyExLoadInterpolData = `${workspace}-exloadInterpolData`
    /* SWR */
    const { data: TD, mutate } = useSWR<TWRawData>(keyRawData, fetchStore)
    const { data: FreqD, mutate: mutateFreq } = useSWR<TWFrequency[]>(keyFreqData, fetchStore)
    const { data: exLoadOriginD, mutate: mutateExLoadOrigin } = useSWR<any>(
        keyExLoadOriginData,
        fetchStore,
    )
    const { data: exLoadInterpolD, mutate: mutateExLoadInteropl } = useSWR<any>(
        keyExLoadInterpolData,
        fetchStore,
    )

    /* Loaded Initial Data for calc ExLoaded */
    const [partHeightArray, setPartHeightArray] = useState([] as any[])
    useEffect(() => {
        if (FreqD !== null && FreqD !== undefined) {
            var heightArray = [20, ...FreqD.map((v) => v.frequency.l)]
            // console.log('heightArray', heightArray)
            const heightArraySum = []
            for (var j = 1; j < heightArray.length; j++) {
                var sumOf =
                    Math.round(heightArray.slice(0, j).reduce((prev, next) => prev + next) * 1000) /
                    1000
                // console.log(j, sumOf)
                heightArraySum.push(sumOf)
            }
            setPartHeightArray(heightArraySum)
        }
    }, [FreqD])

    // useEffect(() => {
    //     console.log('partHeightArray', partHeightArray)
    // }, [partHeightArray])

    /* 1. First Origin Data file Loaded */
    const [fileLoadData, setFileLoadData] = useState([] as ObjExtreme[])
    useEffect(() => {
        if (exLoadOriginD !== null && exLoadOriginD !== undefined) {
            setFileLoadData(exLoadOriginD)
        }
    }, [exLoadOriginD])
    const onDeleteUploadFile = () => {
        setFileLoadData([] as ObjExtreme[])
        localStorage.removeItem(keyExLoadOriginData)
    }
    const uploadFile = (e: any) => {
        console.log(e.target.files[0])
        let file = e.target.files[0]
        var reader = new FileReader()
        reader.onload = (e) => {
            var fileContentArray = e.target!.result?.toString()
            var lines = fileContentArray!.split(/\r\n|\n/)
            var loadDataOriginExtreme = [] as ObjExtreme[]
            for (var i = 0, count = 0; i < lines.length - 1; i++) {
                if (i % 5 === 2) {
                    // console.log(i + ' --> ' + lines[i])
                    // Find Height
                    let start_height = lines[i].indexOf('=') + 1
                    let end_height = lines[i].indexOf('m')
                    let find_A = lines[i].indexOf('A') + 1
                    let eachHeight = parseFloat(lines[i].substring(start_height, end_height).trim())
                    let dataLine = lines[i].substring(find_A, lines[i].length).split(/\s+/g)
                    dataLine.splice(0, 1)

                    let eachData = dataLine.map((v) => parseFloat(v))
                    loadDataOriginExtreme[count] = {
                        index: count,
                        height: eachHeight,
                        mxy: eachData[0],
                        mx: eachData[1],
                        my: eachData[2],
                        mz: eachData[3],
                        fx: eachData[4],
                        fy: eachData[5],
                        fz: eachData[6],
                        sf: eachData[7],
                    }
                    count++
                }
            }
            setFileLoadData(loadDataOriginExtreme)
            // console.log(loadDataOriginExtreme)
            localStorage.setItem(keyExLoadOriginData, JSON.stringify(loadDataOriginExtreme))
            mutateExLoadOrigin()
        }

        if (file) {
            let data = new FormData()
            data.append('file', file)
            // axios.post('/files', data)...
        }
        reader.readAsText(file, /* optional */ 'euc-kr')
    }

    /* 2. Click Origin Data Veification Complete */
    const [originalDataCheck, setOriginalDataCheck] = useState(false)
    const [interpolationData, setInteropolationData] = useState([] as any[])
    // Loaded Exist Data Configure Value
    const [towerTopMass, setTowerTopMass] = useState(673052.5)
    const [mfcMaxTowerHeight, setMfcMaxTowerHeight] = useState(130) //Manufacturing imperfection & solar radiation
    const [mfcImperfectionValue, setMfcImperfectionValue] = useState(5) //Manufacturing imperfection & solar radiation
    const [unevenlySubsidenceValue, setUnevenlySubsidenceValue] = useState(3) //Unevenly subsidence of the ground
    const [rebuildExistData, setRebuildExistData] = useState([] as any[])
    const onClickOriginDataVerificationComplete = () => {
        console.log('origin Data Complete Click')
        setOriginalDataCheck(true)
        // console.log(fileLoadData)

        let rebuildArray = [] as any[]
        let rebuildPartLenghtSum = 0
        let partHeightArrayNoOffset = partHeightArray.shift()
        if (TD !== null && TD !== undefined) {
            // console.log('TD', TD.partsData)
            const partList = TD.partsData.map((partsArray, sectionNumber) => {
                let rebuildPart = [] as any[]
                let sectionIndex = sectionNumber + 1
                const partRebuild = partsArray.parts.map((partsElement, partIndex) => {
                    let returnData = null

                    if (partsArray.parts.length === 1) {
                        returnData = [
                            {
                                id: rebuildPartLenghtSum + 0,
                                section: sectionIndex,
                                heightSum: partHeightArray[rebuildPartLenghtSum + 0],
                                height:
                                    (TD.flangesData[sectionNumber].flanges[0].flange.flangeHeight +
                                        TD.flangesData[sectionNumber].flanges[0].flange
                                            .neckHeight) /
                                    1000,
                                part: 0,
                                topOutside: TD.flangesData[sectionNumber].flanges[0].flange.outDia,
                                btmOutside: TD.flangesData[sectionNumber].flanges[0].flange.outDia,
                                topInside:
                                    TD.flangesData[sectionNumber].flanges[0].flange.outDia -
                                    TD.flangesData[sectionNumber].flanges[0].flange.neckWidth * 2,
                                btmInside:
                                    TD.flangesData[sectionNumber].flanges[0].flange.outDia -
                                    TD.flangesData[sectionNumber].flanges[0].flange.neckWidth * 2,
                                weightFlange:
                                    TD.flangesData[sectionNumber].flanges[0].flangeWeight / 1000,
                            },
                            {
                                id: rebuildPartLenghtSum + partIndex + 1,
                                section: sectionIndex,
                                heightSum: partHeightArray[rebuildPartLenghtSum + partIndex + 1],
                                height: partsElement.part.height / 1000,
                                part: partIndex + 1,
                                topOutside: partsElement.part.top,
                                btmOutside: partsElement.part.bottom,
                                topInside: partsElement.part.top - partsElement.thickness * 2,
                                btmInside: partsElement.part.bottom - partsElement.thickness * 2,
                                weightFlange: 0,
                            },
                            {
                                id: rebuildPartLenghtSum + partIndex + 2,
                                section: sectionIndex,
                                heightSum: partHeightArray[rebuildPartLenghtSum + partIndex + 2],
                                height:
                                    (TD.flangesData[sectionNumber].flanges[1].flange.flangeHeight +
                                        TD.flangesData[sectionNumber].flanges[1].flange
                                            .neckHeight) /
                                    1000,
                                part: TD.partsData[sectionNumber]?.parts.length + 1,
                                topOutside: TD.flangesData[sectionNumber].flanges[1].flange.outDia,
                                btmOutside: TD.flangesData[sectionNumber].flanges[1].flange.outDia,
                                topInside:
                                    TD.flangesData[sectionNumber].flanges[1].flange.outDia -
                                    TD.flangesData[sectionNumber].flanges[1].flange.neckWidth * 2,
                                btmInside:
                                    TD.flangesData[sectionNumber].flanges[1].flange.outDia -
                                    TD.flangesData[sectionNumber].flanges[1].flange.neckWidth * 2,
                                weightFlange:
                                    TD.flangesData[sectionNumber].flanges[1].flangeWeight / 1000,
                            },
                        ]
                    } else if (partsArray.parts.length - 1 > 0 && partIndex === 0) {
                        returnData = [
                            {
                                id: rebuildPartLenghtSum + 0,
                                section: sectionIndex,
                                heightSum: partHeightArray[rebuildPartLenghtSum + 0],
                                height:
                                    (TD.flangesData[sectionNumber].flanges[0].flange.flangeHeight +
                                        TD.flangesData[sectionNumber].flanges[0].flange
                                            .neckHeight) /
                                    1000,
                                part: 0,
                                topOutside: TD.flangesData[sectionNumber].flanges[0].flange.outDia,
                                btmOutside: TD.flangesData[sectionNumber].flanges[0].flange.outDia,
                                topInside:
                                    TD.flangesData[sectionNumber].flanges[0].flange.outDia -
                                    TD.flangesData[sectionNumber].flanges[0].flange.neckWidth * 2,
                                btmInside:
                                    TD.flangesData[sectionNumber].flanges[0].flange.outDia -
                                    TD.flangesData[sectionNumber].flanges[0].flange.neckWidth * 2,
                                weightFlange:
                                    TD.flangesData[sectionNumber].flanges[0].flangeWeight / 1000,
                            },
                            {
                                id: rebuildPartLenghtSum + partIndex + 1,
                                section: sectionIndex,
                                heightSum: partHeightArray[rebuildPartLenghtSum + partIndex + 1],
                                height: partsElement.part.height / 1000,
                                part: partIndex + 1,
                                topOutside: partsElement.part.top,
                                btmOutside: partsElement.part.bottom,
                                topInside: partsElement.part.top - partsElement.thickness * 2,
                                btmInside: partsElement.part.bottom - partsElement.thickness * 2,
                                weightFlange: 0,
                            },
                        ]
                    } else if (
                        partsArray.parts.length - 1 > 0 &&
                        partIndex === partsArray.parts.length - 1
                    ) {
                        returnData = [
                            {
                                id: rebuildPartLenghtSum + 0,
                                section: sectionIndex,
                                heightSum: partHeightArray[rebuildPartLenghtSum + 0],
                                height: partsElement.part.height / 1000,
                                part: partIndex + 1,
                                topOutside: partsElement.part.top,
                                btmOutside: partsElement.part.bottom,
                                topInside: partsElement.part.top - partsElement.thickness * 2,
                                btmInside: partsElement.part.bottom - partsElement.thickness * 2,
                                weightFlange: 0,
                            },
                            {
                                id: rebuildPartLenghtSum + 1,
                                section: sectionIndex,
                                heightSum: partHeightArray[rebuildPartLenghtSum + 1],
                                height:
                                    (TD.flangesData[sectionNumber].flanges[1].flange.flangeHeight +
                                        TD.flangesData[sectionNumber].flanges[1].flange
                                            .neckHeight) /
                                    1000,
                                part: TD.partsData[sectionNumber]?.parts.length + 1,
                                topOutside: TD.flangesData[sectionNumber].flanges[1].flange.outDia,
                                btmOutside: TD.flangesData[sectionNumber].flanges[1].flange.outDia,
                                topInside:
                                    TD.flangesData[sectionNumber].flanges[1].flange.outDia -
                                    TD.flangesData[sectionNumber].flanges[1].flange.neckWidth * 2,
                                btmInside:
                                    TD.flangesData[sectionNumber].flanges[1].flange.outDia -
                                    TD.flangesData[sectionNumber].flanges[1].flange.neckWidth * 2,
                                weightFlange:
                                    TD.flangesData[sectionNumber].flanges[1].flangeWeight / 1000,
                            },
                        ]
                    } else {
                        returnData = {
                            id: rebuildPartLenghtSum + 0,
                            section: sectionIndex,
                            heightSum: partHeightArray[rebuildPartLenghtSum + 0],
                            height: partsElement.part.height / 1000,
                            part: partIndex + 1,
                            topOutside: partsElement.part.top,
                            btmOutside: partsElement.part.bottom,
                            topInside: partsElement.part.top - partsElement.thickness * 2,
                            btmInside: partsElement.part.bottom - partsElement.thickness * 2,
                            weightFlange: 0,
                        }
                    }

                    if (Array.isArray(returnData)) {
                        // console.log(...returnData)
                        rebuildPart.push(...returnData)
                        rebuildPartLenghtSum += returnData.length
                    } else {
                        // console.log(returnData)
                        rebuildPart.push(returnData)
                        rebuildPartLenghtSum += 1
                    }
                    // console.log('rebuildPartLenghtSum', rebuildPartLenghtSum)
                })
                rebuildArray.push(...rebuildPart)
            })
            rebuildArray.unshift({
                id: -1,
                section: 0,
                height: TD.initial.offset / 1000,
                heightSum: TD.initial.offset / 1000,
                part: 0,
                topOutside: rebuildArray[0].topOutside,
                btmOutside: null,
                topInside: rebuildArray[0].topInside,
                btmInside: null,
                weightFlange: 0,
            })
        }

        setRebuildExistData(rebuildArray)
        // console.log('rebuildArray', rebuildArray)
        // setRebuildExistData(rebuildArray)
        /* Load = > interpolation */
        const interpolCalcData = partHeightArray.map((partHeight, index) => {
            let interpolItem = {}
            fileLoadData.reduce((prev, next) => {
                // console.log('prev', prev.height)
                // console.log('next', next.height)
                if (partHeight >= prev.height && partHeight <= next.height) {
                    interpolItem = {
                        index: index,
                        height: partHeight,
                        mxy:
                            prev.mxy +
                            ((partHeight - prev.height) / (next.height - prev.height)) *
                                (next.mxy - prev.mxy),
                        mx:
                            prev.mx +
                            ((partHeight - prev.height) / (next.height - prev.height)) *
                                (next.mx - prev.mx),
                        my:
                            prev.my +
                            ((partHeight - prev.height) / (next.height - prev.height)) *
                                (next.my - prev.my),
                        mz:
                            prev.mz +
                            ((partHeight - prev.height) / (next.height - prev.height)) *
                                (next.mz - prev.mz),
                        fx:
                            prev.fx +
                            ((partHeight - prev.height) / (next.height - prev.height)) *
                                (next.fx - prev.fx),
                        fy:
                            prev.fy +
                            ((partHeight - prev.height) / (next.height - prev.height)) *
                                (next.fy - prev.fy),
                        fz:
                            prev.fz +
                            ((partHeight - prev.height) / (next.height - prev.height)) *
                                (next.fz - prev.fz),
                        sf:
                            prev.sf +
                            ((partHeight - prev.height) / (next.height - prev.height)) *
                                (next.sf - prev.sf),
                    }
                    // console.log('chose', [partHeight, prev, next, interpolItem])
                }
                return next
            })
            return interpolItem
        })
        // console.log('interpolCalcData', interpolCalcData)
        setInteropolationData(interpolCalcData)
    }

    //Addional Moment Colun
    interface ExternalMomentUnit {
        secion: number
        part: number
        h_dt_station: number
        cg_cf_1: number
        cg_cf_2: number
        m_cf_1: number
        m_cf_2: number
        cg_v_direction: number
        f_by_g: number
        h_dt_cg: number
        moment_addition: number
    }
    const [exMomentArray, setExMommentArray] = useState([] as ExternalMomentUnit[])

    const onClickInterpolationSettingComplete = () => {
        const newBuildData = rebuildExistData.map((part, index) => {
            let exMoment = {} as ExternalMomentUnit
            exMoment.secion = part.section
            exMoment.part = part.part
            exMoment.h_dt_station =
                (mfcImperfectionValue + unevenlySubsidenceValue) * part.heightSum

            if (rebuildExistData.length - 1 !== index) {
                exMoment.cg_cf_1 =
                    ((rebuildExistData[index + 1].height / 4) *
                        (3 * Math.pow(rebuildExistData[index + 1].topOutside / 2, 2) +
                            Math.pow(rebuildExistData[index + 1].btmOutside / 2, 2) +
                            2 *
                                (rebuildExistData[index + 1].btmOutside / 2) *
                                (rebuildExistData[index + 1].topOutside / 2))) /
                    (Math.pow(rebuildExistData[index + 1].topOutside / 2, 2) +
                        Math.pow(rebuildExistData[index + 1].btmOutside / 2, 2) +
                        ((rebuildExistData[index + 1].btmOutside / 2) *
                            rebuildExistData[index + 1].topOutside) /
                            2)
                exMoment.cg_cf_2 =
                    ((rebuildExistData[index + 1].height / 4) *
                        (3 * Math.pow(rebuildExistData[index + 1].topInside / 2, 2) +
                            Math.pow(rebuildExistData[index + 1].btmInside / 2, 2) +
                            2 *
                                (rebuildExistData[index + 1].btmInside / 2) *
                                (rebuildExistData[index + 1].topInside / 2))) /
                    (Math.pow(rebuildExistData[index + 1].topInside / 2, 2) +
                        Math.pow(rebuildExistData[index + 1].btmInside / 2, 2) +
                        ((rebuildExistData[index + 1].btmInside / 2) *
                            rebuildExistData[index + 1].topInside) /
                            2)
                exMoment.m_cf_1 =
                    ((Math.PI * rebuildExistData[index + 1].height * 1000) / 3) *
                    (Math.pow(rebuildExistData[index + 1].topOutside / 2, 2) +
                        Math.pow(rebuildExistData[index + 1].btmOutside / 2, 2) +
                        (rebuildExistData[index + 1].btmOutside / 2) *
                            (rebuildExistData[index + 1].topOutside / 2)) *
                    7.85 *
                    Math.pow(10, -6)
                exMoment.m_cf_2 =
                    -1 *
                    ((Math.PI * rebuildExistData[index + 1].height * 1000) / 3) *
                    (Math.pow(rebuildExistData[index + 1].topInside / 2, 2) +
                        Math.pow(rebuildExistData[index + 1].btmInside / 2, 2) +
                        (rebuildExistData[index + 1].btmInside / 2) *
                            (rebuildExistData[index + 1].topInside / 2)) *
                    7.85 *
                    Math.pow(10, -6)
                exMoment.cg_v_direction =
                    part.heightSum +
                    ((TD?.partsData[part.section - 1]?.divided === part.part
                        ? (rebuildExistData[index + 1]?.weightFlange +
                              (rebuildExistData[index + 2] !== undefined
                                  ? rebuildExistData[index + 2].weightFlange
                                  : 0)) *
                          rebuildExistData[index + 1].height
                        : 0) +
                        (exMoment.m_cf_1 * exMoment.cg_cf_1 + exMoment.m_cf_2 * exMoment.cg_cf_2)) /
                        ((TD?.partsData[part.section - 1]?.divided === part.part
                            ? rebuildExistData[index + 1]?.weightFlange +
                              (rebuildExistData[index + 2] !== undefined
                                  ? rebuildExistData[index + 2].weightFlange
                                  : 0)
                            : 0) +
                            (exMoment.m_cf_1 + exMoment.m_cf_2))
                exMoment.f_by_g =
                    9.810665 *
                    ((TD?.partsData[part.section - 1]?.divided === part.part
                        ? rebuildExistData[index + 1]?.weightFlange +
                          (rebuildExistData[index + 2] !== undefined
                              ? rebuildExistData[index + 2].weightFlange
                              : 0)
                        : 0) +
                        (exMoment.m_cf_1 + exMoment.m_cf_2))
            } else {
                exMoment.cg_cf_1 = 0
                exMoment.cg_cf_2 = 0
                exMoment.m_cf_1 = 0
                exMoment.m_cf_2 = 0
                exMoment.cg_v_direction = 130
                exMoment.f_by_g = 9.810665 * towerTopMass
            }
            exMoment.h_dt_cg =
                (mfcImperfectionValue + unevenlySubsidenceValue) * exMoment.cg_v_direction

            return exMoment
        })
        console.log('Rebuild ExMoment', newBuildData)
        const finalNewBuildData = newBuildData.map((v, index) => {
            const sumofArray = [] as number[]
            newBuildData.map((calcData, calcIndex) => {
                if (calcIndex >= index) {
                    // sumofArray.push(calcData.h_dt_cg * calcData.f_by_g)
                    sumofArray.push(
                        (calcData.h_dt_cg - newBuildData[index].h_dt_station) *
                            calcData.f_by_g *
                            Math.pow(10, -6),
                    )
                }
            })
            // console.log('productArray', productArray)

            const sumOfProduct = sumofArray.reduce((prev, crrt, sumOfIndex) => {
                // console.log('prev + crrt', `${index} - ${prev + crrt}`)
                return prev + crrt
            }, 0)

            // console.log(`sumOfProduct - ${index}`, sumOfProduct)
            v.moment_addition = sumOfProduct
            return v
        })
        console.log('Final ExMoment', finalNewBuildData)
        setExMommentArray(finalNewBuildData)
    }

    useEffect(() => {
        console.log('rebuildExistData', rebuildExistData)
    }, [rebuildExistData])

    /*Table Parameter*/
    const ExtremeLoadHeader = [
        'Index',
        'Height',
        'Mxy',
        'Mx',
        'My',
        'Mz',
        'Fx',
        'Fy',
        'Fz',
        'Safety Factor',
    ] as String[]

    /*Table Parameter*/
    const ExtremeConvertHeader = [
        'Index',
        'h_dt_station',
        'cg_cf_1',
        'cg_cf_2',
        'm_cf_1',
        'm_cf_2',
        'cg_v_direction',
        'f_by_g',
        'h_dt_cg',
        'moment_addition',
    ] as String[]
    return (
        <>
            <PageTypeWide>
                <Grid fullWidth>
                    <Row>
                        <Column sm={2} md={6} lg={10}>
                            <Header>
                                Extreme Load Setting
                                <p>Tower station loads with safety factor.</p>
                            </Header>
                        </Column>
                        {/* <Column sm={2} md={2} lg={2}>
                            <br />
                            <br />
                            <br />
                            <Button kind="tertiary" renderIcon={Fade32}>
                                Upload
                                <br /> Extreme Loads Data
                            </Button>
                        </Column> */}
                    </Row>
                    <SectionDivider />
                    <Section>
                        {/* <Row as="article" narrow>
                            <Column sm={4} md={8} lg={6} style={{ marginBlock: '0.5rem' }}>
                                Project Components
                            </Column>
                        </Row> */}
                        <h3>1. Upload Data from Load Team</h3>
                        <FileUploader
                            onChange={uploadFile}
                            accept={['.txt']}
                            buttonKind="primary"
                            buttonLabel="Add Extreme Load Data"
                            filenameStatus="edit"
                            iconDescription="Clear file"
                            labelDescription="only .txt files"
                            labelTitle="Upload"
                            onDelete={() => onDeleteUploadFile()}
                        />
                        <InputDivider />
                        <h3>2. Data conversion</h3>
                        <Row>
                            <Column sm={2} md={6} lg={10}>
                                <Accordion align="start">
                                    <AccordionItem
                                        title={
                                            fileLoadData.length
                                                ? `Original Data`
                                                : `Please Upload File`
                                        }
                                        disabled={fileLoadData.length ? false : true}
                                    >
                                        {fileLoadData.length && (
                                            <Table size="sm">
                                                <TableHead>
                                                    <TableRow>
                                                        {ExtremeLoadHeader.map((v, index) => {
                                                            return (
                                                                <TableHeader
                                                                    key={`extreme-header-${index}`}
                                                                >
                                                                    <div
                                                                        style={{
                                                                            color: '#fff',
                                                                            marginLeft: '0px',
                                                                        }}
                                                                    >
                                                                        {v}
                                                                    </div>
                                                                </TableHeader>
                                                            )
                                                        })}
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {fileLoadData.map((v, index) => {
                                                        return (
                                                            <TableRow key={`extreme-body-${index}`}>
                                                                <TableCell>{index + 1}</TableCell>
                                                                <TableCell>{v.height}</TableCell>
                                                                <TableCell>{v.mxy}</TableCell>
                                                                <TableCell>{v.mx}</TableCell>
                                                                <TableCell>{v.my}</TableCell>
                                                                <TableCell>{v.mz}</TableCell>
                                                                <TableCell>{v.fx}</TableCell>
                                                                <TableCell>{v.fy}</TableCell>
                                                                <TableCell>{v.fz}</TableCell>
                                                                <TableCell>{v.sf}</TableCell>
                                                            </TableRow>
                                                        )
                                                    })}
                                                </TableBody>
                                            </Table>
                                        )}
                                    </AccordionItem>
                                </Accordion>
                            </Column>
                            <Column sm={2} md={2} lg={2}>
                                {fileLoadData.length > 0 && (
                                    <Button
                                        kind="tertiary"
                                        renderIcon={Fade32}
                                        onClick={() => onClickOriginDataVerificationComplete()}
                                    >
                                        Original data verification complete.
                                    </Button>
                                )}
                            </Column>
                        </Row>
                        <InputDivider />
                        {interpolationData.length > 0 && (
                            <Row>
                                <Column sm={2} md={6} lg={10}>
                                    <Accordion align="start">
                                        <AccordionItem
                                            title={
                                                originalDataCheck
                                                    ? `Interpolation setting`
                                                    : `Interpolation setting disabled. Please, Check original data and Click the verification complete button.`
                                            }
                                            disabled={!originalDataCheck}
                                        >
                                            {interpolationData.length && (
                                                <Table size="sm">
                                                    <TableHead>
                                                        <TableRow>
                                                            {ExtremeLoadHeader.map((v, index) => {
                                                                return (
                                                                    <TableHeader
                                                                        key={`extreme-header-${index}`}
                                                                    >
                                                                        <div
                                                                            style={{
                                                                                color: '#fff',
                                                                                marginLeft: '0px',
                                                                            }}
                                                                        >
                                                                            {v}
                                                                        </div>
                                                                    </TableHeader>
                                                                )
                                                            })}
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {interpolationData.map((v, index) => {
                                                            return (
                                                                <TableRow
                                                                    key={`extreme-body-${index}`}
                                                                >
                                                                    <TableCell>
                                                                        {index + 1}
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        {v.height}
                                                                    </TableCell>
                                                                    <TableCell>{v.mxy}</TableCell>
                                                                    <TableCell>{v.mx}</TableCell>
                                                                    <TableCell>{v.my}</TableCell>
                                                                    <TableCell>{v.mz}</TableCell>
                                                                    <TableCell>{v.fx}</TableCell>
                                                                    <TableCell>{v.fy}</TableCell>
                                                                    <TableCell>{v.fz}</TableCell>
                                                                    <TableCell>{v.sf}</TableCell>
                                                                </TableRow>
                                                            )
                                                        })}
                                                    </TableBody>
                                                </Table>
                                            )}
                                        </AccordionItem>
                                    </Accordion>
                                </Column>
                                <Column sm={2} md={2} lg={2}>
                                    {interpolationData.length > 0 && (
                                        <Button
                                            kind="tertiary"
                                            renderIcon={Fade32}
                                            disabled={!originalDataCheck}
                                            onClick={() => onClickInterpolationSettingComplete()}
                                        >
                                            Interpolation setting complete.
                                        </Button>
                                    )}
                                </Column>
                            </Row>
                        )}

                        <InputDivider />
                        {exMomentArray.length > 0 && (
                            <Row>
                                <Column sm={2} md={6} lg={10}>
                                    <Accordion align="start">
                                        <AccordionItem title={`Additional Moment`}>
                                            {exMomentArray.length && (
                                                <Table size="sm">
                                                    <TableHead>
                                                        <TableRow>
                                                            {ExtremeConvertHeader.map(
                                                                (v, index) => {
                                                                    return (
                                                                        <TableHeader
                                                                            key={`extreme-header-convert-${index}`}
                                                                        >
                                                                            <div
                                                                                style={{
                                                                                    color: '#fff',
                                                                                    marginLeft:
                                                                                        '0px',
                                                                                }}
                                                                            >
                                                                                {v}
                                                                            </div>
                                                                        </TableHeader>
                                                                    )
                                                                },
                                                            )}
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {exMomentArray.map((v, index) => {
                                                            return (
                                                                <TableRow
                                                                    key={`extreme-body-convert-${index}`}
                                                                >
                                                                    <TableCell>
                                                                        {index + 1}
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        {v.h_dt_station}
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        {v.cg_cf_1}
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        {v.cg_cf_2}
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        {v.m_cf_1}
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        {v.m_cf_2}
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        {v.cg_v_direction}
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        {v.f_by_g}
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        {v.h_dt_cg}
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        {v.moment_addition}
                                                                    </TableCell>
                                                                </TableRow>
                                                            )
                                                        })}
                                                    </TableBody>
                                                </Table>
                                            )}
                                        </AccordionItem>
                                    </Accordion>
                                </Column>
                                <Column sm={2} md={2} lg={2}>
                                    {interpolationData.length > 0 && (
                                        <Button
                                            kind="tertiary"
                                            renderIcon={Fade32}
                                            disabled={!originalDataCheck}
                                            onClick={() => onClickInterpolationSettingComplete()}
                                        >
                                            Interpolation setting complete.
                                        </Button>
                                    )}
                                </Column>
                            </Row>
                        )}
                    </Section>
                </Grid>
            </PageTypeWide>
        </>
    )
}

export default ExLoad
