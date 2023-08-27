import * as React from "react"
import {
    Create, SimpleForm, TextInput, AutocompleteInput, required, ReferenceInput, ArrayInput, SimpleFormIterator, SelectInput, BooleanInput, RadioButtonGroupInput, 
} from "react-admin"
import { visibleListMandatory, arrayShouldNotbeEmpty, isSingleValueAsync } from "../../common/functions"

import { styleGetter, classNameGetter } from "../../common/commonStyles"
import { modulePermissions, modules } from "../../common/configs"
import { resources } from "../../providers/i18nProvider"


export const CreateUserAuths = () => {
    const [password, setPassword] = React.useState("")
    const [password2, setPassword2] = React.useState("")
    return (
        <Create redirect="/userauths">
            <SimpleForm>
                <div style={styleGetter("formBox", 2)}>
                    <ReferenceInput
                        source="UserId"
                        reference="users"
                        filterToQuery={search => ({ q: search })}
                        validate={[required()]}
                    >
                        <AutocompleteInput optionText="cc" />
                    </ReferenceInput>
                    <TextInput
                        source="username"
                        validate={[required(), async value => await isSingleValueAsync( "userauths", "username", value)]}
                        fullWidth
                    />
                    <TextInput
                        source="password"
                        type="password"
                        onChange={e => setPassword(e.target.value)}
                        fullWidth
                        validate={[required(), () => {
                            if (password != password2) { return "Passwords must be the same" }
                        }]}
                    />
                    <TextInput
                        source="password2"
                        type="password"
                        onChange={e => setPassword2(e.target.value)}
                        validate={[required()]}
                        fullWidth
                    />
                </div>
                <ArrayInput
                    source="UserPermissions"
                    fullWidth
                    className={classNameGetter("ArrayInput", "formBox", 3)} 
                    required
                    validate={[
                        value => arrayShouldNotbeEmpty(value, "permission"),
                        value => visibleListMandatory(value), 
                    ]}
                >
                    <SimpleFormIterator disableReordering  fullWidth>
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
        </Create>
    )
}
