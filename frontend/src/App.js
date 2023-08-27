import  * as React from "react"
import { Admin, CustomRoutes, Resource } from 'react-admin';
import { Route } from "react-router-dom";
import simpleRestProvider from 'ra-data-simple-rest';
import { i18nProvider } from "./providers/i18nProvider";
import { httpClient, httpResetApplication } from "./providers/httpClientProvider";
import { authProvider } from "./providers/authProvider";
import { hasPermission } from "./common/functions";
import { CreateUsers } from "./views/users/Create";
import { ShowUsers } from "./views/users/Show";
import { ListUsers } from "./views/users/List";
import { EditUsers } from "./views/users/Editar";
import { CreateUserAuths } from "./views/userauths/Create"
import { ShowUserAuth } from "./views/userauths/Show"
import { EditUserAuths } from "./views/userauths/Edit"
import { ListUserAuths } from "./views/userauths/List"
import { ListCases } from "./views/cases/List";
import { ShowCases } from "./views/cases/Show";
import { CreateCases } from "./views/cases/Create";
import { EditCases } from "./views/cases/Editar";

const dataProvider = simpleRestProvider('http://localhost:4000', httpClient);


function App() {
  return (
    <Admin 
      dataProvider={dataProvider} 
      authProvider={authProvider}
      i18nProvider={i18nProvider}
    >
      <Resource name="userauths" list={ListUserAuths} show={ShowUserAuth} create={CreateUserAuths} edit={EditUserAuths} />
      <Resource 
        name="users"
        list={hasPermission("users", "list")? ListUsers : null}
        show={hasPermission("users", "show")? ShowUsers : null}
        create={hasPermission("users", "create")? CreateUsers : null}
        edit={hasPermission("users", "edit")? EditUsers : null}
      />
      <Resource 
        name="cases"
        list={hasPermission("cases", "list")? ListCases : null}
        show={hasPermission("cases", "show")? ShowCases : null}
        create={hasPermission("cases", "create")? CreateCases : null}
        edit={hasPermission("cases", "edit")? EditCases : null}
      />
      <CustomRoutes>
        <Route path="/reset" element={<button onClick={() => httpResetApplication(window)}>RESET EVERYTHING!!!!!!</button>} />
      </CustomRoutes>
    </Admin>
  );
}

export default App;



