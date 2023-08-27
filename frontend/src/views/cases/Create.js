import * as React from "react"
import {
    Create, ReferenceInput, SimpleForm, TextInput, SelectInput, ArrayInput, SimpleFormIterator, required, BooleanInput,
} from "react-admin"
import { roles, states } from "../../common/configs"
import { getRoleNameFromId } from "../../common/functions"


export const CreateCases = () => {
    const validateArrayForm = (arrayValues) => {
        let errors = []
        for(let valueObj of arrayValues) {
            if(typeof valueObj.id_responsible != "number") {
                errors.push("a responsible is required")
            }
        }
        
        return errors.join(", ")
    }
    return (
        <Create redirect="/cases">
            <SimpleForm>
                <ReferenceInput
                    source="id_user"
                    reference="users"
                    filter={{ role: "customer" }}
                    perPage={1000}
                    isRequired
                >
                    <SelectInput isRequired  validate={[required()]} optionText={option => `${getRoleNameFromId(option.role)}: ${option.name} - ${option.cc}`} fullWidth />
                </ReferenceInput>
                <ArrayInput
                    source="CaseTechnicalStudies"
                    defaultValue={[{}]}
                    fullWidth
                    required
                    validate={[validateArrayForm]}
                >
                    <SimpleFormIterator disableAdd disableRemove disableReordering fullWidth>
                        <ReferenceInput
                            source="id_responsible"
                            reference="users"
                            filter={{ role: "technical" }}
                            perPage={1000}
                            validate={[required()]}
                            fullWidth
                        >
                            <SelectInput fullWidth optionText={option => `${getRoleNameFromId(option.role)}: ${option.name} - ${option.cc}`} />
                        </ReferenceInput>
                        <TextInput source="evaluation" fullWidth disabled style={{ display: "none" }} />
                        <SelectInput
                            source="state"
                            defaultValue={"pending"}
                            choices={states}
                            required
                            disabled
                            fullWidth
                            style={{ display: "none" }}
                        />
                        <BooleanInput fullWidth source="isFeasable" disabled defaultValue={false} />
                    </SimpleFormIterator>
                </ArrayInput>
            </SimpleForm>
        </Create>
    )
}