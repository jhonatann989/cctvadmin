import * as React from "react"
import { Datagrid, List, NumberField, SelectField, TextField, EmailField } from "react-admin"
import { PostBulkActionButtons, ListActions } from "../../common/components"

export const ListUsers = () => {
    return(
        <List>
            <Datagrid bulkActionButtons={<PostBulkActionButtons url="users" /> }>
                <NumberField source="id" fullWidth />
                <NumberField source="cc" fullWidth />
                <SelectField
                    source="cc_type"
                    choices={[
                        {id:"CC", name: "Cedula de Ciudadanía"}, 
                        {id:"CE", name: "Cedula de Extrangería"},
                        {id:"PP", name: "Pasaporte"},
                        {id:"PE", name: "Permiso Especial de Permanencia"},
                        {id:"OT", name: "Otro"}
                    ]}
                    fullWidth
                />
                <TextField source="name" fullWidth />
                <EmailField source="email" fullWidth />
                <SelectField
                    source="role"
                    choices={[
                        { id: "customer", name: "Cliente Final" },
                            { id: "reseller", name: "Mayorista" },
                            { id: "technical", name: "Técnico" },
                            { id: "seller", name: "Vendedor" },
                            { id: "administrator", name: "Administrador" },
                            { id: "owner", name: "Propietario" }
                    ]}
                    fullWidth
                />
                <ListActions url="users" />
            </Datagrid>
        </List>
    )
}