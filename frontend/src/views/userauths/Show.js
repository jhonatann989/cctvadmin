import * as React from "react"
import { Show, SimpleShowLayout, TextField, ArrayField, ReferenceField, Datagrid, BooleanField, FunctionField } from "react-admin"

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
                        <TextField source="module" fullWidth />
                        <TextField source="view" fullWidth />
                        <BooleanField source="can_view" />
                    </Datagrid>
                </ArrayField>
            </SimpleShowLayout>
        </Show>
    )
}