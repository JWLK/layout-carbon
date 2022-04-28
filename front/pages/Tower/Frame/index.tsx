import React, { useState, useCallback, useEffect } from 'react'

//Current Page Parameter
import { useParams } from 'react-router'
//Request
import useSWR from 'swr'
import fetchStore from '@utils/store'

/* @objects/Data */
import { RawData } from '@objects/Data/InitValue'
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
} from 'typings/object'

//CSS
import { PageTypeWide, Header, Section, SectionDivider } from '@pages/Common/ContentsLayout/styles'
import {
    FlexWrap,
    GraphicWrap,
    SettingWrap,
    GraphicViewOrigin,
    GraphicViewHarf,
    SettingView,
    SettingTitle,
    InputLabel,
    InputDivider,
    /* Custom Carbon Design Component */
    NumberInputCustom,
    SliderCustom,
} from './styles'
import { Fade32 } from '@carbon/icons-react'
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
    //total height

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

    const onClickSetSectionsInitData = useCallback(
        (e) => {
            e.preventDefault()
            var sectionsObject = [] as TWSection[]
            var partsObject = [] as TWParts[]
            var sectorsObject = [] as TWSectors[]
            var flangesObject = [] as TWFlanges[]

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
                        height: eachHeight,
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
                                height: eachHeight,
                            },
                            thickness: 50,
                        },
                    ],
                    divided: 1,
                }

                sectorsObject[divided - 1 - i] = {
                    index: i,
                    sectors: [
                        {
                            index: 0,
                            sector: {
                                degree: 0,
                                radian: 0,
                                originConeHeight: 0,
                                originConeHypo: 0,
                                originConeArcLength: 0,
                                topConeHeight: 0,
                                topConeHypo: 0,
                                topConeArcLength: 0,
                                trancatedConeHeight: 0,
                                trancatedConeHypo: 0,
                                trancatedMargin: 0,
                                paperOriginWidth: 0,
                                paperOriginHeight: 0,
                                paperMargin: 0,
                                paperSheetWidth: 0,
                                paperSheetHeight: 0,
                            },
                        },
                    ],
                }

                /* Calc Flange Value */
                flangesObject[divided - 1 - i] = {
                    index: i,
                    flanges: [
                        {
                            index: 0,
                            flange: {
                                outDia: 0,
                                inDia: 0,
                                flangeWidth: 0,
                                flangeHeight: 0,
                                neckWidth: 0,
                                neckHeight: 0,
                                minScrewWidth: 0,
                                pcDia: 0,
                                param_a: 0,
                                param_b: 0,
                                screwWidth: 0,
                                screwNumberOf: 0,
                            },
                        },
                        {
                            index: 1,
                            flange: {
                                outDia: 0,
                                inDia: 0,
                                flangeWidth: 0,
                                flangeHeight: 0,
                                neckWidth: 0,
                                neckHeight: 0,
                                minScrewWidth: 0,
                                pcDia: 0,
                                param_a: 0,
                                param_b: 0,
                                screwWidth: 0,
                                screwNumberOf: 0,
                            },
                        },
                    ],
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
        },
        [divided, initData, rawData, keyRawData, totalHeight, topUpperOutDia, bottomLowerOutDia],
    )

    /* Section Parameter : Current(Selected) Section Index State */
    const [currentSectionIndex, setCurrentSectionIndex] = useState(0)
    const onChaneSelectedIndex = useCallback(
        (value) => {
            setCurrentSectionIndex(value)
            /* Link to Section Index */
            setDivided(partsData[value].divided)
        },
        [partsData],
    )
    useEffect(() => {
        sectionData.map((v, index) => {
            if (index == currentSectionIndex) {
                // setScaleViewBox(onChangeScale(v.section.height))
            }
        })
    }, [currentSectionIndex, sectionData])

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
                    {sectionData.length && (
                        <VOTower
                            draws={sectionData.map((v) => v.section)}
                            currentIndex={currentSectionIndex}
                            setCurrentIndex={setCurrentSectionIndex}
                        />
                    )}
                </GraphicViewOrigin>
            </GraphicWrap>
            <SettingWrap>
                <SettingView>
                    <SettingTitle>Tower Initial Design</SettingTitle>
                    <SectionDivider />
                    <InputLabel>Tower Total Height</InputLabel>
                    <NumberInputCustom
                        id="NumberInput_totalHeight"
                        label=""
                        invalidText="This value cannot be used. (Valid Value = 5,000mm~200,000mm)"
                        min={5000}
                        max={200000}
                        onChange={onChangeTotalHeight}
                        size="lg"
                        step={100}
                        value={totalHeight}
                        warnText="A high threshold may impact performance"
                    />
                    <InputDivider />
                    <InputLabel>Section {divided} - Upper Outside Diameter</InputLabel>
                    <SliderCustom>
                        <Slider
                            id="Slider_topUpperOutDia"
                            max={8000}
                            min={3000}
                            step={50}
                            value={topUpperOutDia}
                            onChange={onChangeTopUpperOutDia}
                            style={{ fontSize: '3rem' }}
                        />
                    </SliderCustom>
                    <InputDivider />
                    <InputLabel>Section 1 - Lower Outside Diameter</InputLabel>
                    <SliderCustom>
                        <Slider
                            id="Slider_bottomLowerOutDia"
                            labelText=""
                            max={8000}
                            min={3000}
                            step={50}
                            value={bottomLowerOutDia}
                            onChange={onChangeBottomLowerOutDia}
                        />
                    </SliderCustom>
                    <SectionDivider />
                </SettingView>
            </SettingWrap>
        </FlexWrap>
    )
}

export default Frame
