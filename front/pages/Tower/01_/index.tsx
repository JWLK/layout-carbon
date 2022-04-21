import React from 'react'

import SectionsOutline from '@components/Tower/BuildBase/SectionsOutline'

import { PageTypeWide, Header, Section, SectionDivider } from '@pages/Common/ContentsLayout/styles'

import {} from './styles'

import { Fade32 } from '@carbon/icons-react'
import { Grid, Row, Column, Tile, Tabs, Tab } from 'carbon-components-react'

const InitWallValue = () => {
    return (
        <>
            <PageTypeWide>
                <Grid fullWidth>
                    <Header>Initial Modeling</Header>
                    <p>Initial value is required to create a tower layout.</p>
                    <SectionDivider />
                    <Section>
                        <SectionsOutline />
                    </Section>
                    <SectionDivider />
                </Grid>
            </PageTypeWide>
        </>
    )
}

export default InitWallValue
