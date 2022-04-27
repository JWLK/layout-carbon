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
} from './styles'
import { Fade32 } from '@carbon/icons-react'
import { Grid, Row, Column, Button, TextInput } from 'carbon-components-react'

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
    const [flangeData, setFlangeData] = useState([] as TWFlanges[])
    const [sectorsData, setSectorsData] = useState([] as TWSectors[])

    /* Current Page Mode Swicher */
    const [modeSwicher, setModeSwicher] = useState('part')
    const onChangeModeSwitcher = useCallback((e) => {
        setModeSwicher(e.name)
    }, [])

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
    }, [currentSectionIndex, initData.totalHeight, sectionData])

    /* Section Parameter : Section Thickness State*/
    const [defaultThick, setDefaultThick] = useState(1)
    const onChangeDefaultThickness = useCallback(
        (e) => {
            partsData[currentSectionIndex].parts.map((v) => (v.thickness = e.value))
            updateFlangeThicknessSync(e.value)
            rawData.partsData = partsData
            localStorage.setItem(keyRawData, JSON.stringify(rawData))
            mutate()
        },
        [currentSectionIndex, keyRawData, partsData, rawData],
    )

    /* Section Parmeter : Section Divided State */
    const [divided, setDivided] = useState(1)
    const onChangeDevided = useCallback((e) => {
        setDivided(e.value)
    }, [])

    /* Flange Parameter : updateFlangeThickness */
    const updateFlangeThicknessSync = (thickness: number) => {
        //Set Upper Flange Thickness
        //Set Lower Flange Thickness
        // rawData.flangeData[currentSectionIndex] = flangeData[currentSectionIndex]
        // localStorage.setItem(keyRawData, JSON.stringify(rawData))
        // mutate()
    }

    /* Part Parameter */
    const [currentPartIndex, setCurrentPartIndex] = useState(0)

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
            setSectionData(TD.sectionData)
            setPartsData(TD.partsData)
            setSectorsData(TD.sectorsData)
            setFlangeData(TD.flangeData)
            setDivided(TD.partsData[currentSectionIndex].divided)
            // setThinckness(TD.partsData[currentSectionIndex].parts[currentPartIndex].thickness)
        }
    }, [TD])

    if (TD === undefined) {
        return <div>Loading...</div>
    }

    return (
        <FlexWrap>
            <GraphicWrap>
                <GraphicViewOrigin>
                    {partsData.length && (
                        <VOSection
                            draws={partsData[currentSectionIndex].parts.map((v) => v.part)}
                            currentPartIndex={currentPartIndex}
                            setCurrentPartIndex={setCurrentPartIndex}
                        />
                    )}
                </GraphicViewOrigin>
            </GraphicWrap>
            <GraphicWrap>
                <GraphicViewHarf>
                    {partsData.length && (
                        <VHalf
                            draws={partsData[currentSectionIndex].parts.map((v) => v.part)}
                            currentPartIndex={currentPartIndex}
                            setCurrentPartIndex={setCurrentPartIndex}
                        />
                    )}
                </GraphicViewHarf>
                <GraphicViewHarf>
                    {partsData.length && (
                        <VHalf
                            draws={partsData[currentSectionIndex].parts.map((v) => v.part)}
                            currentPartIndex={currentPartIndex}
                            setCurrentPartIndex={setCurrentPartIndex}
                        />
                    )}
                </GraphicViewHarf>
            </GraphicWrap>

            <SettingWrap>
                <SettingView></SettingView>
            </SettingWrap>
        </FlexWrap>
    )
}

export default Frame
