import React from 'react'

import TowerBuildValue from '@components/Tower/BuildValue'

import { PageTypeWide, Header, Section, SectionDivider } from '@pages/Common/ContentsLayout/styles'

import {} from './styles'

import { Fade32 } from '@carbon/icons-react'
import { Grid, Row, Column, Tile } from 'carbon-components-react'

const InitWallValue = () => {
    return (
        <>
            <PageTypeWide>
                <Grid fullWidth>
                    <Header>Initial Wall Value</Header>
                    <p>Design the initial model by entering the basic values of the tower.</p>
                    <Section>
                        <TowerBuildValue />
                    </Section>
                </Grid>
            </PageTypeWide>
        </>
    )
}

export default InitWallValue
