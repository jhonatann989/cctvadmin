import * as React from "react"
import { Show, SimpleShowLayout, TextField, ArrayField, ReferenceField, Datagrid, BooleanField, FunctionField, SelectField } from "react-admin"
import { modulePermissions, modules } from "../../common/configs"

export const ShowUserAuth = () => {
    return (
        <Show>
            <SimpleShowLayout>
                <ReferenceField source="UserId" reference="users">
                    <FunctionField render={record => record && `${record.cc} - ${record.name}`} />
                </ReferenceField>
                <TextField source="username" fullWidth />
                
                <ArrayField source="UserPermissions">
                    <Datagrid bulkActionButtons={false}>
                        <SelectField source="module" choices={modules} fullWidth />
                        <SelectField source="view" choices={modulePermissions} fullWidth />
                        <BooleanField source="can_view" />
                    </Datagrid>
                </ArrayField>
            </SimpleShowLayout>
        </Show>
    )
}