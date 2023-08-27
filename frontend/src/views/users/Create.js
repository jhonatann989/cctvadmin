import * as React from "react"
import {
    Create, NumberInput, SimpleForm, TextInput, SelectInput, ArrayInput, SimpleFormIterator, FormDataConsumer
} from "react-admin"

import { styleGetter } from "../../common/commonStyles"
import { cc_types, hiring_type, roles } from "../../common/configs"


export const CreateUsers = () => {
    return (
        <Create redirect="/users">
            <SimpleForm>
                    <SelectInput
                        source="cc_type"
                        choices={cc_types}
                        required
                        fullWidth
                    />
                    <NumberInput source="cc" required fullWidth />
                    <TextInput source="name" required fullWidth />
                    <TextInput source="email" type="email" required fullWidth />
                    <SelectInput
                        source="role"
                        choices={roles}
                        required
                        fullWidth
                    />
                <ArrayInput source="UserDatas" defaultValue={[{}]} fullWidth >
                    <SimpleFormIterator disableAdd disableRemove disableReordering fullWidth>
                        <TextInput source="dataKey" fullWidth required />
                        <TextInput source="dataValue" fullWidth required />
                    </SimpleFormIterator>
                </ArrayInput>
                <FormDataConsumer>
                    {({formData}) => (
                        <ArrayInput source="UserStaffs" defaultValue={[{}]}  fullWidth disabled={["customer", "reseller"].includes(formData.role) || formData.role == undefined}>
                            <SimpleFormIterator disableAdd disableRemove disableReordering fullWidth>
                                <SelectInput
                                    source="role"
                                    choices={hiring_type}
                                    fullWidth
                                />
                            </SimpleFormIterator>
                        </ArrayInput>
                    )}
                </FormDataConsumer>
            </SimpleForm>
        </Create>
    )
}
