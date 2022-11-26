const safe = (sequelize, DataTypes) => {
    const Safe = sequelize.define('safe',{
        _id:{
            type: DataTypes.STRING,
        },
        date: {
            type: DataTypes.STRING,
        },
        name: {
            type: DataTypes.STRING,
        },
        quantity: {
            type: DataTypes.STRING,
        }
    });
    Safe.associate = models => {  
        Safe.belongsTo(models.User);
    }
    return Safe
};
module.exports = safe;