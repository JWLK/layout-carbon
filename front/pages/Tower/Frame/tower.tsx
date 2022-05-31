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

    /* Initial Parameter : outline value */
    const [topUpperOutDia, setTopUpperOutDia] = useState(0)
    const [bottomLowerOutDia, setBottomLowerOutDia] = useState(0)
    const [totalHeight, setTotalHeight] = useState(0)
    const [maxHeight, setMaxHeight] = useState(0)
    const [divided, setDivided] = useState(1)

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
    const onChangeTotalHeight = useCallback(
        (e) => {
            const valueNumber = parseInt(
                e.imaginaryTarget.value !== '' ? e.imaginaryTarget.value : 0,
            )
            setTotalHeight(valueNumber)
            setMaxHeight(valueNumber)
            initData.totalHeight = valueNumber
            initData.maxHeight = valueNumber
            rawData.initial = initData
            localStorage.setItem(keyRawData, JSON.stringify(rawData))
        },
        [keyRawData, rawData, initData],
    )
    const onChangeDevided = useCallback((e) => {
        setDivided(e.value)
    }, [])

    /* Initial Parameter : Validation Check */
    const [currentStep, setCurrentStep] = useState(sectionData.length > 1 ? 1 : 0)
    //Valid Parmeter : STEP 1
    const [validHeight, setValidHeight] = useState(totalHeight >= 5000 && totalHeight <= 200000)
    const [validTopBottom, setValidTopBottom] = useState(
        bottomLowerOutDia >= topUpperOutDia ? true : false,
    )
    const [validFirstStep, setValidFirstStep] = useState(validHeight && validTopBottom)
    //Valid Button Event
    //Valid useEffect STEP 1
    useEffect(() => {
        setValidHeight(totalHeight >= 5000 && totalHeight <= 200000)
        setValidTopBottom(bottomLowerOutDia >= topUpperOutDia ? true : false)
        if (validHeight && validTopBottom) {
            setValidFirstStep(true)
        } else {
            setValidFirstStep(false)
        }
    }, [bottomLowerOutDia, topUpperOutDia, totalHeight, validHeight, validTopBottom, divided])

    //Valid Parmeter : STEP 2
    const [validSecondStep, setValidSecondStep] = useState(false)
    const [invalidTableCheck, setInvalidTableCheck] = useState(false)
    //Valid Button Event
    //Valid useEffect STEP 2
    useEffect(() => {
        let invalidList = sectionData
            .slice(0)
            .reverse()
            .map((v) => {
                const invalidCheckLength = v.section.height > MfrD!.capacity[0].length * 1000
                const invalidTopBottom = v.section.top > v.section.bottom
                const invalidCheckTop = v.section.top > MfrD!.capacity[0].diameter * 1000
                const invalidCheckBottom = v.section.bottom > MfrD!.capacity[0].diameter * 1000

                return (
                    invalidCheckLength || invalidTopBottom || invalidCheckTop || invalidCheckBottom
                )
            })
        invalidList.push(
            sectionData.map((v) => v.section.height).reduce((prev, curr) => prev + curr, 0) !=
                initData.maxHeight,
        )

        setInvalidTableCheck(invalidList.filter((v) => v).length > 0)
    }, [MfrD, initData.maxHeight, sectionData])

    /* STEP 0 */
    const onClickSetSectionsInitData = useCallback(
        (e) => {
            setCurrentSectionIndex(0)
            var sectionsObject = [] as TWSection[]
            var partsObject = [] as TWParts[]
            var sectorsObject = [] as TWSectors[]
            var flangesObject = [] as TWFlanges[]
            var defaultFlangeHeight = 200
            var defaultNeckHeight = 100

            for (var i = 0; i < divided; i++) {
                /* Init Value */
                var eachSectionHeight = Math.round(maxHeight / divided)
                var eachPartHeight =
                    eachSectionHeight - 2 * (defaultFlangeHeight + defaultNeckHeight)
                var triBottom = Math.abs(topUpperOutDia - bottomLowerOutDia) / 2
                var eachHypo = Math.sqrt(Math.pow(triBottom, 2) + Math.pow(maxHeight, 2)) / divided
                var radian = Math.PI / 2 - Math.atan(maxHeight / triBottom)

                // console.log('eachHeight', eachHeight)
                // console.log('triBottom', triBottom)
                // console.log('eachHypo', eachHypo)
                // console.log('angle', (180 / Math.PI) * angle)

                /* Calc Secion & Parts Value */
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
                        height: eachSectionHeight,
                    },
                    tapered: true,
                }

                partsObject[divided - 1 - i] = {
                    index: i,
                    parts: [
                        {
                            index: 0,
                            part: {
                                top: sectionWidthTop,
                                bottom: sectionWidthBottom,
                                height: eachPartHeight,
                            },
                            thickness: 50,
                        },
                    ],
                    divided: 1,
                }

                /* Calc Flange Value */
                flangesObject[divided - 1 - i] = {
                    index: i,
                    flanges: [
                        {
                            index: 0,
                            flange: {
                                outDia: sectionWidthBottom,
                                inDia: sectionWidthBottom - 2 * 400, //= outDia - 2 * flangeWidth
                                flangeWidth: 400,
                                flangeHeight: defaultFlangeHeight,
                                neckWidth: 50,
                                neckHeight: defaultNeckHeight,
                                minScrewWidth: 80,
                                pcDia: sectionWidthBottom - 2 * 50 - 2 * 80, // = outDia - 2 * neckWidth - 2 * minScrewWidth
                                param_a:
                                    (sectionWidthBottom -
                                        2 * 50 -
                                        2 * 80 -
                                        (sectionWidthBottom - 2 * 400)) /
                                    2,
                                // param_a =  (pcDia - inDia) / 2
                                param_b:
                                    (sectionWidthBottom -
                                        50 -
                                        (sectionWidthBottom - 2 * 50 - 2 * 80)) /
                                    2,
                                // param_b = (outDia - neckWidth - pcDia) / 2
                                screwWidth: 64,
                                screwNumberOf: 150,
                            },
                        },
                        {
                            index: 1,
                            flange: {
                                outDia: sectionWidthTop,
                                inDia: sectionWidthTop - 2 * 400, //= outDia - 2 * flangeWidth
                                flangeWidth: 400,
                                flangeHeight: defaultFlangeHeight,
                                neckWidth: 50,
                                neckHeight: defaultNeckHeight,
                                minScrewWidth: 80,
                                pcDia: sectionWidthTop - 2 * 50 - 2 * 80, // = outDia - 2 * neckWidth - 2 * minScrewWidth
                                param_a:
                                    (sectionWidthTop -
                                        2 * 50 -
                                        2 * 80 -
                                        (sectionWidthTop - 2 * 400)) /
                                    2,
                                // param_a =  (pcDia - inDia) / 2
                                param_b:
                                    (sectionWidthTop - 50 - (sectionWidthTop - 2 * 50 - 2 * 80)) /
                                    2,
                                // param_b = (outDia - neckWidth - pcDia) / 2
                                screwWidth: 64,
                                screwNumberOf: 150,
                            },
                        },
                    ],
                }

                sectorsObject[divided - 1 - i] = {
                    index: i,
                    sectors: [InitSector],
                }
            }

            initData.totalHeight = maxHeight
            initData.divided = divided
            rawData.initial = initData
            rawData.sectionData = sectionsObject
            rawData.partsData = partsObject
            rawData.sectorsData = sectorsObject
            rawData.flangesData = flangesObject
            localStorage.setItem(keyRawData, JSON.stringify(rawData))

            //개별 업데이터
            // setRawData(rawData)
            // setSectionData(sectionsObject)

            //한번에 업데이터
            mutate()
            setValidFirstStep(true)
            setValidSecondStep(false)
        },
        [divided, initData, rawData, keyRawData, maxHeight, topUpperOutDia, bottomLowerOutDia],
    )

    /* STEP 1 */
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

    const updateInitialSync = useCallback(
        (sections: TWSection[]) => {
            var totalHeight = 0
            for (var i = 0; i < sections.length; i++) {
                totalHeight += sections[i].section.height
            }
            initData.topUpperOutDia = sections[sections.length - 1].section.top
            initData.bottomLowerOutDia = sections[0].section.bottom
            initData.totalHeight = totalHeight

            return initData
        },
        [initData],
    )

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

    const updatePartsSync = (sections: TWSection[], TWParts: TWParts[], TWFlanges: TWFlanges[]) => {
        for (var i = 0; i < sections.length; i++) {
            TWParts[i] = {
                index: TWParts[i].index,
                parts: [
                    {
                        index: TWParts[i].parts[0].index,
                        part: {
                            top: sections[i].section.top,
                            bottom: sections[i].section.bottom,
                            height:
                                sections[i].section.height -
                                (TWFlanges[i].flanges[0].flange.flangeHeight +
                                    TWFlanges[i].flanges[0].flange.neckHeight) -
                                (TWFlanges[i].flanges[1].flange.flangeHeight +
                                    TWFlanges[i].flanges[1].flange.neckHeight),
                        },
                        thickness: TWParts[i].parts[0].index,
                    },
                ],
                divided: TWParts[i].divided,
            }
        }
        return TWParts
    }

    const updateFlangesSync = (sections: TWSection[], TWFlanges: TWFlanges[]) => {
        for (var i = 1; i < sections.length; i++) {
            // TWFlanges[i].flanges[0].flange.outDia = sections[i].section.bottom
            // TWFlanges[i].flanges[0].flange.inDia =
            //     sections[i].section.bottom - 2 * TWFlanges[i].flanges[0].flange.flangeWidth

            // TWFlanges[i].flanges[1].flange.outDia = sections[i].section.top
            // TWFlanges[i].flanges[1].flange.inDia =
            //     sections[i].section.top - 2 * TWFlanges[i].flanges[1].flange.flangeWidth
            TWFlanges[i].flanges = [
                {
                    index: 0,
                    flange: {
                        outDia: sectionData[i].section.bottom,
                        inDia:
                            sectionData[i].section.bottom -
                            2 * TWFlanges[i].flanges[0].flange.flangeWidth, //= outDia - 2 * flangeWidth
                        flangeWidth: TWFlanges[i].flanges[0].flange.flangeWidth,
                        flangeHeight: TWFlanges[i].flanges[0].flange.flangeHeight,
                        neckWidth: TWFlanges[i].flanges[0].flange.neckWidth,
                        neckHeight: TWFlanges[i].flanges[0].flange.neckHeight,
                        minScrewWidth: TWFlanges[i].flanges[0].flange.minScrewWidth,
                        pcDia:
                            sectionData[i].section.bottom -
                            2 * TWFlanges[i].flanges[0].flange.neckWidth -
                            2 * TWFlanges[i].flanges[0].flange.minScrewWidth, // = outDia - 2 * neckWidth - 2 * minScrewWidth
                        param_a:
                            (sectionData[i].section.bottom -
                                2 * TWFlanges[i].flanges[0].flange.neckWidth -
                                2 * TWFlanges[i].flanges[0].flange.minScrewWidth -
                                (sectionData[i].section.bottom -
                                    2 * TWFlanges[i].flanges[0].flange.flangeWidth)) /
                            2,
                        param_b:
                            (sectionData[i].section.bottom -
                                TWFlanges[i].flanges[0].flange.neckWidth -
                                (sectionData[i].section.bottom -
                                    2 * TWFlanges[i].flanges[0].flange.neckWidth -
                                    2 * TWFlanges[i].flanges[0].flange.minScrewWidth)) /
                            2,
                        screwWidth: TWFlanges[i].flanges[0].flange.screwWidth,
                        screwNumberOf: TWFlanges[i].flanges[0].flange.screwNumberOf,
                    },
                },
                {
                    index: 1,
                    flange: {
                        outDia: sectionData[i].section.top,
                        inDia: sectionData[i].section.top - 2 * 400, //= outDia - 2 * flangeWidth
                        flangeWidth: 400,
                        flangeHeight: 200,
                        neckWidth: 50,
                        neckHeight: 100,
                        minScrewWidth: 80,
                        pcDia: sectionData[i].section.top - 2 * 50 - 2 * 80, // = outDia - 2 * neckWidth - 2 * minScrewWidth
                        param_a:
                            (sectionData[i].section.bottom -
                                2 * 50 -
                                2 * 80 -
                                (sectionData[i].section.bottom - 2 * 400)) /
                            2,
                        param_b:
                            (sectionData[i].section.bottom -
                                50 -
                                (sectionData[i].section.bottom - 2 * 50 - 2 * 80)) /
                            2,
                        screwWidth: 64,
                        screwNumberOf: 150,
                    },
                },
            ]
        }
        return TWFlanges
    }

    type typeObjSquare = 'top' | 'bottom' | 'height'
    const onChangeSectionTableData = useCallback(
        (e, index, invalid) => {
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
            setValidSecondStep(false)
        },
        [keyRawData, mutate, rawData, sectionData, updateInitialSync],
    )
    useEffect(() => {}, [])

    const onClickSetSectionsFinalData = useCallback(
        (e) => {
            const updateInitial = updateInitialSync(sectionData)
            const updateSection = updateSectionsTaperedSync(sectionData)
            const updateParts = updatePartsSync(updateSection, partsData, flangesData)
            const updateFlanges = updateFlangesSync(updateSection, flangesData)
            rawData.initial = updateInitial
            rawData.sectionData = updateSection
            rawData.partsData = updateParts
            rawData.flangesData = updateFlanges
            localStorage.setItem(keyRawData, JSON.stringify(rawData))
            mutate()
            setValidSecondStep(true)
        },
        [flangesData, keyRawData, partsData, rawData, sectionData, updateInitialSync],
    )

    /* Section Parameter : Current(Selected) Section Index State */
    const [currentSectionIndex, setCurrentSectionIndex] = useState(0)
    const onChaneSectionIndex = useCallback((value) => {
        setCurrentSectionIndex(value)
        /* Link to Section Index */
    }, [])

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
            //InitialData
            setInitData(TD.initial)
            setTotalHeight(TD.initial.totalHeight)
            setMaxHeight(TD.initial.maxHeight)
            setTopUpperOutDia(TD.initial.topUpperOutDia)
            setBottomLowerOutDia(TD.initial.bottomLowerOutDia)
            setDivided(TD.initial.divided)
            //SectionData
            setSectionData(TD.sectionData)
            //PartsData
            setPartsData(TD.partsData)
            //SectorsData
            setSectorsData(TD.sectorsData)
            //FlangesData
            setFlangesData(TD.flangesData)

            //Set Valid Step
            // setCurrentStep(TD.initial.divided > 1 ? 1 : 0)
            // setValidFirstStep(TD.initial.divided > 1)
        }
    }, [TD])

    if (TD === undefined || MfrD === undefined) {
        return <div>Loading...</div>
    }

    /* TABLE HEADER */
    const headers = [
        {
            key: 'no',
            header: 'Secion No',
        },
        {
            key: 'length',
            header: 'Length',
        },
        {
            key: 'type',
            header: 'Type',
        },
        {
            key: 'top',
            header: 'Up Diameter',
        },
        {
            key: 'bottom',
            header: 'Low Diameter',
        },
    ]

    return (
        <FlexWrap>
            <GraphicWrap>
                <GraphicViewOrigin>
                    <VOTower
                        draws={sectionData.map((v) => v.section)}
                        currentIndex={currentSectionIndex}
                        setCurrentIndex={setCurrentSectionIndex}
                    />
                </GraphicViewOrigin>
            </GraphicWrap>

            <SettingWrap>
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
                    {/* 
                        STEP 1
                    */}
                    <>
                        <SettingTitle>
                            STEP 1 : Initial Design
                            <div style={{ float: 'right', paddingBottom: '100px' }}>
                                <Button
                                    kind="tertiary"
                                    renderIcon={ArrowRight32}
                                    disabled={!validSecondStep}
                                    as={NavLink}
                                    to={
                                        validSecondStep
                                            ? `/workspace/${workspace}/model/section`
                                            : ''
                                    }
                                >
                                    NEXT
                                </Button>
                            </div>
                        </SettingTitle>

                        {!validFirstStep && (
                            <div style={{ width: '100%', color: '#fa4d56' }}>
                                Invalid Value Exist. Check input value
                            </div>
                        )}
                        <SectionDivider />
                        <InputLabel>
                            <span style={{ color: '#ffff00' }}>Tower Total Height (mm)</span>
                        </InputLabel>
                        <NumberInputCustom
                            id="NumberInput_totalHeight"
                            label=""
                            size="lg"
                            min={5000}
                            max={200000}
                            step={100}
                            value={maxHeight}
                            onChange={onChangeTotalHeight}
                            invalidText="This value cannot be used. (Valid Value : 5,000mm ~ 200,000mm)"
                            warnText="Warn Text"
                        />
                        <InputDivider />
                        <InputLabel>
                            <span style={{ color: '#42be65' }}>
                                Section {divided} - Upper Outside Diameter (mm)
                            </span>
                        </InputLabel>
                        <SliderCustom>
                            <Slider
                                id="Slider_topUpperOutDia"
                                min={3000}
                                max={MfrD.capacity[0].diameter * 1000}
                                step={50}
                                value={topUpperOutDia}
                                onChange={onChangeTopUpperOutDia}
                                style={{ fontSize: '3rem' }}
                                invalid={
                                    !validTopBottom ||
                                    topUpperOutDia > MfrD.capacity[0].diameter * 1000
                                }
                            />
                        </SliderCustom>
                        <InputDivider />
                        <InputLabel>
                            <span style={{ color: '#be95ff' }}>
                                Section 1- Lower Outside Diameter (mm)
                            </span>
                        </InputLabel>
                        <SliderCustom>
                            <Slider
                                id="Slider_bottomLowerOutDia"
                                labelText=""
                                min={3000}
                                max={MfrD.capacity[0].diameter * 1000}
                                step={50}
                                value={bottomLowerOutDia}
                                onChange={onChangeBottomLowerOutDia}
                                invalid={
                                    !validTopBottom ||
                                    bottomLowerOutDia > MfrD.capacity[0].diameter * 1000
                                }
                            />
                        </SliderCustom>
                        <InputDivider />
                        <InputLabel>Number of Tower Section</InputLabel>
                        <SliderCustom>
                            <Slider
                                id="Slider_initialDivided"
                                labelText=""
                                min={1}
                                max={10}
                                step={1}
                                value={divided}
                                onChange={onChangeDevided}
                            />
                        </SliderCustom>

                        {!validFirstStep && (
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
                            onClick={onClickSetSectionsInitData}
                            disabled={!validFirstStep}
                        >
                            STEP1 : SAVE
                        </Button>

                        <SectionDivider />
                    </>

                    {/* 
                        STEP 2
                    */}
                    <>
                        <SettingTitle>STEP 2 : Each Section Setting</SettingTitle>
                        {divided !== sectionData.length && (
                            <div style={{ width: '100%', color: '#fa4d56' }}>
                                Please, Click the STEP1 SAVE Button
                            </div>
                        )}
                        {invalidTableCheck && (
                            <div style={{ width: '100%', color: '#fa4d56' }}>
                                Invalid Value Exist. Check input value
                            </div>
                        )}

                        <SectionDivider />
                        <div style={{ marginBlock: '10px', fontSize: '1.2rem' }}>
                            Production Capcity [mm]
                        </div>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    {headers.map((header) => (
                                        <TableHeader key={header.key}>
                                            <div style={{ marginLeft: '10px' }}>
                                                {header.header}
                                            </div>
                                        </TableHeader>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <TableRow>
                                    <TableCell>
                                        <TextWrapTableCell width={3}>Capacity</TextWrapTableCell>
                                    </TableCell>
                                    <TableCell>
                                        <TextWrapTableCell width={7}>
                                            {MfrD.capacity[0].length * 1000}
                                        </TextWrapTableCell>
                                    </TableCell>
                                    <TableCell>
                                        <TextWrapTableCell width={5}>Not Defined</TextWrapTableCell>
                                    </TableCell>
                                    <TableCell>
                                        <TextWrapTableCell width={7}>
                                            {MfrD.capacity[0].diameter * 1000}
                                        </TextWrapTableCell>
                                    </TableCell>
                                    <TableCell>
                                        <TextWrapTableCell width={7}>
                                            {MfrD.capacity[0].diameter * 1000}
                                        </TextWrapTableCell>
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                        <InputDivider />
                        <div style={{ marginBlock: '10px', fontSize: '1.2rem' }}>
                            Each Section Parameter [mm]
                        </div>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    {headers.map((header) => (
                                        <TableHeader key={header.key}>
                                            <div style={{ marginLeft: '10px' }}>
                                                {header.header}
                                            </div>
                                        </TableHeader>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {sectionData
                                    .slice(0)
                                    .reverse()
                                    .map((v) => {
                                        const notSaveValidation = divided !== sectionData.length
                                        const linearTypeValidationNotLastSection =
                                            !v.tapered && v.index !== sectionData.length - 1
                                        const invalidCheckLength =
                                            v.section.height > MfrD.capacity[0].length * 1000
                                        const invalidTextLength = `Length <= ${
                                            MfrD.capacity[0].length * 1000
                                        }`
                                        const invalidTopBottom = v.section.top > v.section.bottom
                                        const invalidCheckTop =
                                            v.section.top > MfrD.capacity[0].diameter * 1000
                                        const invalidCheckBottom =
                                            v.section.bottom > MfrD.capacity[0].diameter * 1000

                                        const invalidTextDiameter = `Diamter <= ${
                                            MfrD.capacity[0].diameter * 1000
                                        }`

                                        const invalidTextTop =
                                            v.section.top > MfrD.capacity[0].diameter * 1000
                                                ? invalidTextDiameter
                                                : `Diamter <= ${v.section.bottom}`
                                        const invalidTextBottom = invalidTextDiameter
                                        return (
                                            <TableRow
                                                key={`section-${v.index}`}
                                                style={{ textAlign: 'end' }}
                                            >
                                                <TableCell>
                                                    <TextWrapTableCell width={3}>
                                                        {initData.divided - v.index}
                                                    </TextWrapTableCell>
                                                </TableCell>
                                                <TableCell>
                                                    <TextWrapTableCell width={7}>
                                                        <TextInput
                                                            id={`section-height-${v.index}`}
                                                            labelText=""
                                                            name="height"
                                                            onChange={(e) =>
                                                                onChangeSectionTableData(
                                                                    e,
                                                                    v.index,
                                                                    v.section.height >
                                                                        MfrD.capacity[0].length *
                                                                            1000,
                                                                )
                                                            }
                                                            invalid={invalidCheckLength}
                                                            invalidText={invalidTextLength}
                                                            value={v.section.height}
                                                            disabled={notSaveValidation}
                                                        />
                                                    </TextWrapTableCell>
                                                </TableCell>
                                                <TableCell>
                                                    <TextWrapTableCell width={5}>
                                                        <Button
                                                            kind="ghost"
                                                            onClick={(e) =>
                                                                onClickTypeToggle(v.index)
                                                            }
                                                            style={{
                                                                color: v.tapered
                                                                    ? '#00fe33'
                                                                    : '#ffff00',
                                                            }}
                                                            disabled={notSaveValidation}
                                                        >
                                                            {v.tapered ? 'Tapered' : 'Linear'}
                                                        </Button>
                                                    </TextWrapTableCell>
                                                </TableCell>
                                                <TableCell>
                                                    <TextWrapTableCell width={7}>
                                                        <TextInput
                                                            id={`section-top-${v.index}`}
                                                            labelText=""
                                                            name="top"
                                                            onChange={(e) =>
                                                                onChangeSectionTableData(
                                                                    e,
                                                                    v.index,
                                                                    invalidCheckTop ||
                                                                        invalidTopBottom,
                                                                )
                                                            }
                                                            invalid={
                                                                invalidCheckTop || invalidTopBottom
                                                            }
                                                            invalidText={invalidTextTop}
                                                            value={v.section.top}
                                                            disabled={
                                                                !v.tapered || notSaveValidation
                                                            }
                                                        />
                                                    </TextWrapTableCell>
                                                </TableCell>
                                                <TableCell>
                                                    <TextWrapTableCell width={7}>
                                                        <TextInput
                                                            id={`section-bottom-${v.index}`}
                                                            labelText=""
                                                            name="bottom"
                                                            onChange={(e) =>
                                                                onChangeSectionTableData(
                                                                    e,
                                                                    v.index,
                                                                    invalidCheckBottom,
                                                                )
                                                            }
                                                            invalid={invalidCheckBottom}
                                                            invalidText={invalidTextBottom}
                                                            value={v.section.bottom}
                                                            disabled={
                                                                linearTypeValidationNotLastSection ||
                                                                notSaveValidation
                                                            }
                                                        />
                                                    </TextWrapTableCell>
                                                </TableCell>
                                            </TableRow>
                                        )
                                    })}
                            </TableBody>
                        </Table>
                        <br />
                        <Table size="lg">
                            <TableBody>
                                <TableRow>
                                    <TableCell>
                                        <TextWrapTableCell width={5}>
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
                                                    sectionData
                                                        .map((v) => v.section.height)
                                                        .reduce((prev, curr) => prev + curr, 0) !=
                                                    initData.maxHeight
                                                }
                                                invalidText={`Total = ${initData.maxHeight}`}
                                                value={sectionData
                                                    .map((v) => v.section.height)
                                                    .reduce((prev, curr) => prev + curr, 0)}
                                                disabled={divided !== sectionData.length}
                                            />
                                        </TextWrapTableCell>
                                    </TableCell>
                                    <TableCell>
                                        <TextWrapTableCell width={24}>
                                            {`Tower Total Height ${initData.maxHeight}mm (= ${
                                                initData.maxHeight / 1000
                                            }m) `}
                                        </TextWrapTableCell>
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>

                        <InputDivider />
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
                        </Button>
                        <SectionDivider />
                        <div
                            style={{
                                paddingBlock: '1rem',
                                marginBottom: '100px',
                                float: 'right',
                            }}
                        >
                            <Button
                                kind="tertiary"
                                renderIcon={ArrowRight32}
                                disabled={!validSecondStep}
                                as={NavLink}
                                to={validSecondStep ? `/workspace/${workspace}/model/section` : ''}
                            >
                                NEXT
                            </Button>
                        </div>
                    </>
                </SettingViewFit>
            </SettingWrap>
        </FlexWrap>
    )
}

export default Frame
