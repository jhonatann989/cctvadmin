const { DataTypes, Sequelize, Model } = require('sequelize');
const server = require("./../configs/sequelizeServer")
const sequelize = new Sequelize(server.database, server.username, server.password, server.params)


class CaseInstallation extends Model {}

CaseInstallation.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    id_responsible: {
        type: DataTypes.INTEGER,
    },
    installation_report: {
        type: DataTypes.STRING,
    },
    state: {
        type: DataTypes.STRING,
    },
    has_been_installed: {
        type: DataTypes.BOOLEAN,
    }
},{sequelize})

module.exports = CaseInstallation;