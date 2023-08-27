import { fetchUtils } from "react-admin";
import { BACKEND_URL } from "../common/configs";

export const httpClient = (url, options = {}) => {
    if (!options.headers) {  options.headers = new Headers({ Accept: 'application/json' }); }
    let token = localStorage.getItem('token');
    options.headers.set('Authorization', `Bearer ${token}`);
    return fetchUtils.fetchJson(url, options);
};

/**
 * 
 * @param {*} url Mandatory - url to upload withdout the base
 * @param {*} file Mandatory - a js instance of a file
 * @param {*} filename optioinal - the current filename if its an update of a previously uploadede file
 * @returns 
 */
export const httpFileUpload = (url, file, filename = undefined) => {
    let extension = file.name.split(".").pop()
    let options = {}
    let data = new FormData()
    if(filename) { data.append("file", file, filename) }
    else { data.append("file", file, "create-uuid." + extension) }
    let token = localStorage.getItem('token');
    options.headers = new Headers({ 'Authorization': `Bearer ${token}` }); 
    options.method = "post"
    options.body = data
    
    return fetch(`${BACKEND_URL}/${url}`, options)
}

/**
 * 
 * @param {*} url Mandatory - URL withoud the base
 * @param {*} notify Mandatory - an instance of react admin useNotify()
 * @param {*} beginMessage optional - a message to show befor fetch starts
 * @param {*} errorMessage optional - a message to show on error
 */
export const httpFileDownload = (url, notify, beginMessage = "", errorMessage = "") => {
    let filename = url.split("/").pop()
    let token = localStorage.getItem('token');
    let options = {}
    options.headers = new Headers({ 'Authorization': `Bearer ${token}` }); 
    options.method = "get"

    notify(beginMessage? beginMessage : "Downloading...")
    fetch(`${BACKEND_URL}/${url}`, options)
    .then(res => res.blob())
    .then(data => {
        let a = document.createElement("a");
        a.href = window.URL.createObjectURL(data);
        a.download = filename;
        a.click();
    })
    .catch((error) => {
        console.error(error)
        notify(errorMessage? errorMessage : "There was an error downloading the file")
    })
}

/**
 * 
 * @param {*} url Mandatory - URL withoud the base
 * @param {*} notify Mandatory - an instance of react admin useNotify()
 * @param {*} successMessage optional - a message to show befor fetch starts
 * @param {*} errorMessage optional - a message to show on error
 */
export const httpFileDeletion = (url, notify, errorMessage = "") => {
    let token = localStorage.getItem('token');
    let options = {}
    options.headers = new Headers({ 'Authorization': `Bearer ${token}` }); 
    options.method = "delete"

    fetch(`${BACKEND_URL}/${url}`, options)
    .then(res => {
        if(res.status == 500) {
            notify(errorMessage? errorMessage : "There was an error deleting the file")
        }
    })
    .catch((error) => {
        console.error(error)
        notify(errorMessage? errorMessage : "There was an error deleting the file")
    })
}

export const httpResetApplication = (window) => {
    let token = localStorage.getItem('token');
    let options = {}
    options.headers = new Headers({ 'Authorization': `Bearer ${token}` }); 
    options.method = "delete"

    fetch(`${BACKEND_URL}/reset`, options)
}