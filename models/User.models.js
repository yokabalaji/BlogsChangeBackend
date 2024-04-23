module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define("users", {
    username: {
      type: DataTypes.STRING,
      allownull: false,
    },
    email: {
      type: DataTypes.STRING,
      allownull: false,
    },
    password: {
      type: DataTypes.STRING,
      allownull: false,
    },
  });
  return User;
};
