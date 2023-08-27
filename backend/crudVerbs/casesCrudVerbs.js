const fs = require("fs")
const { v4: uuidv4 } = require('uuid');
const { Op } = require('sequelize');
const { dirname } = require('path');
const appDir = dirname(require.main.filename);
const getPermission = require("../helperFunctions/getPermitions")

const {
  CaseLogs,
  CaseInstallation,
  CaseSale,
  CaseQuotationRequest,
  CaseTechnicalStudy,
  Case
} = require("../models/");

const casesCrudVerbs = {
  getList: async ({ filter, limit, offset, order }, { req }) => {
    let resultPermissions = await getPermission("cases", "list", req.header("Authorization"))
    if (!resultPermissions) {
      return undefined
    }

    let caseData = await Case.findAndCountAll({ limit, offset, order, where: filter, include: [CaseTechnicalStudy, CaseQuotationRequest, CaseSale, CaseInstallation, CaseLogs] })
    return caseData
  },
  getOne: async (id, { req, res }) => {
    let resultPermissions = await getPermission("cases", "show", req.header("Authorization"))
    if (!resultPermissions) {
      return undefined
    }
    let caseData = await Case.findByPk(id, { include: [CaseTechnicalStudy, CaseQuotationRequest, CaseSale, CaseInstallation, CaseLogs] })
    return caseData
  },
  create: async (body, { req, res }) => {
    let resultPermissions = await getPermission("cases", "create", req.header("Authorization"))
    if (!resultPermissions) {
      return undefined
    }
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
  },
  update: async (id, body, { req, res }) => {
    let resultPermissions = await getPermission("cases", "edit", req.header("Authorization"))
    if (!resultPermissions) {
      return undefined
    }
    if (Array.isArray(body.CaseTechnicalStudies) && body.CaseTechnicalStudies.length) {
      CaseTechnicalStudy.update(body.CaseTechnicalStudies[0], { where: { CaseId: id } })
    }
    if (Array.isArray(body.CaseQuotationRequests) && body.CaseQuotationRequests.length) {
      let localBody = { ...body.CaseQuotationRequests[0], ...{ CaseId: id } }
      let caseQuitationExists = await CaseQuotationRequest.findOne({ where: { CaseId: id } })
      if (caseQuitationExists == null) {
        CaseQuotationRequest.create(localBody)
      } else {
        CaseQuotationRequest.update(localBody, { where: { CaseId: id } })
      }
    }
    if (Array.isArray(body.CaseSales) && body.CaseSales.length) {
      let caseSaleExists = await CaseSale.findOne({ where: { CaseId: id } })
      if (caseSaleExists == null) { CaseSale.create({ ...body.CaseSales[0], ...{ CaseId: id } }) }
      else { CaseSale.update({ ...body.CaseSales[0], ...{ CaseId: id } }, { where: { CaseId: id } }) }

    }
    if (Array.isArray(body.CaseInstallations) && body.CaseInstallations.length) {
      let CaseInstallationExists = await CaseInstallation.findOne({ where: { CaseId: id } })
      if (CaseInstallationExists == null) { CaseInstallation.create({ ...body.CaseInstallations[0], ...{ CaseId: id } }) }
      else { CaseInstallation.update({ ...body.CaseInstallations[0], ...{ CaseId: id } }, { where: { CaseId: id } }) }

    }
    if (Array.isArray(body.CaseLogs) && body.CaseLogs.length) {
      let CaseLogsExists = await CaseLogs.findOne({ where: { CaseId: id } })
      if (CaseLogsExists == null) { CaseLogs.create({ ...body.CaseLogs[0], ...{ CaseId: id } }) }
      else { CaseLogs.update({ ...body.CaseLogs[0], ...{ CaseId: id } }, { where: { CaseId: id } }) }

    }
    return Case.findByPk(id)
},
  destroy: async (id, { req, res }) => {
    /**
     * TO DO: Borrar archivos asociados a registros borrados
     */
    let resultPermissions = await getPermission("cases", "delete", req.header("Authorization"))
    if (!resultPermissions) {
      return undefined
    }
    let caseData = await Case.findByPk(id, { include: [CaseTechnicalStudy, CaseQuotationRequest, CaseSale, CaseInstallation, CaseLogs] })
    
    const deletionHandler = (file) => {
      let dir = `${appDir}`
      console.log("deleting", `${dir}/${file}`)
      if(fs.existsSync(`${dir}/${file}`)) {
        fs.unlink(`${dir}/${file}`, err => {
          if(err) {
            console.log("error deleting file",file, error)
          }
        })
      }
    }

    if(Array.isArray(caseData.dataValues.CaseQuotationRequests) && caseData.dataValues.CaseQuotationRequests.length > 0) {
      deletionHandler(caseData.dataValues.CaseQuotationRequests[0].quotation_doc)
    }
    if(Array.isArray(caseData.dataValues.CaseSales) && caseData.dataValues.CaseSales.length > 0) {
      deletionHandler(caseData.dataValues.CaseSales[0].sales_doc)
    }

    await Case.destroy({ where: { id } })
    await CaseTechnicalStudy.destroy({ where: { CaseId: id } })
    await CaseQuotationRequest.destroy({ where: { CaseId: id } })
    await CaseSale.destroy({ where: { CaseId: id } })
    await CaseInstallation.destroy({ where: { CaseId: id } })
    await CaseLogs.destroy({ where: { CaseId: id } })
  },
    search: async (q, limit) => {
      const { rows, count } = await Case.findAndCountAll({
        limit,
        where: {
          [Op.or]: [
            { id: { [Op.like]: `${q}%` } },
          ],
        },
        attributes: ["id"]
      })
      return { rows, count }
    }
}

module.exports = casesCrudVerbs