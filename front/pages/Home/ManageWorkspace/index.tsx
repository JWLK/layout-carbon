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

const ManageWorkspace = () => {
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
                            <Column key={t} sm={4} md={4} lg={4}>
                                <Tile>
                                    <AspectRatio ratio="16x9">{t}</AspectRatio>
                                </Tile>
                            </Column>
                        ))}
                    </Row>
                </Section>

                <SectionDivider />
            </Grid>
        </PageTypeWide>
    )
}

export default ManageWorkspace
