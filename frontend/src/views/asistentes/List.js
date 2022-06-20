import * as React from "react"
import { Datagrid, List,DateField, NumberField, ShowButton, EditButton, TextField } from "react-admin"

export const ListAsistentes = () => {
    return(
        <List>
            <Datagrid>
                <NumberField source="id" fullWidth />
                <NumberField source="cedula" fullWidth />
                <TextField source="full_name" fullWidth />
                <DateField source="fecha_nac" fullWidth />
                <TextField source="tipo_sangre" fullWidth />
                <TextField source="genero" fullWidth />
                <TextField source="condicion_riezgo" fullWidth />
                <ShowButton />
                <EditButton />
            </Datagrid>
        </List>
    )
}