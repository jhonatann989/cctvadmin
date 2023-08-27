import * as React from "react"
import { Datagrid, List, NumberField, SelectField, TextField, EmailField, SimpleList } from "react-admin"
import { useMediaQuery } from '@mui/material';
import { PostBulkActionButtons, ListActions } from "../../common/components"
import { cc_types, roles } from "../../common/configs";

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