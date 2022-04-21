import React from 'react'

//Request
import useSWR from 'swr'
import fetchStore from '@utils/store'

import { PageTypeWide, Header, Section, SectionDivider } from '@pages/Common/ContentsLayout/styles'

import {} from './styles'

import { Fade32 } from '@carbon/icons-react'
import { Grid, Row, Column, Button, TextInput } from 'carbon-components-react'

//Component
import ViewEachSection from '@components/Tower/BuildBase/ViewEachSection'

const WallBodySection = () => {
    return (
        <>
            <PageTypeWide>
                <Grid fullWidth>
                    <Header>Section Flange </Header>
                    <p>Set the parts and flanges for each section.</p>
                    <SectionDivider />
                    <Section>
                        <ViewEachSection />
                    </Section>
                </Grid>
            </PageTypeWide>
        </>
    )
}

export default WallBodySection
