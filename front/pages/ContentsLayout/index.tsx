import React from 'react'

import { Fade32 } from '@carbon/icons-react'
import { Grid, Row, Column, OrderedList, ListItem } from 'carbon-components-react'

import { PageTypeWide, Header, Section, SectionDivider } from './styles'

const ContetnsLayout = () => {
    return (
        <PageTypeWide>
            <Header>
                Contents Layout
                <p>Sub Title</p>
            </Header>
            <SectionDivider />
            <Section>
                <h3> Header & Text Size (H3)</h3>
                <Grid fullWidth style={{ border: '1px solid #ddd' }}>
                    <Row>
                        <Column>
                            <OrderedList nested>
                                <ListItem>
                                    <h1>H1</h1>
                                </ListItem>
                                <ListItem>
                                    <h2>H2</h2>
                                </ListItem>
                                <ListItem>
                                    <h3>H3</h3>
                                </ListItem>
                                <ListItem>
                                    <h4>H4</h4>
                                </ListItem>
                                <ListItem>
                                    <h5>H5</h5>
                                </ListItem>
                                <ListItem>
                                    <p>p</p>
                                </ListItem>
                                <ListItem>
                                    <span>Span</span>
                                </ListItem>
                                <ListItem>
                                    <span>
                                        <text>text</text>
                                    </span>
                                </ListItem>
                            </OrderedList>
                        </Column>
                    </Row>
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

export default ContetnsLayout
