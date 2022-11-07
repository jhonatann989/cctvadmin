const { DataTypes, Model } = require('sequelize');

module.exports = (sequelize) => {
    class CaseLogs extends Model {
        static associate(models) {
            CaseLogs.belongsTo(models.Case)
        }
    }

    CaseLogs.init({
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        id_user: {
            type: DataTypes.INTEGER,
        },
        case_step: {
            type: DataTypes.STRING,
        },
        cause: {
            type: DataTypes.STRING,
        },
    },{sequelize})

    return CaseLogs;
}
