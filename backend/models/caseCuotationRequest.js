const { DataTypes, Sequelize, Model } = require('sequelize');
const server = require("./../configs/sequelizeServer")
const sequelize = new Sequelize(server.database, server.username, server.password, server.params)


class CaseQuotationRequest extends Model {}

CaseQuotationRequest.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    id_case: {
        type: DataTypes.INTEGER,
    },
    id_responsible: {
        type: DataTypes.INTEGER,
    },
    quotation_doc: {
        type: DataTypes.STRING,
    },
    state: {
        type: DataTypes.STRING,
    }
},{
    sequelize,
    tableName: "case_quotation_request",
})

module.exports = CaseQuotationRequest;