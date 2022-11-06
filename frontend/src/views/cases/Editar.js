import * as React from "react"
import {
    SelectInput, Edit, ReferenceInput, SimpleForm, TextInput, ArrayInput, SimpleFormIterator, required, BooleanInput, FormDataConsumer,
    ArrayField, Datagrid, ReferenceField, FunctionField, TextField, SelectField, BooleanField
} from "react-admin"
import { styleGetter, classNameGetter } from "../../common/commonStyles"
import { getBase64FromDomInput } from "../../common/functions"
import { BACKEND_URL } from "../../common/configs"
import { Button } from '@mui/material';
import { ModeEdit, EditOff } from '@mui/icons-material';

export const EditCases = () => {
    const dataTransformer = async (data) => {
        if (fileAsBase64) {
            data.CaseQuotationRequests[0].quotation_doc = await getBase64FromDomInput("quotation_doc")
        }
        return data
    }
    const [fileAsBase64, setFileAsBase64] = React.useState("")
    const [technicalStudyState, setTechnicalStudyState] = React.useState("")
    const [caseQuotationLength, setCaseQuotationLength] = React.useState(0)
    const [quotationRequestState, setQuotationRequestState] = React.useState("")
    const [isFeasable, setIsFeasable] = React.useState(false)
    const [quotationRequestUrl, setQuotationRequestUrl] = React.useState("")
    const [salesState, setSalesState] = React.useState("")
    const [salesLength, setSalesLength] = React.useState("")
    const [installationState, setInstallationState] = React.useState("")
    const [installationLength, setInstallationLength] = React.useState("")
    return (
        <Edit redirect="/cases" transform={dataTransformer}>
            <SimpleForm>
                <FormDataConsumer>
                    {({ formData }) => {
                        if (Array.isArray(formData.CaseTechnicalStudies) && formData.CaseTechnicalStudies.length) {
                            setTechnicalStudyState(formData.CaseTechnicalStudies[0].state)
                            setIsFeasable(formData.CaseTechnicalStudies[0].isFeasable)
                        }
                        if (Array.isArray(formData.CaseQuotationRequests) && formData.CaseQuotationRequests.length) {
                            setQuotationRequestState(formData.CaseQuotationRequests[0].state)
                            setQuotationRequestUrl(formData.CaseQuotationRequests[0].quotation_doc)
                            setCaseQuotationLength(formData.CaseQuotationRequests.length)
                        }
                        if (Array.isArray(formData.CaseSales) && formData.CaseSales.length) {
                            setSalesState(formData.CaseSales[0].state)
                            setSalesLength(formData.CaseSales.length)
                        }
                        if (Array.isArray(formData.CaseInstallations) && formData.CaseInstallations.length) {
                            setInstallationState(formData.CaseInstallations[0].state)
                            setInstallationLength(formData.CaseInstallations.length)
                        }
                    }}
                </FormDataConsumer>
                <ReferenceField source="id_user" reference="users" link="show" >
                    <FunctionField render={record => record && `Cliente: ${record.cc} - ${record.name}`} />
                </ReferenceField>
                <ReferenceInput
                    source="id_user"
                    reference="users"
                    filter={{ role: "customer" }}
                    perPage={1000}
                    validate={[required()]}
                >
                    <SelectInput optionText="cc" disabled fullWidth style={{ display: "none" }} />
                </ReferenceInput>
                <CaseTechnicalStudies technicalStudyState={technicalStudyState} />
                <br />
                {technicalStudyState == "done" && <CaseQuotationRequests salesState={salesState} salesLength={salesLength} setSalesLength={setSalesLength} />}
                <br />
                {quotationRequestState == "done" && <CaseSales salesState={salesState} salesLength={salesLength} setSalesLength={setSalesLength} />}
                <br/>
                {salesState == "done" && isFeasable && <CaseInstallations salesLength={installationLength} setInstallationLength={setInstallationLength} installationState={installationState} />}
            </SimpleForm>
        </Edit>
    )
}

const CaseTechnicalStudies = (props) => {
    const { technicalStudyState } = props
    const [isEditable, setIsEditable] = React.useState(false)
    return (
        <div style={{ display: "flex", justifyContent: "space-between" }}>
            <ArrayInput
                source="CaseTechnicalStudies"
                className={classNameGetter("ArrayInput", "formBox", 3)}
                defaultValue={[{}]}
                fullWidth
                style={{ display: isEditable ? "block" : "none" }}
            >
                <SimpleFormIterator disableAdd disableRemove disableReordering >
                    <ReferenceInput
                        source="id_responsible"
                        reference="users"
                        filter={{ role: "technical" }}
                        perPage={1000}
                        validate={[required()]}
                    >
                        <SelectInput optionText="cc" disabled />
                    </ReferenceInput>
                    <TextInput
                        source="evaluation"
                        disabled={technicalStudyState === "ongoing" ? false : true}
                    />
                    <SelectInput
                        source="state"
                        choices={[
                            { id: "pending", name: "Pending" },
                            { id: "ongoing", name: "Ongoing" },
                            { id: "done", name: "Done" },
                        ]}
                        validate={[required()]}
                    />
                    <BooleanInput source="isFeasable" disabled={technicalStudyState !== "done" ? false : true} />
                </SimpleFormIterator>
            </ArrayInput>
            {!isEditable &&
                <ArrayField source="CaseTechnicalStudies">
                    <Datagrid bulkActionButtons={false}>
                        <ReferenceField source="id_responsible" reference="users">
                            <FunctionField render={record => record && `${record.cc} - ${record.name}`} />
                        </ReferenceField>
                        <TextField source="evaluation" />
                        <SelectField
                            source="state"
                            choices={[
                                { id: "pending", name: "Pending" },
                                { id: "ongoing", name: "Ongoing" },
                                { id: "done", name: "Done" },
                            ]}
                            fullWidth
                        />
                        <BooleanField source="isFeasable" />
                    </Datagrid>
                </ArrayField>
            }
            <Button variant="text" onClick={() => setIsEditable(!isEditable)}>
                {isEditable ? <EditOff style={{ backgroundColor: "transparent" }} /> : <ModeEdit style={{ backgroundColor: "transparent" }} />}
            </Button>
        </div>

    )
}

const CaseQuotationRequests = (props) => {
    const { salesState, salesLength, setSalesLength } = props
    const [isEditable, setIsEditable] = React.useState(false)
    return (
        <div style={{ display: "flex", justifyContent: "space-between" }}>
            <ArrayInput
                source="CaseSales"
                className={classNameGetter("ArrayInput", "formBox", 3)}
                fullWidth
                validate={[value => setSalesLength(value.length)]}
                style={{ display: isEditable ? "block" : "none" }}
            >
                <SimpleFormIterator
                    disableAdd={salesLength === 1 ? true : false}
                    disableRemove
                    disableReordering
                >
                    <ReferenceInput
                        source="id_responsible"
                        reference="users"
                        filter={{ role: "seller" }}
                        perPage={1000}
                        validate={[required()]}
                    >
                        <SelectInput optionText="cc" disabled={salesState == "pending" ? false : true} />
                    </ReferenceInput>
                    <TextInput source="id_bill" disabled={salesState !== "done" ? false : true} />
                    <TextInput source="id_bill" />
                    <SelectInput
                        source="state"
                        defaultValue="pending"
                        choices={[
                            { id: "pending", name: "Pending" },
                            { id: "ongoing", name: "Ongoing" },
                            { id: "done", name: "Done" },
                        ]}
                        validate={[required()]}
                    />
                </SimpleFormIterator>
            </ArrayInput>
            {!isEditable &&
                <ArrayField source="CaseQuotationRequests">
                    <Datagrid bulkActionButtons={false}>
                        <ReferenceField source="id_responsible" reference="users">
                            <FunctionField render={record => record && `${record.cc} - ${record.name}`} />
                        </ReferenceField>
                        <FunctionField source="quotation_doc" render={record => <a href={`${BACKEND_URL}/${record.quotation_doc}`}>{record.quotation_doc}</a>} />
                        <SelectField
                            source="state"
                            choices={[
                                { id: "pending", name: "Pending" },
                                { id: "ongoing", name: "Ongoing" },
                                { id: "done", name: "Done" },
                            ]}
                            fullWidth
                        />
                    </Datagrid>
                </ArrayField>
            }
            <Button variant="text" onClick={() => setIsEditable(!isEditable)}>
                {isEditable ? <EditOff style={{ backgroundColor: "transparent" }} /> : <ModeEdit style={{ backgroundColor: "transparent" }} />}
            </Button>
        </div>

    )
}

const CaseSales = (props) => {
    const { salesState, salesLength, setSalesLength } = props
    const [isEditable, setIsEditable] = React.useState(false)
    return (
        <div style={{ display: "flex", justifyContent: "space-between" }}>
            <ArrayInput
                style={{ display: isEditable ? "block" : "none" }}
                source="CaseSales"
                className={classNameGetter("ArrayInput", "formBox", 3)}
                fullWidth
                validate={[value => setSalesLength(value.length)]}
            >
                <SimpleFormIterator
                    disableAdd={salesLength === 1 ? true : false}
                    disableRemove
                    disableReordering
                >
                    <ReferenceInput
                        source="id_responsible"
                        reference="users"
                        filter={{ role: "seller" }}
                        perPage={1000}
                        validate={[required()]}
                    >
                        <SelectInput optionText="cc" disabled={salesState == "pending" ? false : true} />
                    </ReferenceInput>
                    <TextInput source="id_bill" disabled={salesState !== "done" ? false : true} />
                    <SelectInput
                        source="state"
                        defaultValue="pending"
                        choices={[
                            { id: "pending", name: "Pending" },
                            { id: "ongoing", name: "Ongoing" },
                            { id: "done", name: "Done" },
                        ]}
                        validate={[required()]}
                    />
                </SimpleFormIterator>
            </ArrayInput>
            {!isEditable &&
                <ArrayField source="CaseSales">
                    <Datagrid bulkActionButtons={false}>
                        <ReferenceField source="id_responsible" reference="users">
                            <FunctionField render={record => record && `${record.cc} - ${record.name}`} />
                        </ReferenceField>
                        <TextField source="id_bill" />
                        <SelectField
                            source="state"
                            choices={[
                                { id: "pending", name: "Pending" },
                                { id: "ongoing", name: "Ongoing" },
                                { id: "done", name: "Done" },
                            ]}
                            fullWidth
                        />
                    </Datagrid>
                </ArrayField>
            }
            <Button variant="text" onClick={() => setIsEditable(!isEditable)}>
                {isEditable ? <EditOff style={{ backgroundColor: "transparent" }} /> : <ModeEdit style={{ backgroundColor: "transparent" }} />}
            </Button>
        </div>

    )
}

const CaseInstallations = (props) => {
    const { installationLength, setInstallationLength, installationState } = props
    const [isEditable, setIsEditable] = React.useState(false)
    return (
        <div style={{ display: "flex", justifyContent: "space-between" }}>
            <ArrayInput
                style={{ display: isEditable ? "block" : "none" }}
                source="CaseInstallations"
                className={classNameGetter("ArrayInput", "formBox", 3)}
                fullWidth
                validate={[value => setInstallationLength(value.length)]}
            >
                <SimpleFormIterator
                    disableAdd={installationLength === 1 ? true : false}
                    disableRemove
                    disableReordering
                >
                    <ReferenceInput
                        source="id_responsible"
                        reference="users"
                        filter={{ role: "technical" }}
                        perPage={1000}
                        validate={[required()]}
                    >
                        <SelectInput optionText="cc" disabled={installationState == "pending" ? false : true} />
                    </ReferenceInput>
                    <TextInput source="installation_report" disabled={installationState !== "done" ? false : true} />
                    <SelectInput
                        source="state"
                        defaultValue="pending"
                        choices={[
                            { id: "pending", name: "Pending" },
                            { id: "ongoing", name: "Ongoing" },
                            { id: "done", name: "Done" },
                        ]}
                        validate={[required()]}
                    />
                    <BooleanInput source="has_been_installed" disabled={installationState !== "done" ? false : true} />
                </SimpleFormIterator>
            </ArrayInput>
            {!isEditable &&
                <ArrayField source="CaseInstallations">
                    <Datagrid bulkActionButtons={false}>
                        <ReferenceField source="id_responsible" reference="users">
                            <FunctionField render={record => record && `${record.cc} - ${record.name}`} />
                        </ReferenceField>
                        <TextField source="installation_report" />
                        <SelectField
                            source="state"
                            choices={[
                                { id: "pending", name: "Pending" },
                                { id: "ongoing", name: "Ongoing" },
                                { id: "done", name: "Done" },
                            ]}
                            fullWidth
                        />
                        <BooleanField source="has_been_installed" />
                    </Datagrid>
                </ArrayField>
            }
            <Button variant="text" onClick={() => setIsEditable(!isEditable)}>
                {isEditable ? <EditOff style={{ backgroundColor: "transparent" }} /> : <ModeEdit style={{ backgroundColor: "transparent" }} />}
            </Button>
        </div>

    )
}