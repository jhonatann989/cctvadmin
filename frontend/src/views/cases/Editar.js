import * as React from "react"
import {
    SelectInput, Edit, ReferenceInput, SimpleForm, TextInput, ArrayInput, SimpleFormIterator, required, BooleanInput, FormDataConsumer,
    useEditContext 
} from "react-admin"
import { styleGetter, classNameGetter } from "../../common/commonStyles"
import { getBase64FromDomInput } from "../../common/functions"
import { BACKEND_URL } from "../../common/configs"

export const EditCases = () => {
    const dataTransformer = async (data) => {
        if(fileAsBase64) {
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
                    {({ formData}) => {
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
                {/* <div style={styleGetter("formBox")}> */}
                    <ReferenceInput
                        source="id_user"
                        reference="users"
                        filter={{ role: "customer" }}
                        perPage={1000}
                        validate={[required()]}
                    >
                        <SelectInput optionText="cc" disabled fullWidth/>
                    </ReferenceInput>
                    {/* <SelectInput
                        source="state"
                        defaultValue={"technical_study"}
                        choices={[
                            { id: "technical_study", name: "Technical Study" },
                            { id: "quotation_request", name: "Quotation Request" },
                            { id: "sale", name: "Sale" },
                            { id: "installation", name: "Instalation" },
                        ]}
                        required
                        disabled
                        fullWidth
                    /> */}
                {/* </div> */}
                <ArrayInput
                    source="CaseTechnicalStudies"
                    className={classNameGetter("ArrayInput", "formBox", 3)}
                    defaultValue={[{}]}
                    fullWidth
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
                {technicalStudyState == "done" && isFeasable &&
                    <ArrayInput
                        source="CaseQuotationRequests"
                        className={classNameGetter("ArrayInput", "formBox", 3)}
                        fullWidth
                        validate={[value => setCaseQuotationLength(value.length)]}
                    >
                        <SimpleFormIterator 
                            disableAdd={caseQuotationLength === 1? true : false} 
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
                                <SelectInput optionText="cc" disabled={quotationRequestState == "pending"? false : true} />
                            </ReferenceInput>
                            {quotationRequestUrl?
                                <a href={`${BACKEND_URL}/${quotationRequestUrl}`}>{quotationRequestUrl}</a> 
                                : 
                                <input id="quotation_doc" onChange={async () => await setFileAsBase64("quotation_doc") } type="file" accept=".pdf" />}
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
                }
                {quotationRequestState == "done" && isFeasable &&
                    <ArrayInput
                        source="CaseSales"
                        className={classNameGetter("ArrayInput", "formBox", 3)}
                        fullWidth
                        validate={[value => setSalesLength(value.length)]}
                    >
                        <SimpleFormIterator 
                            disableAdd={salesLength === 1? true : false} 
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
                                <SelectInput optionText="cc" disabled={salesState == "pending"? false : true} />
                            </ReferenceInput>
                            <TextInput source="id_bill" disabled={salesState !== "done"? false : true} />
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
                }
                {salesState == "done" && isFeasable &&
                    <ArrayInput
                        source="CaseInstallations"
                        className={classNameGetter("ArrayInput", "formBox", 3)}
                        fullWidth
                        validate={[value => setInstallationLength(value.length)]}
                    >
                        <SimpleFormIterator 
                            disableAdd={installationLength === 1? true : false} 
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
                                <SelectInput optionText="cc" disabled={installationState == "pending"? false : true} />
                            </ReferenceInput>
                            <TextInput source="installation_report" disabled={installationState !== "done"? false : true} />
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
                            <BooleanInput source="has_been_installed" disabled={installationState !== "done"? false : true} />
                        </SimpleFormIterator>
                    </ArrayInput>
                }
            </SimpleForm>
        </Edit>
    )
}

