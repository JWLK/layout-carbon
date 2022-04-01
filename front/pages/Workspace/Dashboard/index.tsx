import React, { useState, useCallback, useEffect } from 'react'
import { useParams } from 'react-router'

import useInput from '@hooks/useInput'
import fetcher from '@utils/fetcher'
import { IWorkspace } from '@typings/db'

import axios from 'axios'
import useSWR from 'swr'
//Components
import InviteWorkspaceModal from '@components/Workspace/InviteWorkspaceModal'

import { PageTypeWide, Header, Section, SectionDivider } from '@pages/Common/ContentsLayout/styles'
import { InfoText } from './styles'

import { Fade32, ShareKnowledge32 } from '@carbon/icons-react'
import {
    Grid,
    Row,
    Column,
    Tile,
    AspectRatio,
    Accordion,
    AccordionItem,
    ContentSwitcher,
    Switch,
    Button,
    Toggle,
    TextInput,
    RadioButtonGroup,
    RadioButton,
    Dropdown,
} from 'carbon-components-react'

const Dashboard = () => {
    /* Param */
    const { workspace } = useParams<{ workspace?: string }>()

    /* SWR */
    const { data: workspaceData } = useSWR<IWorkspace[]>('/api/workspaces', fetcher)

    /*Modal*/
    const [showInviteWorkspaceModal, setShowInviteWorkspaceModal] = useState(false)
    const onClickAddMember = useCallback(() => {
        setShowInviteWorkspaceModal(true)
    }, [])
    /* Close Modal */
    const onCloseModal = useCallback(() => {
        setShowInviteWorkspaceModal(false)
    }, [])

    /* DashBord Page Value */
    const thisWorkspace = workspaceData?.find((v) => v.url === workspace)
    // console.log(thisWorkspace)

    /* Default Value */
    const items = [
        {
            id: 'option-0',
            text: 'Option 0',
        },
        {
            id: 'option-1',
            text: 'Option 1',
        },
        {
            id: 'option-2',
            text: 'Option 2',
        },
    ]
    /* State */
    //turnbineOption Dropdown Option
    const [turnbineOption, setTurbineOption] = useState(items[2])
    useEffect(() => {
        console.log(turnbineOption)
    }, [turnbineOption])

    //project-info-edit Toggle Option
    const [projectInfoEdit, setProjectInfoEdit] = useState(true)
    const onChangeProjectInfoEdit = useCallback(
        (e) => {
            setProjectInfoEdit(!projectInfoEdit)
            console.log(projectInfoEdit)
        },
        [projectInfoEdit, setProjectInfoEdit],
    )

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
                    <Accordion style={{ marginBlock: '2rem' }} align="start" size="lg">
                        <AccordionItem title="Project Info" open>
                            <Section>
                                <Row as="article" narrow>
                                    <Column sm={4} md={8} lg={6} style={{ marginBlock: '0.5rem' }}>
                                        <InfoText>Project Name</InfoText>
                                        <TextInput
                                            id="project-name"
                                            invalidText="Valid value is required"
                                            labelText=""
                                            value={thisWorkspace?.name || ''}
                                            placeholder="Placeholder text"
                                            disabled={projectInfoEdit}
                                        />
                                        <InfoText>Default Turbine Size</InfoText>
                                        <Dropdown
                                            id="default-turbine-size"
                                            titleText="Selected Size"
                                            label="Dropdown menu options"
                                            items={items}
                                            itemToString={(item) => (item ? item.text : '')}
                                            onChange={({ selectedItem }) =>
                                                setTurbineOption(selectedItem!)
                                            }
                                            selectedItem={turnbineOption}
                                            disabled={projectInfoEdit}
                                        />
                                        <InfoText>Tower Manufacturer</InfoText>
                                        <RadioButtonGroup
                                            name="tower-manufacturer"
                                            defaultSelected="cmp-a"
                                            disabled={projectInfoEdit}
                                        >
                                            <RadioButton
                                                labelText="Company A"
                                                value="cmp-a"
                                                id="cmp-a"
                                            />
                                            <RadioButton
                                                labelText="Company B"
                                                value="cmp-b"
                                                id="cmp-b"
                                            />
                                            <RadioButton
                                                labelText="Company C"
                                                value="cmp-c"
                                                id="cmp-c"
                                            />
                                        </RadioButtonGroup>
                                    </Column>
                                    <Column
                                        sm={4}
                                        md={8}
                                        lg={{ span: 4, offset: 1 }}
                                        style={{ marginBlock: '0.5rem' }}
                                    >
                                        <InfoText>Option Name</InfoText>
                                        <Toggle
                                            aria-label="project-info-toggle"
                                            id="project-info-toggle"
                                            labelText="Project Info Edit"
                                            labelA="Disable"
                                            labelB="Editable"
                                            onChange={onChangeProjectInfoEdit}
                                            toggled={!projectInfoEdit}
                                        />
                                    </Column>
                                </Row>
                            </Section>
                        </AccordionItem>
                    </Accordion>

                    <InfoText>STEP. Calculation</InfoText>
                    <ContentSwitcher
                        selectionMode="manual"
                        onChange={() => {
                            console.log('change')
                        }}
                    >
                        <Switch name="step-calc-1" text="Natural Frequency" />
                        <Switch name="step-calc-2" text="Buckling " />
                        <Switch name="step-calc-3" text="Extream Strength" />
                        <Switch name="step-calc-4" text="Fatigue Damage" />
                        <Switch name="step-calc-5" text="Vortex induced Vibration " />
                    </ContentSwitcher>

                    <SectionDivider />

                    <InfoText>STEP. Tower Architecture</InfoText>
                    <ContentSwitcher
                        selectionMode="manual"
                        onChange={() => {
                            console.log('change')
                        }}
                    >
                        <Switch name="step-calc-1" text="Default Wall Value" />
                        <Switch name="step-calc-2" text="Wall Body Section " />
                        <Switch name="step-calc-3" text="Flanges" />
                        <Switch name="step-calc-4" text="Door Opening" />
                        <Switch name="step-calc-5" text="Aviation Light Hole " />
                    </ContentSwitcher>
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
