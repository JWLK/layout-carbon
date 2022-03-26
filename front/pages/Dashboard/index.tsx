import React from 'react'

import { Fade32 } from '@carbon/icons-react'
import { Grid, Row, Column } from 'carbon-components-react'

import { PageTypeWide, Header, Section, SectionDivider } from './styles'

const Dashboard = () => {
    return (
        <PageTypeWide>
            <Header>
                DashBoard
                <p>Quick Access Menu & Infographics</p>
            </Header>
            <SectionDivider />
            <Section>
                <Grid fullWidth style={{ border: '1px solid #ddd' }}>
                    <Row>
                        <Column sm={1} md={2} lg={3} style={{ border: '1px solid #222' }}>
                            Contnents Column 1
                        </Column>
                        <Column sm={1} md={2} lg={3} style={{ border: '1px solid #222' }}>
                            Contnents Column 2
                        </Column>
                        <Column sm={1} md={2} lg={3} style={{ border: '1px solid #222' }}>
                            Contnents Column 3
                        </Column>
                        <Column sm={1} md={2} lg={3} style={{ border: '1px solid #222' }}>
                            Contnents Column 4
                        </Column>
                        <Column sm={1} md={2} lg={3} style={{ border: '1px solid #222' }}>
                            Contnents Column 5
                        </Column>
                    </Row>
                </Grid>
            </Section>
            <Section>
                <Grid fullWidth style={{ border: '1px solid #ddd' }}>
                    <Row>
                        <Column sm={1} md={2} lg={3} style={{ border: '1px solid #222' }}>
                            Contnents Column 1
                        </Column>
                        <Column sm={1} md={2} lg={3} style={{ border: '1px solid #222' }}>
                            Contnents Column 2
                        </Column>
                        <Column sm={1} md={2} lg={3} style={{ border: '1px solid #222' }}>
                            Contnents Column 3
                        </Column>
                        <Column sm={1} md={2} lg={3} style={{ border: '1px solid #222' }}>
                            Contnents Column 4
                        </Column>
                        <Column sm={1} md={2} lg={3} style={{ border: '1px solid #222' }}>
                            Contnents Column 5
                        </Column>
                    </Row>
                </Grid>
            </Section>
        </PageTypeWide>
    )
}

export default Dashboard
