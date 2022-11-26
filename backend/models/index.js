import { Sequelize, Model, DataTypes } from 'sequelize';//use to connect to many databases

const sequelize = new Sequelize(
    process.env.DB,
    process.env.DB_USER,
    process.env.DB_PASS,
    {
        dialect: 'postgres'
    }
);

const models = {
    User: require('./user') (sequelize, Sequelize.DataTypes),
    Wallet: require('./wallet') (sequelize, Sequelize.DataTypes),
    Expenses: require('./expenses') (sequelize, Sequelize.DataTypes),
    Safe: require('./safe') (sequelize, Sequelize.DataTypes),
}



sequelize.authenticate()   //to chack connection
.then(()=>{
    console.log('Connection seccessfully');
})
.catch(err =>{
    console.error('Unable to connect to database', err);
})

export {sequelize};

export default models;