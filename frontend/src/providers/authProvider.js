import { BACKEND_URL } from "../common/configs";


export const authProvider = {
    // send username and password to the auth server and get back credentials
    login: ({ username, password }) => {
        return fetch(`${BACKEND_URL}/login`, {
            method: "POST",
            body: JSON.stringify({ username, password }),
            headers: new Headers({ 'Content-Type': 'application/json' })
        })
            .then(response => {
                if (response.status < 200 || response.status >= 300) { throw new Error(response.statusText); }
                return response.json();
            })
            .then(json => {
                // console.log(json)
                localStorage.setItem("token", json.token)
                localStorage.setItem("UserPermissions", JSON.stringify(json.UserPermissions))
            })
            .catch((error) => { throw new Error('Network error. ' + error.message) })
    },
    // remove local credentials and notify the auth server that the user logged out
    logout: () => {
        let token = localStorage.getItem("token")? localStorage.getItem("token") : ""
        return fetch(`${BACKEND_URL}/logout`, {
            method: "GET",
            headers: new Headers({ "Authorization": `Bearer ${token}` })
        })
        .then(response => {
            if (response.status < 200 || response.status >= 300) { throw new Error(response.statusText); }
            return response.json();
        })
        .then(json => {
            localStorage.removeItem("token")
            localStorage.removeItem("UserPermissions")
        })
        .catch((error) => { throw new Error('Network error. ' + error.message) })
        // return Promise.resolve()
    },
    // when the user navigates, make sure that their credentials are still valid
    checkAuth: () =>{
        // console.log("checking auth")
        return localStorage.getItem('token') ? Promise.resolve() : Promise.reject()
    },
    // when the dataProvider returns an error, check if this is an authentication error
    checkError: (error) => {
        const status = error.status;
        if (status === 401 || status === 403) {
            localStorage.removeItem('token');
            localStorage.removeItem('UserPermissions');
            return Promise.reject();
        }
        // other error code (404, 500, etc): no need to log out
        return Promise.resolve();
    },
    // get the user's profile
    getIdentity: () =>
        fetch(`${BACKEND_URL}/identity`, {
            method: "GET",
            headers: { "Authorization": `Bearer ${localStorage.getItem('token')}` }
        })
            .then(response => {
                if (response.status < 200 || response.status >= 300) { throw new Error(response.statusText); }
                let fullName
                return response.json();
            })
            .catch((error) => { throw new Error('Network error. ' + error.message) }),
    // get the user permissions (optional)
    getPermissions: () => {
        try {
            Promise.resolve(JSON.parse(localStorage.getItem("UserPermissions")))
        } catch (error) {
            console.log(error)
            Promise.reject(error)
        }
    },
};

