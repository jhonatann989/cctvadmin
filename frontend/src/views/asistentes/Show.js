import * as React from "react"
import { DateField, NumberField, Show, SimpleShowLayout, TextField } from "react-admin"

export const ShowAsistentes = () => {
    return (
        <Show>
            <SimpleShowLayout sx={{display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gridGap:"10px"}}>
                <NumberField source="id" sx={{gridColumn: 1, gridRow: 1}} />
                <NumberField source="cedula" sx={{gridColumn: 1, gridRow: 2}} />
                <TextField source="full_name" sx={{gridColumn: 1, gridRow: 3}} />
                <DateField source="fecha_nac" sx={{gridColumn: 2, gridRow: 1}} />
                <TextField source="tipo_sangre" sx={{gridColumn: 1, gridRow: 2}} />
                <TextField source="genero" sx={{gridColumn: 1, gridRow: 3}} />
                <TextField source="condicion_riezgo" sx={{gridColumn: 3, gridRow: 1}} />
            </SimpleShowLayout>
        </Show>
    )
}