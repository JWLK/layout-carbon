import React from 'react'
import { Fade32 } from '@carbon/icons-react'
import {
    Grid,
    Row,
    Column,
    UnorderedList,
    ListItem,
    Tile,
    ClickableTile,
    AspectRatio,
} from 'carbon-components-react'

import { PageTypeWide, Header, Section, SectionDivider } from './styles'

const ContetnsLayout = () => {
    const contentsItmems = [
        'CNT - 1',
        'CNT - 2',
        'CNT - 3',
        'CNT - 4',
        'CNT - 5',
        'CNT - 6',
        'CNT - 7',
        'CNT - 8',
        'CNT - 9',
        'CNT - 10',
        'CNT - 11',
        'CNT - 12',
        'CNT - 13',
    ]
    const tileMenus = ['Column - 1', 'Column - 2', 'Column - 3', 'Column - 4']
    return (
        <PageTypeWide>
            <Grid fullWidth>
                <Header>
                    Contents Layout
                    <p>Quick Access Menu & Infographics</p>
                </Header>

                <SectionDivider />

                <Section>
                    <h3> Input Box</h3>
                    <h4>Tile Grid - 1/2/3</h4>
                    <Row as="article" narrow>
                        {contentsItmems.map((t) => (
                            //  sm=4/4 md=4/8 lg= 4/12
                            <Column sm={4} md={4} lg={4}>
                                <Tile>
                                    <AspectRatio ratio="16x9">{t}</AspectRatio>
                                </Tile>
                            </Column>
                        ))}
                    </Row>
                </Section>

                <SectionDivider />

                <Section>
                    <h3> Tile Ratio</h3>
                    <h4> 16 x 9</h4>
                    <Row as="article">
                        {tileMenus.map((tileMenu) => (
                            <Column>
                                <ClickableTile>
                                    <AspectRatio ratio="16x9">{tileMenu}</AspectRatio>
                                </ClickableTile>
                            </Column>
                        ))}
                    </Row>

                    <h4> 1 x 1</h4>
                    <Row as="article">
                        {tileMenus.map((tileMenu) => (
                            <Column>
                                <ClickableTile>
                                    <AspectRatio ratio="1x1">{tileMenu}</AspectRatio>
                                </ClickableTile>
                            </Column>
                        ))}
                    </Row>
                    <h4> 4 x 3</h4>
                    <Row as="article">
                        {tileMenus.map((tileMenu) => (
                            <Column>
                                <ClickableTile>
                                    <AspectRatio ratio="4x3">{tileMenu}</AspectRatio>
                                </ClickableTile>
                            </Column>
                        ))}
                    </Row>

                    <h4> 1 x 2</h4>
                    <Row as="article">
                        {tileMenus.map((tileMenu) => (
                            <Column>
                                <ClickableTile>
                                    <AspectRatio ratio="1x2">{tileMenu}</AspectRatio>
                                </ClickableTile>
                            </Column>
                        ))}
                    </Row>
                </Section>

                <SectionDivider />

                <Section>
                    <h3> Header & Text Size (H3)</h3>
                    <Row as="article">
                        <Column>
                            <UnorderedList>
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
                            </UnorderedList>
                        </Column>
                    </Row>
                </Section>

                <SectionDivider />

                <Section style={{ border: '1px solid #ddd' }}>
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
                </Section>
            </Grid>
        </PageTypeWide>
    )
}

export default ContetnsLayout
