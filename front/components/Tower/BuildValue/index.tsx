import React, { useState, useCallback } from 'react'

import { ObjPoint, ObjSquare, ObjData } from 'typings/db'

import { Fade32 } from '@carbon/icons-react'
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
    FormGroup,
    RadioButtonGroup,
    RadioButton,
    Dropdown,
    Tabs,
    Tab,
} from 'carbon-components-react'

//Tower Element
import { ViewBox, ViewCenter } from '@objects/Base/AxisBase'
import AxisX from '@objects/Base/AxisX'
import AxisY from '@objects/Base/AxisY'

import Parts from '@objects/Tower/Parts'

const BuildValue = () => {
    const towerData = {
        base: { totalHeight: 100000, offset: 10, maxHeight: 110000, custom: false, divided: 4 },
        section: { 0: true, 1: 25000, 2: 25000, 3: 27500, 4: 30000 },
        parts: {
            0: true,
            1: [
                { top: 6200, bottom: 6500, height: 2100 },
                { top: 6000, bottom: 6200, height: 2100 },
                { top: 5600, bottom: 6000, height: 2100 },
                { top: 5400, bottom: 5600, height: 2100 },
                { top: 5200, bottom: 5400, height: 2250 },
                { top: 5000, bottom: 5200, height: 2250 },
                { top: 4800, bottom: 5000, height: 2250 },
                { top: 4600, bottom: 4800, height: 2250 },
                { top: 4000, bottom: 4600, height: 2335 },
            ],
            2: [
                { top: 6200, bottom: 6500, height: 2100 },
                { top: 6000, bottom: 6200, height: 2100 },
                { top: 5600, bottom: 6000, height: 2100 },
                { top: 5400, bottom: 5600, height: 2100 },
                { top: 5200, bottom: 5400, height: 2250 },
                { top: 5000, bottom: 5200, height: 2250 },
                { top: 4800, bottom: 5000, height: 2250 },
                { top: 4600, bottom: 4800, height: 2250 },
                { top: 4000, bottom: 4600, height: 2335 },
            ],
            3: [
                { top: 6200, bottom: 6500, height: 2100 },
                { top: 6000, bottom: 6200, height: 2100 },
                { top: 5600, bottom: 6000, height: 2100 },
                { top: 5400, bottom: 5600, height: 2100 },
                { top: 5200, bottom: 5400, height: 2250 },
                { top: 5000, bottom: 5200, height: 2250 },
                { top: 4800, bottom: 5000, height: 2250 },
                { top: 4600, bottom: 4800, height: 2250 },
                { top: 4000, bottom: 4600, height: 2335 },
            ],
            4: [
                { top: 6200, bottom: 6500, height: 2100 },
                { top: 6000, bottom: 6200, height: 2100 },
                { top: 5600, bottom: 6000, height: 2100 },
                { top: 5400, bottom: 5600, height: 2100 },
                { top: 5200, bottom: 5400, height: 2250 },
                { top: 5000, bottom: 5200, height: 2250 },
                { top: 4800, bottom: 5000, height: 2250 },
                { top: 4600, bottom: 4800, height: 2250 },
                { top: 4000, bottom: 4600, height: 2335 },
            ],
        },
    }

    /* State */
    //Set Tower Number of Section
    const [sectionNumber, setSectionNumber] = useState('Sec-9')
    const onChangeSectionNumber = useCallback(
        (value) => {
            setSectionNumber(value)
            // console.log(value)
        },
        [sectionNumber, setSectionNumber],
    )
    //Set Tower Type Option
    const [typeOption, setTypeOption] = useState('Type-a')
    const onChangeTypeOption = useCallback(
        (value) => {
            setTypeOption(value)
            // console.log(value)
        },
        [typeOption, setTypeOption],
    )

    return (
        <>
            <Tabs>
                <Tab label="Base Tower Value"></Tab>
                <Tab label="Each Parts Value">
                    <h3>Parts Value</h3>
                    <Row as="article" narrow>
                        <Column sm={4} md={8} lg={6} style={{ marginBlock: '0.5rem' }}>
                            <Tile>
                                <AspectRatio>
                                    <svg viewBox={ViewBox} fill="#fff">
                                        {towerData.parts[0] ? (
                                            <Parts
                                                center={ViewCenter}
                                                draws={towerData.parts[1]}
                                                margin={300}
                                            />
                                        ) : (
                                            <div>Data Not Setting</div>
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
                </Tab>
                <Tab label="Tab label 2">
                    <p>Content for second tab goes here.</p>
                </Tab>
            </Tabs>
        </>
    )
}

export default BuildValue
