import * as React from "react"
import { NumberField, SelectField, Show, SimpleShowLayout, EmailField, TextField, ArrayField, SingleFieldList, Datagrid } from "react-admin"

export const ShowUsers = () => {
    return (
        <Show>
            <SimpleShowLayout>
                <NumberField source="id" fullWidth />
                <NumberField source="cc" fullWidth />
                <SelectField
                    source="cc_type"
                    choices={[
                        { id: "CC", name: "Cedula de Ciudadanía" },
                        { id: "CE", name: "Cedula de Extrangería" },
                        { id: "PP", name: "Pasaporte" },
                        { id: "PE", name: "Permiso Especial de Permanencia" },
                        { id: "OT", name: "Otro" }
                    ]}
                    fullWidth
                />
                <TextField source="name" fullWidth />
                <EmailField source="email" fullWidth />
                <SelectField
                    source="role"
                    choices={[
                        { id: "customer", name: "Cliente Final" },
                        { id: "technical", name: "Técnico" },
                        { id: "seller", name: "Vendedor" },
                        { id: "admin", name: "administrador" },
                        { id: "owner", name: "Propietario" }
                    ]}
                    fullWidth
                />
                <ArrayField source="UserDatas">
                    <Datagrid bulkActionButtons={false}>
                        <TextField source="address" fullWidth />
                    </Datagrid>
                </ArrayField>
                <ArrayField source="UserStaffs">
                    <Datagrid bulkActionButtons={false}>
                        <SelectField
                            source="role"
                            choices={[
                                { id: "technical", name: "Técnico" },
                                { id: "seller", name: "Vendedor" },
                                { id: "administrator", name: "Administrador" },
                                { id: "owner", name: "Propietario" },
                            ]}
                            fullWidth
                        />
                    </Datagrid>
                </ArrayField>
            </SimpleShowLayout>
        </Show>
    )
}