import React from 'react'

//Components
import WorkspaceList from '@components/Home/WorkspaceList'

import { Fade32, Add32 } from '@carbon/icons-react'
import { Grid, Button } from 'carbon-components-react'

import { PageTypeWide, Header, Section, SectionDivider } from './styles'

const ManageWorkspace = () => {
    return (
        <PageTypeWide>
            <Grid fullWidth style={{ maxWidth: '2560px' }}>
                <Header>
                    Welcome To Carbon
                    <p>Make your own workspace</p>
                </Header>

                <SectionDivider />

                <Section>
                    <h3>Worksapce</h3>
                    <Button renderIcon={Add32}> Add Workspace</Button>
                </Section>
                <WorkspaceList />
            </Grid>
        </PageTypeWide>
    )
}

export default ManageWorkspace
