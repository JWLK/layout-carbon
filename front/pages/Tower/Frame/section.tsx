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
    const onChaneSectionIndex = useCallback(
        (value) => {
            setCurrentSectionIndex(value)
            /* Link to Section Index */
            setDivided(partsData[value].divided)
        },
        [partsData],
    )

    /* STEP 1 - Mass Check */
    /* Section Parameter : Each Section Mass Setting value */
    const [totalThickness, setTotalThickness] = useState(0)
    const onChangeTotalThickness = useCallback(
        (e) => {
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
                return v
            })

            //Set RawData Sync
            rawData.partsData[currentSectionIndex].parts = partObject
            rawData.flangesData[currentSectionIndex].flanges = flangeObject
            localStorage.setItem(keyRawData, JSON.stringify(rawData))
        },
        [partsData, currentSectionIndex, flangesData, rawData, keyRawData],
    )

    /* STEP 2 - Each Section -> Part & Each Part Value Check */
    /* Part Parameter */
    const [currentPartIndex, setCurrentPartIndex] = useState(0)
    const [divided, setDivided] = useState(1) // part divided
    const onChanePartIndex = useCallback((value) => {
        setCurrentPartIndex(value)
        /* Link to Part Index */
    }, [])
    const onChangeDevided = useCallback((e) => {
        setDivided(e.value)
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
            setInitData(TD.initial)
            //SectionData
            setSectionData(TD.sectionData)
            //PartsData
            setPartsData(TD.partsData)
            //Section & Parts
            setTotalThickness(TD.partsData[currentSectionIndex].parts[currentPartIndex].thickness)
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
        <FlexWrap>
            <GraphicWrap>
                <GraphicViewOrigin>
                    {partsData.length && (
                        <VOSection
                            draws={partsData[currentSectionIndex].parts.map((v) => v.part)}
                            currentIndex={currentPartIndex}
                            setCurrentIndex={setCurrentPartIndex}
                        />
                    )}
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
                    <SettingTitle>
                        {`Section ${currentSectionIndex + 1} - Production Check`}
                        <div style={{ float: 'right', paddingBottom: '100px' }}>
                            <Button
                                kind="tertiary"
                                renderIcon={ArrowRight32}
                                // disabled={!validNextStep}
                            >
                                NEXT
                            </Button>
                        </div>
                    </SettingTitle>
                    <InputLabel>= Lower Flange : Section 2</InputLabel>
                    {/* {!validInitialData && (
                        <div style={{ width: '100%', color: '#fa4d56' }}>
                            Invalid Value Exist. Check input value
                        </div>
                    )} */}
                    <SectionDivider />
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

                <SectionDivider />

                {/* STEP : Flange Upper */}
                <SettingViewWide>
                    <SettingViewWideInner>
                        <SettingTitle>Upper Flange : Section 1</SettingTitle>
                        <InputLabel>= Lower Flange : Section 2</InputLabel>
                    </SettingViewWideInner>
                    <GraphicWrapHarf>
                        <GraphicViewHarf>
                            {partsData.length && (
                                <VHFlange
                                    draws={partsData[currentSectionIndex].parts.map((v) => v.part)}
                                    currentPartIndex={currentPartIndex}
                                    setCurrentPartIndex={setCurrentPartIndex}
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

                <SectionDivider />

                {/* STEP : Flange Lower */}
                <SettingViewWide>
                    <SettingViewWideInner>
                        <SettingTitle>Lower Flange : Section 1</SettingTitle>
                        <InputLabel></InputLabel>
                    </SettingViewWideInner>
                    <GraphicWrapHarf>
                        <GraphicViewHarf>
                            {partsData.length && (
                                <VHFlange
                                    draws={partsData[currentSectionIndex].parts.map((v) => v.part)}
                                    currentPartIndex={currentPartIndex}
                                    setCurrentPartIndex={setCurrentPartIndex}
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
            </SettingWrap>
        </FlexWrap>
    )
}

export default Frame
