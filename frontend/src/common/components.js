
import React, {useState} from "react";
import { BulkDeleteButton, BulkExportButton, ShowButton, EditButton, useInput, Button, useSafeSetState, LinearProgress, useNotify } from "react-admin";
import { getBase64FromEventInput, hasPermission } from "./functions";
import { httpClient, httpFileUpload } from "../providers/httpClientProvider";

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

export const FileInput = ({source, label, onFileChange, accept}) => {
    let {id, field, fieldState, formState, } = useInput({source})

    const handleChange = async event => {
        let base64 = await getBase64FromEventInput(event)
        field.onChange(base64)
        if(typeof onFileChange == "function") {
            onFileChange(base64)
        }
    }
    
    return (
        <label htmlFor={id}>
            <input 
                type="file" 
                className="custom-file-input"
                onChange={handleChange}
                accept={accept}
            />
            {fieldState.error && <span>{fieldState.error.message}</span>}
        </label>
    )
}

export const ServerSideFileInput = (props) => {
    const {
        source, label, accept, fullWidth, uploadUri, uploadErrorMessage, uploadSuccessMessage
    } = props
    const {id, field, fieldState, formState, } = useInput({source})
    const notify = useNotify()
    const [fileLength, setFileLength] = useState(0)
    const [file, setFile] = useState(undefined)
    const [isUploading, setIsUploading] = useState(false)

    const handleChange = async event => {
        setFileLength(event.target.files.length)
        setFile(event.target.files[0])
    }
    
    const handleUpload = () => {
        let filename = field.value? field.value.split("/").pop() : ""
        setIsUploading(true)
        httpFileUpload(uploadUri, file, filename)
        .then(response => response.json())
        .then(json => {
            if(json.error) {
                notify(`${json.error}`)
            } else {
                field.onChange(json.path)
                notify(`${uploadSuccessMessage? uploadSuccessMessage : "Upload Success"}`)
            }
        })
        .catch(() => {
            notify(`${uploadErrorMessage? uploadErrorMessage : "Unable to upload file"}`)
        })
        .finally(() => setIsUploading(false))
    }

    return (
        <>
            <div style={{display: "flex", justifyContent: "space-between", gap: "1vw", width: fullWidth? "100%": undefined}}>
                <div>
                    <label htmlFor={id}>
                        <input 
                            type="file" 
                            class="custom-file-input"
                            onChange={handleChange}
                            accept={accept}
                        />
                        {fieldState.error && <span>{fieldState.error.message}</span>}
                    </label>
                </div>
                <Button disabled={fileLength == 0} onClick={handleUpload}>Upload</Button>
            </div> 
            {isUploading? <LinearProgress sx={{width: "100%"}}/> : null}
        </>
    )
}