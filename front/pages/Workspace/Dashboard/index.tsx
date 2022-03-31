import React from 'react'

import { PageTypeWide, Header, Section, SectionDivider } from '@pages/Common/ContentsLayout/styles'
import {} from './styles'

import { Fade32 } from '@carbon/icons-react'
import { Grid, Row, Column, Tile, AspectRatio, Button, TextInput } from 'carbon-components-react'

const Dashboard = () => {
    return (
        <PageTypeWide>
            <Grid fullWidth>
                <Header>
                    DashBoard
                    <p>Quick Access Menu & Infographics</p>
                </Header>
                <SectionDivider />
                <Section>
                    <h3>Worksapce</h3>
                    <Button renderIcon={Fade32}> Add Workspace</Button>
                </Section>
                <Grid fullWidth>
                    <Row as="article" narrow>
                        <Column sm={4} md={8} lg={6} style={{ marginBlock: '0.5rem' }}>
                            <TextInput
                                helperText="Optional helper text"
                                id="test2"
                                invalidText="A valid value is required"
                                labelText="Text input label"
                                placeholder="Placeholder text"
                            />
                        </Column>
                    </Row>
                </Grid>
            </Grid>
        </PageTypeWide>
    )
}

export default Dashboard
