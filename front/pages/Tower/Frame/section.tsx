import React, { useState, useCallback, useEffect } from 'react'
import { NavLinkProps, NavLink } from 'react-router-dom'

//Current Page Parameter
import { useParams } from 'react-router'
//Request
import useSWR from 'swr'
import fetchStore from '@utils/store'

/* Component */
import MfrTableDefault from '@components/Tower/MfrTable/ViewDefault'
import MfrTableSelected from '@components/Tower/MfrTable/ViewSelected'

/* Table Init Data */
import { rowsInit } from '@components/Tower/MfrTable/mfr-data'

/* @objects/Data */
import { RawData, InitSector } from '@objects/Data/InitValue'
/* @objects/Tools */
import { toRadian, toAngle } from '@objects/Tools/Cartesian'
/* @objects/Element */
import VOTower from '@objects/Tower/Body/VOTower'
import VOSection from '@objects/Tower/Body/VOSection'
import VHFlange from '@objects/Tower/Body/VHFlange'

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
    TWFlange,
    TWFlanges,
    ObjFlange,
    TWSectors,
    ObjSector,
    TWSector,
} from '@typings/object'

//CSS
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
    GraphicWrapHarf,
    SettingViewWideInner,
} from '@pages/Tower/Frame/styles'
import {
    Fade32,
    ArrowUp32,
    ArrowDown32,
    ArrowLeft32,
    ArrowRight32,
    Save32,
    CheckmarkOutline32,
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
    ProgressIndicator,
    ProgressStep,
} from 'carbon-components-react'

const Frame = () => {
    /* Param */
    const { workspace } = useParams<{ workspace?: string }>()
    /* Localstorage */
    const keyRawData = `${workspace}-towerData`
    const keyCapData = `${workspace}-mfrData`
    if (localStorage.getItem(keyRawData) === null) {
        localStorage.setItem(keyRawData, JSON.stringify(RawData))
    }
    if (localStorage.getItem(keyCapData) === null) {
        localStorage.setItem(keyCapData, JSON.stringify(rowsInit))
    }
    /* SWR */
    const { data: TD, mutate } = useSWR<TWRawData>(keyRawData, fetchStore)
    const { data: MfrD, mutate: mutateMfr } = useSWR<dataListMfr>(keyCapData, fetchStore)

    /*
     ** localStorage & SWR Data Sync useState
     */
    const [rawData, setRawData] = useState({} as TWRawData)
    const [initData, setInitData] = useState({} as TWInitialValue)
    const [sectionData, setSectionData] = useState([] as TWSection[])
    const [partsData, setPartsData] = useState([] as TWParts[])
    const [flangesData, setFlangesData] = useState([] as TWFlanges[])
    const [sectorsData, setSectorsData] = useState([] as TWSectors[])

    /* Current Page Mode Swicher */
    const [modeSwicher, setModeSwicher] = useState('part')
    const onChangeModeSwitcher = useCallback((e) => {
        setModeSwicher(e.name)
    }, [])

    /* STEP 0 - All Position */
    /* Section Parameter : Current(Selected) Section Index State */
    const [currentSectionIndex, setCurrentSectionIndex] = useState(0)
    const onChangeSectionIndex = useCallback(
        (value) => {
            setCurrentSectionIndex(value)
            /* Link to Section Index */
            setDivided(partsData[value].divided)
        },
        [partsData],
    )

    /* STEP 1 - Mass Check */
    /* Section Parameter : Each Section Mass Setting value */
    const [totalThickness, setTotalThickness] = useState(50)
    const onChangeTotalThickness = useCallback(
        (e) => {
            console.log('onChangeTotalThickness')
            const valueNumber = parseInt(e.value)
            var partObject = [] as TWPart[]
            var flangeObject = [] as TWFlange[]
            setTotalThickness(valueNumber)
            //Set each part -> thickness
            partObject = partsData[currentSectionIndex].parts.map((v) => {
                v.thickness = valueNumber
                return v
            })
            //Set each Flange -> neckWidth
            flangeObject = flangesData[currentSectionIndex].flanges.map((v) => {
                v.flange.neckWidth = valueNumber
                v.flange.pcDia = v.flange.outDia - 2 * valueNumber - 2 * v.flange.minScrewWidth
                v.flange.param_a = (v.flange.pcDia - v.flange.inDia) / 2
                v.flange.param_b = (v.flange.outDia - valueNumber - v.flange.pcDia) / 2
                var flangeWithNeckOutsideMass = Math.abs(
                    ((Math.pow(v.flange.outDia, 2) -
                        Math.pow(v.flange.outDia - 2 * valueNumber, 2) +
                        Math.pow(v.flange.outDia, 2) -
                        Math.pow(v.flange.outDia - 2 * valueNumber, 2) +
                        v.flange.outDia * v.flange.outDia -
                        (v.flange.outDia - 2 * valueNumber) * (v.flange.outDia - 2 * valueNumber)) *
                        Math.PI *
                        (v.flange.flangeHeight + v.flange.neckHeight) *
                        1000 *
                        7.85 *
                        Math.pow(10, -6)) /
                        12,
                )
                var flangeBodyInnerMass = Math.abs(
                    ((Math.pow(v.flange.outDia - 2 * valueNumber, 2) -
                        Math.pow(v.flange.inDia, 2)) *
                        Math.PI *
                        v.flange.flangeHeight *
                        1000 *
                        7.85 *
                        Math.pow(10, -6)) /
                        4,
                )
                v.weight = flangeWithNeckOutsideMass + flangeBodyInnerMass
                return v
            })

            //Set RawData Sync
            rawData.partsData[currentSectionIndex].parts = partObject
            rawData.flangesData[currentSectionIndex].flanges = flangeObject
            localStorage.setItem(keyRawData, JSON.stringify(rawData))
        },
        [partsData, currentSectionIndex, flangesData, rawData, keyRawData],
    )

    // Section Body Mass Parameter Calc
    const [checkBodyHeight, setCheckBodyHeight] = useState(0)
    const [checkDiaOutUPR, setCheckDiaOutUPR] = useState(0)
    const [checkDiaInUPR, setCheckDiaInUPR] = useState(0)
    const [checkDiaOutLWR, setCheckDiaOutLWR] = useState(0)
    const [checkDiaInLWR, setCheckDiaInLWR] = useState(0)
    const [checkBodyMass, setCheckBodyMass] = useState(0)
    useEffect(() => {
        if (sectionData.length && partsData.length && flangesData.length) {
            var bodyHeight =
                sectionData[currentSectionIndex].section.height -
                flangesData[currentSectionIndex].flanges[0].flange.flangeHeight -
                flangesData[currentSectionIndex].flanges[0].flange.neckHeight -
                flangesData[currentSectionIndex].flanges[1].flange.flangeHeight -
                flangesData[currentSectionIndex].flanges[1].flange.neckHeight
            setCheckBodyHeight(bodyHeight)
            var diaOutUPR = sectionData[currentSectionIndex].section.top
            var diaInUPR = sectionData[currentSectionIndex].section.top - 2 * totalThickness
            var diaOutLWR = sectionData[currentSectionIndex].section.bottom
            var diaInLWR = sectionData[currentSectionIndex].section.bottom - 2 * totalThickness
            setCheckDiaOutUPR(diaOutUPR)
            setCheckDiaInUPR(diaInUPR)
            setCheckDiaOutLWR(diaOutLWR)
            setCheckDiaInLWR(diaInLWR)
            var bodyMass = Math.abs(
                ((Math.pow(diaOutUPR, 2) -
                    Math.pow(diaInUPR, 2) +
                    (Math.pow(diaOutLWR, 2) - Math.pow(diaInLWR, 2)) +
                    diaOutUPR * diaOutLWR -
                    diaInUPR * diaInLWR) *
                    Math.PI *
                    bodyHeight *
                    1000 *
                    7.85 *
                    Math.pow(10, -6)) /
                    12,
            )
            setCheckBodyMass(bodyMass / 1000)
        }
    }, [
        TD,
        currentSectionIndex,
        flangesData,
        keyRawData,
        partsData,
        rawData,
        sectionData,
        totalThickness,
    ])

    /* STEP 2 - Each Section -> Part & Each Part Value Check */
    /* Part Parameter */
    const [currentPartIndex, setCurrentPartIndex] = useState(0)
    const [divided, setDivided] = useState(1) // part divided
    const onChangePartIndex = useCallback((value) => {
        setCurrentPartIndex(value)
        /* Link to Part Index */
    }, [])
    const onChangeDevided = useCallback((e) => {
        setDivided(e.value)
    }, [])

    //
    /* Table onChange Flange Init data */
    //
    type typeObjFlange =
        | 'outDia'
        | 'inDia'
        | 'flangeWidth'
        | 'flangeHeight'
        | 'neckWidth'
        | 'neckHeight'
        | 'minScrewWidth'
        | 'pcDia'
        | 'param_a'
        | 'param_b'
        | 'screwNumberOf'
    const onChangeFlnageData = useCallback(
        (e, selectedIndex) => {
            // console.log(e.target.name, selectedIndex, currentSectionIndex)
            // console.log('flangeData', flangesData[currentSectionIndex])
            const flanges = flangesData[currentSectionIndex].flanges.map((v, index) => {
                const typeObject: typeObjFlange = e.target.name
                if (index === selectedIndex) {
                    v.flange[`${typeObject}`] = parseInt(e.target.value !== '' ? e.target.value : 0)
                    if (typeObject == 'neckWidth') {
                        v.flange.pcDia =
                            v.flange.outDia -
                            2 * parseInt(e.target.value !== '' ? e.target.value : 0) -
                            2 * v.flange.minScrewWidth
                        v.flange.param_a = (v.flange.pcDia - v.flange.inDia) / 2
                        v.flange.param_b =
                            (v.flange.outDia - v.flange.neckWidth - v.flange.pcDia) / 2
                    } else if (typeObject == 'minScrewWidth') {
                        v.flange.pcDia =
                            v.flange.outDia -
                            2 * v.flange.neckWidth -
                            2 * parseInt(e.target.value !== '' ? e.target.value : 0)
                        v.flange.param_a = (v.flange.pcDia - v.flange.inDia) / 2
                        v.flange.param_b =
                            (v.flange.outDia - v.flange.neckWidth - v.flange.pcDia) / 2
                    } else if (typeObject == 'flangeWidth') {
                        v.flange.inDia = v.flange.outDia - v.flange.flangeWidth * 2
                        v.flange.param_a = (v.flange.pcDia - v.flange.inDia) / 2
                    }
                    var flangeWithNeckOutsideMass = Math.abs(
                        ((Math.pow(v.flange.outDia, 2) -
                            Math.pow(v.flange.outDia - 2 * v.flange.neckWidth, 2) +
                            Math.pow(v.flange.outDia, 2) -
                            Math.pow(v.flange.outDia - 2 * v.flange.neckWidth, 2) +
                            v.flange.outDia * v.flange.outDia -
                            (v.flange.outDia - 2 * v.flange.neckWidth) *
                                (v.flange.outDia - 2 * v.flange.neckWidth)) *
                            Math.PI *
                            (v.flange.flangeHeight + v.flange.neckHeight) *
                            1000 *
                            7.85 *
                            Math.pow(10, -6)) /
                            12,
                    )
                    var flangeBodyInnerMass = Math.abs(
                        ((Math.pow(v.flange.outDia - 2 * v.flange.neckWidth, 2) -
                            Math.pow(v.flange.inDia, 2)) *
                            Math.PI *
                            v.flange.flangeHeight *
                            1000 *
                            7.85 *
                            Math.pow(10, -6)) /
                            4,
                    )
                    v.weight = flangeWithNeckOutsideMass + flangeBodyInnerMass
                }
                return v
            })
            console.log('flanges', flanges)

            rawData.flangesData[currentSectionIndex].flanges = flanges
            localStorage.setItem(keyRawData, JSON.stringify(rawData))
            // localStorage.setItem(
            //     keyRawData,
            //     JSON.stringify(updateRawDatadSyncWithFlange(flange, selectedIndex)),
            // )
            mutate()
        },
        [currentSectionIndex, flangesData, keyRawData, rawData],
    )

    const updateRawDatadSyncWithFlange = (flanges: TWFlange[], flangeIndex: number) => {
        //Out Diameter => part
        // partsData[currentSectionIndex].parts[0].part.bottom = flanges[0].outDia
        // partsData[currentSectionIndex].parts[partsData.length - 1].part.top = flanges[1].outDia
        partsData[currentSectionIndex].parts[0].thickness = flanges[flangeIndex].flange.neckWidth
        // partsData[currentSectionIndex].parts[partsData.length - 1].thickness = flanges[1].neckWidth

        rawData.initial = initData
        rawData.sectionData = sectionData
        rawData.partsData[currentSectionIndex] = partsData[currentSectionIndex]
        rawData.flangesData[currentSectionIndex].flanges = flanges

        return rawData
    }

    const onClickSetPartsData = useCallback(
        (e) => {
            e.preventDefault()
            setCurrentPartIndex(0)
            var partArray = [] as TWPart[]
            var sectorArray = [] as TWSector[]
            var flangeArray = {} as TWFlanges
            // var totalHeight = sectionData[currentSectionIndex].section.height

            var totalHeight = checkBodyHeight
            var topUpperOutDia = sectionData[currentSectionIndex].section.top
            var bottomLowerOutDia = sectionData[currentSectionIndex].section.bottom

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
                var sectoinWeight = Math.abs(
                    ((Math.pow(sectionWidthTop, 2) -
                        Math.pow(sectionWidthTop - 2 * totalThickness, 2) +
                        Math.pow(sectionWidthBottom, 2) -
                        Math.pow(sectionWidthBottom - 2 * totalThickness, 2) +
                        sectionWidthTop * sectionWidthBottom -
                        (sectionWidthTop - 2 * totalThickness) *
                            (sectionWidthBottom - 2 * totalThickness)) *
                        Math.PI *
                        eachHeight *
                        1000 *
                        7.85 *
                        Math.pow(10, -6)) /
                        12,
                )

                //Inser Reverse
                partArray[divided - 1 - i] = {
                    index: i,
                    part: {
                        top: sectionWidthTop,
                        bottom: sectionWidthBottom,
                        height: eachHeight,
                    },
                    thickness: totalThickness,
                    weight: sectoinWeight,
                }
            }

            rawData.partsData[currentSectionIndex].divided = divided
            rawData.partsData[currentSectionIndex].parts = partArray
            // rawData.sectorsData[currentSectionIndex].sectors = sectorArray
            // rawData.flangesData[currentSectionIndex] = flangeArray
            localStorage.setItem(keyRawData, JSON.stringify(rawData))

            //개별 업데이터
            // setRawData(rawData)
            // setSectionData(sectionsObject)

            //한번에 업데이터
            mutate()
        },
        [
            checkBodyHeight,
            sectionData,
            currentSectionIndex,
            divided,
            rawData,
            keyRawData,
            totalThickness,
        ],
    )

    //
    /* Table onChange Each Part data */
    //
    type typeObjSquare = 'top' | 'bottom' | 'height' | 'thickness'
    const onChangePartsData = useCallback(
        (e, selectedIndex) => {
            console.log(e.target.name, selectedIndex)
            const parts = partsData[currentSectionIndex].parts.map((v, index) => {
                const typeObject: typeObjSquare = e.target.name
                if (index === selectedIndex) {
                    if (typeObject !== 'thickness') {
                        v.part[`${typeObject}`] = parseInt(
                            e.target.value !== '' ? e.target.value : 0,
                        )
                    } else {
                        v.thickness = parseInt(e.target.value !== '' ? e.target.value : 0)
                    }
                    var bodyMass = Math.abs(
                        ((Math.pow(v.part.top, 2) -
                            Math.pow(v.part.top - 2 * v.thickness, 2) +
                            Math.pow(v.part.bottom, 2) -
                            Math.pow(v.part.bottom - 2 * v.thickness, 2) +
                            v.part.top * v.part.bottom -
                            (v.part.top - 2 * v.thickness) * (v.part.bottom - 2 * v.thickness)) *
                            Math.PI *
                            v.part.height *
                            1000 *
                            7.85 *
                            Math.pow(10, -6)) /
                            12,
                    )
                    v.weight = bodyMass
                }

                return v
            })

            // const updateInitial = updateInitialSync(section)
            // const updateParts = updatePartsTaperedSync(section)
            // localStorage.setItem(keyRawData, JSON.stringify(updateRawDatadSyncWithParts(parts)))
            rawData.partsData[currentSectionIndex].parts = parts
            localStorage.setItem(keyRawData, JSON.stringify(rawData))
            mutate()
        },
        [currentSectionIndex, keyRawData, partsData, rawData],
    )

    const updateRawDatadSyncWithParts = (parts: TWPart[]) => {
        var totalHeight = 0
        var sectionHeight = 0

        for (var i = 0; i < partsData[currentSectionIndex].parts.length; i++) {
            sectionHeight += partsData[currentSectionIndex].parts[i].part.height
        }
        sectionData[currentSectionIndex].section.height = sectionHeight

        for (var l = 0; l < sectionData.length; l++) {
            totalHeight += sectionData[l].section.height
        }
        initData.totalHeight = totalHeight

        rawData.initial = initData
        rawData.sectionData = sectionData
        rawData.partsData[currentSectionIndex].parts = parts

        // rawData.sectorsData[currentSectionIndex].sectors[currentPartIndex].sector =
        //     sectorObjectUpdate(
        //         parts[currentPartIndex].part.top,
        //         parts[currentPartIndex].part.bottom,
        //         parts[currentPartIndex].part.height,
        //     )

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
            //SectionData
            setSectionData(TD.sectionData)
            //PartsData
            setPartsData(TD.partsData)
            //Section & Parts
            setDivided(TD.partsData[currentSectionIndex].divided)

            //SectorsData
            setSectorsData(TD.sectorsData)
            //FlangesData
            setFlangesData(TD.flangesData)

            // setThinckness(TD.partsData[currentSectionIndex].parts[currentPartIndex].thickness)
        }
    }, [TD])

    if (TD === undefined || MfrD === undefined) {
        return <div>Loading...</div>
    }

    return (
        <>
            {partsData.length && flangesData.length && (
                <FlexWrap>
                    <GraphicWrap>
                        <GraphicViewOrigin>
                            {partsData.length && (
                                <VOSection
                                    draws={partsData[currentSectionIndex].parts.map((v) => v.part)}
                                    currentIndex={currentPartIndex}
                                    setCurrentIndex={setCurrentPartIndex}
                                    label={`Section ${sectionData.length - currentSectionIndex}`}
                                />
                            )}
                        </GraphicViewOrigin>
                    </GraphicWrap>

                    <SettingWrap>
                        {/* 
                            Production Capcity
                        */}
                        <SettingViewWide>
                            <Accordion align="start">
                                <AccordionItemCustom title="Capacity Setting">
                                    <div style={{ marginTop: '10px', fontSize: '1.2rem' }}>
                                        Production Capcity
                                    </div>
                                    <MfrTableDefault />
                                    <div style={{ marginTop: '30px', fontSize: '1.2rem' }}>
                                        Selected Manufacturer List
                                    </div>
                                    <MfrTableSelected />
                                </AccordionItemCustom>
                            </Accordion>
                        </SettingViewWide>

                        <SettingViewFit>
                            {/*  */}
                            {/*  */}
                            {/* Section Progress & Change Zone*/}
                            {/*  */}
                            {/*  */}
                            <ProgressIndicator
                                currentIndex={currentSectionIndex}
                                onChange={onChangeSectionIndex}
                            >
                                {partsData.map((v, index) => (
                                    <ProgressStep label={`SECTION ${sectionData.length - index}`} />
                                ))}
                            </ProgressIndicator>
                            <SectionDivider />
                            {/* 
                                STEP 1 - 1 : Section Mass Check
                            */}
                            <>
                                <SettingTitle>
                                    {`Section ${currentSectionIndex + 1} - Mass Capacity Check`}
                                    <div style={{ float: 'right', paddingBottom: '100px' }}>
                                        {currentSectionIndex !== 0 && (
                                            <Button
                                                kind="tertiary"
                                                renderIcon={ArrowLeft32}
                                                hasIconOnly={true}
                                                iconDescription="Previous"
                                                onClick={() =>
                                                    setCurrentSectionIndex(currentSectionIndex - 1)
                                                }
                                            />
                                        )}

                                        <Button
                                            kind="tertiary"
                                            renderIcon={ArrowRight32}
                                            disabled={!true}
                                            onClick={() =>
                                                setCurrentSectionIndex(currentSectionIndex + 1)
                                            }
                                        >
                                            NEXT
                                        </Button>
                                    </div>
                                </SettingTitle>
                                {/* {!validInitialData && (
                                    <div style={{ width: '100%', color: '#fa4d56' }}>
                                        Invalid Value Exist. Check input value
                                    </div>
                                )} */}
                                <SectionDivider />
                                <InputLabel style={{ color: '#ff00ff' }}>
                                    All thickness control (mm)
                                </InputLabel>
                                <SliderCustom>
                                    <Slider
                                        id="Slider_totalThickness"
                                        labelText=""
                                        min={10}
                                        max={100}
                                        step={1}
                                        value={totalThickness}
                                        onChange={onChangeTotalThickness}
                                    />
                                </SliderCustom>

                                <SectionDivider />
                                <InputLabel>Section Body Mass Check</InputLabel>
                                <Table size="lg">
                                    <TableHead>
                                        <TableRow>
                                            <TableHeader>
                                                <div style={{ color: '#fff', marginLeft: '0px' }}>
                                                    Type
                                                </div>
                                            </TableHeader>
                                            <TableHeader>
                                                <div style={{ color: '#fff', marginLeft: '0px' }}>
                                                    Length
                                                </div>
                                            </TableHeader>
                                            <TableHeader>
                                                <div style={{ color: '#fff', marginLeft: '0px' }}>
                                                    Out,i_UPR
                                                </div>
                                            </TableHeader>
                                            <TableHeader>
                                                <div style={{ color: '#fff', marginLeft: '0px' }}>
                                                    In,i_UPR
                                                </div>
                                            </TableHeader>
                                            <TableHeader>
                                                <div style={{ color: '#fff', marginLeft: '0px' }}>
                                                    Out,i_LWR
                                                </div>
                                            </TableHeader>
                                            <TableHeader>
                                                <div style={{ color: '#fff', marginLeft: '0px' }}>
                                                    In,i_LWR
                                                </div>
                                            </TableHeader>
                                            <TableHeader>
                                                <div style={{ color: '#fff', marginLeft: '0px' }}>
                                                    Thickness
                                                </div>
                                            </TableHeader>
                                            <TableHeader>
                                                <div style={{ marginLeft: '0px' }}>
                                                    Weight of Section (Kg)
                                                </div>
                                            </TableHeader>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {/* Tower Parts */}
                                        <TableRow>
                                            <TableCell>
                                                <TextWrapTableCell width={2}>
                                                    <div
                                                        style={{
                                                            fontSize: '0.7rem',
                                                            color: '#fff',
                                                        }}
                                                    >
                                                        Part 1
                                                    </div>
                                                </TextWrapTableCell>
                                            </TableCell>
                                            <TableCell>
                                                <TextWrapTableCell width={3}>
                                                    <div style={{ color: '#ffff00' }}>
                                                        {checkBodyHeight}
                                                    </div>
                                                </TextWrapTableCell>
                                            </TableCell>
                                            <TableCell>
                                                <TextWrapTableCell width={3}>
                                                    <div style={{ color: '#42be65' }}>
                                                        {checkDiaOutUPR}
                                                    </div>
                                                </TextWrapTableCell>
                                            </TableCell>
                                            <TableCell>
                                                <TextWrapTableCell width={3}>
                                                    <div style={{ color: '#fff' }}>
                                                        {checkDiaInUPR}
                                                    </div>
                                                </TextWrapTableCell>
                                            </TableCell>
                                            <TableCell>
                                                <TextWrapTableCell width={3}>
                                                    <div style={{ color: '#be95ff' }}>
                                                        {checkDiaOutLWR}
                                                    </div>
                                                </TextWrapTableCell>
                                            </TableCell>
                                            <TableCell>
                                                <TextWrapTableCell width={3}>
                                                    <div style={{ color: '#fff' }}>
                                                        {checkDiaInLWR}
                                                    </div>
                                                </TextWrapTableCell>
                                            </TableCell>
                                            <TableCell>
                                                <TextWrapTableCell width={3}>
                                                    <div style={{ color: '#ff00ff' }}>
                                                        {totalThickness}
                                                    </div>
                                                </TextWrapTableCell>
                                            </TableCell>
                                            <TableCell>
                                                <TextWrapTableCell width={3}>
                                                    <div style={{ color: '#fff' }}>
                                                        {Math.round(checkBodyMass * 1000) / 1000}
                                                    </div>
                                                </TextWrapTableCell>
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </>
                            <br />
                            {/* 
                                STEP 1 - 2 : Flange Mass Check
                            */}
                            <>
                                <InputLabel>Flange Mass Check</InputLabel>
                                <Table size="lg">
                                    <TableHead>
                                        <TableRow>
                                            <TableHeader>
                                                <div
                                                    style={{
                                                        fontSize: '0.7rem',
                                                        color: '#eee',
                                                        marginLeft: '0px',
                                                    }}
                                                >
                                                    Type
                                                </div>
                                            </TableHeader>
                                            <TableHeader>
                                                <div
                                                    style={{
                                                        color: '#fff',
                                                        fontSize: '0.7rem',
                                                        marginLeft: '0px',
                                                    }}
                                                >
                                                    Out Dia <br />
                                                    dₒ
                                                </div>
                                            </TableHeader>
                                            <TableHeader>
                                                <div
                                                    style={{
                                                        color: '#fff',
                                                        fontSize: '0.7rem',
                                                        marginLeft: '0px',
                                                    }}
                                                >
                                                    In Dia <br />
                                                    dᵢ
                                                </div>
                                            </TableHeader>
                                            <TableHeader>
                                                <div
                                                    style={{
                                                        color: '#fff',
                                                        fontSize: '0.7rem',
                                                        marginLeft: '0px',
                                                    }}
                                                >
                                                    Flange Width
                                                    <br /> b_fi
                                                </div>
                                            </TableHeader>
                                            <TableHeader>
                                                <div
                                                    style={{
                                                        color: '#fff',
                                                        fontSize: '0.7rem',
                                                        marginLeft: '0px',
                                                    }}
                                                >
                                                    Flange Height
                                                    <br /> t_fi
                                                </div>
                                            </TableHeader>
                                            <TableHeader>
                                                <div
                                                    style={{
                                                        color: '#fff',
                                                        fontSize: '0.7rem',
                                                        marginLeft: '0px',
                                                    }}
                                                >
                                                    Neck Height
                                                    <br /> tₜ
                                                </div>
                                            </TableHeader>
                                            <TableHeader>
                                                <div
                                                    style={{
                                                        color: '#fff',
                                                        fontSize: '0.7rem',
                                                        marginLeft: '0px',
                                                    }}
                                                >
                                                    Total Length
                                                </div>
                                            </TableHeader>
                                            <TableHeader>
                                                <div
                                                    style={{
                                                        color: '#fff',
                                                        fontSize: '0.7rem',
                                                        marginLeft: '0px',
                                                    }}
                                                >
                                                    Neck Thickness
                                                    <br /> tₛ
                                                </div>
                                            </TableHeader>
                                            <TableHeader>
                                                <div
                                                    style={{
                                                        fontSize: '0.7rem',
                                                        marginLeft: '0px',
                                                    }}
                                                >
                                                    Weight of Flange (Kg)
                                                </div>
                                            </TableHeader>
                                        </TableRow>
                                    </TableHead>

                                    <TableBody>
                                        {/* Upper */}
                                        <TableRow>
                                            <TableCell>
                                                <TextWrapTableCell width={2}>
                                                    <div
                                                        style={{
                                                            fontSize: '0.7rem',
                                                            color: '#ED6E46',
                                                        }}
                                                    >
                                                        Upper
                                                    </div>
                                                </TextWrapTableCell>
                                            </TableCell>
                                            <TableCell>
                                                <TextWrapTableCell width={2}>
                                                    <div style={{ color: '#42be65' }}>
                                                        {
                                                            flangesData[currentSectionIndex]
                                                                .flanges[1].flange.outDia
                                                        }
                                                    </div>
                                                </TextWrapTableCell>
                                            </TableCell>
                                            <TableCell>
                                                <TextWrapTableCell width={2}>
                                                    <div style={{ color: '#fff' }}>
                                                        {
                                                            flangesData[currentSectionIndex]
                                                                .flanges[1].flange.inDia
                                                        }
                                                    </div>
                                                </TextWrapTableCell>
                                            </TableCell>
                                            <TableCell>
                                                <TextWrapTableCell width={5}>
                                                    <TextInput
                                                        id={`flange-flangeWidth-UPR`}
                                                        labelText=""
                                                        name="flangeWidth"
                                                        value={
                                                            flangesData[currentSectionIndex]
                                                                .flanges[1].flange.flangeWidth
                                                        }
                                                        onChange={(e) => onChangeFlnageData(e, 1)}
                                                    />
                                                </TextWrapTableCell>
                                            </TableCell>
                                            <TableCell>
                                                <TextWrapTableCell width={5}>
                                                    <TextInput
                                                        id={`flange-flangeHeight-UPR`}
                                                        labelText=""
                                                        name="flangeHeight"
                                                        value={
                                                            flangesData[currentSectionIndex]
                                                                .flanges[1].flange.flangeHeight
                                                        }
                                                        onChange={(e) => onChangeFlnageData(e, 1)}
                                                    />
                                                </TextWrapTableCell>
                                            </TableCell>
                                            <TableCell>
                                                <TextWrapTableCell width={5}>
                                                    <TextInput
                                                        id={`flange-neckHeight-UPR`}
                                                        labelText=""
                                                        name="neckHeight"
                                                        value={
                                                            flangesData[currentSectionIndex]
                                                                .flanges[1].flange.neckHeight
                                                        }
                                                        onChange={(e) => onChangeFlnageData(e, 1)}
                                                    />
                                                </TextWrapTableCell>
                                            </TableCell>
                                            <TableCell>
                                                <TextWrapTableCell width={2}>
                                                    <div style={{ color: '#ffff00' }}>
                                                        {flangesData[currentSectionIndex].flanges[1]
                                                            .flange.flangeHeight +
                                                            flangesData[currentSectionIndex]
                                                                .flanges[1].flange.neckHeight}
                                                    </div>
                                                </TextWrapTableCell>
                                            </TableCell>
                                            <TableCell>
                                                <TextWrapTableCell width={5}>
                                                    <TextInput
                                                        style={{ color: '#ff00ff' }}
                                                        id={`flange-neckWidth-UPR`}
                                                        labelText=""
                                                        name="neckWidth"
                                                        value={
                                                            flangesData[currentSectionIndex]
                                                                .flanges[1].flange.neckWidth
                                                        }
                                                        onChange={(e) => onChangeFlnageData(e, 1)}
                                                    />
                                                </TextWrapTableCell>
                                            </TableCell>
                                            <TableCell>
                                                <TextWrapTableCell width={5}>
                                                    <div style={{ color: '#fff' }}>
                                                        {Math.round(
                                                            flangesData[currentSectionIndex]
                                                                .flanges[1].weight,
                                                        ) / 1000}
                                                    </div>
                                                </TextWrapTableCell>
                                            </TableCell>
                                        </TableRow>

                                        {/* Lower */}
                                        <TableRow>
                                            <TableCell>
                                                <TextWrapTableCell width={2}>
                                                    <div
                                                        style={{
                                                            fontSize: '0.7rem',
                                                            color: '#1291b9',
                                                        }}
                                                    >
                                                        Lower
                                                    </div>
                                                </TextWrapTableCell>
                                            </TableCell>
                                            <TableCell>
                                                <TextWrapTableCell width={2}>
                                                    <div style={{ color: '#be95ff' }}>
                                                        {
                                                            flangesData[currentSectionIndex]
                                                                .flanges[0].flange.outDia
                                                        }
                                                    </div>
                                                </TextWrapTableCell>
                                            </TableCell>
                                            <TableCell>
                                                <TextWrapTableCell width={2}>
                                                    <div style={{ color: '#fff' }}>
                                                        {
                                                            flangesData[currentSectionIndex]
                                                                .flanges[0].flange.inDia
                                                        }
                                                    </div>
                                                </TextWrapTableCell>
                                            </TableCell>
                                            <TableCell>
                                                <TextWrapTableCell width={5}>
                                                    <TextInput
                                                        id={`flange-flangeWidth-UPR`}
                                                        labelText=""
                                                        name="flangeWidth"
                                                        value={
                                                            flangesData[currentSectionIndex]
                                                                .flanges[0].flange.flangeWidth
                                                        }
                                                        onChange={(e) => onChangeFlnageData(e, 0)}
                                                    />
                                                </TextWrapTableCell>
                                            </TableCell>
                                            <TableCell>
                                                <TextWrapTableCell width={5}>
                                                    <TextInput
                                                        id={`flange-flangeHeight-UPR`}
                                                        labelText=""
                                                        name="flangeHeight"
                                                        value={
                                                            flangesData[currentSectionIndex]
                                                                .flanges[0].flange.flangeHeight
                                                        }
                                                        onChange={(e) => onChangeFlnageData(e, 0)}
                                                    />
                                                </TextWrapTableCell>
                                            </TableCell>
                                            <TableCell>
                                                <TextWrapTableCell width={5}>
                                                    <TextInput
                                                        id={`flange-neckHeight-UPR`}
                                                        labelText=""
                                                        name="neckHeight"
                                                        value={
                                                            flangesData[currentSectionIndex]
                                                                .flanges[0].flange.neckHeight
                                                        }
                                                        onChange={(e) => onChangeFlnageData(e, 0)}
                                                    />
                                                </TextWrapTableCell>
                                            </TableCell>
                                            <TableCell>
                                                <TextWrapTableCell width={2}>
                                                    <div style={{ color: '#ffff00' }}>
                                                        {flangesData[currentSectionIndex].flanges[0]
                                                            .flange.flangeHeight +
                                                            flangesData[currentSectionIndex]
                                                                .flanges[0].flange.neckHeight}
                                                    </div>
                                                </TextWrapTableCell>
                                            </TableCell>
                                            <TableCell>
                                                <TextWrapTableCell width={5}>
                                                    <TextInput
                                                        style={{ color: '#ff00ff' }}
                                                        id={`flange-neckWidth-LWR`}
                                                        labelText=""
                                                        name="neckWidth"
                                                        value={
                                                            flangesData[currentSectionIndex]
                                                                .flanges[0].flange.neckWidth
                                                        }
                                                        onChange={(e) => onChangeFlnageData(e, 0)}
                                                    />
                                                </TextWrapTableCell>
                                            </TableCell>
                                            <TableCell>
                                                <TextWrapTableCell width={5}>
                                                    <div style={{ color: '#fff' }}>
                                                        {Math.round(
                                                            flangesData[currentSectionIndex]
                                                                .flanges[0].weight,
                                                        ) / 1000}
                                                    </div>
                                                </TextWrapTableCell>
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                                <SettingViewWide>
                                    <GraphicWrapHarf>
                                        <GraphicViewHarf>
                                            <div style={{ padding: '20px', color: '#ED6E46' }}>
                                                {' '}
                                                Upper{' '}
                                            </div>
                                            {partsData.length && (
                                                <VHFlange
                                                    flanges={
                                                        flangesData[currentSectionIndex].flanges
                                                    }
                                                    currentFlange={1}
                                                />
                                            )}
                                        </GraphicViewHarf>
                                        <div
                                            style={{
                                                width: '2px',
                                                height: 'auto',
                                                background: '#333',
                                            }}
                                        ></div>
                                        <GraphicViewHarf>
                                            <div style={{ padding: '20px', color: '#1291b9' }}>
                                                {' '}
                                                Lower{' '}
                                            </div>
                                            {partsData.length && (
                                                <VHFlange
                                                    flanges={
                                                        flangesData[currentSectionIndex].flanges
                                                    }
                                                    currentFlange={0}
                                                />
                                            )}
                                        </GraphicViewHarf>
                                    </GraphicWrapHarf>
                                </SettingViewWide>

                                {!true && (
                                    <>
                                        <InputDivider />
                                        <div style={{ width: '100%', color: '#fa4d56' }}>
                                            Invalid Value Exist. Check input value.
                                        </div>
                                    </>
                                )}

                                <InputDivider />
                                <Button
                                    kind="primary"
                                    renderIcon={Save32}
                                    // onClick={onClickSetSectionsInitData}
                                    // disabled={!validFirstStep}

                                    onClick={onClickSetPartsData}
                                >
                                    Section {currentSectionIndex + 1} Mass Capacity : SAVE
                                </Button>

                                <SectionDivider />
                            </>

                            {/* 
                                STEP 2 - 1 : Number of Parts
                            */}
                            <>
                                <SettingTitle>
                                    {`Section ${currentSectionIndex + 1} - Each Part Mass Check`}
                                </SettingTitle>
                                <SectionDivider />
                                <InputLabel style={{ color: '#fff' }}>
                                    Number of Tower Part
                                </InputLabel>
                                <Row
                                    style={{
                                        border: '0px solid #333',
                                        marginBlock: '0.5rem',
                                        padding: '1.5rem',
                                    }}
                                    narrow
                                >
                                    <SliderCustom>
                                        <Slider
                                            id="initial-divided"
                                            labelText=""
                                            max={20}
                                            min={1}
                                            step={1}
                                            value={divided}
                                            onChange={onChangeDevided}
                                        />
                                    </SliderCustom>
                                    <Button
                                        renderIcon={Save32}
                                        onClick={onClickSetPartsData}
                                        style={{ margin: '5px' }}
                                    >
                                        Set Parts
                                    </Button>
                                </Row>
                                <SectionDivider />
                            </>
                            {/* 
                                STEP 2 - 2 : Each Part & Flange Table
                            */}
                            <>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableHeader>
                                                <div style={{ color: '#fff', marginLeft: '0px' }}>
                                                    Type.
                                                </div>
                                            </TableHeader>
                                            <TableHeader>
                                                <div style={{ color: '#fff', marginLeft: '0px' }}>
                                                    Length
                                                </div>
                                            </TableHeader>
                                            <TableHeader>
                                                <div style={{ color: '#fff', marginLeft: '0px' }}>
                                                    Out,i_UPR
                                                </div>
                                            </TableHeader>
                                            <TableHeader>
                                                <div style={{ color: '#fff', marginLeft: '0px' }}>
                                                    In,i_UPR
                                                </div>
                                            </TableHeader>
                                            <TableHeader>
                                                <div style={{ color: '#fff', marginLeft: '0px' }}>
                                                    Out,i_LWR
                                                </div>
                                            </TableHeader>
                                            <TableHeader>
                                                <div style={{ color: '#fff', marginLeft: '0px' }}>
                                                    In,i_LWR
                                                </div>
                                            </TableHeader>
                                            <TableHeader>
                                                <div style={{ color: '#fff', marginLeft: '0px' }}>
                                                    Thickness
                                                </div>
                                            </TableHeader>
                                            <TableHeader>
                                                <div style={{ marginLeft: '0px' }}>Weight(Kg)</div>
                                            </TableHeader>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {/* Upper Flange */}
                                        <TableRow>
                                            <TableCell>
                                                <TextWrapTableCell width={2}>
                                                    <div
                                                        style={{
                                                            fontSize: '0.7rem',
                                                            color: '#ED6E46',
                                                        }}
                                                    >
                                                        Upper
                                                    </div>
                                                </TextWrapTableCell>
                                            </TableCell>
                                            <TableCell>
                                                <TextWrapTableCell width={2}>
                                                    <div style={{ color: '#ffff00' }}>
                                                        {flangesData[currentSectionIndex].flanges[1]
                                                            .flange.flangeHeight +
                                                            flangesData[currentSectionIndex]
                                                                .flanges[1].flange.neckHeight}
                                                    </div>
                                                </TextWrapTableCell>
                                            </TableCell>
                                            <TableCell>
                                                <TextWrapTableCell width={2}>
                                                    <div style={{ color: '#42be65' }}>
                                                        {
                                                            flangesData[currentSectionIndex]
                                                                .flanges[1].flange.outDia
                                                        }
                                                    </div>
                                                </TextWrapTableCell>
                                            </TableCell>
                                            <TableCell>
                                                <TextWrapTableCell width={2}>
                                                    <div style={{ color: '#fff' }}>
                                                        {
                                                            flangesData[currentSectionIndex]
                                                                .flanges[1].flange.inDia
                                                        }
                                                    </div>
                                                </TextWrapTableCell>
                                            </TableCell>
                                            <TableCell>
                                                <TextWrapTableCell width={5}></TextWrapTableCell>
                                            </TableCell>
                                            <TableCell>
                                                <TextWrapTableCell width={5}></TextWrapTableCell>
                                            </TableCell>
                                            <TableCell>
                                                <TextWrapTableCell width={2}>
                                                    <div style={{ color: '#ff00ff' }}>
                                                        {
                                                            flangesData[currentSectionIndex]
                                                                .flanges[1].flange.neckWidth
                                                        }
                                                    </div>
                                                </TextWrapTableCell>
                                            </TableCell>
                                            <TableCell>
                                                <TextWrapTableCell width={5}>
                                                    <div style={{ color: '#fff' }}>
                                                        {Math.round(
                                                            flangesData[currentSectionIndex]
                                                                .flanges[1].weight,
                                                        ) / 1000}
                                                    </div>
                                                </TextWrapTableCell>
                                            </TableCell>
                                        </TableRow>

                                        {/* Tower Parts */}
                                        {partsData[currentSectionIndex].parts
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
                                                        <div
                                                            style={{
                                                                fontSize: '0.7rem',
                                                                color: '#fff',
                                                            }}
                                                        >
                                                            Part{' '}
                                                            {partsData[currentSectionIndex]
                                                                .divided - index}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <TextWrapTableCell width={5}>
                                                            <TextInput
                                                                id={`section-height-${
                                                                    divided - index - 1
                                                                }`}
                                                                labelText=""
                                                                name="height"
                                                                onChange={(e) =>
                                                                    onChangePartsData(
                                                                        e,
                                                                        divided - index - 1,
                                                                    )
                                                                }
                                                                value={v.part.height}
                                                            />
                                                        </TextWrapTableCell>
                                                    </TableCell>

                                                    <TableCell>{v.part.top}</TableCell>

                                                    <TableCell>
                                                        {v.part.top - v.thickness * 2}
                                                    </TableCell>

                                                    <TableCell>{v.part.bottom}</TableCell>
                                                    <TableCell>
                                                        {v.part.bottom - v.thickness * 2}
                                                    </TableCell>

                                                    <TableCell>
                                                        <TextWrapTableCell width={5}>
                                                            <TextInput
                                                                id={`section-thickness-${
                                                                    divided - index - 1
                                                                }`}
                                                                labelText=""
                                                                name="thickness"
                                                                onChange={(e) =>
                                                                    onChangePartsData(
                                                                        e,
                                                                        divided - index - 1,
                                                                    )
                                                                }
                                                                value={v.thickness}
                                                            />
                                                        </TextWrapTableCell>
                                                    </TableCell>
                                                    <TableCell>
                                                        <TextWrapTableCell width={5}>
                                                            {Math.round(v.weight) / 1000}
                                                        </TextWrapTableCell>
                                                    </TableCell>
                                                </TableRow>
                                            ))}

                                        {/* Lower Flange */}
                                        <TableRow>
                                            <TableCell>
                                                <TextWrapTableCell width={2}>
                                                    <div
                                                        style={{
                                                            fontSize: '0.7rem',
                                                            color: '#1291b9',
                                                        }}
                                                    >
                                                        Lower
                                                    </div>
                                                </TextWrapTableCell>
                                            </TableCell>
                                            <TableCell>
                                                <TextWrapTableCell width={2}>
                                                    <div style={{ color: '#ffff00' }}>
                                                        {flangesData[currentSectionIndex].flanges[0]
                                                            .flange.flangeHeight +
                                                            flangesData[currentSectionIndex]
                                                                .flanges[0].flange.neckHeight}
                                                    </div>
                                                </TextWrapTableCell>
                                            </TableCell>
                                            <TableCell>
                                                <TextWrapTableCell width={2}>
                                                    <div style={{ color: '#be95ff' }}>
                                                        {
                                                            flangesData[currentSectionIndex]
                                                                .flanges[0].flange.outDia
                                                        }
                                                    </div>
                                                </TextWrapTableCell>
                                            </TableCell>
                                            <TableCell>
                                                <TextWrapTableCell width={2}>
                                                    <div style={{ color: '#fff' }}>
                                                        {
                                                            flangesData[currentSectionIndex]
                                                                .flanges[0].flange.inDia
                                                        }
                                                    </div>
                                                </TextWrapTableCell>
                                            </TableCell>
                                            <TableCell>
                                                <TextWrapTableCell width={5}></TextWrapTableCell>
                                            </TableCell>
                                            <TableCell>
                                                <TextWrapTableCell width={5}></TextWrapTableCell>
                                            </TableCell>
                                            <TableCell>
                                                <TextWrapTableCell width={2}>
                                                    <div style={{ color: '#ff00ff' }}>
                                                        {
                                                            flangesData[currentSectionIndex]
                                                                .flanges[0].flange.neckWidth
                                                        }
                                                    </div>
                                                </TextWrapTableCell>
                                            </TableCell>
                                            <TableCell>
                                                <TextWrapTableCell width={5}>
                                                    <div style={{ color: '#fff' }}>
                                                        {Math.round(
                                                            flangesData[currentSectionIndex]
                                                                .flanges[0].weight,
                                                        ) / 1000}
                                                    </div>
                                                </TextWrapTableCell>
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>

                                {/* Sum of Section Data */}

                                <InputDivider />

                                <Table size="lg">
                                    <TableBody>
                                        <TableRow>
                                            <TableCell>
                                                <TextWrapTableCell width={2}>
                                                    <div style={{ color: '#fff' }}>Total</div>
                                                </TextWrapTableCell>
                                            </TableCell>
                                            <TableCell>
                                                <TextWrapTableCell width={7}>
                                                    <TextInput
                                                        id={`section-total-height`}
                                                        labelText=""
                                                        name="total-height"
                                                        invalid={
                                                            partsData[currentSectionIndex].parts
                                                                .map((v) => v.part.height)
                                                                .reduce(
                                                                    (prev, curr) => prev + curr,
                                                                    0,
                                                                ) +
                                                                flangesData[
                                                                    currentSectionIndex
                                                                ].flanges
                                                                    .map(
                                                                        (v) =>
                                                                            v.flange.flangeHeight +
                                                                            v.flange.neckHeight,
                                                                    )
                                                                    .reduce(
                                                                        (prev, curr) => prev + curr,
                                                                        0,
                                                                    ) !=
                                                            sectionData[currentSectionIndex].section
                                                                .height
                                                        }
                                                        invalidText={`Remaining = ${
                                                            sectionData[currentSectionIndex].section
                                                                .height -
                                                            partsData[currentSectionIndex].parts
                                                                .map((v) => v.part.height)
                                                                .reduce(
                                                                    (prev, curr) => prev + curr,
                                                                    0,
                                                                ) -
                                                            flangesData[currentSectionIndex].flanges
                                                                .map(
                                                                    (v) =>
                                                                        v.flange.flangeHeight +
                                                                        v.flange.neckHeight,
                                                                )
                                                                .reduce(
                                                                    (prev, curr) => prev + curr,
                                                                    0,
                                                                )
                                                        }`}
                                                        value={
                                                            partsData[currentSectionIndex].parts
                                                                .map((v) => v.part.height)
                                                                .reduce(
                                                                    (prev, curr) => prev + curr,
                                                                    0,
                                                                ) +
                                                            flangesData[currentSectionIndex].flanges
                                                                .map(
                                                                    (v) =>
                                                                        v.flange.flangeHeight +
                                                                        v.flange.neckHeight,
                                                                )
                                                                .reduce(
                                                                    (prev, curr) => prev + curr,
                                                                    0,
                                                                )
                                                        }
                                                        // disabled={
                                                        //     divided !== sectionData.length
                                                        // }
                                                    />
                                                </TextWrapTableCell>
                                            </TableCell>
                                            <TableCell>
                                                <TextWrapTableCell width={30}>
                                                    {`Section ${
                                                        currentSectionIndex + 1
                                                    } - Total Height ${
                                                        sectionData[currentSectionIndex].section
                                                            .height
                                                    }mm (= ${
                                                        sectionData[currentSectionIndex].section
                                                            .height / 1000
                                                    }m) `}
                                                </TextWrapTableCell>
                                            </TableCell>
                                            <TableCell>
                                                <TextWrapTableCell width={7}>
                                                    <TextInput
                                                        id={`section-total-weight`}
                                                        labelText=""
                                                        name="total-weight"
                                                        invalid={
                                                            Math.round(
                                                                (partsData[
                                                                    currentSectionIndex
                                                                ].parts
                                                                    .map((v) => v.weight)
                                                                    .reduce(
                                                                        (prev, curr) => prev + curr,
                                                                        0,
                                                                    ) +
                                                                    flangesData[
                                                                        currentSectionIndex
                                                                    ].flanges
                                                                        .map((v) => v.weight)
                                                                        .reduce(
                                                                            (prev, curr) =>
                                                                                prev + curr,
                                                                            0,
                                                                        )) /
                                                                    1000,
                                                            ) >
                                                            MfrD.capacity[0].weight * 1000
                                                        }
                                                        invalidText={`< ${
                                                            MfrD.capacity[0].weight * 1000
                                                        }`}
                                                        value={Math.round(
                                                            (partsData[currentSectionIndex].parts
                                                                .map((v) => v.weight)
                                                                .reduce(
                                                                    (prev, curr) => prev + curr,
                                                                    0,
                                                                ) +
                                                                flangesData[
                                                                    currentSectionIndex
                                                                ].flanges
                                                                    .map((v) => v.weight)
                                                                    .reduce(
                                                                        (prev, curr) => prev + curr,
                                                                        0,
                                                                    )) /
                                                                1000,
                                                        )}
                                                    />
                                                </TextWrapTableCell>
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </>
                        </SettingViewFit>

                        {/* STEP : Flange Upper */}
                        {/* <SectionDivider />
                <SettingViewWide>
                    <SettingViewWideInner>
                        <SettingTitle>Upper Flange : Section 1</SettingTitle>
                        <InputLabel>= Lower Flange : Section 2</InputLabel>
                    </SettingViewWideInner>
                    <GraphicWrapHarf>
                        <GraphicViewHarf>
                            {partsData.length && (
                                // <VHFlange
                                //     draws={partsData[currentSectionIndex].parts.map((v) => v.part)}
                                //     currentPartIndex={currentPartIndex}
                                //     setCurrentPartIndex={setCurrentPartIndex}
                                // />

                                <EachFlangeTypeL
                                    flanges={flangesData[currentSectionIndex].flanges}
                                    currentFlange={0}
                                />
                            )}
                        </GraphicViewHarf>
                        <SettingViewFit>
                            <InputLabel>Tower Total Thickness (mm)</InputLabel>
                            <SliderCustom>
                                <Slider
                                    id="Slider_totalThickness"
                                    labelText=""
                                    min={10}
                                    max={100}
                                    step={1}
                                    value={totalThickness}
                                    onChange={onChangeTotalThickness}
                                />
                            </SliderCustom>
                        </SettingViewFit>
                    </GraphicWrapHarf>
                </SettingViewWide>
                <SectionDivider /> */}

                        <SettingViewFit>
                            <>
                                {/* <InputDivider />
                        {divided !== sectionData.length && (
                            <div style={{ width: '100%', color: '#fa4d56' }}>
                                Please, Click the STEP1 SAVE Button
                            </div>
                        )}
                        {invalidTableCheck && (
                            <div style={{ width: '100%', color: '#fa4d56' }}>
                                Invalid Value Exist. Check input value.
                            </div>
                        )}
                        <InputDivider />
                        <Button
                            kind="primary"
                            renderIcon={Save32}
                            onClick={onClickSetSectionsFinalData}
                            disabled={invalidTableCheck}
                        >
                            STEP2 : SAVE
                        </Button> */}
                                <SectionDivider />
                                <div
                                    style={{
                                        paddingBlock: '1rem',
                                        marginBottom: '100px',
                                        float: 'right',
                                    }}
                                >
                                    {currentSectionIndex !== 0 && (
                                        <Button
                                            kind="tertiary"
                                            renderIcon={ArrowLeft32}
                                            hasIconOnly={true}
                                            iconDescription="Previous"
                                            onClick={() =>
                                                setCurrentSectionIndex(currentSectionIndex - 1)
                                            }
                                        />
                                    )}

                                    <Button
                                        kind="tertiary"
                                        renderIcon={ArrowRight32}
                                        disabled={!true}
                                        onClick={() =>
                                            setCurrentSectionIndex(currentSectionIndex + 1)
                                        }
                                    >
                                        NEXT
                                    </Button>
                                </div>
                            </>
                        </SettingViewFit>
                    </SettingWrap>
                </FlexWrap>
            )}
        </>
    )
}

export default Frame
