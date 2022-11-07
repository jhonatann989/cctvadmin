const { DataTypes, Model } = require('sequelize');

const bcrypt = require("bcrypt")

module.exports = (sequelize) => {
    class UserAuth extends Model {
        static associate(models) {
            UserAuth.belongsTo(models.Users)
            UserAuth.hasMany(models.UserPermissions)
        }
    }

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

    return UserAuth;
}
