import React, { useState, useCallback } from 'react'

//Components
import InviteWorkspaceModal from '@components/Workspace/InviteWorkspaceModal'

import { PageTypeWide, Header, Section, SectionDivider } from '@pages/Common/ContentsLayout/styles'

import { Fade32, ShareKnowledge32 } from '@carbon/icons-react'
import { Grid, Row, Column, Tile, AspectRatio, Button, TextInput } from 'carbon-components-react'

const Dashboard = () => {
    const [showInviteWorkspaceModal, setShowInviteWorkspaceModal] = useState(false)
    const onClickAddMember = useCallback(() => {
        setShowInviteWorkspaceModal(true)
    }, [])
    /* Close Modal */
    const onCloseModal = useCallback(() => {
        setShowInviteWorkspaceModal(false)
    }, [])

    return (
        <>
            <PageTypeWide>
                <Grid fullWidth>
                    <Row>
                        <Column sm={2} md={6} lg={10}>
                            <Header>
                                DashBoard
                                <p>Quick Access Menu & Infographics</p>
                            </Header>
                        </Column>
                        <Column sm={2} md={2} lg={2}>
                            <br />
                            <br />
                            <br />
                            <Button onClick={onClickAddMember} renderIcon={ShareKnowledge32}>
                                Invite Workspace Memeber
                            </Button>
                        </Column>
                    </Row>
                    <SectionDivider />
                    <Section>
                        <h3>Workspace</h3>
                        <Button renderIcon={Fade32}> Add Workspace</Button>
                        <Row as="article" narrow>
                            <Column sm={4} md={8} lg={6} style={{ marginBlock: '0.5rem' }}>
                                <TextInput
                                    helperText="Optional helper text"
                                    id="test2"
                                    invalidText="A valid value is required"
                                    labelText="Text input label"
                                    placeholder="Placeholder text"
                                />
                            </Column>
                        </Row>
                    </Section>
                </Grid>
            </PageTypeWide>

            <InviteWorkspaceModal
                show={showInviteWorkspaceModal}
                onCloseModal={onCloseModal}
                setShowInviteWorkspaceModal={setShowInviteWorkspaceModal}
            />
        </>
    )
}

export default Dashboard
