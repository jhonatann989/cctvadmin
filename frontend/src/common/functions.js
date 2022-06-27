import { BACKEND_URL } from "../common/configs";

/**helpers**/

export function hasPermission(url, verb) {
  // let permissionObject = authProvider.getPermissions()
  let permissionObject = JSON.parse(localStorage.getItem("UserPermissions"))
  // console.log(permissionObject)
  let permission = Array.isArray(permissionObject) ?
    permissionObject.filter(permission => permission.module === url).filter(permission => permission.view === verb && permission.can_view)
    :
    []
  if (permission.length) {
    return true
  } else {
    return false
  }
}

/** Validators */

//array validators

export function arrayShouldNotbeEmpty(value, itemKind = "item") {
  if (value.length === 0) {
    return `You should add at least one ${itemKind}`
  }
}

export function visibleListMandatory(value) {
  let modules = []
  value.forEach(element => {
    if (!modules.includes(element.module)) { modules.push(element.module) }
  });

  let listItems = 0
  modules.forEach(module => {
    let foundModule = value.findIndex(item => item.module === module && item.view === "list" && item.can_view === true)
    if (foundModule >= 0) { listItems++ }
  })

  let pluralModules = ""
  for (const module of modules) {
    let foundListModule = value.filter(item => item.module === module && item.view === "list")
    let foundShowModule = value.filter(item => item.module === module && item.view === "show")
    let foundEditModule = value.filter(item => item.module === module && item.view === "edit")
    let foundCreatetModule = value.filter(item => item.module === module && item.view === "create")
    let foundDeleteModule = value.filter(item => item.module === module && item.view === "delete")
    if (
      foundListModule.length > 1 ||
      foundShowModule.length > 1 ||
      foundEditModule.length > 1 ||
      foundCreatetModule.length > 1 ||
      foundDeleteModule.length > 1
    ) {
      pluralModules = "Modules should have one permission per view"
      break;
    }
  }

  if (modules.length === 0 || modules[0] === "") {
    return "Module input should not be empty"
  } else if (listItems < modules.length) {
    return "List view is mandatory on each module"
  } else if (pluralModules !== "") {
    return pluralModules
  }
}

//field validators
export async function isSingleValueAsync(source, propertyName, value) {
  let result = await fetch(`${BACKEND_URL}/${source}?filter={"${propertyName}":"${value}"}`, {
    method: "GET",
    headers: new Headers({ 'Authorization': window.localStorage.getItem("token") })
  }).then(response => response.json())
  if(result.length > 0) {
    return `${value} is already in use`;
  }
}

//tranformators

export async function getBase64FromDomInput(domId) {
  return new Promise((resolve, reject) => {
    var file = document.getElementById(domId).files[0]
    var reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = error => { console.log(error); resolve("") }
  })
}