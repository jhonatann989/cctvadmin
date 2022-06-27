const { DataTypes, Sequelize, Model } = require('sequelize');
const server = require("./../configs/sequelizeServer")
const sequelize = new Sequelize(server.database, server.username, server.password, server.params)


class CaseSale extends Model {}

CaseSale.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    id_responsible: {
        type: DataTypes.INTEGER,
    },
    id_bill: {
        type: DataTypes.STRING,
    },
    state: {
        type: DataTypes.STRING,
    }
},{sequelize})

module.exports = CaseSale;