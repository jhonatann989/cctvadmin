import * as React from "react"
import { NumberField, SelectField, Show, SimpleShowLayout, EmailField, TextField, ArrayField, SingleFieldList, Datagrid } from "react-admin"
import { cc_types, hiring_type, roles } from "../../common/configs"
import { EmptyMessageDatagrid } from "../../common/components"

export const ShowUsers = () => {
    return (
        <Show>
            <SimpleShowLayout>
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
                <ArrayField source="UserDatas" >
                    <Datagrid bulkActionButtons={false} empty={<EmptyMessageDatagrid phaseName="No se han registrado datos del usuario" />}>
                        <TextField source="dataKey" fullWidth />
                        <TextField source="dataValue" fullWidth />
                    </Datagrid>
                </ArrayField>
                <ArrayField source="UserStaffs">
                    <Datagrid bulkActionButtons={false} empty={<EmptyMessageDatagrid phaseName="Este perfil no tiene un rol en el staff" />}>
                        <SelectField
                            source="role"
                            choices={hiring_type}
                            fullWidth
                        />
                    </Datagrid>
                </ArrayField>
            </SimpleShowLayout>
        </Show>
    )
}