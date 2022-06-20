const { DataTypes, Sequelize, Model } = require('sequelize');
const server = require("./../configs/sequelizeServer");
const UserAuth = require('./userAuth');
const sequelize = new Sequelize(server.database, server.username, server.password, server.params)
const UserDatas = require("./userDatas")
const UserStaff = require("./userStaff")


class User extends Model {}

User.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    cc: {
        type: DataTypes.INTEGER,
    },
    name: {
        type: DataTypes.STRING,
    },
    cc_type: {
        type: DataTypes.STRING,
    },
    email: {
        type: DataTypes.STRING
    },
    role: {
        type: DataTypes.STRING,
    },
},{
    sequelize,
    tableName: "user"
})

User.hasOne(UserAuth)
UserAuth.belongsTo(User)
User.hasMany(UserDatas)
UserDatas.belongsTo(User)
User.hasMany(UserStaff)
UserStaff.belongsTo(User)

module.exports = User;