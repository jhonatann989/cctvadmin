const { DataTypes, Sequelize, Model } = require('sequelize');
const server = require("./../configs/sequelizeServer")
const sequelize = new Sequelize(server.database, server.username, server.password, server.params)


class CaseLogs extends Model {}

CaseLogs.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    id_case: {
        type: DataTypes.INTEGER,
    },
    id_user: {
        type: DataTypes.INTEGER,
    },
    case_step: {
        type: DataTypes.STRING,
    },
    cause: {
        type: DataTypes.STRING,
    },
},{
    sequelize,
    tableName: "case_sale",
})

module.exports = CaseLogs;