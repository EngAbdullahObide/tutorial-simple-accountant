const wallet = (sequelize, DataTypes) => {
    const Wallet = sequelize.define('wallet',{
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
   
    return Wallet
};
module.exports = wallet;