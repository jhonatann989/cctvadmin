import * as React from "react"
import { 
    NumberField, SelectField, Show, SimpleShowLayout, 
    ReferenceField, TextField, ArrayField, FunctionField, Datagrid, BooleanField, Button, useNotify } from "react-admin"
import { EmptyMessageDatagrid } from "../../common/components"
import { quotation_states, states } from "../../common/configs"
import { httpFileDownload } from "../../providers/httpClientProvider"
import { getRoleNameFromId } from "../../common/functions"
export const ShowCases = () => {
    const notify = useNotify()
    return (
        <Show>
            <SimpleShowLayout>
                <NumberField source="id" fullWidth />
                <ReferenceField source="id_user" reference="users" link="show" >
                    <FunctionField render={record => record && `${getRoleNameFromId(record.role)}: ${record.name} - ${record.cc}`} />
                </ReferenceField>
                <ArrayField source="CaseTechnicalStudies">
                    <Datagrid bulkActionButtons={false} empty={<EmptyMessageDatagrid phaseName="El estudio técnico no se realizó." />}>
                        <ReferenceField source="id_responsible" reference="users" link="show">
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
                <ArrayField source="CaseQuotationRequests">
                    <Datagrid bulkActionButtons={false} empty={<EmptyMessageDatagrid phaseName="La solicitud de cotización no se realizó." />}>
                        <ReferenceField source="id_responsible" reference="users" link="show">
                            <FunctionField render={record => record && `${getRoleNameFromId(record.role)}: ${record.name} - ${record.cc}`} />
                        </ReferenceField>
                        <FunctionField 
                            source="quotation_doc" 
                            render={record => record && <Button onClick={() => httpFileDownload(record.quotation_doc, notify, "Descargando...", "Hubo un problema al descargar el archivo")}>{record.quotation_doc}</Button>} 
                        />
                        <SelectField
                            source="state"
                            choices={quotation_states}
                            fullWidth
                        />
                    </Datagrid>
                </ArrayField>
                <ArrayField source="CaseSales">
                    <Datagrid bulkActionButtons={false} empty={<EmptyMessageDatagrid phaseName="La venta no se realizó." />}>
                        <ReferenceField source="id_responsible" reference="users" link="show">
                            <FunctionField render={record => record && `${getRoleNameFromId(record.role)}: ${record.name} - ${record.cc}`} />
                        </ReferenceField>
                        <TextField source="id_bill" />
                        <FunctionField 
                            source="sales_doc" 
                            render={record => record && <Button onClick={() => httpFileDownload(record.sales_doc, notify, "Descargando...", "Hubo un problema al descargar el archivo")}>{record.sales_doc}</Button>} 
                        />
                        <SelectField
                            source="state"
                            choices={states}
                            fullWidth
                        />
                    </Datagrid>
                </ArrayField>
                <ArrayField source="CaseInstallations">
                    <Datagrid bulkActionButtons={false} empty={<EmptyMessageDatagrid phaseName="La instalación no se realizó." />}>
                        <ReferenceField source="id_responsible" reference="users" link="show">
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
            </SimpleShowLayout>
        </Show>
    )
}