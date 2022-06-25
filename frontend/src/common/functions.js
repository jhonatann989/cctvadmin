import { authProvider } from "../providers/authProvider"

/**helpers**/

export function hasPermission(url, verb) {
  // let permissionObject = authProvider.getPermissions()
  let permissionObject = JSON.parse(localStorage.getItem("UserPermissions"))
  // console.log(permissionObject)
  let permission = Array.isArray(permissionObject)? 
    permissionObject.filter(permission => permission.module == url).filter(permission => permission.view == verb && permission.can_view)
    :
    []
  if(permission.length) {
    return true
  } else {
    return false
  }
}