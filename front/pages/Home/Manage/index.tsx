import React, { useState } from 'react'

//Components
import CreateWorkspaceModal from '@components/Home/CreateWorkspaceModal'
import WorkspaceList from '@components/Home/WorkspaceList'

//Hook Util
import { useGlobal } from '@hooks/useGlobal'

//Css
import { Fade32, Add32 } from '@carbon/icons-react'
import { Grid, Button } from 'carbon-components-react'

import { PageTypeWide, Header, Section, SectionDivider } from './styles'

const ManageWorkspace = () => {
    const { siteTitle } = useGlobal()

    const [showCreateWorkspaceModal, setShowCreateWorkspaceModal] = useState(false)

    return (
        <>
            <PageTypeWide>
                <Grid fullWidth style={{ maxWidth: '2560px' }}>
                    <Header>
                        Welcome To {siteTitle}
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
            <CreateWorkspaceModal />
        </>
    )
}

export default ManageWorkspace
