import * as React from "react"
import { Datagrid, List, NumberField, ReferenceField, TextField, FunctionField, SelectField
} from "react-admin"
import { PostBulkActionButtons, ListActions } from "../../common/components"

export const ListCases = () => {
    return(
        <List>
            <Datagrid bulkActionButtons={<PostBulkActionButtons url="cases" /> }>
                <NumberField source="id" fullWidth />
                <ReferenceField source="id_user" reference="users">
                    <FunctionField render={record => record && `${record.cc} - ${record.name}`} />
                </ReferenceField>
                {/* <SelectField 
                    source="state" 
                    choices={[
                        { id: "technical_study", name: "Technical Study" },
                        { id: "quotation_request", name: "Quotation Request" },
                        { id: "sale", name: "Sale" },
                        { id: "installation", name: "Instalation" },
                    ]}
                /> */}
                <ListActions url="cases" />
            </Datagrid>
        </List>
    )
}