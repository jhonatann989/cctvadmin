
import React from "react";
import { BulkDeleteButton, BulkExportButton, ShowButton, EditButton } from "react-admin";
import { hasPermission } from "./functions";

export const PostBulkActionButtons = ({url}) => (
    <React.Fragment>
        <BulkExportButton />
        {hasPermission(url, "delete")? <BulkDeleteButton /> : null}
    </React.Fragment>
);

export const ListActions = ({url}) =>(
    <React.Fragment>
        {hasPermission(url, "show")? <ShowButton /> : null}
        {hasPermission(url, "edit")? <EditButton /> : null}
    </React.Fragment>
)