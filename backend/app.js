const express = require('express')
const cors = require('cors')
const { crud } = require("express-crud-router")
const jwt = require('jsonwebtoken');
const port = 4000

const usersCrudVerbs = require("./crudVerbs/usersCrudVerbs")
const userauthsCrudVerbs = require("./crudVerbs/userauthsCrudVerbs")
const casesCrudVerbs = require("./crudVerbs/casesCrudVerbs")

const Users = require("./models/user")
const UserAuth = require("./models/userAuth")
const UserPermissions = require("./models/userPermissions");
const { sequelize } = require('./models/userPermissions');

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
  let authenticatedUser = await UserAuth.findOne({ where: { username: username }, include: [UserPermissions]})
  if (authenticatedUser === null && !await authenticatedUser.isValidPassword(password, authenticatedUser.dataValues.password)) {
    res.status(401).send({})
  } else {
    let token = jwt.sign({ data: username }, process.env.SECRET, { expiresIn: "12h" })
    let UsersModel = await Users.findByPk(authenticatedUser.get("UserId"))
    await UserAuth.update({ token: token }, { where: { username: username} })
    authenticatedUser.set("token", token)
    delete authenticatedUser.dataValues.password
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

app.use(crud('/users', usersCrudVerbs))

app.use(crud('/userauths', userauthsCrudVerbs))

app.use(crud('/cases', casesCrudVerbs))


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
  await sequelize.sync({force:true})
  
  // await UserPermissions.drop()
  // await UserDatas.drop()
  // await UserStaff.drop()
  // await UserAuth.drop()
  // await Users.drop()
  // await CaseTechnicalStudy.drop()
  // await CaseQuotationRequest.drop()
  // await CaseSale.drop()
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
  // await CaseSale.sync({force: true})
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