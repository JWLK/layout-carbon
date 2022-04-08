import React from 'react'

//Request
import useSWR from 'swr'
import fetchStore from '@utils/store'

import { PageTypeWide, Header, Section, SectionDivider } from '@pages/Common/ContentsLayout/styles'

import {} from './styles'

import { Fade32 } from '@carbon/icons-react'
import { Grid, Row, Column, Button, TextInput } from 'carbon-components-react'

//Tower Element
import { ObjPoint, ObjSquare, TWInitialValue, TWRawData } from 'typings/object'
import { ViewBox, ViewCenter } from '@objects/Base/AxisBase'
import AxisX from '@objects/Base/AxisX'
import AxisY from '@objects/Base/AxisY'

const WallBodySection = () => {
    const { data: towerData } = useSWR<TWRawData>('towerData', fetchStore)
    console.log(towerData)
    return (
        <>
            <PageTypeWide>
                <Grid fullWidth>
                    <Row>
                        <Column sm={2} md={6} lg={10}>
                            <Header>
                                Wall Body Section
                                <p>Project Detail</p>
                            </Header>
                        </Column>
                        <Column sm={2} md={2} lg={2}>
                            <br />
                            <br />
                            <br />
                            <Button renderIcon={Fade32}>Action Button For This Project</Button>
                        </Column>
                    </Row>
                    <SectionDivider />
                    <Section>
                        <h3>First</h3>
                        <Button renderIcon={Fade32}> Add First Component</Button>
                        <Row as="article" narrow>
                            <Column sm={4} md={8} lg={6} style={{ marginBlock: '0.5rem' }}>
                                Project Components
                            </Column>
                        </Row>
                    </Section>
                </Grid>
            </PageTypeWide>
        </>
    )
}

export default WallBodySection
