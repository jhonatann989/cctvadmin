const { DataTypes, Sequelize, Model } = require('sequelize');
const server = require("./../configs/sequelizeServer")
const sequelize = new Sequelize(server.database, server.username, server.password, server.params)


class UserStaff extends Model {}

UserStaff.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    UserId: {
        type: DataTypes.INTEGER,
    },
    role: {
        type: DataTypes.STRING,
    },
},{
    sequelize,
    tableName: "user_staff",
})



module.exports = UserStaff;