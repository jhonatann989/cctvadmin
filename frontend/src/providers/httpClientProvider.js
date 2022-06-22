import { fetchUtils } from "react-admin";

export const httpClient = (url, options = {}) => {

    if (!options.headers) {  options.headers = new Headers({ Accept: 'application/json' }); }
    let token = localStorage.getItem('token');
    options.headers.set('Authorization', `Bearer ${token}`);
    return fetchUtils.fetchJson(url, options);
};