import React from 'react'

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
import { ViewScale, ViewMargin, ViewSize, ViewBox } from '@objects/Base/AxisBase'
import AxisX from '@objects/Base/AxisX'
import AxisY from '@objects/Base/AxisY'

import Sections from '@objects/Tower/Sections'
import Objects from '@objects/Tower/Sections/data.json'

const InitWallValue = () => {
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
                        <h3>First</h3>
                        <Row as="article" narrow>
                            <Column sm={4} md={8} lg={6} style={{ marginBlock: '0.5rem' }}>
                                <Tile>
                                    <AspectRatio>
                                        <svg viewBox={ViewBox} fill="#fff">
                                            <Sections Type={1} Object={Objects.Object001} />
                                            <AxisX />
                                            <AxisY />
                                        </svg>
                                    </AspectRatio>
                                </Tile>
                                <Tile>
                                    <AspectRatio>
                                        <svg viewBox={ViewBox} fill="#fff">
                                            <Sections Type={2} Object={Objects.Object002} />
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
                                            legendText="Select Slope Type"
                                            name="tower-slope"
                                            defaultSelected="type-a"
                                            orientation="vertical"
                                        >
                                            <RadioButton
                                                labelText="Type A"
                                                value="type-a"
                                                id="type-a"
                                            />
                                            <RadioButton
                                                labelText="Company B"
                                                value="Type-b"
                                                id="type-b"
                                            />
                                            <RadioButton
                                                labelText="Company C"
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
