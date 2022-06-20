import * as React from "react"
import {
    SelectInput, Edit, NumberInput, SimpleForm, TextInput, ArrayInput, SimpleFormIterator
} from "react-admin"
import { styleGetter } from "../../common/commonStyles"

export const EditUsers = () => {
    return (
        <Edit redirect="/users">
            <SimpleForm>
                <div style={styleGetter("formBox")}>
                    <SelectInput
                        source="cc_type"
                        choices={[
                            { id: "CC", name: "Cedula de Ciudadanía" },
                            { id: "CE", name: "Cedula de Extrangería" },
                            { id: "PP", name: "Pasaporte" },
                            { id: "PE", name: "Permiso Especial de Permanencia" },
                            { id: "OT", name: "Otro" }
                        ]}
                        fullWidth
                        required
                        disabled
                    />
                    <NumberInput source="cc" fullWidth required disabled />
                    <TextInput source="name" fullWidth required />
                    <TextInput source="email" type="email" fullWidth required />
                    <SelectInput
                        source="role"
                        choices={[
                            { id: "customer", name: "Cliente Final" },
                            { id: "technical", name: "Técnico" },
                            { id: "seller", name: "Vendedor" },
                            { id: "admin", name: "administrador" },
                            { id: "owner", name: "Propietario" }
                        ]}
                        fullWidth
                        required
                    />
                </div>
                 <ArrayInput source="UserDatas" fullWidth>
                    <SimpleFormIterator disableAdd disableRemove disableReordering>
                        <TextInput source="address" fullwidth required />
                    </SimpleFormIterator>
                </ArrayInput>
                <ArrayInput source="UserStaffs" fullWidth>
                    <SimpleFormIterator disableAdd disableRemove disableReordering>
                        <SelectInput
                            source="role"
                            choices={[
                                { id: "technical", name: "Técnico" },
                                { id: "seller", name: "Vendedor" },
                                { id: "administrator", name: "Administrador" },
                                { id: "owner", name: "Propietario" },
                            ]}
                            required
                            fullWidth
                        />
                    </SimpleFormIterator>
                </ArrayInput>
            </SimpleForm>
        </Edit>
    )
}