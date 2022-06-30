import React, { useState, useCallback, useEffect } from 'react'
import { useParams } from 'react-router'

import useInput from '@hooks/useInput'
import fetcher from '@utils/fetcher'
import { IWorkspace } from '@typings/db'

import axios from 'axios'
import useSWR from 'swr'
//Components
import InviteWorkspaceModal from '@components/Workspace/InviteWorkspaceModal'

import {
    PageTypeWide,
    Header,
    Section,
    SectionDivider,
    InfoText,
} from '@pages/Common/ContentsLayout/styles'

import { Fade32, ShareKnowledge32, Archive32, CheckmarkFilled16 } from '@carbon/icons-react'
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
    ButtonSet,
    Button,
    Toggle,
    TextInput,
    RadioButtonGroup,
    RadioButton,
    Dropdown,
    Modal,
    StructuredListWrapper,
    StructuredListHead,
    StructuredListBody,
    StructuredListRow,
    StructuredListCell,
    StructuredListInput,
} from 'carbon-components-react'

/* @objects/Data */
import { sampleMode_00 } from '@objects/Data/sampleData'

const Dashboard = () => {
    /* Param */
    const { workspace } = useParams<{ workspace?: string }>()

    /* SWR */
    const { data: workspaceData } = useSWR<IWorkspace[]>('/api/workspaces', fetcher)

    /* Localstorage */
    const keyRawData = `${workspace}-towerData`

    const [importData, setimportData] = useState(false)
    const onClickLoadSampleData = useCallback(() => {
        console.log('loaded')
        setimportData(false)
        localStorage.setItem(keyRawData, JSON.stringify(sampleMode_00))
    }, [keyRawData])

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
    // useEffect(() => {
    //     // console.log(turnbineOption)
    // }, [turnbineOption])

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
            {importData && (
                <Modal
                    modalHeading="Import Sample"
                    modalLabel="Sample Data"
                    primaryButtonText="Import"
                    secondaryButtonText="Cancel"
                    open={importData}
                    onRequestClose={() => setimportData(false)}
                    onRequestSubmit={onClickLoadSampleData}
                >
                    <StructuredListWrapper selection ariaLabel="Structured list">
                        <StructuredListHead>
                            <StructuredListRow head tabIndex={0}>
                                <StructuredListCell head>No.</StructuredListCell>
                                <StructuredListCell head>Date</StructuredListCell>
                                <StructuredListCell head>Description</StructuredListCell>
                                <StructuredListCell head />
                            </StructuredListRow>
                        </StructuredListHead>
                        <StructuredListBody>
                            <StructuredListRow tabIndex={0}>
                                <StructuredListCell>1</StructuredListCell>
                                <StructuredListCell>2022.06.22</StructuredListCell>
                                <StructuredListCell>
                                    TOWER CALCULATION for 8 Mega 126.555 meter offshore model.
                                </StructuredListCell>
                                <StructuredListInput
                                    id="row-1"
                                    value="row-1"
                                    title="row-1"
                                    name="row-1"
                                    defaultChecked
                                />
                                <StructuredListCell>
                                    <CheckmarkFilled16
                                        className="cds--structured-list-svg"
                                        aria-label="select an option"
                                    >
                                        <title>select an option</title>
                                    </CheckmarkFilled16>
                                </StructuredListCell>
                            </StructuredListRow>
                        </StructuredListBody>
                    </StructuredListWrapper>
                </Modal>
            )}
            <PageTypeWide>
                <Grid fullWidth>
                    <Section>
                        <Row>
                            <Column sm={2} md={6} lg={9}>
                                <Header>
                                    DashBoard
                                    <p>Quick Access Menu & Infographics</p>
                                </Header>
                            </Column>
                            <Column sm={2} md={2} lg={3}>
                                <br />
                                <br />
                                <br />
                                <Button
                                    kind="tertiary"
                                    onClick={() => setimportData(true)}
                                    renderIcon={Archive32}
                                >
                                    Load Sample Data
                                </Button>
                                <Button
                                    hasIconOnly
                                    iconDescription="Invite Memeber"
                                    kind="tertiary"
                                    onClick={onClickAddMember}
                                    renderIcon={ShareKnowledge32}
                                />
                            </Column>
                        </Row>
                    </Section>
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
                                        <br />
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
                                        <br />
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
                        <Switch name="step-calc-1" text="Initial Wall Value" />
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
