const db = require('../models/index.js');
const User = db.User;
const Article = db.Article;
const Comment = db.Comment;
const Like = db.Like;
const Rating=db.Rating;

const bcrypt=require("bcrypt")
var jwt = require('jsonwebtoken');
const { where } = require('sequelize');

//             register 


const register= async (request, response) => {
    const {username,email, password} = request.body
     // console.log(email)
    const hashedPassword = await bcrypt.hash(password, 10)
  
    const getUserQuery = await User.findOne({ where: { email: request.body.email } });
  //console.log("get user query  "+getUserQuery)
    const dbUser =getUserQuery

    console.log("user email "+dbUser)
  
    if (dbUser !== null) {
      response.status(400)
      response.send('User already exists')
    } else {
      if (password.length < 6) {
        response.status(400)
        response.send('Password is too short')
      } else {
        const info={
            username:username,
            email:email,
            password:hashedPassword
        }
        console.log("info information  "+info)
        const createUserQuery =await User.create(info)
  
        await db.createUserQuery
        response.send('User created successfully')
      }
    }
  }


//       login


const loginUser=  async (request, response) => {
    const {email, password} = request.body
    const payload = {email}
  
    const getUserQuery =  await User.findOne({where:{email:email}});
 // console.log("getsssss   "+getUserQuery)
    const dbUser = getUserQuery.password
  //  console.log(dbUser)
  
    if (dbUser === undefined) {
      response.status(400)
      response.send('Invalid user')
    } else {
      const isPasswordMatched = await bcrypt.compare(password, dbUser)
      if (isPasswordMatched) {
        const jwtToken = jwt.sign(payload, 'itsBalajiPassword')
        response.send({jwtToken})
      } else {
        response.status(400)
        response.send('Invalid password')
      }
    }
  }

 
 
  //       Authorization

  const authenticateToken = (request, response, next) => {
    const authToken = request.headers['authorization']
    console.log("tokennn   "+authToken)
    let jwtToken
    if (authToken !== undefined) {
      jwtToken = authToken.split(' ')[1]
      console.log(jwtToken)
    }
    if (jwtToken === undefined) {
      response.status(401)
      response.send('Invalid JWT Token')
    } else {
      jwt.verify(jwtToken, 'itsBalajiPassword', async (error, payload) => {
        if (error) {
          response.status(401)
          response.send('Invalid JWT Token itssssss')
          console.log(error)
        } else {
          console.log("oneeeee");
          const getUser = await User.findOne({where:{email:payload.email}})
          request.userId = getUser.id
          console.log("userId  "+request.userId)
          next()
         
        }
      })
    }
  }

// userArticle 

const userArticle= async (request, response, next) => {
  const id=request.userId;
  const info={
    userId:id,
    title:request.body.title,
    content:request.body.content
  }
  const postArticle=await Article.create(info);
  response.status(200).send(postArticle);
  console.log(postArticle);
  next()
}

//      userComment

const userComment= async (request, response, next) => {
  const id=request.userId;
  const articleId=parseInt(request.params.id,10);
  console.log(articleId)
  const info={
    userId:id,
    articleId:articleId,
    comment:request.body.comment,
    
  }
  const commentArticle=await Comment.create(info);
  response.status(200).send(commentArticle);
  console.log(commentArticle);
  next()
}
  
//      userLikes

const userLikes= async (request, response, next) => {
  const id=request.userId;
  const articleId=request.params.id;
  const info={
    userId:id,
    articleId:articleId,
    like:request.body.like,
    
  }
  const likeArticle=await Like.create(info);
  response.status(200).send(likeArticle);
  console.log(likeArticle);
  next()
}

//      userRating
const userRatings= async (request, response, next) => {
  const id=request.userId;
  const articleId=request.params.id;
  const info={
    userId:id,
    articleId:articleId,
    rating:request.body.rating,
    
  }
  const ratingArticle=await Rating.create(info);
  response.status(200).send(ratingArticle);
  console.log(ratingArticle);
  next()
}

//      get all articles

const userArticleAll  = async (request, response, next) => {
 // const id=request.userId;

  const allArticle=await Article.findAll();
  response.status(200).send(allArticle);
  console.log(allArticle);
  next()
}

//         current user article

const currentUserArticle= async (request, response, next) => {
  const id=request.userId;
  const currentArticle=await Article.findAll({where:{userId:id}});
  response.status(200).send(currentArticle);
  console.log(currentArticle);
  next()
}

module.exports = {
    register,loginUser,authenticateToken,userArticle,userComment,userLikes,userRatings,
    userArticleAll,currentUserArticle  };
