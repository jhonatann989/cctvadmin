const { DataTypes, Sequelize, Model } = require('sequelize');
const server = require("./../configs/sequelizeServer")
const sequelize = new Sequelize(server.database, server.username, server.password, server.params)


class CaseTechnicalStudy extends Model {}

CaseTechnicalStudy.init({
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
    state: {
        type: DataTypes.STRING,
    },
    evaluation: {
        type: DataTypes.STRING,
    },
    isFeasable: {
        type: DataTypes.BOOLEAN,
    },
},{
    sequelize,
    tableName: "case_technical_study",
})

module.exports = CaseTechnicalStudy;