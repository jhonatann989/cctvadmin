const { DataTypes, Sequelize, Model } = require('sequelize');
const server = require("./../configs/sequelizeServer")
const sequelize = new Sequelize(server.database, server.username, server.password, server.params)


class UserPermissions extends Model {}

UserPermissions.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    module: {
        type: DataTypes.STRING,
    },
    view: {
        type: DataTypes.STRING,
    },
    can_view: {
        type: DataTypes.BOOLEAN,
    },
},{ sequelize})

module.exports = UserPermissions;