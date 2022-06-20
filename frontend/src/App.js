import  * as React from "react"
import { Admin, Resource } from 'react-admin';
import simpleRestProvider from 'ra-data-simple-rest';
import { CreateUsers } from "./views/users/Create";
import { ShowUsers } from "./views/users/Show";
import { ListUsers } from "./views/users/List";
import { EditUsers } from "./views/users/Editar";
import { CreateUserAuths } from "./views/userauths/Create"
import { ShowUserAuth } from "./views/userauths/Show"
import { EditUserAuths } from "./views/userauths/Edit"
import { ListUserAuths } from "./views/userauths/List"
// import { ListAsistentes } from "./views/asistentes/List";
// import { ShowAsistentes } from "./views/asistentes/Show";
// import { CreateAsistentes } from "./views/asistentes/Create";
// import { EditAsistentes } from "./views/asistentes/Editar";

const dataProvider = simpleRestProvider('http://localhost:4000');


function App() {
  return (
    <Admin 
      dataProvider={dataProvider} 
    >
      <Resource name="users"     list={ListUsers}     show={ShowUsers}    create={CreateUsers}     edit={EditUsers}      />
      <Resource name="userauths" list={ListUserAuths} show={ShowUserAuth} create={CreateUserAuths} edit={EditUserAuths} />
    </Admin>
  );
}

export default App;
