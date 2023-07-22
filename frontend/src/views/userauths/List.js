import * as React from "react"
import { Datagrid, List, NumberField, ShowButton, EditButton, ReferenceField, FunctionField, BulkDeleteButton, BulkExportButton, SimpleList  } from "react-admin"
import { useMediaQuery } from '@mui/material';

export const ListUserAuths = () => {
    const isSmall = useMediaQuery(theme => theme.breakpoints.down('md'))
    return(
        <List>
            {isSmall?
                <SimpleList
                    primaryText={() => (
                        <ReferenceField source="UserId" reference="users" link={false} >
                            <FunctionField render={record => record && `${record.cc} - ${record.name}`} />
                        </ReferenceField>
                    )}
                    tertiaryText={record => record.id}
                    linkType="show"
                />
                :
                <Datagrid bulkActionButtons={<PostBulkActionButtons />}>
                    <NumberField source="id" />
                    <ReferenceField source="UserId" reference="users" link={false}>
                        <FunctionField render={record => record && `${record.cc} - ${record.name}`} />
                    </ReferenceField>
                    <ShowButton />
                    <EditButton />
                </Datagrid>
            }
        </List>
    )
}

const PostBulkActionButtons = () => (
    <React.Fragment>
        {/* <BulkExportButton /> */}
        <BulkDeleteButton />
    </React.Fragment>
);