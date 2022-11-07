const { DataTypes, Model } = require('sequelize');

module.exports = (sequelize) => {
    class CaseTechnicalStudy extends Model {
        static associate(models) {
            CaseTechnicalStudy.belongsTo(models.Case)
        }
    }

    CaseTechnicalStudy.init({
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        id_responsible: {
            type: DataTypes.INTEGER,
        },
        state: {
            type: DataTypes.STRING,
        },
        evaluation: {
            type: DataTypes.STRING,
        },
        isFeasable: {
            type: DataTypes.BOOLEAN,
        },
    },{ sequelize})

    return CaseTechnicalStudy;
}
