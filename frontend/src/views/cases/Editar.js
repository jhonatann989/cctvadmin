import React, {useState} from "react"
import {
    SelectInput, Edit, ReferenceInput, SimpleForm, TextInput, ArrayInput, SimpleFormIterator, required, BooleanInput, FormDataConsumer,
    ArrayField, Datagrid, ReferenceField, FunctionField, TextField, SelectField, BooleanField, useRecordContext, RadioButtonGroupInput, useStore
} from "react-admin"
import { classNameGetter } from "../../common/commonStyles"
import { BACKEND_URL, quotation_states, states } from "../../common/configs"
import { Button, Box } from '@mui/material';
import { ModeEdit, EditOff } from '@mui/icons-material';
import { ServerSideFileInput, EmptyMessageDatagrid } from "../../common/components"
import { getRoleNameFromId } from "../../common/functions";

export const EditCases = () => {

    return (
        <Edit redirect="/cases">
            <SimpleForm>
                <ReferenceField source="id_user" reference="users" link={false} >
                    <FunctionField render={record => record && `${getRoleNameFromId(record.role)}: ${record.name} - ${record.cc}`} />
                </ReferenceField>
                <ReferenceInput
                    source="id_user"
                    reference="users"
                    filter={{ role: "customer" }}
                    perPage={1000}
                    validate={[required()]}
                >
                    <SelectInput optionText={option => `${getRoleNameFromId(option.role)}: ${option.name} - ${option.cc}`} disabled fullWidth style={{ display: "none" }} />
                </ReferenceInput>
                <FormDataConsumer>
                    {({formData}) => (
                        <>
                            <br />
                            <CaseTechnicalStudies  />
                            <br />
                            <CaseQuotationRequests CaseQuotationRequests={formData.CaseQuotationRequests} />
                            <br />
                            <CaseSales CaseSales={formData.CaseSales} />
                            <br/>
                            <CaseInstallations CaseInstallations={formData.CaseInstallations}  />
                        </>
                    )}
                </FormDataConsumer>
            </SimpleForm>
        </Edit>
    )
}

const CaseTechnicalStudies = (props) => {
    const {CaseTechnicalStudies} = useRecordContext()
    let technicalStudyState = CaseTechnicalStudies?.length? CaseTechnicalStudies[0].state : ""
    const [isEditable, setIsEditable] = React.useState(false)
    const validateArrayForm = (arrayValues) => {
        let errors = []
        for(let valueObj of arrayValues) {
            if(typeof valueObj.id_responsible != "number") {
                errors.push("a responsible is required")
            }

            if(!valueObj.evaluation && valueObj.state == "done") {
                errors.push("A valid evaluation is required")
            }

            if(!valueObj.state) {
                errors.push("a valid state is required")
            }
        }
        
        return errors.join(", ")
    }
    return (
        <div style={{ display: "flex", width: "100%"}}>
            <ArrayInput
                source="CaseTechnicalStudies"
                defaultValue={[{}]}
                fullWidth
                style={{ display: isEditable ? "block" : "none" }}
                isRequired
                validate={[validateArrayForm]}
            >
                <SimpleFormIterator 
                    disableAdd 
                    disableRemove
                    disableReordering 
                    fullWidth
                >
                    <ReferenceInput
                        source="id_responsible"
                        reference="users"
                        filter={{ role: "technical" }}
                        perPage={1000}
                        validate={[required()]}
                        
                    >
                        <SelectInput optionText={option => `${getRoleNameFromId(option.role)}: ${option.name} - ${option.cc}`} disabled fullWidth />
                    </ReferenceInput>
                    <TextInput
                        source="evaluation"
                        multiline
                        fullWidth
                    />
                    <RadioButtonGroupInput
                        source="state"
                        choices={states}
                        validate={[required()]}
                        fullWidth
                    />
                    <BooleanInput fullWidth source="isFeasable" />
                </SimpleFormIterator>
            </ArrayInput>
            {!isEditable &&
                <ArrayField source="CaseTechnicalStudies"  disableReordering>
                    <Datagrid bulkActionButtons={false} sx={{width: "inherit"}} empty={<EmptyMessageDatagrid phaseName="El estudio técnico no se ha realizado." />} >
                        <ReferenceField source="id_responsible" reference="users" link={false}>
                            <FunctionField render={record => record && `${getRoleNameFromId(record.role)}: ${record.name} - ${record.cc}`} />
                        </ReferenceField>
                        <TextField source="evaluation" />
                        <SelectField
                            source="state"
                            choices={states}
                            fullWidth
                        />
                        <BooleanField source="isFeasable" />
                        
                    </Datagrid>
                </ArrayField>
            }
            {technicalStudyState != "done" && 
                <Button variant="text" onClick={() => setIsEditable(!isEditable)}>
                    {isEditable ? <EditOff style={{ backgroundColor: "transparent" }} /> : <ModeEdit style={{ backgroundColor: "transparent" }} />}
                </Button>
            }
        </div>

    )
}

const CaseQuotationRequests = (props) => {
    const {CaseTechnicalStudies} = useRecordContext()
    const {CaseQuotationRequests} = props
    let CaseTechnicalStudiesState = CaseTechnicalStudies?.length? CaseTechnicalStudies[0].state : ""
    let CaseTechnicalStudyIsFeasable = CaseTechnicalStudies?.length? CaseTechnicalStudies[0].isFeasable : false
    let CaseQuotationRequestsState = CaseQuotationRequests?.length? CaseQuotationRequests[0].state : ""
    let caseQuotationLength = CaseQuotationRequests?.length
    const [isEditable, setIsEditable] = React.useState(false)
    const validateArrayForm = (arrayValues) => {
        let errors = []
        for(let valueObj of arrayValues) {
            if(!valueObj.id_responsible) {
                errors.push("a responsible is required")
            }

            if(!valueObj.quotation_doc) {
                errors.push("a document is required. Did you selected it AND uploaded it?")
            }

            if(!valueObj.state) {
                errors.push("a valid state is required")
            }
        }
        
        return errors.join(", ")
    }

    return (
        <div style={{ display: "flex", width: "100%"}}>
            <ArrayInput
                source="CaseQuotationRequests"
                fullWidth
                defaultValue={[{}]}
                style={{ display: isEditable ? "block" : "none" }}
                
                validate={[validateArrayForm]}
            >
                <SimpleFormIterator
                    disableAdd={caseQuotationLength === 1 ? true : false}
                    disableReordering
                    fullWidth
                >
                    <ReferenceInput
                        source="id_responsible"
                        reference="users"
                        filter={{ role: "seller" }}
                        perPage={1000}
                        validate={[required()]}
                    >
                        <SelectInput fullWidth optionText={option => `${getRoleNameFromId(option.role)}: ${option.name} - ${option.cc}`} />
                    </ReferenceInput>
                    <ServerSideFileInput 
                        source="quotation_doc" 
                        accept=".pdf" 
                        uploadUri="static/upload" 
                        fullWidth
                    />
                    <RadioButtonGroupInput
                        source="state"
                        defaultValue="pending"
                        choices={quotation_states}
                        validate={[required()]}
                        fullWidth
                    />
                </SimpleFormIterator>
            </ArrayInput>
            {!isEditable &&
                <ArrayField source="CaseQuotationRequests" disableReordering>
                    <Datagrid bulkActionButtons={false} sx={{width: "inherit"}} empty={<EmptyMessageDatagrid phaseName="La solicitud de cotización no se ha realizado." />}>
                        <ReferenceField source="id_responsible" reference="users" link={false}>
                            <FunctionField render={record => record && `${getRoleNameFromId(record.role)}: ${record.name} - ${record.cc}`} />
                        </ReferenceField>
                        <FunctionField source="quotation_doc" render={record => <Box>{record.quotation_doc}</Box>} />
                        <SelectField
                            source="state"
                            choices={quotation_states}
                            fullWidth
                        />
                    </Datagrid>
                </ArrayField>
            }
            {CaseTechnicalStudiesState == "done" && CaseTechnicalStudyIsFeasable == true && CaseQuotationRequestsState != "done"  &&
                <Button variant="text" onClick={() => setIsEditable(!isEditable)}>
                    {isEditable ? <EditOff style={{ backgroundColor: "transparent" }} /> : <ModeEdit style={{ backgroundColor: "transparent" }} />}
                </Button>
            }
        </div>

    )
}

const CaseSales = (props) => {
    const {CaseQuotationRequests} = useRecordContext()
    const {CaseSales} = props
    let CaseQuotationRequestsState = CaseQuotationRequests?.length? CaseQuotationRequests[0].state : ""
    let salesState = CaseSales?.length? CaseSales[0].state : ""
    let salesLength = CaseSales?.length

    const [isEditable, setIsEditable] = React.useState(false)

    const validateArrayForm = (arrayValues) => {
        let errors = []
        for(let valueObj of arrayValues) {
            if(!valueObj.id_responsible) {
                errors.push("a responsible is required")
            }

            if(!valueObj.id_bill) {
                errors.push("a Valid Bill ID is required")
            }

            if(!valueObj.sales_doc) {
                errors.push("a document is required. Did you selected it AND uploaded it?")
            }

            if(!valueObj.state) {
                errors.push("a valid state is required")
            }
        }
        
        return errors.join(", ")
    }

    return (
        <div style={{ display: "flex", width: "100%"}}>
            <ArrayInput
                style={{ display: isEditable ? "block" : "none" }}
                source="CaseSales"
                fullWidth
                validate={[validateArrayForm]}
            >
                <SimpleFormIterator
                    disableAdd={salesLength === 1 ? true : false}
                    disableReordering
                    fullWidth
                >
                    <ReferenceInput
                        source="id_responsible"
                        reference="users"
                        filter={{ role: "seller" }}
                        perPage={1000}
                        validate={[required()]}
                        fullWidth
                    >
                        <SelectInput fullWidth optionText={option => `${getRoleNameFromId(option.role)}: ${option.name} - ${option.cc}`} />
                    </ReferenceInput>
                    <TextInput fullWidth source="id_bill" />
                    <ServerSideFileInput 
                        source="sales_doc" 
                        accept=".pdf" 
                        uploadUri="static/upload" 
                        fullWidth
                    />
                    <RadioButtonGroupInput
                        source="state"
                        defaultValue="pending"
                        choices={states}
                        validate={[required()]}
                        fullWidth
                    />
                </SimpleFormIterator>
            </ArrayInput>
            {!isEditable &&
                <ArrayField source="CaseSales"  disableReordering>
                    <Datagrid bulkActionButtons={false} sx={{width: "inherit"}} empty={<EmptyMessageDatagrid phaseName="La venta no se ha realizado." />}>
                        <ReferenceField source="id_responsible" reference="users" link={false}>
                            <FunctionField render={record => record && `${getRoleNameFromId(record.role)}: ${record.name} - ${record.cc}`} />
                        </ReferenceField>
                        <TextField source="id_bill" />
                        <FunctionField source="sales_doc" render={record => <Box>{record.sales_doc}</Box>} />
                        <SelectField
                            source="state"
                            choices={states}
                            fullWidth
                        />
                    </Datagrid>
                </ArrayField>
            }
            {CaseQuotationRequestsState == "done" && salesState != "done" &&
                <Button variant="text" onClick={() => setIsEditable(!isEditable)}>
                    {isEditable ? <EditOff style={{ backgroundColor: "transparent" }} /> : <ModeEdit style={{ backgroundColor: "transparent" }} />}
                </Button>
            }
        </div>

    )
}

const CaseInstallations = (props) => {
    const {CaseSales} = useRecordContext()
    let {CaseInstallations} = props
    let installationState = CaseInstallations?.length? CaseInstallations[0].state : ""
    let salesState = CaseSales?.length? CaseSales[0].state : ""
    let installationLength = CaseInstallations?.length
    const [isEditable, setIsEditable] = React.useState(false)
    const validateArrayForm = (arrayValues) => {
        let errors = []
        for(let valueObj of arrayValues) {
            if(!valueObj.id_responsible) {
                errors.push("a responsible is required")
            }

            if(!valueObj.installation_report && valueObj.state == "done") {
                errors.push("A valid installation report is required")
            }

            if(!valueObj.state) {
                errors.push("a valid state is required")
            }
        }
        
        return errors.join(", ")
    }
    return (
        <div style={{ display: "flex", width: "100%"}}>
            <ArrayInput
                style={{ display: isEditable ? "block" : "none" }}
                source="CaseInstallations"
                className={classNameGetter("ArrayInput", "formBox", 3)}
                fullWidth
                isRequired
                validate={[validateArrayForm]}
            >
                <SimpleFormIterator
                    disableAdd={installationLength === 1 ? true : false}
                    disableReordering
                    fullWidth
                >
                    <ReferenceInput
                        source="id_responsible"
                        reference="users"
                        filter={{ role: "technical" }}
                        perPage={1000}
                        validate={[required()]}
                        fullWidth
                    >
                        <SelectInput fullWidth optionText={option => `${getRoleNameFromId(option.role)}: ${option.name} - ${option.cc}`} />
                    </ReferenceInput>
                    <TextInput fullWidth source="installation_report" multiline />
                    <RadioButtonGroupInput
                        source="state"
                        defaultValue="pending"
                        choices={states}
                        validate={[required()]}
                        fullWidth
                    />
                    <BooleanInput fullWidth source="has_been_installed" />
                </SimpleFormIterator>
            </ArrayInput>
            {!isEditable &&
                <ArrayField source="CaseInstallations" disableReordering>
                    <Datagrid bulkActionButtons={false} sx={{width: "inherit"}} empty={<EmptyMessageDatagrid phaseName="La instalación no se ha realizado." />}>
                        <ReferenceField source="id_responsible" reference="users" link={false}>
                            <FunctionField render={record => record && `${getRoleNameFromId(record.role)}: ${record.name} - ${record.cc}`} />
                        </ReferenceField>
                        <TextField source="installation_report" />
                        <SelectField
                            source="state"
                            choices={states}
                            fullWidth
                        />
                        <BooleanField source="has_been_installed" />
                    </Datagrid>
                </ArrayField>
            }
            {salesState == "done" && installationState != "done" &&
                <Button variant="text" onClick={() => setIsEditable(!isEditable)}>
                    {isEditable ? <EditOff style={{ backgroundColor: "transparent" }} /> : <ModeEdit style={{ backgroundColor: "transparent" }} />}
                </Button>
            }
        </div>

    )
}