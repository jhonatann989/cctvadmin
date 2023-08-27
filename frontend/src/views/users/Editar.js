import * as React from "react"
import {
    SelectInput, Edit, NumberInput, SimpleForm, TextInput, ArrayInput, SimpleFormIterator, FormDataConsumer
} from "react-admin"
import { styleGetter } from "../../common/commonStyles"
import { cc_types, hiring_type, roles } from "../../common/configs"

export const EditUsers = () => {
    return (
        <Edit redirect="/users">
            <SimpleForm>
                    <SelectInput
                        source="cc_type"
                        choices={cc_types}
                        fullWidth
                        required
                        disabled
                    />
                    <NumberInput source="cc" fullWidth required disabled />
                    <TextInput source="name" fullWidth required />
                    <TextInput source="email" type="email" fullWidth required />
                    <SelectInput
                        source="role"
                        choices={roles}
                        fullWidth
                        required
                    />
                 <ArrayInput source="UserDatas" fullWidth>
                    <SimpleFormIterator disableReordering disableClear fullWidth>
                        <TextInput source="dataKey" fullWidth required />
                        <TextInput source="dataValue" fullWidth required multiline />
                    </SimpleFormIterator>
                </ArrayInput>
                <FormDataConsumer fullWidth>
                    {({formData}) => (
                        <ArrayInput source="UserStaffs" fullWidth disabled={["customer", "reseller"].includes(formData.role) || formData.role == undefined}>
                            <SimpleFormIterator disableAdd={["customer", "reseller"].includes(formData.role) || formData.role == undefined || formData.UserStaffs.length} disableReordering fullWidth>
                                <SelectInput
                                    source="role"
                                    choices={hiring_type}
                                    required
                                    fullWidth
                                />
                            </SimpleFormIterator>
                        </ArrayInput>
                    )}
                </FormDataConsumer>
            </SimpleForm>
        </Edit>
    )
}