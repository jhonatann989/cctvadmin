const { DataTypes, Model } = require('sequelize');

module.exports = (sequelize) => {
    class Case extends Model {

        static associate(models) {
            Case.hasMany(models.CaseTechnicalStudy)
            Case.hasMany(models.CaseQuotationRequest)
            Case.hasMany(models.CaseSale)
            Case.hasMany(models.CaseInstallation)
            Case.hasMany(models.CaseLogs)
        }
    }

    Case.init({
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        id_user: {
            type: DataTypes.INTEGER,
        },
        state: {
            type: DataTypes.STRING,
        },
    }, {
        sequelize,
        tableName: "case",
        timestamps: true,
    });

    return Case;
};
