const fs = require("fs")
const { v4: uuidv4 } = require('uuid');
const { Op } = require('sequelize');
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
    if (await getPermission("cases", "list", req.header("Authorization"))) {
      return Case.findAndCountAll({ limit, offset, order, where: filter, include: [CaseTechnicalStudy, CaseQuotationRequest, CaseSale, CaseInstallation, CaseLogs] })
    }
    else {
      return { count: 0, rows: [] }
    }
  },
  getOne: async (id, { req, res }) => {
    if (await getPermission("cases", "show", req.header("Authorization"))) {
      return Case.findByPk(id, { include: [CaseTechnicalStudy, CaseQuotationRequest, CaseSale, CaseInstallation, CaseLogs] })
    }
    else {
      return undefined
    }

  },
  create: async (body, { req, res }) => {
    if (await getPermission("cases", "create", req.header("Authorization"))) {
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
    if (await getPermission("cases", "edit", req.header("Authorization"))) {
      if (Array.isArray(body.CaseTechnicalStudies) && body.CaseTechnicalStudies.length) {
        CaseTechnicalStudy.update(body.CaseTechnicalStudies[0], { where: { CaseId: id } })
      }
      if (Array.isArray(body.CaseQuotationRequests) && body.CaseQuotationRequests.length) {
        let attachment = ``
        let localBody = { ...body.CaseQuotationRequests[0], ...{ CaseId: id } }
        // console.log(attachment)
        // if (body.CaseQuotationRequests.length && body.CaseQuotationRequests[0].quotation_doc) {
        //   attachment = `static/${uuidv4()}.pdf`
        //   base64Data = localBody.quotation_doc.replace(/^data:application\/pdf;base64,/, ""),
        //     binaryData = new Buffer(base64Data, 'base64').toString('binary');
        //   fs.writeFile(attachment, binaryData, "binary", function (err) {
        //     console.log(err); // writes out file without error, but it's not a valid image
        //   });
        //   localBody = { ...localBody, ...{ quotation_doc: attachment } }
        // }
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
    } else {
      return undefined
    }
  },
  destroy: async (id, { req, res }) => {
    if (await getPermission("cases", "delete", req.header("Authorization"))) {
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
      attributes: ["id"]
    })
    return { rows, count }
  }
}

module.exports = casesCrudVerbs