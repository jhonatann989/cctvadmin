const { DataTypes, Model } = require('sequelize');

module.exports = (sequelize) => {
    class Users extends Model {
        static associate(models) {
            Users.hasOne(models.UserAuth);
            Users.hasMany(models.UserDatas)
            Users.hasMany(models.UserStaff)

            // UserStaff.belongsTo(Users)
        }
    }

    Users.init({
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        cc: {
            type: DataTypes.INTEGER,
            unique: true
        },
        name: {
            type: DataTypes.STRING,
        },
        cc_type: {
            type: DataTypes.STRING,
        },
        email: {
            type: DataTypes.STRING,
        },
        role: {
            type: DataTypes.STRING,
        },
    },{
        sequelize,
        tableName: "user"
    })

    return Users;
}
