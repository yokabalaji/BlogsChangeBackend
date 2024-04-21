const {Sequelize,DataTypes }= require('sequelize');
const dbConfig = require('../Config/dbConfig.js');

const sequelize = new Sequelize(dbConfig.db, dbConfig.user, dbConfig.password, {
  host: dbConfig.host,
  dialect: dbConfig.dialect,
  pool: {
    max: dbConfig.max,
    min: dbConfig.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  },
//  operatorsAliases: false // This option is deprecated, you might want to remove it
});


sequelize.authenticate().then(()=>{
    console.log("database is connected.....")
}).catch((err)=>{
    console.log("Error database not connected  "+err);
});


const db={};
db.Sequelize=Sequelize;
db.sequelize=sequelize;

db.User=require('./users.model.js')(sequelize,DataTypes);
db.Article=require('./articles.models.js')(sequelize,DataTypes);
db.Comment=require('./comments.models.js')(sequelize,DataTypes);
db.Like=require('./likes.models.js')(sequelize,DataTypes);
db.Rating=require('./ratings.models.js')(sequelize,DataTypes);

db.User.hasMany(db.Article,{foreignKey:"userId"});
db.User.hasMany(db.Comment,{foreignKey:"userId"});
db.User.hasMany(db.Like,{foreignKey:"userId"});
db.User.hasMany(db.Rating,{foreignKey:"userId"});
db.Article.belongsTo(db.User,{foreignKey:"userId"});
db.Comment.belongsTo(db.User,{foreignKey:"userId"});
db.Like.belongsTo(db.User,{foreignKey:"userId"});
db.Rating.belongsTo(db.User,{foreignKey:"userId"});

db.Article.hasMany(db.Comment,{foreignKey:"articleId"});
db.Article.hasMany(db.Like,{foreignKey:"articleId"});
db.Article.hasMany(db.Rating,{foreignKey:"articleId"});

db.Comment.belongsTo(db.Article,{foreignKey:"articleId"});
db.Like.belongsTo(db.Article,{foreignKey:"articleId"});
db.Rating.belongsTo(db.Article,{foreignKey:"articleId"});

db.sequelize.sync().then(()=>{
    console.log(`yes re-sync done`)
});

module.exports=db;
//module.exports = sequelize;
