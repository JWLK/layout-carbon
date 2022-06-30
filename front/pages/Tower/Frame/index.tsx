import React, { useState, useCallback, useEffect } from 'react'
import { NavLinkProps, NavLink } from 'react-router-dom'

//Current Page Parameter
import { useParams } from 'react-router'
//Request
import useSWR from 'swr'
import fetchStore from '@utils/store'

/* @objects/Data */
import { RawData, InitSector } from '@objects/Data/InitValue'
/* @objects/Tools */
import { toRadian, toAngle } from '@objects/Tools/Cartesian'
/* @objects/Element */
import VOrigin from '@objects/Tower/Body/VOrigin'
import VOTower from '@objects/Tower/Body/VOTower'
import VOSection from '@objects/Tower/Body/VOSection'
import VHalf from '@objects/Tower/Body/VHalf'

/* @typings */
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
    SettingViewCorver,
    SettingTitle,
    InputLabel,
    InputDivider,
    /* Custom Carbon Design Component */
    NumberInputCustom,
    SliderCustom,
} from '@pages/Tower/Frame/styles'
import { Fade32, ArrowRight32, CheckmarkOutline32 } from '@carbon/icons-react'
import { Grid, Row, Column, Button, TextInput, NumberInput, Slider } from 'carbon-components-react'

const Frame = () => {
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
            initData.totalHeight = valueNumber
            rawData.initial = initData
            localStorage.setItem(keyRawData, JSON.stringify(rawData))
        },
        [keyRawData, rawData, initData],
    )
    const onChangeDevided = useCallback((e) => {
        setDivided(e.value)
    }, [])

    /* Initial Parameter : Validation Check */
    const [validNextStep, setValidNextStep] = useState(false)
    //Valid Parmeter
    const [validHeight, setValidHeight] = useState(totalHeight >= 5000 && totalHeight <= 200000)
    const [validTopBottom, setValidTopBottom] = useState(
        bottomLowerOutDia >= topUpperOutDia ? true : false,
    )
    //Valid Button Event
    const [validInitialData, setValidInitialData] = useState(validHeight && validTopBottom)
    useEffect(() => {
        setValidHeight(totalHeight >= 5000 && totalHeight <= 200000)
        setValidTopBottom(bottomLowerOutDia >= topUpperOutDia ? true : false)
        if (validHeight && validTopBottom) {
            setValidInitialData(true)
        } else {
            setValidInitialData(false)
        }
        setValidNextStep(false)
    }, [bottomLowerOutDia, topUpperOutDia, totalHeight, validHeight, validTopBottom])

    const onClickSetSectionsInitData = useCallback(
        (e) => {
            e.preventDefault()
            setCurrentSectionIndex(0)
            var sectionsObject = [] as TWSection[]
            var partsObject = [] as TWParts[]
            var sectorsObject = [] as TWSectors[]
            var flangesObject = [] as TWFlanges[]
            var defaultFlangeHeight = 200
            var defaultNeckHeight = 100

            for (var i = 0; i < divided; i++) {
                /* Init Value */
                var eachSectionHeight = Math.round(totalHeight / divided)
                var eachPartHeight =
                    eachSectionHeight - 2 * (defaultFlangeHeight + defaultNeckHeight)
                var triBottom = Math.abs(topUpperOutDia - bottomLowerOutDia) / 2
                var eachHypo =
                    Math.sqrt(Math.pow(triBottom, 2) + Math.pow(totalHeight, 2)) / divided
                var radian = Math.PI / 2 - Math.atan(totalHeight / triBottom)

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
                    index: divided - 1 - i,
                    section: {
                        top: sectionWidthTop,
                        bottom: sectionWidthBottom,
                        height: eachSectionHeight,
                    },
                    tapered: true,
                    thickness: 50,
                    weight: 0,
                }

                partsObject[divided - 1 - i] = {
                    index: divided - 1 - i,
                    parts: [
                        {
                            index: 0,
                            part: {
                                top: sectionWidthTop,
                                bottom: sectionWidthBottom,
                                height: eachPartHeight,
                            },
                            thickness: 50,
                            weight: 0,
                        },
                    ],
                    divided: 1,
                }

                /* Calc Flange Value */
                flangesObject[divided - 1 - i] = {
                    index: divided - 1 - i,
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
                            weight: 0,
                            flangeWeight: 0,
                            partWeight: 0,
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
                            weight: 0,
                            flangeWeight: 0,
                            partWeight: 0,
                        },
                    ],
                }

                sectorsObject[divided - 1 - i] = {
                    index: divided - 1 - i,
                    sectors: [InitSector],
                }
            }

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
            setValidNextStep(true)
        },
        [divided, initData, rawData, keyRawData, totalHeight, topUpperOutDia, bottomLowerOutDia],
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
        }
    }, [TD])

    if (TD === undefined) {
        return <div>Loading...</div>
    }

    return (
        <FlexWrap>
            <GraphicWrap>
                <GraphicViewOrigin>
                    {/* <VOTower
                        draws={sectionData.map((v) => v.section)}
                        currentIndex={currentSectionIndex}
                        setCurrentIndex={setCurrentSectionIndex}
                    /> */}
                </GraphicViewOrigin>
            </GraphicWrap>
            <SettingWrap>
                <SettingViewCorver>
                    <SettingTitle>
                        Tower Initial Design
                        <div style={{ float: 'right', paddingBottom: '100px' }}>
                            <Button
                                kind="tertiary"
                                renderIcon={ArrowRight32}
                                disabled={!validNextStep}
                                as={NavLink}
                                to={`/workspace/${workspace}/model/section`}
                            >
                                NEXT
                            </Button>
                        </div>
                    </SettingTitle>

                    {!validInitialData && (
                        <div style={{ width: '100%', color: '#fa4d56' }}>
                            Invalid Value Exist. Check input value
                        </div>
                    )}
                    <SectionDivider />
                    <InputLabel>Tower Total Height (mm)</InputLabel>
                    <NumberInputCustom
                        id="NumberInput_totalHeight"
                        label=""
                        size="lg"
                        min={5000}
                        max={200000}
                        step={100}
                        value={totalHeight}
                        onChange={onChangeTotalHeight}
                        invalidText="This value cannot be used. (Valid Value : 5,000mm ~ 200,000mm)"
                        warnText="Warn Text"
                    />
                    <InputDivider />
                    <InputLabel>Section {divided} - Upper Outside Diameter (mm)</InputLabel>
                    <SliderCustom>
                        <Slider
                            id="Slider_topUpperOutDia"
                            min={3000}
                            max={8000}
                            step={50}
                            value={topUpperOutDia}
                            onChange={onChangeTopUpperOutDia}
                            style={{ fontSize: '3rem' }}
                            invalid={!validTopBottom}
                        />
                    </SliderCustom>
                    <InputDivider />
                    <InputLabel>Section 1 - Lower Outside Diameter (mm)</InputLabel>
                    <SliderCustom>
                        <Slider
                            id="Slider_bottomLowerOutDia"
                            labelText=""
                            min={3000}
                            max={8000}
                            step={50}
                            value={bottomLowerOutDia}
                            onChange={onChangeBottomLowerOutDia}
                            invalid={!validTopBottom}
                        />
                    </SliderCustom>
                    <InputDivider />
                    <InputLabel>Number of Tower Section (mm)</InputLabel>
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
                    <InputDivider />

                    <Button
                        renderIcon={CheckmarkOutline32}
                        onClick={onClickSetSectionsInitData}
                        disabled={!validInitialData}
                    >
                        SAVE : Tower Initial Design
                    </Button>

                    <SectionDivider />
                    {!validInitialData && (
                        <div style={{ width: '100%', color: '#fa4d56' }}>
                            Invalid Value Exist. Check input value
                        </div>
                    )}

                    <div style={{ float: 'right', paddingBottom: '100px' }}>
                        <Button
                            kind="tertiary"
                            renderIcon={ArrowRight32}
                            disabled={!validNextStep}
                            as={NavLink}
                            to={`/workspace/${workspace}/model/section`}
                        >
                            NEXT
                        </Button>
                    </div>
                </SettingViewCorver>
            </SettingWrap>
        </FlexWrap>
    )
}

export default Frame
