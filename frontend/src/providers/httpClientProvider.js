import { fetchUtils } from "react-admin";
import { BACKEND_URL } from "../common/configs";

export const httpClient = (url, options = {}) => {
    if (!options.headers) {  options.headers = new Headers({ Accept: 'application/json' }); }
    let token = localStorage.getItem('token');
    options.headers.set('Authorization', `Bearer ${token}`);
    return fetchUtils.fetchJson(url, options);
};

export const httpFileUpload = (url, file, filename) => {
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