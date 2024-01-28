import './configs/initEnv.js'
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import express from 'express'
import fileUpload from 'express-fileupload';
import { v4 } from 'uuid'
import cors from 'cors'
import fs from 'fs'
import modelEntity from './models/index.js';
import { crud } from 'express-crud-router'
import sequelizeCrud from 'express-crud-router-sequelize-v6-connector'

const port = process.env.PORT || 4000;
const __dirname = dirname(fileURLToPath(import.meta.url));

const { models } = modelEntity

const app = express()

app.use(cors({ origin: 'http://localhost:3000', }))

app.use(express.json({limit: '50mb'}))
app.use(express.urlencoded({limit: '50mb'}));
app.use(express.static('static'));
app.use(fileUpload());

/** post routes middleware **/
app.use((err, req, res, next) => {
  console.error('ERROR2022: ', err);

  res.status(500).json({ error: true, message: err.message });
  next();
});

/**CRUD Handler */
for(const modelName of Object.keys(models)) {
  app.use(crud(`/${modelName}`, sequelizeCrud.default(models[modelName])))
}

/**
 * Files Handlers
 */
app.get('/static/:filename', function(req, res){
  const file = `${__dirname}/static/${req.params.filename}`;
  res.download(file); // Set disposition and send it.
});

app.post("/static/upload", (req, res) => {
  let upfile = req.files.file
  console.log(upfile)
  let extension = upfile.name.split(".").pop()
  let updest = `static/${upfile.name}`;

  if(upfile.name.includes("create-uuid")) {
    updest = `static/${v4.uuidv4()}.${extension}`;
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

app.delete('/static/:filename', function(req, res){
  const file = `${__dirname}/static/${req.params.filename}`;
  if(fs.existsSync(file)) {
    fs.unlink(file, err => {
      if(err) {
        console.error(err)
        res.status(500).send({msg: "could not delete file"})
      }
      res.status(200).send({msg: "deleted successfully"})
    })
  }
  res.download(file); // Set disposition and send it.
});

app.get('/', async (req, res) => {
  res.send("Hello World!")
})

app.get('/builder/:newModelName', async (req, res) => {
  let modelName = req.params.newModelName
  try {
    let model = JSON.parse(fs.readFileSync(`${__dirname}/models/${modelName}.json`))
    res.send(model)
  } catch (error) {
    console.error(error)
    if(error.code == 'ENOENT') {
      res.status(404).send({error: `No model found with name ${modelName}`})
    } else {
      res.status(500).send({error: error.message})
    }
  }
})

app.post('/builder/:newModelName', async (req, res) => {
  try {
    let body = req.body
    let modelName = req.params.newModelName

    if(!body.hasOwnProperty("fieldsDefinition")) {
      res.status(400).send({status: "Error", message: `Fields Definitions are required in body`})
      return
    }

    if(!body.hasOwnProperty("associations")) {
      res.status(400).send({status: "Error", message: `Field associations are required in body`})
      return
    }

    if(!Array.isArray(body.associations)) {
      res.status(400).send({status: "Error", message: `Field associations in body should be an array of objects or an empty array if there's no associations for the model`})
      return
    }

    if(fs.existsSync( `${__dirname}/models/${modelName}.json` )) {
      res.status(400).send({status: "Error", message: `Model ${modelName} already exists`})
      return
    } 
    
    fs.writeFileSync(`${__dirname}/models/${modelName}.json`, JSON.stringify(body));
    res.status(201).send({status: "Success", message: `Model ${modelName} created successfully`})

  } catch(err) {
    console.error(err)
    res.status(500).send({status: "Error", message: err.message})
  }
})

app.delete('/builder/:newModelName', async (req, res) => {
  try {
    let modelName = req.params.newModelName
    let modelEntity = await import("./models/index.js")
    let {sequelize} = modelEntity.default

    let queryInterface = sequelize.getQueryInterface()
    queryInterface.dropTable(modelName)
    .then(() => {
      if(fs.existsSync(`${__dirname}/models/${modelName}.json`)) {
        fs.unlinkSync(`${__dirname}/models/${modelName}.json`)
      }
    })
    res.send({status: "Success", message: `Model ${modelName} deleted successfully`})

  } catch(err) {
    console.error(err)
    res.status(500).send({status: "Error", message: err.message})
  }
})

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})