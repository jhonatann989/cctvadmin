const { DataTypes, Sequelize, Model } = require('sequelize');
const server = require("./../configs/sequelizeServer")
const sequelize = new Sequelize(server.database, server.username, server.password, server.params)
const UserPermissions = require("./userPermissions")
const bcrypt = require("bcrypt")

class UserAuth extends Model { }

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
}, {
    instanceMethods: {
        isValidPassword: (password) => (bcrypt.compareSync(password, this.password))
    },
    sequelize
})

UserAuth.addHook("beforeCreate", async (user) => {
    if (user.password) {
        const salt = await bcrypt.genSaltSync(10, 'a');
        user.password = bcrypt.hashSync(user.password, salt);
    }
})
UserAuth.addHook("beforeUpdate", async (user) => {
    if (user.password) {
        const salt = await bcrypt.genSaltSync(10, 'a');
        user.password = bcrypt.hashSync(user.password, salt);
    }
})

UserAuth.prototype.isValidPassword = async (password, hash) => (await bcrypt.compareSync(password, hash))

UserAuth.hasMany(UserPermissions)
UserPermissions.belongsTo(UserAuth)

module.exports = UserAuth;