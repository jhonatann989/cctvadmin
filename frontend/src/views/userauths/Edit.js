import * as React from "react"
import {
    ReferenceInput, Edit, required, SimpleForm, TextInput, AutocompleteInput, SimpleFormIterator, ArrayInput, SelectInput, BooleanInput, RadioButtonGroupInput
} from "react-admin"
import { styleGetter, classNameGetter } from "../../common/commonStyles"
import { visibleListMandatory, arrayShouldNotbeEmpty } from "../../common/functions"
import { modulePermissions, modules } from "../../common/configs"
import { resources } from "../../providers/i18nProvider"

export const EditUserAuths = () => {
    return (
        <Edit redirect="/userauths">
            <SimpleForm>
                <div style={styleGetter("formBox", 2)}>
                    <ReferenceInput
                        source="UserId"
                        reference="users"
                        filterToQuery={search => ({ q: search })}
                        validate={[required()]}
                    >
                        <AutocompleteInput optionText="cc" disabled />
                    </ReferenceInput>
                    <TextInput
                        disabled
                        source="username"
                        validate={[required()]}
                        fullWidth
                    />
                </div>
                <ArrayInput
                    source="UserPermissions"
                    fullWidth
                    validate={[
                        value => arrayShouldNotbeEmpty(value, "permission"),
                        value => visibleListMandatory(value), 
                    ]}
                >
                    <SimpleFormIterator disableReordering fullWidth>
                        <SelectInput
                            source="module"
                            label={resources.userauths.fields.module}
                            choices={modules}
                            validate={[required()]}
                            fullWidth
                        />
                        <RadioButtonGroupInput
                            source="view"
                            label={resources.userauths.fields.view}
                            choices={modulePermissions}
                            validate={[required()]}
                            fullWidth
                        />
                        <BooleanInput source="can_view" label={resources.userauths.fields.can_view} defaultValue={true} fullWidth />
                    </SimpleFormIterator>
                </ArrayInput>
            </SimpleForm>
        </Edit>
    )
}