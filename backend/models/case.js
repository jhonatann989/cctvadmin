const { DataTypes, Sequelize, Model } = require('sequelize');
const server = require("./../configs/sequelizeServer")
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

module.exports = Case;