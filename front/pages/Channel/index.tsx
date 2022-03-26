import React from 'react'
import { Fade32 } from '@carbon/icons-react'
import { Grid, Row, Column } from 'carbon-components-react'
const Channel = () => {
    return (
        <>
            <Grid fullWidth style={{ border: '1px solid #ddd', padding: '1rem 2rem' }}>
                <Row>
                    <Column
                        sm={1}
                        md={2}
                        lg={3}
                        style={{ border: '1px solid #222', padding: '2rem 1rem' }}
                    >
                        Channel Column 1
                    </Column>
                    <Column
                        sm={1}
                        md={2}
                        lg={3}
                        style={{ border: '1px solid #222', padding: '2rem 1rem' }}
                    >
                        Column 2
                    </Column>
                    <Column
                        sm={1}
                        md={2}
                        lg={3}
                        style={{ border: '1px solid #222', padding: '2rem 1rem' }}
                    >
                        Column 3
                    </Column>
                    <Column
                        sm={1}
                        md={2}
                        lg={3}
                        style={{ border: '1px solid #222', padding: '2rem 1rem' }}
                    >
                        Column 4
                    </Column>
                    <Column sm={1} style={{ border: '1px solid #222', padding: '2rem 1rem' }}>
                        Column 1
                    </Column>
                    <Column sm={1} style={{ border: '1px solid #222', padding: '2rem 1rem' }}>
                        Column 2
                    </Column>
                    <Column sm={1} style={{ border: '1px solid #222', padding: '2rem 1rem' }}>
                        Column 3
                    </Column>
                    <Column sm={1} style={{ border: '1px solid #222', padding: '2rem 1rem' }}>
                        Column 4
                    </Column>
                </Row>
            </Grid>
        </>
    )
}

export default Channel
