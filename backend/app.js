require('dotenv').config();
const express = require('express')
const fileUpload = require("express-fileupload");
const { v4: uuidv4 } = require('uuid');
const cors = require('cors')
const { crud } = require("express-crud-router")
const jwt = require('jsonwebtoken');
const fs = require('fs');
const port = process.env.PORT || 4000;

const models = require('./models');

const usersCrudVerbs = require("./crudVerbs/usersCrudVerbs")
const userauthsCrudVerbs = require("./crudVerbs/userauthsCrudVerbs")
const casesCrudVerbs = require("./crudVerbs/casesCrudVerbs")

const app = express()

app.use(cors({ origin: 'http://localhost:3000', }))

//files
app.use(express.json({limit: '50mb'}))
app.use(express.urlencoded({limit: '50mb'}));
app.use(express.static('static'));
app.use(fileUpload());

app.get('/static/:filename', function(req, res){
  const file = `${__dirname}/static/${req.params.filename}`;
  res.download(file); // Set disposition and send it.
});

/** pre routes middlewares */

// verify authorization
app.use((req, res, next) => {
  let wildUrls = ["/login", "/logout"]
  if (!wildUrls.includes(req.url)) {
    try {
      let token = req.header("Authorization").replace("Bearer ", "")
      jwt.verify(token, process.env.SECRET, async (error, decoded) => {
        if (error) { res.status(401).send({ error: error.message }) }
        else {
          let authenticatedUser = await models.UserAuth.findOne({ where: { username: decoded.data, token: token }, include: [models.UserPermissions] })
          if (authenticatedUser === null) {
            await models.UserAuth.update({ token: "" }, { where: { username: decoded.data } })
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
  let authenticatedUser = await models.UserAuth.findOne({ where: { username: username }, include: [models.UserPermissions]})
  if (authenticatedUser !== null && !await authenticatedUser.isValidPassword(password, authenticatedUser.dataValues.password)) {
    res.status(401).send({})
  } else {
    let token = jwt.sign({ data: username }, process.env.SECRET, { expiresIn: "12h" })
    let UsersModel = await models.Users.findByPk(authenticatedUser.get("UserId"))
    await models.UserAuth.update({ token: token }, { where: { username: username} })
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
        let authenticatedUser = await models.UserAuth.findOne({ where: { username: decoded.data, token: token }, include: [models.UserPermissions] })
        if (authenticatedUser === null) {
          res.status(200).send({ message: "Already logged out." })
        } else {
          await models.UserAuth.update({ token: "" }, { where: { username: decoded.data } })
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
        let authenticatedUser = await models.UserAuth.findOne({
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

app.post("/static/upload", (req, res) => {
  let upfile = req.files.file
  console.log(upfile)
  let extension = upfile.name.split(".").pop()
  let updest = `static/${upfile.name}`;

  if(upfile.name.includes("create-uuid")) {
    updest = `static/${uuidv4()}.${extension}`;
  }
  upfile.mv(`${__dirname}/${updest}`, err => {
    if(err) {
      return res.status(500).send(err);
    }
    res.status(200).send({
      "errno": 0,
      "code": "",
      "syscall": "",
      "path": updest
  });
  })
})



app.get('/', async (req, res) => {
  res.send("Hello World!")
})

/** post routes middleware **/
app.use((err, req, res, next) => {
  console.log('ERROR2022: ', err);

  res.status(404).json({ error: true });
  next();
});


async function initData() {
  console.log("=== sync database ====".toLocaleUpperCase())

  await models.sequelize.sync({ force:true })

  let initData = [
    {
      cc: 1232400204,
      name: "Jhonatan Morales",
      cc_type: "CC",
      email: "jhonatann989@gmail.com",
      role: "customer"
    },
    {
      cc: 1094352748,
      name: "Josué Morales",
      cc_type: "CC",
      email: "moralescjosued@gmail.com",
      role: "technical"
    },
    {
      cc: 13386011,
      name: "Rodolfo Morales",
      cc_type: "CC",
      email: "pastorodolfo1@gmail.com",
      role: "seller"
    },
  ]

  for (let singledata of initData) {
    await models.Users.create(singledata)
  }


  await models.UserAuth.create({
    username: "admin",
    password: "dvr12345",
    UserId: 1
  })
}

models.sequelize.sync()
  //.then(initData)
  .then( async () => {
    app.listen(port, () => {
      console.log(`App listening on port ${port}`)
    })
  })