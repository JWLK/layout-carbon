import React from 'react'

import SectionsOutline from '@components/Tower/BuildBase/SectionsOutline'
import PartsOutline from '@components/Tower/BuildBase/PartsOutline'

import { PageTypeWide, Header, Section, SectionDivider } from '@pages/Common/ContentsLayout/styles'

import {} from './styles'

import { Fade32 } from '@carbon/icons-react'
import { Grid, Row, Column, Tile, Tabs, Tab } from 'carbon-components-react'

const InitWallValue = () => {
    return (
        <>
            <PageTypeWide>
                <Grid fullWidth>
                    {/* <Header>Initial Wall Value</Header>
                    <p>Design the initial model by entering the basic values of the tower.</p>
                    <Section>
                        <Tabs>
                            <Tab label="Sections">
                                <h3>Sections Outline</h3>
                                <SectionsOutline />
                            </Tab>
                            <Tab label="Parts">
                                <h3>Parts Setting </h3>
                                <PartsOutline />
                            </Tab>
                        </Tabs>
                    </Section> */}
                    <Section>
                        <h3>Sections Outline</h3>
                        <SectionsOutline />
                    </Section>
                    <SectionDivider />
                    <Section>
                        <h3>Parts Setting </h3>
                        {/* <PartsOutline /> */}
                    </Section>
                </Grid>
            </PageTypeWide>
        </>
    )
}

export default InitWallValue
