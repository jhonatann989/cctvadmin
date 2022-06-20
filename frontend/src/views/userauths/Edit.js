import * as React from "react"
import {
    ReferenceInput, Edit, required, SimpleForm, TextInput, AutocompleteInput, SimpleFormIterator, ArrayInput, SelectInput, BooleanInput
} from "react-admin"
import { styleGetter, classNameGetter } from "../../common/commonStyles"

export const EditUserAuths = () => {
    const [password, setPassword] = React.useState("")
    const [password2, setPassword2] = React.useState("")
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
                        required
                        fullWidth
                    />
                    {/* <TextInput
                        source="password"
                        type="password"
                        required
                        onChange={e => setPassword(e.target.value)}
                        fullWidth
                        validate={() => {
                            if (password != password2) { return "Passwords must be the same" }
                        }}
                    />
                    <TextInput
                        source="password2"
                        type="password"
                        onChange={e => setPassword2(e.target.value)}
                        required
                        fullWidth
                    /> */}
                </div>
                <ArrayInput
                    source="UserPermissions"
                    defaultValue={[
                        { module: "users" , view: "list"},
                        { module: "users" , view: "show"},
                        { module: "users" , view: "edit"},
                        { module: "users" , view: "create"},
                        { module: "users" , view: "delete"}
                    ]}
                    fullWidth
                    className={classNameGetter("ArrayInput", "formBox", 3)} 
                >
                    <SimpleFormIterator disableAdd disableRemove disableReordering >
                        <SelectInput
                            source="module"
                            choices={[
                                { id: "users", name: "Users" },
                            ]}
                            required
                            disabled
                        />
                        <SelectInput
                            source="view"
                            choices={[
                                { id: "list", name: "List" },
                                { id: "show", name: "Show" },
                                { id: "edit", name: "Edit" },
                                { id: "create", name: "Create" },
                                { id: "delete", name: "Delete" },
                            ]}
                            required
                            disabled
                        />
                        <BooleanInput source="can_view" />
                    </SimpleFormIterator>
                </ArrayInput>
            </SimpleForm>
        </Edit>
    )
}