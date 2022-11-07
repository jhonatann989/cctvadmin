const { DataTypes, Model } = require('sequelize');

module.exports = (sequelize) => {
    class UserStaff extends Model {
        static associate(models) {
            UserStaff.belongsTo(models.Users)
        }
    }

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

    return UserStaff;
}
