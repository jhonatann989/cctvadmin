const { DataTypes, Sequelize, Model } = require('sequelize');
const server = require("./../configs/sequelizeServer")
const sequelize = new Sequelize(server.database, server.username, server.password, server.params)
const UserPermissions = require("./userPermissions")

class UserAuth extends Model {}

UserAuth.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    username: {
        type: DataTypes.STRING,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
    },
    token: {
        type: DataTypes.STRING,
    },
},{ sequelize })

UserAuth.hasMany(UserPermissions)
UserPermissions.belongsTo(UserAuth)

module.exports = UserAuth;