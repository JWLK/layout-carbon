import React from 'react'

import { PageTypeWide, Header, Section, SectionDivider } from '@pages/Common/ContentsLayout/styles'

import {} from './styles'

import { Fade32 } from '@carbon/icons-react'
import { Grid, Row, Column, Button, TextInput } from 'carbon-components-react'

const Project = () => {
    return (
        <>
            <PageTypeWide>
                <Grid fullWidth>
                    <Header>
                        Project
                        <p>Project Detail</p>
                    </Header>
                    <SectionDivider />
                    <Section>
                        <h3>First</h3>
                        <Button renderIcon={Fade32}> Add First Component</Button>
                    </Section>
                    <Grid fullWidth>
                        <Row as="article" narrow>
                            <Column sm={4} md={8} lg={6} style={{ marginBlock: '0.5rem' }}>
                                Project Components
                            </Column>
                        </Row>
                    </Grid>
                </Grid>
            </PageTypeWide>
        </>
    )
}

export default Project
