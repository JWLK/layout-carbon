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
        const freqArray = [] as TWFrequency[]
        const elementLength = partsData.forEach((e) => e.divided)
        console.log(elementLength)
    }, [partsData])

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
