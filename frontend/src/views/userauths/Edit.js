import * as React from "react"
import {
    ReferenceInput, Edit, required, SimpleForm, TextInput, AutocompleteInput, SimpleFormIterator, ArrayInput, SelectInput, BooleanInput
} from "react-admin"
import { styleGetter, classNameGetter } from "../../common/commonStyles"
import { visibleListMandatory, arrayShouldNotbeEmpty } from "../../common/functions"

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
                    className={classNameGetter("ArrayInput", "formBox", 3)} 
                    validate={[
                        value => arrayShouldNotbeEmpty(value, "permission"),
                        value => visibleListMandatory(value), 
                    ]}
                >
                    <SimpleFormIterator disableReordering >
                        <SelectInput
                            source="module"
                            choices={[
                                { id: "users", name: "Users" },
                                { id: "cases", name: "Cases" },
                            ]}
                            validate={[required()]}
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
                            validate={[required()]}
                        />
                        <BooleanInput source="can_view" defaultValue={true} />
                    </SimpleFormIterator>
                </ArrayInput>
            </SimpleForm>
        </Edit>
    )
}