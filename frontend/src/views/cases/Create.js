import * as React from "react"
import {
    Create, ReferenceInput, SimpleForm, TextInput, SelectInput, ArrayInput, SimpleFormIterator, required, AutocompleteInput, BooleanInput,
    useGetList  
} from "react-admin"
import { styleGetter, classNameGetter } from "../../common/commonStyles"


export const CreateCases = () => {
    // const [technical, setTechnicals] = React.useState([])
    let technicalData = useGetList('users',  { pagination: { page: 1, perPage: 1000 }, filter: {role: "technical"} });
    let customerData = useGetList('users',  { pagination: { page: 1, perPage: 1000 }, filter: {role: "customer"} });
    return (
        <Create redirect="/cases">
            <SimpleForm>
                {/* <div style={styleGetter("formBox")}> */}
                    {/* <AutocompleteInput source="UserId" choices={customerData.data} optionText="cc" /> */}
                    <ReferenceInput
                        source="id_user"
                        reference="users"
                        filter={{role: "customer"}}
                        perPage={1000}
                        validate={[required()]}
                    >
                        <SelectInput optionText="cc" fullWidth />
                    </ReferenceInput>
                    {/* <SelectInput
                        source="state"
                        defaultValue={"technical_study"}
                        choices={[
                            { id: "technical_study", name: "Technical Study" },
                            { id: "quotation_request", name: "Quotation Request" },
                            { id: "sale", name: "Sale" },
                            { id: "installation", name: "Instalation" },
                        ]}
                        required
                        disabled
                        fullWidth
                    /> */}
                {/* </div> */}
                <ArrayInput 
                    source="CaseTechnicalStudies"
                    className={classNameGetter("ArrayInput", "formBox", 3)}  
                    defaultValue={[{}]} 
                    fullWidth 
                >
                    <SimpleFormIterator disableAdd disableRemove disableReordering >
                        {/* <AutocompleteInput source="id_responsible" choices={technicalData.data} optionText="cc" /> */}
                        <ReferenceInput
                            source="id_responsible"
                            reference="users"
                            filter={{role: "technical"}}
                            perPage={1000}
                            validate={[required()]}
                        >
                            <SelectInput optionText="cc" />
                        </ReferenceInput>
                        <TextInput source="evaluation" fullwidth disabled />
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
                        />
                        <BooleanInput source="isFeasable" disabled defaultValue={false} />
                    </SimpleFormIterator>
                </ArrayInput>
            </SimpleForm>
        </Create>
    )
}
