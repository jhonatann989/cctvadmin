const express = require('express')
const cors = require('cors')
const { crud } = require("express-crud-router")
const sequelizeCrud = require("express-crud-router-sequelize-v6-connector").default
const { Op } = require('sequelize');
const jwt = require('jsonwebtoken');
const port = 4000


const Users = require("./models/user")
const UserAuth = require("./models/userAuth")
const UserPermissions = require("./models/userPermissions")
const UserDatas = require("./models/userDatas")
const UserStaff = require("./models/userStaff")
const Case = require("./models/case")
const CaseTechnicalStudy = require("./models/caseTechnicalStudy")
const CaseQuotationRequest = require("./models/caseCuotationRequest")
const CaseSale = require("./models/caseSale")
const CaseInstallation = require("./models/caseInstalation")
const CaseLogs = require("./models/caseLogs");

const app = express()

app.use(cors({ origin: 'http://localhost:3000', }))
app.use(express.json())

/**middlewares */
// app.use(function (req, res, next) { initData(); next(); });
// verify authorization
app.use((req, res, next) => {
  let wildUrls = ["/login", "/logout"]
  if (!wildUrls.includes(req.url)) {
    try {
      let token = req.header("Authorization").replace("Bearer ", "")
      jwt.verify(token, process.env.SECRET, async (error, decoded) => {
        if (error) { res.status(401).send({ error: error.message }) }
        else {
          let authenticatedUser = await UserAuth.findOne({ where: { username: decoded.data, token: token }, include: [UserPermissions] })
          if (authenticatedUser === null) {
            await UserAuth.update({ token: "" }, { where: { username: decoded.data } })
            res.status(401).send({ error: "Token does not corresponds to the authenticated user." })
          } else {
            next()
          }
        }
      })
    }
    catch (error) {
      res.status(400).send({ error: "It appears that Bearer Token is not present in headers." })
    }
  } else { next() }
})

//verify permissions


/***************** */
app.post("/login", async (req, res) => {
  console.log(req.body)
  let username = req.body.username
  let password = req.body.password
  let authenticatedUser = await UserAuth.findOne({ where: { username: username, password: password }, include: [UserPermissions], attributes: { exclude: ["password"] } })
  if (authenticatedUser === null) {
    res.status(401).send({})
  } else {
    let token = jwt.sign({ data: username }, process.env.SECRET, { expiresIn: "12h" })
    await UserAuth.update({ token: token }, { where: { username: username, password: password } })
    authenticatedUser.set("token", token)
    res.status(200).send(authenticatedUser)
  }
})

app.get("/logout", async (req, res) => {
  try {
    let token = req.header("Authorization").replace("Bearer ", "")
    jwt.verify(token, process.env.SECRET, async (error, decoded) => {
      if (error) res.status(200).send({ message: "it appears that token is an empty string or an invalid value.", error: error.message })
      else {
        let authenticatedUser = await UserAuth.findOne({ where: { username: decoded.data, token: token }, include: [UserPermissions] })
        if (authenticatedUser === null) {
          res.status(200).send({ message: "Already logged out." })
        } else {
          await UserAuth.update({ token: "" }, { where: { username: decoded.data } })
          res.status(200).send({ message: "Logged out successfully." })
        }
      }
    })
  }
  catch (error) {
    res.status(400).send({ error: "It appears that Bearer Token is not present in headers." })
  }
})

app.get("/identity", async (req, res) => {
  try {
    let token = req.header("Authorization").replace("Bearer ", "")
    jwt.verify(token, process.env.SECRET, async (error, decoded) => {
      if (error) { res.status(401).send({ error: error.message }) }
      else {
        let authenticatedUser = await UserAuth.findOne({
          where: { username: decoded.data },
          attributes: { exclude: ["password", "token", "createdAt", "updatedAt", "id"] }
        })
        if (authenticatedUser === null) {
          res.status(401).send({ error: "Unknown User." })
        } else {
          res.status(200).send({
            id: authenticatedUser.get("UserId"),
            fullName: authenticatedUser.get("username"),
          })
        }
      }
    })
  }
  catch (error) {
    res.status(400).send({ error: "It appears that Bearer Token is not present in headers." })
  }
})

app.use(crud('/users', {
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
      attributes:["cc", "name"]
    })
    return { rows, count }
  }
}))

app.use(crud('/userauths', {
  getList: async ({ filter, limit, offset, order }) =>
    UserAuth.findAndCountAll({ limit, offset, order, where: filter, include: [UserPermissions], attributes: { exclude: ["password"] } }),
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
      body.UserPermissions.forEach(async singleData => await UserPermissions.update(singleData, { where: { id: singleData.id } }));
    }
    return UserAuth.findByPk(id)
  },
  destroy: async (id, { req, res }) => {
    await UserPermissions.destroy({ where: { UserAuthId: id } })
    await UserAuth.destroy({ where: { id } })
  }
}))


app.get('/', async (req, res) => {
  res.send("Hello World!")
})

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})

/**helpers */

function initData() {
  Users.sync()
  UserAuth.sync()
  UserPermissions.sync()
  UserDatas.sync()
  UserStaff.sync()
  Case.sync()
  CaseTechnicalStudy.sync()
  CaseQuotationRequest.sync()
  CaseSale.sync()
  CaseInstallation.sync()
  CaseLogs.sync()
}

async function getPermission(url, verb, rawToken) {
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
  // console.log(`permissionsByUrl '${url}' and verb '${verb}'`, result.length)
  return Boolean(result.length)
}