import React, { useState, useCallback, useEffect } from 'react'
import { useParams } from 'react-router'

//Request
import useSWR from 'swr'
import fetchStore from '@utils/store'

import { Fade32, SettingsCheck32 } from '@carbon/icons-react'
import {
    Grid,
    Row,
    Column,
    Tile,
    AspectRatio,
    Accordion,
    AccordionItem,
    ContentSwitcher,
    Switch,
    Button,
    Toggle,
    TextInput,
    NumberInput,
    Slider,
    FormGroup,
    RadioButtonGroup,
    RadioButton,
    Dropdown,
    Tabs,
    Tab,
} from 'carbon-components-react'

/*Tower Element*/
//Type
import { ObjPoint, ObjSquare, TWInitialValue, TWRawData } from 'typings/object'
//Data
import { InitValue } from '@objects/Data/InitValue'
//Element
import { ViewSize, ViewCenter, AxisX, AxisY } from '@objects/Base/AxisSections'

import Sections from '@objects/Tower/Sections'
import Parts from '@objects/Tower/Parts'

const BuildValue = () => {
    /* Param */
    const { workspace } = useParams<{ workspace?: string }>()
    /* Localstorage */
    const key = `${workspace}-towerData`
    if (localStorage.getItem(key) === null) {
        localStorage.setItem(key, JSON.stringify(InitValue))
    }
    /* SWR */
    const { data: TD, mutate } = useSWR<TWRawData>(key, fetchStore)

    /* State */
    //Set Tower Number of Section
    // const [sectionNumber, setSectionNumber] = useState('Sec-9')
    // const onChangeSectionNumber = useCallback(
    //     (value) => {
    //         setSectionNumber(value)
    //         // console.log(value)
    //     },
    //     [sectionNumber, setSectionNumber],
    // )
    // //Set Tower Type Option
    // const [typeOption, setTypeOption] = useState('Type-a')
    // const onChangeTypeOption = useCallback(
    //     (value) => {
    //         setTypeOption(value)
    //         // console.log(value)
    //     },
    //     [typeOption, setTypeOption],
    // )

    //Initial Value State
    const [rawData, setRawData] = useState({} as TWRawData)
    const [initValue, setInitValue] = useState({} as TWInitialValue)
    const [sectionsObject, setSectionsObject] = useState([] as ObjSquare[])
    const [topUpperOutDia, setTopUpperOutDia] = useState(0)
    const [bottomLowerOutDia, setBottomLowerOutDia] = useState(0)
    const [totalHeight, setTotalHeight] = useState(0)
    const [divided, setDivided] = useState(0)

    const onChangeTopUpperOutDia = useCallback(
        (e) => {
            setTopUpperOutDia(e.value)
            initValue.topUpperOutDia = e.value
            rawData.initial = initValue
            localStorage.setItem(key, JSON.stringify(rawData))
            mutate()
        },
        [initValue, rawData, topUpperOutDia],
    )

    const onChangeBottomLowerOutDia = useCallback(
        (e) => {
            setBottomLowerOutDia(e.value)
            initValue.bottomLowerOutDia = e.value
            rawData.initial = initValue
            localStorage.setItem(key, JSON.stringify(rawData))
            mutate()
        },
        [initValue, rawData, bottomLowerOutDia],
    )

    const onChangeTotalHeight = useCallback(
        (e) => {
            setTotalHeight(e.value)
            initValue.totalHeight = e.value
            rawData.initial = initValue
            localStorage.setItem(key, JSON.stringify(rawData))
            mutate()
        },
        [initValue, rawData, totalHeight],
    )

    const onChangeDevided = useCallback(
        (e) => {
            setDivided(e.value)
            initValue.divided = e.value
            rawData.initial = initValue
            localStorage.setItem(key, JSON.stringify(rawData))
            mutate()
        },
        [initValue, rawData, divided],
    )

    const onClickSetSections = useCallback(
        (e) => {
            e.preventDefault()
            var sectionsWrap = []

            for (var i = 0; i < divided; i++) {
                var eachHeight = Math.round(totalHeight / divided)
                console.log('eachHeight', eachHeight)
                var triBottom = Math.abs(topUpperOutDia - bottomLowerOutDia) / 2
                console.log('triBottom', triBottom)
                var eachHypo =
                    Math.sqrt(Math.pow(triBottom, 2) + Math.pow(totalHeight, 2)) / divided
                console.log('eachHypo', eachHypo)
                var angle = Math.PI / 2 - Math.atan(totalHeight / triBottom)
                console.log('angle', (180 / Math.PI) * angle)

                var sectionWidthTop = topUpperOutDia + eachHypo * i * Math.sin(angle) * 2
                var sectionWidthBottom = topUpperOutDia + eachHypo * (i + 1) * Math.sin(angle) * 2
                // console.log('sectionWidth', Math.round(sectionWidth * 2 + topUpperOutDia))

                sectionsWrap[divided - 1 - i] = {
                    top: sectionWidthTop,
                    bottom: sectionWidthBottom,
                    height: eachHeight,
                }
            }
            setSectionsObject(sectionsWrap)
            rawData.sections = sectionsWrap
            localStorage.setItem(key, JSON.stringify(rawData))
            mutate()
        },
        [bottomLowerOutDia, totalHeight, divided, rawData],
    )

    useEffect(() => {
        if (TD !== undefined) {
            // console.log(TD)
            setRawData(TD)
            setInitValue(TD.initial)
            setTopUpperOutDia(TD.initial.topUpperOutDia)
            setBottomLowerOutDia(TD.initial.bottomLowerOutDia)
            setTotalHeight(TD.initial.totalHeight)
            setDivided(TD.initial.divided)
        }
    }, [TD])

    if (TD === undefined) {
        return <div>Loading...</div>
    }

    return (
        <>
            <Tabs>
                <Tab label="Initial Tower Value">
                    <h3>Initial Value</h3>
                    <Row as="article" narrow>
                        <Column sm={4} md={8} lg={6} style={{ marginBlock: '0.5rem' }}>
                            <Tile>
                                <svg
                                    viewBox={`${ViewSize * 0.2} ${ViewSize * 0.1} ${
                                        ViewSize * 0.7
                                    } ${ViewSize * 0.9}`}
                                    fill="#fff"
                                >
                                    {TD.sections && (
                                        <Sections
                                            center={ViewCenter}
                                            draws={TD.sections}
                                            margin={0}
                                        />
                                    )}
                                </svg>
                            </Tile>
                        </Column>
                        <Column sm={4} md={8} lg={6} style={{ marginBlock: '0.5rem' }}>
                            <Accordion style={{ marginBlock: '2rem' }} align="end" size="lg">
                                <AccordionItem title="Tower Layout Base" open>
                                    <Slider
                                        ariaLabelInput="Top Upper Outside Diameter"
                                        id="topUpperOutDia"
                                        labelText="Top Upper Outside Diameter"
                                        max={8000}
                                        min={3000}
                                        step={50}
                                        value={topUpperOutDia}
                                        onChange={onChangeTopUpperOutDia}
                                    />
                                    <br />
                                    <br />
                                    <Slider
                                        ariaLabelInput="Bottom Lower Outside Diameter"
                                        id="bottomLowerOutDia"
                                        labelText="Bottom Lower Outside Diameter"
                                        max={8000}
                                        min={3000}
                                        step={50}
                                        value={bottomLowerOutDia}
                                        onChange={onChangeBottomLowerOutDia}
                                    />
                                    <br />
                                    <br />
                                    <Slider
                                        ariaLabelInput="Bottom Lower Outside Diameter"
                                        id="bottomLowerOutDia"
                                        labelText="Total Height"
                                        max={110000}
                                        min={90000}
                                        step={100}
                                        value={totalHeight}
                                        onChange={onChangeTotalHeight}
                                    />
                                    <br />
                                    <br />
                                    <Slider
                                        ariaLabelInput="Number of Tower Sectionl"
                                        id="initial-divided"
                                        labelText="Number of Tower Sectionl"
                                        max={6}
                                        min={1}
                                        step={1}
                                        value={divided}
                                        onChange={onChangeDevided}
                                    />
                                    <br />
                                    <br />
                                    <Button
                                        renderIcon={SettingsCheck32}
                                        onClick={onClickSetSections}
                                    >
                                        Set
                                    </Button>
                                    <br />
                                    <br />
                                </AccordionItem>
                                <AccordionItem title="Setting Value" open>
                                    <Slider
                                        ariaLabelInput="Top Upper Outside Diameter"
                                        id="topUpperOutDia"
                                        labelText="Top Upper Outside Diameter"
                                        max={8000}
                                        min={3000}
                                        step={50}
                                        value={topUpperOutDia}
                                        onChange={onChangeTopUpperOutDia}
                                    />
                                    <br />
                                    <Slider
                                        ariaLabelInput="Bottom Lower Outside Diameter"
                                        id="bottomLowerOutDia"
                                        labelText="Bottom Lower Outside Diameter"
                                        max={8000}
                                        min={3000}
                                        step={50}
                                        value={bottomLowerOutDia}
                                        onChange={onChangeBottomLowerOutDia}
                                    />
                                    <br />
                                    <Slider
                                        ariaLabelInput="Bottom Lower Outside Diameter"
                                        id="bottomLowerOutDia"
                                        labelText="Total Height"
                                        max={110000}
                                        min={90000}
                                        step={100}
                                        value={totalHeight}
                                        onChange={onChangeTotalHeight}
                                    />
                                </AccordionItem>
                            </Accordion>
                        </Column>
                    </Row>
                </Tab>
                {/* <Tab label="Each Parts Value">
                    <h3>Parts Value</h3>
                    <Row as="article" narrow>
                        <Column sm={4} md={8} lg={6} style={{ marginBlock: '0.5rem' }}>
                            <Tile>
                                <AspectRatio>
                                    <svg viewBox={ViewBox} fill="#fff">
                                        {TD?.parts && (
                                            <Sections
                                                center={ViewCenter}
                                                draws={TD?.parts[0]}
                                                margin={300}
                                            />
                                        )}
                                        <AxisX />
                                        <AxisY />
                                    </svg>
                                </AspectRatio>
                            </Tile>
                        </Column>
                        <Column sm={4} md={8} lg={6} style={{ marginBlock: '0.5rem' }}>
                            <Accordion style={{ marginBlock: '2rem' }} align="end" size="lg">
                                <AccordionItem title="Tower Layout Base" open>
                                    <TextInput
                                        id="tower-height"
                                        invalidText="Valid value is required"
                                        labelText="Tower Total Height"
                                        value="20145"
                                        placeholder="Input tower total height."
                                        disabled
                                    />
                                    <br />
                                    <RadioButtonGroup
                                        legendText="Select Number of Section"
                                        name="tower-section"
                                        defaultSelected="Sec-9"
                                        orientation="vertical"
                                        onChange={onChangeSectionNumber}
                                    >
                                        <RadioButton labelText="9" value="Sec-9" id="Sec-9" />
                                        <RadioButton labelText="6" value="Sec-6" id="Sec-6" />
                                    </RadioButtonGroup>
                                    <br />
                                    <RadioButtonGroup
                                        legendText="Select Slope Type"
                                        name="tower-slope"
                                        defaultSelected="Type-a"
                                        orientation="vertical"
                                        valueSelected={typeOption}
                                        onChange={onChangeTypeOption}
                                    >
                                        <RadioButton
                                            labelText="Type A"
                                            value="Type-a"
                                            id="type-a"
                                        />
                                        <RadioButton
                                            labelText="Type B"
                                            value="Type-b"
                                            id="type-b"
                                        />
                                        <RadioButton
                                            labelText="Type C"
                                            value="Type-c"
                                            id="type-c"
                                        />
                                    </RadioButtonGroup>
                                </AccordionItem>
                            </Accordion>
                        </Column>
                    </Row>
                </Tab> */}
                <Tab label="Tab label 2">
                    <p>Content for second tab goes here.</p>
                </Tab>
            </Tabs>
        </>
    )
}

export default BuildValue
