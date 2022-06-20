const { DataTypes, Sequelize, Model } = require('sequelize');
const server = require("./../configs/sequelizeServer")
const sequelize = new Sequelize(server.database, server.username, server.password, server.params)


class UserDatas extends Model {}

UserDatas.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    UserId: {
        type: DataTypes.INTEGER,
    },
    address: {
        type: DataTypes.STRING,
    },
},{
    sequelize,
    tableName: "user_data",
})

module.exports = UserDatas;