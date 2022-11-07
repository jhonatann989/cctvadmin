const { DataTypes, Model } = require('sequelize');

module.exports = (sequelize) => {
    class CaseQuotationRequest extends Model {
        static associate(models) {
            CaseQuotationRequest.belongsTo(models.Case)
        }
    }

    CaseQuotationRequest.init({
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        id_responsible: {
            type: DataTypes.INTEGER,
        },
        quotation_doc: {
            type: DataTypes.STRING,
        },
        state: {
            type: DataTypes.STRING,
        }
    },{sequelize})

    return CaseQuotationRequest;
}
