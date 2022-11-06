const UserAuth = require("../models/userAuth")
const UserPermissions = require("../models/userPermissions")


const userauthsCrudVerbs = {
    getList: async ({ filter, limit, offset, order }) =>
        UserAuth.findAndCountAll({ limit, offset, order, where: filter, include: [UserPermissions], attributes: { exclude: ["password", "token"] } }),
    getOne: async (id, { req, res }) => UserAuth.findByPk(id, { include: [UserPermissions], attributes: { exclude: ["password"] } }),
    create: async (body, { req, res }) => {
        let UsersModel = await UserAuth.create(body)
        if (Array.isArray(body.UserPermissions) && body.UserPermissions.length) {
            body.UserPermissions.forEach(async singleData => {
                UsersModel.addUserPermission(await UserPermissions.create(singleData))
            });
        }
        return UsersModel
    },
    update: async (id, body, { req, res }) => {
        let currentUserAuth = await UserAuth.findByPk(id)
        body.password = currentUserAuth.getDataValue("password")
        UserAuth.update(body, { where: { id } })
        if (Array.isArray(body.UserPermissions) && body.UserPermissions.length) {
            body.UserPermissions.forEach(async singleData => {
                if (singleData.id === undefined) {
                    currentUserAuth.addUserPermission(await UserPermissions.create(singleData))
                } else {
                    await UserPermissions.update(singleData, { where: { id: singleData.id } })
                }
            });
        }
        return UserAuth.findByPk(id)
    },
    destroy: async (id, { req, res }) => {
        await UserPermissions.destroy({ where: { UserAuthId: id } })
        await UserAuth.destroy({ where: { id } })
    }
}

module.exports = userauthsCrudVerbs