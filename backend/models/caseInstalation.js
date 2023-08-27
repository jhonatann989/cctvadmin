const { DataTypes, Model } = require('sequelize');

module.exports = (sequelize) => {
    class CaseInstallation extends Model {
        static associate(models) {
            CaseInstallation.belongsTo(models.Case)
        }
    }

    CaseInstallation.init({
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        id_responsible: {
            type: DataTypes.INTEGER,
        },
        installation_report: {
            type: DataTypes.TEXT,
        },
        state: {
            type: DataTypes.STRING,
        },
        has_been_installed: {
            type: DataTypes.BOOLEAN,
        }
    },{sequelize})

    return CaseInstallation;
}
