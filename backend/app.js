const express = require('express')
const cors = require('cors')
const { crud } = require("express-crud-router")
const sequelizeCrud = require("express-crud-router-sequelize-v6-connector").default
const fs = require("fs")
const { v4: uuidv4 } = require('uuid');
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

//files
app.use(express.json({limit: '50mb'}))
app.use(express.urlencoded({limit: '50mb'}));
app.use(express.static('static'));

app.get('/InitData', async (req, res) => {
  initData()
  res.send("Init Data Completed")
})

app.get('/static/:filename', function(req, res){
  const file = `${__dirname}/static/${req.params.filename}`;
  res.download(file); // Set disposition and send it.
});

/**middlewares */

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


/***************** */
app.post("/login", async (req, res) => {
  let username = req.body.username
  let password = req.body.password
  let authenticatedUser = await UserAuth.findOne({ where: { username: username, password: password }, include: [UserPermissions], attributes: { exclude: ["password"] } })
  if (authenticatedUser === null) {
    res.status(401).send({})
  } else {
    let token = jwt.sign({ data: username }, process.env.SECRET, { expiresIn: "12h" })
    let UsersModel = await Users.findByPk(authenticatedUser.get("UserId"))
    await UserAuth.update({ token: token }, { where: { username: username, password: password } })
    authenticatedUser.set("token", token)
    res.status(200).send({...authenticatedUser.dataValues, ...{role: UsersModel.get("role")}})
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
      attributes:["id","cc", "name"]
    })
    return { rows, count }
  }
}))

app.use(crud('/userauths', {
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
        if(singleData.id === undefined) {
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
}))

app.use(crud('/cases', {
  getList: async ({ filter, limit, offset, order }, {req}) => {
    if(await getPermission("cases", "list", req.header("Authorization"))) {
      return Case.findAndCountAll({ limit, offset, order, where: filter, include: [CaseTechnicalStudy, CaseQuotationRequest, CaseSale, CaseInstallation, CaseLogs] })
    }
    else {
      return {count: 0, rows: []}
    }
  },
  getOne: async (id, { req, res }) => {
    if(await getPermission("cases", "show", req.header("Authorization"))) {
      return Case.findByPk(id, { include: [CaseTechnicalStudy, CaseQuotationRequest, CaseSale, CaseInstallation, CaseLogs] })
    }
    else {
      return undefined
    }
    
  },
  create: async (body, { req, res }) => {
    if(await getPermission("cases", "create", req.header("Authorization"))) {
      let UsersModel = await Case.create(body)
      if (Array.isArray(body.CaseTechnicalStudies) && body.CaseTechnicalStudies.length) {
        UsersModel.addCaseTechnicalStudy(await CaseTechnicalStudy.create(body.CaseTechnicalStudies[0]))
      }
      if (Array.isArray(body.CaseQuotationRequests) && body.CaseQuotationRequests.length) {
        UsersModel.addCaseQuotationRequest(await CaseQuotationRequest.create(body.CaseQuotationRequests[0]))
      }
      if (Array.isArray(body.CaseSales) && body.CaseSales.length) {
        UsersModel.addCaseSale(await CaseSale.create(body.CaseSales[0]))
      }
      if (Array.isArray(body.CaseInstallations) && body.CaseInstallations.length) {
        UsersModel.addCaseInstallation(await CaseInstallation.create(body.CaseInstallations[0]))
      }
      if (Array.isArray(body.CaseLogs) && body.CaseLogs.length) {
        UsersModel.addCaseLogs(await CaseLogs.create(body.CaseLogs[0]))
      }
      return UsersModel
    }
    else {
      return undefined
    }
  },
  update: async (id, body, { req, res }) => {
    if(await getPermission("cases", "edit", req.header("Authorization"))) {
      if (Array.isArray(body.CaseTechnicalStudies) && body.CaseTechnicalStudies.length) {
        CaseTechnicalStudy.update(body.CaseTechnicalStudies[0], { where: { CaseId: id } })
      }
      if (Array.isArray(body.CaseQuotationRequests) && body.CaseQuotationRequests.length) {
        let attachment = ``
        let localBody = {...body.CaseQuotationRequests[0], ...{CaseId : id}}
        console.log(attachment)
        if(body.CaseQuotationRequests.length && body.CaseQuotationRequests[0].quotation_doc) {
          attachment = `static/${uuidv4()}.pdf`
          base64Data = localBody.quotation_doc.replace(/^data:application\/pdf;base64,/,""),
          binaryData = new Buffer(base64Data, 'base64').toString('binary');
          fs.writeFile(attachment, binaryData, "binary", function(err) {
            console.log(err); // writes out file without error, but it's not a valid image
          });
          localBody = {...localBody, ...{quotation_doc: attachment}}
        }
        let caseQuitationExists = await CaseQuotationRequest.findOne({ where: { CaseId: id } })
        if(caseQuitationExists == null) {
          CaseQuotationRequest.create(localBody)
        } else {
          CaseQuotationRequest.update(localBody, { where: { CaseId: id } })
        }
      }
      if (Array.isArray(body.CaseSales) && body.CaseSales.length) {
        let caseSaleExists = await CaseSale.findOne({ where: { CaseId: id } })
        if(caseSaleExists == null) { CaseSale.create({...body.CaseSales[0], ...{CaseId : id}}) } 
        else { CaseSale.update({...body.CaseSales[0], ...{CaseId : id}}, { where: { CaseId: id } }) }
        
      }
      if (Array.isArray(body.CaseInstallations) && body.CaseInstallations.length) {
        let CaseInstallationExists = await CaseInstallation.findOne({ where: { CaseId: id } })
        if(CaseInstallationExists == null) { CaseInstallation.create({...body.CaseInstallations[0], ...{CaseId : id}}) } 
        else { CaseInstallation.update({...body.CaseInstallations[0], ...{CaseId : id}}, { where: { CaseId: id } }) }
        
      }
      if (Array.isArray(body.CaseLogs) && body.CaseLogs.length) {
        let CaseLogsExists = await CaseLogs.findOne({ where: { CaseId: id } })
        if(CaseLogsExists == null) { CaseLogs.create({...body.CaseLogs[0], ...{CaseId : id}}) } 
        else { CaseLogs.update({...body.CaseLogs[0], ...{CaseId : id}}, { where: { CaseId: id } }) }
        
      }
      return Case.findByPk(id)
    } else {
      return undefined
    }
  },
  destroy: async (id, { req, res }) => {
    if(await getPermission("cases", "delete", req.header("Authorization"))) {
      await Case.destroy({ where: { id } })
      await CaseTechnicalStudy.destroy({ where: { CaseId: id } })
      await CaseQuotationRequest.destroy({ where: { CaseId: id } })
      await CaseSale.destroy({ where: { CaseId: id } })
      await CaseInstallation.destroy({ where: { CaseId: id } })
      await CaseLogs.destroy({ where: { CaseId: id } })
      
    } 
  },
  search: async (q, limit) => {
    const { rows, count } = await Case.findAndCountAll({
      limit,
      where: {
        [Op.or]: [
          { id: { [Op.like]: `${q}%` } },
        ],
      },
      attributes:["id"]
    })
    return { rows, count }
  }
}))


app.get('/', async (req, res) => {
  res.send("Hello World!")
})

app.get('/InitData', async (req, res) => {
  await initData()
  res.send("Init Data Completed")
})

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})

/**helpers */

async function initData() {
  // await UserPermissions.drop()
  // await UserDatas.drop()
  // await UserStaff.drop()
  // await UserAuth.drop()
  // await Users.drop()
  // await CaseTechnicalStudy.drop()
  // await CaseQuotationRequest.drop()
  await CaseSale.drop()
  // await CaseInstallation.drop()
  // await CaseLogs.drop();
  // await Case.drop()

  // await Users.sync({force: true})
  // await UserDatas.sync({force: true})
  // await UserStaff.sync({force: true})
  // await UserAuth.sync({force: true})
  // await UserPermissions.sync({force: true})
  // await Case.sync({force: true})
  // await CaseTechnicalStudy.sync({force: true})
  // await CaseQuotationRequest.sync({force: true})
  await CaseSale.sync({force: true})
  // await CaseInstallation.sync({force: true})
  // await CaseLogs.sync({force: true});

  await Users.create({
    cc: 1232400204,
    name: "Jhonatan Morales",
    cc_type: "CC",
    email: "jhonatann989@gmail.com",
    role: "customer"
  })
  await UserAuth.create({
    username: "moralesrodolfo.5",
    password: "jhonatan18601856",
    UserId: 1
  })
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