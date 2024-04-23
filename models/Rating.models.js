module.exports = (sequelize, DataTypes) => {
  const Rating = sequelize.define("ratings", {
    rating: {
      type: DataTypes.INTEGER,
      allownull: false,
    },
  });
  return Rating;
};
