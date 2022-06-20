import * as React from "react"
import { Create, DateInput, NumberInput, SimpleForm, TextInput} from "react-admin"

export const CreateAsistentes = () => {
    return (
        <Create>
            <SimpleForm>
                <NumberInput source="cedula" fullWidth required/>
                <TextInput source="full_name" fullWidth required/>
                <DateInput source="fecha_nac" fullWidth required/>
                <TextInput source="tipo_sangre" fullWidth required/>
                <TextInput source="genero" fullWidth required/>
                <TextInput source="condicion_riezgo" fullWidth required/>
            </SimpleForm>
        </Create>
    )
}