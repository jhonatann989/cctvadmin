import * as React from "react"
import {
    Create, NumberInput, SimpleForm, TextInput, SelectInput, ArrayInput, SimpleFormIterator
} from "react-admin"

import { styleGetter } from "../../common/commonStyles"


export const CreateUsers = () => {
    return (
        <Create redirect="/users">
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
                        required
                        fullWidth
                    />
                    <NumberInput source="cc" required fullWidth />
                    <TextInput source="name" required fullWidth />
                    <TextInput source="email" type="email" required fullWidth />
                    <SelectInput
                        source="role"
                        choices={[
                            { id: "customer", name: "Cliente Final" },
                            { id: "technical", name: "Técnico" },
                            { id: "reseller", name: "Mayorista" },
                        ]}
                        required
                        fullWidth
                    />
                </div>
                <ArrayInput source="UserDatas" defaultValue={[{}]} fullWidth >
                    <SimpleFormIterator disableAdd disableRemove disableReordering >
                        <TextInput source="address" fullwidth required />
                    </SimpleFormIterator>
                </ArrayInput>
                <ArrayInput source="UserStaffs" defaultValue={[{}]} fullWidth>
                    <SimpleFormIterator disableAdd disableRemove disableReordering >
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
        </Create>
    )
}
