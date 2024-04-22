module.exports=(sequelize,DataTypes)=>{
    const Comment=sequelize.define("comments",
{
   
     comment:{
        type:DataTypes.STRING,
        allownull:false
    }
})
return Comment;

}