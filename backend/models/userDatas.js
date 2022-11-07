const { DataTypes, Model } = require('sequelize');

module.exports = (sequelize) => {
    class UserDatas extends Model {
        static associate(models) {
            UserDatas.belongsTo(models.Users)
        }
    }

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

    return UserDatas;
}
