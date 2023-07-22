import * as React from "react"
import {
    Create, ReferenceInput, SimpleForm, TextInput, SelectInput, ArrayInput, SimpleFormIterator, required, BooleanInput,
} from "react-admin"


export const CreateCases = () => {
    // const [technical, setTechnicals] = React.useState([])
    return (
        <Create redirect="/cases">
            <SimpleForm validate={validateUserCreation}>
                <ReferenceInput
                    source="id_user"
                    reference="users"
                    filter={{ role: "customer" }}
                    perPage={1000}
                    validate={[required()]}
                >
                    <SelectInput optionText={option => `${option.role}: ${option.name} - ${option.cc}`} fullWidth />
                </ReferenceInput>
                <ArrayInput
                    source="CaseTechnicalStudies"
                    defaultValue={[{}]}
                    fullWidth
                    
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
                            <SelectInput fullWidth optionText={option => `${option.role}: ${option.name} - ${option.cc}`} />
                        </ReferenceInput>
                        <TextInput source="evaluation" fullWidth disabled style={{ display: "none" }} />
                        <SelectInput
                            source="state"
                            defaultValue={"pending"}
                            choices={[
                                { id: "pending", name: "Pending" },
                                { id: "ongoing", name: "Ongoing" },
                                { id: "done", name: "Done" },
                            ]}
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

const validateUserCreation = values => {
    let errors = {};
    if (values.CaseTechnicalStudies && values.CaseTechnicalStudies[0].id_responsible == "") {
        errors.CaseTechnicalStudies = 'Please Choose a Technical worker';
    }
    return errors
}