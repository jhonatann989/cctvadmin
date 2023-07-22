import * as React from "react"
import { Datagrid, List, NumberField, SelectField, TextField, EmailField, SimpleList } from "react-admin"
import { useMediaQuery } from '@mui/material';
import { PostBulkActionButtons, ListActions } from "../../common/components"

const roles = [
    { id: "customer", name: "Cliente Final" },
    { id: "reseller", name: "Mayorista" },
    { id: "technical", name: "Técnico" },
    { id: "seller", name: "Vendedor" },
    { id: "administrator", name: "Administrador" },
    { id: "owner", name: "Propietario" }
]

const cc_types = [
    { id: "CC", name: "Cedula de Ciudadanía" },
    { id: "CE", name: "Cedula de Extrangería" },
    { id: "PP", name: "Pasaporte" },
    { id: "PE", name: "Permiso Especial de Permanencia" },
    { id: "OT", name: "Otro" }
]

export const ListUsers = () => {
    const isSmall = useMediaQuery(theme => theme.breakpoints.down('md'))
    return (
        <List>
            {isSmall ?
                <SimpleList
                    primaryText={record => record.name}
                    secondaryText={record => `${record.cc_type} - ${record.cc}`}
                    tertiaryText={record => roles.find(role => role.id == record.role).name}
                    linkType="show"
                />
                :
                <Datagrid bulkActionButtons={<PostBulkActionButtons url="users" />}>
                    <NumberField source="id" fullWidth />
                    <NumberField source="cc" fullWidth />
                    <SelectField
                        source="cc_type"
                        choices={cc_types}
                        fullWidth
                    />
                    <TextField source="name" fullWidth />
                    <EmailField source="email" fullWidth />
                    <SelectField
                        source="role"
                        choices={roles}
                        fullWidth
                    />
                    <ListActions url="users" />
                </Datagrid>
            }
        </List>
    )
}