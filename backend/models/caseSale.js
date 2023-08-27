const { DataTypes, Model } = require('sequelize');

module.exports = (sequelize) => {
    class CaseSale extends Model {
        static associate(models) {
            CaseSale.belongsTo(models.Case)
        }
    }

    CaseSale.init({
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        id_responsible: {
            type: DataTypes.INTEGER,
        },
        id_bill: {
            type: DataTypes.STRING,
        },
        state: {
            type: DataTypes.STRING,
        },
        sales_doc: {
            type: DataTypes.STRING,
        },
    },{sequelize})

    return CaseSale;
}
