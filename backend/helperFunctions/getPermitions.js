const jwt = require('jsonwebtoken');
const UserAuth = require("../models/userAuth")
const UserPermissions = require("../models/userPermissions")

const getPermission = async (url, verb, rawToken) => {
    let token = rawToken.replace("Bearer ", "")
    let result = await jwt.verify(token, process.env.SECRET, async (error, decoded) => {
        if (error) { console.log(error); return [] }
        else {
            let authenticatedUser = await UserAuth.findOne({ where: { username: decoded.data, token: token }, include: [UserPermissions] })
            if (authenticatedUser === null) { return [] }
            else {
                let permissions = authenticatedUser.dataValues.UserPermissions
                let filteredPermissions = permissions.filter(permission => permission.module == url).filter(permission => permission.view == verb && permission.can_view)
                return filteredPermissions
            }
        }
    })
    return Boolean(result.length)
}

module.exports = getPermission