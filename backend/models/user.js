const user = (sequelize, DataTypes) => {  //sequlize to create
    const User = sequelize.define('user', {
        name: {
            type: DataTypes.STRING,
        },
        email: {
            type: DataTypes.STRING,
            unique: true,
        },
        password: {
            type: DataTypes.STRING,
        },
    });
  
    return User;
}
module.exports = user;