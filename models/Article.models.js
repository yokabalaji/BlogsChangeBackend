module.exports = (sequelize, DataTypes) => {
  const Article = sequelize.define("articles", {
    title: {
      type: DataTypes.STRING,
      allownull: false,
    },
    content: {
      type: DataTypes.STRING,
      allownull: false,
    },
  });
  return Article;
};
