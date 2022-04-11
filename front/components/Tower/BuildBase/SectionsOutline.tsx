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
import { RawData } from '@objects/Data/InitValue'
//Element
import { ViewSize, ViewMargin, ViewCenter, AxisX, AxisY } from '@objects/Base/AxisSections'

import Sections from '@objects/Tower/Sections'

const SectionOutline = () => {
    /* Param */
    const { workspace } = useParams<{ workspace?: string }>()
    /* Localstorage */
    const key = `${workspace}-towerData`
    if (localStorage.getItem(key) === null) {
        localStorage.setItem(key, JSON.stringify(RawData))
    }
    /* SWR */
    const { data: TD, mutate } = useSWR<TWRawData>(key, fetchStore)

    /* State */
    //Initial Value State
    const [rawData, setRawData] = useState({} as TWRawData)
    const [initValue, setInitValue] = useState({} as TWInitialValue)
    const [sectionsObject, setSectionsObject] = useState([] as ObjSquare[])

    const [scaleViewBox, setScaleViewBox] = useState(
        `${ViewMargin * 3.5} ${25000} ${ViewSize / 1.5} ${ViewSize - 25000}`,
    )
    const [totalHeight, setTotalHeight] = useState(0)
    const [topUpperOutDia, setTopUpperOutDia] = useState(0)
    const [bottomLowerOutDia, setBottomLowerOutDia] = useState(0)
    const [divided, setDivided] = useState(0)

    const onChangeTotalHeight = useCallback(
        (e) => {
            console.log(e.imaginaryTarget.value)
            setTotalHeight(e.imaginaryTarget.value)
            initValue.totalHeight = e.imaginaryTarget.value
            rawData.initial = initValue
            localStorage.setItem(key, JSON.stringify(rawData))
            // mutate()
        },
        [initValue, rawData, totalHeight],
    )

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

    const onChangeScale = useCallback((value) => {
        if (value > 180000) {
            setScaleViewBox(`${ViewMargin} ${-65000} ${ViewSize} ${ViewSize + 65000}`)
        } else if (value > 140000) {
            setScaleViewBox(`${ViewMargin * 2.5} ${-45000} ${ViewSize / 1.2} ${ViewSize + 45000}`)
        } else if (value > 110000) {
            setScaleViewBox(`${ViewMargin * 3} ${-5000} ${ViewSize / 1.3} ${ViewSize + 5000}`)
        } else {
            setScaleViewBox(`${ViewMargin * 3.5} ${25000} ${ViewSize / 1.5} ${ViewSize - 25000}`)
        }
    }, [])

    const onClickSetSections = useCallback(
        (e) => {
            e.preventDefault()
            var sectionsWrap = []
            var partsWrap = []

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
                partsWrap[divided - 1 - i] = [
                    { top: sectionWidthTop, bottom: sectionWidthBottom, height: eachHeight },
                ]
            }
            setSectionsObject(sectionsWrap)

            onChangeScale(totalHeight)

            rawData.sections = sectionsWrap
            rawData.parts = partsWrap
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
            setTotalHeight(TD.initial.totalHeight)
            onChangeScale(TD.initial.totalHeight)
            setTopUpperOutDia(TD.initial.topUpperOutDia)
            setBottomLowerOutDia(TD.initial.bottomLowerOutDia)
            setDivided(TD.initial.divided)
        }
    }, [TD])

    if (TD === undefined) {
        return <div>Loading...</div>
    }

    return (
        <>
            <Row as="article" narrow>
                <Column sm={4} md={8} lg={6} style={{ marginBlock: '0.5rem' }}>
                    <Tile>
                        <svg viewBox={scaleViewBox} fill="#fff">
                            {TD.sections && (
                                <Sections center={ViewCenter} draws={TD.sections} margin={0} />
                            )}
                        </svg>
                    </Tile>
                </Column>
                <Column sm={4} md={8} lg={6} style={{ marginBlock: '0.5rem' }}>
                    <Accordion style={{ marginBlock: '2rem' }} align="end" size="lg">
                        <AccordionItem title="Tower Layout Base" open>
                            <NumberInput
                                id="totalHeight"
                                label="Total Height"
                                invalidText="This value cannot be used. (Valid Value = 5,000mm~200,000mm)"
                                min={5000}
                                max={200000}
                                onChange={onChangeTotalHeight}
                                size="lg"
                                step={100}
                                value={totalHeight}
                                warnText="A high threshold may impact performance"
                            />
                            <br />
                            <br />

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

                            <Button renderIcon={SettingsCheck32} onClick={onClickSetSections}>
                                Set
                            </Button>
                            <br />
                            <br />
                        </AccordionItem>
                    </Accordion>
                </Column>
            </Row>
        </>
    )
}

export default SectionOutline
