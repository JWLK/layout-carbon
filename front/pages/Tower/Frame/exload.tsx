import React, { useState, useCallback, useEffect } from 'react'

//Current Page Parameter
import { useParams } from 'react-router'
//Request
import useSWR from 'swr'
import fetchStore from '@utils/store'

/* @objects/Data */
import { RawData, FreqData } from '@objects/Data/InitValue'

/* @typings */
import { dataListMfr } from '@typings/table'
import {
    ObjPoint,
    ObjSquare,
    TWInitialValue,
    TWRawData,
    TWSection,
    TWParts,
    TWPart,
    TWFlanges,
    ObjFlange,
    TWSectors,
    ObjSector,
    TWSector,
    TWFrequency,
    ObjExtreme,
} from '@typings/object'

import { PageTypeWide, Header, Section, SectionDivider } from '@pages/Common/ContentsLayout/styles'
import {
    FlexWrap,
    GraphicWrap,
    SettingWrap,
    GraphicViewOrigin,
    GraphicViewHarf,
    SettingViewFit,
    SettingViewWide,
    SettingTitle,
    InputLabel,
    InputDivider,
    /* Custom Carbon Design Component */
    NumberInputCustom,
    SliderCustom,
    AccordionItemCustom,
    TextWrapTableCell,
} from '@pages/Tower/Frame/styles'

import {
    Fade32,
    ArrowUp32,
    ArrowDown32,
    ArrowLeft32,
    ArrowRight32,
    MathCurve32,
} from '@carbon/icons-react'
import {
    Grid,
    Row,
    Column,
    ButtonSet,
    Button,
    TextInput,
    NumberInput,
    Slider,
    ExpandableTile,
    TileAboveTheFoldContent,
    TileBelowTheFoldContent,
    AspectRatio,
    Accordion,
    AccordionItem,
    Table,
    TableHead,
    TableRow,
    TableHeader,
    TableBody,
    TableCell,
    Loading,
    FileUploader,
    Tile,
} from 'carbon-components-react'

const ExLoad = () => {
    const [fileLoadData, setFileLoadData] = useState([] as ObjExtreme[])
    const [originalDataCheck, setOriginalDataCheck] = useState(false)
    const uploadFile = (e: any) => {
        console.log(e.target.result)
        let file = e.target.files[0]
        var reader = new FileReader()
        reader.onload = (e) => {
            var fileContentArray = e.target!.result?.toString()
            var lines = fileContentArray!.split(/\r\n|\n/)
            var loadDataOriginExtreme = [] as ObjExtreme[]
            for (var i = 0, count = 0; i < lines.length - 1; i++) {
                if (i % 5 === 2) {
                    // console.log(i + ' --> ' + lines[i])
                    // Find Height
                    let start_height = lines[i].indexOf('=') + 1
                    let end_height = lines[i].indexOf('m')
                    let find_A = lines[i].indexOf('A') + 1
                    let eachHeight = parseFloat(lines[i].substring(start_height, end_height).trim())
                    let dataLine = lines[i].substring(find_A, lines[i].length).split(/\s+/g)
                    dataLine.splice(0, 1)

                    let eachData = dataLine.map((v) => parseFloat(v))
                    loadDataOriginExtreme[count] = {
                        index: count,
                        height: eachHeight,
                        mxy: eachData[0],
                        mx: eachData[1],
                        my: eachData[2],
                        mz: eachData[3],
                        fx: eachData[4],
                        fy: eachData[5],
                        fz: eachData[6],
                        sf: eachData[7],
                    }
                    count++
                }
            }
            setFileLoadData(loadDataOriginExtreme)
            // console.log(loadDataOriginExtreme)
        }

        if (file) {
            let data = new FormData()
            data.append('file', file)
            // axios.post('/files', data)...
        }
        reader.readAsText(file, /* optional */ 'euc-kr')
    }
    const ExtremeLoadHeader = [
        'Index',
        'Height',
        'Mxy',
        'Mx',
        'My',
        'Mz',
        'Fx',
        'Fy',
        'Fz',
        'Safety Factor',
    ] as String[]
    return (
        <>
            <PageTypeWide>
                <Grid fullWidth>
                    <Row>
                        <Column sm={2} md={6} lg={10}>
                            <Header>
                                Extreme Load Setting
                                <p>Tower station loads with safety factor.</p>
                            </Header>
                        </Column>
                        {/* <Column sm={2} md={2} lg={2}>
                            <br />
                            <br />
                            <br />
                            <Button kind="tertiary" renderIcon={Fade32}>
                                Upload
                                <br /> Extreme Loads Data
                            </Button>
                        </Column> */}
                    </Row>
                    <SectionDivider />
                    <Section>
                        {/* <Row as="article" narrow>
                            <Column sm={4} md={8} lg={6} style={{ marginBlock: '0.5rem' }}>
                                Project Components
                            </Column>
                        </Row> */}
                        <h3>1. Upload Data from Load Team</h3>
                        <FileUploader
                            onChange={uploadFile}
                            accept={['.txt']}
                            buttonKind="primary"
                            buttonLabel="Add Extreme Load Data"
                            filenameStatus="edit"
                            iconDescription="Clear file"
                            labelDescription="only .txt files"
                            labelTitle="Upload"
                        />
                        <InputDivider />
                        <h3>2. Data conversion</h3>
                        <Row>
                            <Column sm={2} md={6} lg={10}>
                                <Accordion align="start">
                                    <AccordionItem
                                        title={
                                            fileLoadData.length
                                                ? `Original Data`
                                                : `Please Upload File`
                                        }
                                        disabled={fileLoadData.length ? false : true}
                                    >
                                        {fileLoadData.length && (
                                            <Table size="sm">
                                                <TableHead>
                                                    <TableRow>
                                                        {ExtremeLoadHeader.map((v, index) => {
                                                            return (
                                                                <TableHeader
                                                                    key={`extreme-header-${index}`}
                                                                >
                                                                    <div
                                                                        style={{
                                                                            color: '#fff',
                                                                            marginLeft: '0px',
                                                                        }}
                                                                    >
                                                                        {v}
                                                                    </div>
                                                                </TableHeader>
                                                            )
                                                        })}
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {fileLoadData.map((v, index) => {
                                                        return (
                                                            <TableRow key={`extreme-body-${index}`}>
                                                                <TableCell>{index + 1}</TableCell>
                                                                <TableCell>{v.height}</TableCell>
                                                                <TableCell>{v.mxy}</TableCell>
                                                                <TableCell>{v.mx}</TableCell>
                                                                <TableCell>{v.my}</TableCell>
                                                                <TableCell>{v.mz}</TableCell>
                                                                <TableCell>{v.fx}</TableCell>
                                                                <TableCell>{v.fy}</TableCell>
                                                                <TableCell>{v.fz}</TableCell>
                                                                <TableCell>{v.sf}</TableCell>
                                                            </TableRow>
                                                        )
                                                    })}
                                                </TableBody>
                                            </Table>
                                        )}
                                    </AccordionItem>
                                </Accordion>
                            </Column>
                            <Column sm={2} md={2} lg={2}>
                                {fileLoadData.length > 0 && (
                                    <Button
                                        kind="tertiary"
                                        renderIcon={Fade32}
                                        onClick={() => setOriginalDataCheck(true)}
                                    >
                                        Original data verification complete.
                                    </Button>
                                )}
                            </Column>
                        </Row>
                        <InputDivider />
                        {fileLoadData.length > 0 && (
                            <Row>
                                <Column sm={2} md={6} lg={10}>
                                    <Accordion align="start">
                                        <AccordionItem
                                            title={
                                                originalDataCheck
                                                    ? `Interpolation setting`
                                                    : `Interpolation setting disabled. Please, Check original data and Click the verification complete button.`
                                            }
                                            disabled={!originalDataCheck}
                                        >
                                            {fileLoadData.length && (
                                                <Table size="sm">
                                                    <TableHead>
                                                        <TableRow>
                                                            {ExtremeLoadHeader.map((v, index) => {
                                                                return (
                                                                    <TableHeader
                                                                        key={`extreme-header-${index}`}
                                                                    >
                                                                        <div
                                                                            style={{
                                                                                color: '#fff',
                                                                                marginLeft: '0px',
                                                                            }}
                                                                        >
                                                                            {v}
                                                                        </div>
                                                                    </TableHeader>
                                                                )
                                                            })}
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {fileLoadData.map((v, index) => {
                                                            return (
                                                                <TableRow
                                                                    key={`extreme-body-${index}`}
                                                                >
                                                                    <TableCell>
                                                                        {index + 1}
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        {v.height}
                                                                    </TableCell>
                                                                    <TableCell>{v.mxy}</TableCell>
                                                                    <TableCell>{v.mx}</TableCell>
                                                                    <TableCell>{v.my}</TableCell>
                                                                    <TableCell>{v.mz}</TableCell>
                                                                    <TableCell>{v.fx}</TableCell>
                                                                    <TableCell>{v.fy}</TableCell>
                                                                    <TableCell>{v.fz}</TableCell>
                                                                    <TableCell>{v.sf}</TableCell>
                                                                </TableRow>
                                                            )
                                                        })}
                                                    </TableBody>
                                                </Table>
                                            )}
                                        </AccordionItem>
                                    </Accordion>
                                </Column>
                                <Column sm={2} md={2} lg={2}>
                                    {fileLoadData.length > 0 && (
                                        <Button
                                            kind="tertiary"
                                            renderIcon={Fade32}
                                            disabled={!originalDataCheck}
                                        >
                                            InterInterpolation setting complete.
                                        </Button>
                                    )}
                                </Column>
                            </Row>
                        )}
                    </Section>
                </Grid>
            </PageTypeWide>
        </>
    )
}

export default ExLoad
