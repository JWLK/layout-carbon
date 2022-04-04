import React, { useState, useCallback } from 'react'

import { PageTypeWide, Header, Section, SectionDivider } from '@pages/Common/ContentsLayout/styles'

import {} from './styles'

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
} from 'carbon-components-react'

//Tower Element
import { ViewBox, ViewCenter } from '@objects/Base/AxisBase'
import AxisX from '@objects/Base/AxisX'
import AxisY from '@objects/Base/AxisY'

import Sections from '@objects/Tower/Sections'

const InitWallValue = () => {
    const sectionData = [
        { top: 6200, bottom: 6500, height: 2100 },
        { top: 6000, bottom: 6200, height: 2100 },
        { top: 5600, bottom: 6000, height: 2100 },
        { top: 5400, bottom: 5600, height: 2100 },
        { top: 5200, bottom: 5400, height: 2250 },
        { top: 5000, bottom: 5200, height: 2250 },
        { top: 4800, bottom: 5000, height: 2250 },
        { top: 4600, bottom: 4800, height: 2250 },
        { top: 4000, bottom: 4600, height: 2335 },
    ]

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
            <PageTypeWide>
                <Grid fullWidth>
                    <Row>
                        <Column sm={2} md={6} lg={10}>
                            <Header>
                                01. Init Wall Values
                                <p>
                                    Design the initial model by entering the basic values of the
                                    tower.
                                </p>
                            </Header>
                        </Column>
                        <Column sm={2} md={2} lg={2}></Column>
                    </Row>
                    <SectionDivider />
                    <Section>
                        <h3>Section Type </h3>
                        <Row as="article" narrow>
                            <Column sm={4} md={8} lg={6} style={{ marginBlock: '0.5rem' }}>
                                <Tile>
                                    <AspectRatio>
                                        <svg viewBox={ViewBox} fill="#fff">
                                            <Sections
                                                base={ViewCenter}
                                                draws={sectionData}
                                                margin={100}
                                            />
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
                    </Section>
                </Grid>
            </PageTypeWide>
        </>
    )
}

export default InitWallValue
