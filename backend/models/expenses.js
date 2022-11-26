const expenses = (sequelize, DataTypes) => {
    const Expenses = sequelize.define('expenses',{
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
   
    return Expenses
};
module.exports = expenses;