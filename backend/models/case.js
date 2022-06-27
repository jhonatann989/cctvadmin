const { DataTypes, Sequelize, Model } = require('sequelize');
const server = require("./../configs/sequelizeServer");
const CaseQuotationRequest = require('./caseCuotationRequest');
const CaseInstallation = require('./caseInstalation');
const CaseLogs = require('./caseLogs');
const CaseSale = require('./caseSale');
const CaseTechnicalStudy = require('./caseTechnicalStudy');
const sequelize = new Sequelize(server.database, server.username, server.password, server.params)



class Case extends Model {}

Case.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    id_user: {
        type: DataTypes.INTEGER,
    },
    state: {
        type: DataTypes.STRING,
    },
},{
    sequelize,
    tableName: "case",
})

Case.hasMany(CaseTechnicalStudy)
CaseTechnicalStudy.belongsTo(Case)
Case.hasMany(CaseQuotationRequest)
CaseQuotationRequest.belongsTo(Case)
Case.hasMany(CaseSale)
CaseSale.belongsTo(Case)
Case.hasMany(CaseInstallation)
CaseInstallation.belongsTo(Case)
Case.hasMany(CaseLogs)
CaseLogs.belongsTo(Case)

module.exports = Case;