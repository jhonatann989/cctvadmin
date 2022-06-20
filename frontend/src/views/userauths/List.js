import * as React from "react"
import { Datagrid, List, NumberField, ShowButton, EditButton, ReferenceField, FunctionField, BulkDeleteButton, BulkExportButton  } from "react-admin"

export const ListUserAuths = () => {
    return(
        <List>
            <Datagrid bulkActionButtons={<PostBulkActionButtons />}>
                <NumberField source="id" />
                <ReferenceField source="UserId" reference="users">
                    <FunctionField render={record => record && `${record.cc} - ${record.name}`} />
                </ReferenceField>
                <ShowButton />
                <EditButton />
            </Datagrid>
        </List>
    )
}

const PostBulkActionButtons = () => (
    <React.Fragment>
        {/* <BulkExportButton /> */}
        <BulkDeleteButton />
    </React.Fragment>
);