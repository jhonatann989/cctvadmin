const { Op } = require('sequelize');
const getPermission = require("../helperFunctions/getPermitions")

const {
  UserStaff,
  UserDatas,
  Users
} = require("../models")

const usersCrudVerbs = {
    getList: async ({ filter, limit, offset, order }, {req}) => {
      if(await getPermission("users", "list", req.header("Authorization"))) {
        return Users.findAndCountAll({ limit, offset, order, where: filter, include: [UserDatas, UserStaff] })
      }
      else {
        return {count: 0, rows: []}
      }
    },
    getOne: async (id, { req, res }) => {
      if(await getPermission("users", "show", req.header("Authorization"))) {
        return Users.findByPk(id, { include: [UserDatas, UserStaff] })
      }
      else {
        return undefined
      }
      
    },
    create: async (body, { req, res }) => {
      if(await getPermission("users", "create", req.header("Authorization"))) {
        let UsersModel = await Users.create(body)
        if (Array.isArray(body.UserDatas) && body.UserDatas.length) {
          UsersModel.addUserDatas(await UserDatas.create(body.UserDatas[0]))
        }
        if (Array.isArray(body.UserStaffs) && body.UserStaffs.length) {
          UsersModel.addUserStaff(await UserStaff.create(body.UserStaffs[0]))
        }
        return UsersModel
      }
      else {
        return undefined
      }
    },
    update: async (id, body, { req, res }) => {
      if(await getPermission("users", "edit", req.header("Authorization"))) {
        Users.update(body, { where: { id } })
        if (Array.isArray(body.UserDatas) && body.UserDatas.length) {
          UserDatas.update(body.UserDatas[0], { where: { UserId: id } })
        }
        if (Array.isArray(body.UserStaffs) && body.UserStaffs.length) {
          UserStaff.update(body.UserStaffs[0], { where: { UserId: id } })
        }
        return Users.findByPk(id)
      } else {
        return undefined
      }
    },
    destroy: async (id, { req, res }) => {
      if(await getPermission("users", "delete", req.header("Authorization"))) {
        await Users.destroy({ where: { id } })
        await UserStaff.destroy({ where: { UserId: id } })
        await UserDatas.destroy({ where: { UserId: id } })
      } 
    },
    search: async (q, limit) => {
      const { rows, count } = await Users.findAndCountAll({
        limit,
        where: {
          [Op.or]: [
            { cc: { [Op.like]: `${q}%` } },
            { name: { [Op.like]: `${q}%` } },
          ],
        },
        attributes:["id","cc", "name"]
      })
      return { rows, count }
    }
  }

module.exports = usersCrudVerbs