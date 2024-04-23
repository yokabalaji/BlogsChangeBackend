module.exports = (sequelize, DataTypes) => {
  const Like = sequelize.define("likes", {
    like: {
      type: DataTypes.BOOLEAN,
      allownull: false,
    },
  });
  return Like;
};
