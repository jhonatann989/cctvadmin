import * as React from "react"
import { 
    NumberField, SelectField, Show, SimpleShowLayout, 
    ReferenceField, TextField, ArrayField, FunctionField, Datagrid, BooleanField } from "react-admin"
import { BACKEND_URL } from "../../common/configs"
export const ShowCases = () => {
    return (
        <Show>
            <SimpleShowLayout>
                <NumberField source="id" fullWidth />
                <ReferenceField source="id_user" reference="users" link="show" >
                    <FunctionField render={record => record && `${record.cc} - ${record.name}`} />
                </ReferenceField>
                <SelectField
                    source="state"
                    choices={[
                        { id: "technical_study", name: "Technical Study" },
                        { id: "quotation_request", name: "Quotation Request" },
                        { id: "sale", name: "Sale" },
                        { id: "installation", name: "Instalation" },
                    ]}
                />
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
            </SimpleShowLayout>
        </Show>
    )
}