const { DataTypes, Model } = require('sequelize');

module.exports = (sequelize) => {
    class UserPermissions extends Model {
        static associate(models) {
            UserPermissions.belongsTo(models.UserAuth)
        }
    }

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
    },{ sequelize })

    return UserPermissions;
}
