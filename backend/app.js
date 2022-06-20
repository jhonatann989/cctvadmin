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
const CaseLogs = require("./models/caseLogs")

const app = express()

app.use(cors({ origin: 'http://localhost:3000', }))
app.use(express.json())

/**middlewares */
app.use(function (req, res, next) { initData(); next(); });

app.use((req, res, next) => {
  if (req.url !== "/login") {
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

/***************** */
app.post("/login", async (req, res) => {
  let username = req.body.username
  let password = req.body.password
  let authenticatedUser = await UserAuth.findOne({ where: { username: username, password: password }, include: [UserPermissions], attributes: { exclude: ["password"] } })
  if (authenticatedUser === null) {
    res.status(200).send({})
  } else {
    let token = jwt.sign({ data: username }, process.env.SECRET, { expiresIn: "12h" })
    await UserAuth.update({ token: token }, { where: { username: username, password: password } })
    authenticatedUser.set("token", token)
    res.status(200).send(authenticatedUser)
  }
})

app.use(crud('/users', {
  getList: async ({ filter, limit, offset, order }) => Users.findAndCountAll({ limit, offset, order, where: filter, include: [UserDatas, UserStaff] }),
  getOne: async (id, { req, res }) => Users.findByPk(id, { include: [UserDatas, UserStaff] }),
  create: async (body, { req, res }) => {
    let UsersModel = await Users.create(body)

    if (Array.isArray(body.UserDatas) && body.UserDatas.length) {
      UsersModel.addUserDatas(await UserDatas.create(body.UserDatas[0]))
    }
    if (Array.isArray(body.UserStaffs) && body.UserStaffs.length) {
      UsersModel.addUserStaff(await UserStaff.create(body.UserStaffs[0]))
    }
    return UsersModel
  },
  update: async (id, body, { req, res }) => {
    Users.update(body, { where: { id } })
    if (Array.isArray(body.UserDatas) && body.UserDatas.length) {
      UserDatas.update(body.UserDatas[0], { where: { UserId: id } })
    }
    if (Array.isArray(body.UserStaffs) && body.UserStaffs.length) {
      UserStaff.update(body.UserStaffs[0], { where: { UserId: id } })
    }
    return Users.findByPk(id)
  },
  destroy: async (id, { req, res }) => {
    await Users.destroy({ where: { id } })
    await UserStaff.destroy({ where: { UserId: id } })
    await UserDatas.destroy({ where: { UserId: id } })
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

app.use(crud('/cases', {
  ...sequelizeCrud(Case),
  search: async (q, limit) => {
    const { rows, count } = await Case.findAndCountAll({
      limit,
      where: {
        [Op.or]: [
          { id: { [Op.like]: `${q}%` } },
          { id_case: { [Op.like]: `${q}%` } }
        ],
      },
    })
    return { rows, count }
  }
}))

app.use(crud('/case_technical_studies', {
  ...sequelizeCrud(CaseTechnicalStudy),
  search: async (q, limit) => {
    const { rows, count } = await CaseTechnicalStudy.findAndCountAll({
      limit,
      where: {
        [Op.or]: [
          { id: { [Op.like]: `${q}%` } },
          { id_case: { [Op.like]: `${q}%` } }
        ],
      },
    })
    return { rows, count }
  }
}))

app.use(crud('/case_quotation_requests', {
  ...sequelizeCrud(CaseQuotationRequest),
  search: async (q, limit) => {
    const { rows, count } = await CaseQuotationRequest.findAndCountAll({
      limit,
      where: {
        [Op.or]: [
          { id: { [Op.like]: `${q}%` } },
          { id_case: { [Op.like]: `${q}%` } }
        ],
      },
    })
    return { rows, count }
  }
}))

app.use(crud('/case_sales', {
  ...sequelizeCrud(CaseSale),
  search: async (q, limit) => {
    const { rows, count } = await CaseSale.findAndCountAll({
      limit,
      where: {
        [Op.or]: [
          { id: { [Op.like]: `${q}%` } },
          { id_case: { [Op.like]: `${q}%` } }
        ],
      },
    })
    return { rows, count }
  }
}))

app.use(crud('/case_installations', {
  ...sequelizeCrud(CaseInstallation),
  search: async (q, limit) => {
    const { rows, count } = await CaseInstallation.findAndCountAll({
      limit,
      where: {
        [Op.or]: [
          { id: { [Op.like]: `${q}%` } },
          { id_case: { [Op.like]: `${q}%` } }
        ],
      },
    })
    return { rows, count }
  }
}))

app.use(crud('/case_logs', {
  ...sequelizeCrud(CaseLogs),
  search: async (q, limit) => {
    const { rows, count } = await CaseLogs.findAndCountAll({
      limit,
      where: {
        [Op.or]: [
          { id: { [Op.like]: `${q}%` } },
          { id_case: { [Op.like]: `${q}%` } }
        ],
      },
    })
    return { rows, count }
  }
}))


app.get('/', async (req, res) => {
  res.send('Hello World!')
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