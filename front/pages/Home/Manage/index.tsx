import React, { useState, useCallback } from 'react'

//Components
import CreateWorkspaceModal from '@components/Home/CreateWorkspaceModal'
import WorkspaceList from '@components/Home/WorkspaceList'

//Hook Util
import { useGlobal } from '@hooks/useGlobal'

//Css
import { Fade32, Add32 } from '@carbon/icons-react'
import { Grid, Row, Column, Button } from 'carbon-components-react'

import { PageTypeWide, Header, Section, SectionDivider } from '@pages/Common/ContentsLayout/styles'

const ManageWorkspace = () => {
    const { siteTitle } = useGlobal()

    const [showCreateWorkspaceModal, setShowCreateWorkspaceModal] = useState(false)
    const onClickAddWorkspace = useCallback(() => {
        setShowCreateWorkspaceModal(true)
    }, [])
    /* Close Modal */
    const onCloseModal = useCallback(() => {
        setShowCreateWorkspaceModal(false)
    }, [])
    return (
        <>
            <PageTypeWide>
                <Grid fullWidth style={{ maxWidth: '2560px' }}>
                    <Row>
                        <Column>
                            <Header>
                                Welcome To {siteTitle}
                                <p>Make your own workspace</p>
                            </Header>
                        </Column>
                    </Row>
                    <SectionDivider />

                    <Section>
                        <h3>Workspace</h3>
                        <Button onClick={onClickAddWorkspace} renderIcon={Add32}>
                            Add Workspace
                        </Button>
                        <WorkspaceList />
                    </Section>
                </Grid>
            </PageTypeWide>

            <CreateWorkspaceModal
                show={showCreateWorkspaceModal}
                onCloseModal={onCloseModal}
                setShowCreateWorkspaceModal={setShowCreateWorkspaceModal}
            />
        </>
    )
}

export default ManageWorkspace
