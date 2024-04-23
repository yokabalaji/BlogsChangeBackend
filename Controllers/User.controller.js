const db = require("../Models/index.js");
const User = db.User;
const Article = db.Article;
const Comment = db.Comment;
const Like = db.Like;
const Rating = db.Rating;

const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
const { where } = require("sequelize");

//             register

const register = async (request, response) => {
  const { username, email, password } = request.body;
  // console.log(email)
  const empEmail = email;
  console.log(empEmail);

  function isValidEmail(empEmail) {
    const regex = /^[a-zA-Z0-9.+_-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,15}$/;
    return regex.test(empEmail);
  }

  function isStrongPassword(password) {
    // Regular expressions for password criteria
    const minLength = 8;
    const uppercaseRegex = /[A-Z]/;
    const lowercaseRegex = /[a-z]/;
    const digitRegex = /\d/;
    const specialCharRegex = /[!@#$%^&*()\-_=+[\]{};:'",.<>/?\\|~`]/;

    // Check if password meets all criteria
    return (
      password.length >= minLength &&
      uppercaseRegex.test(password) &&
      lowercaseRegex.test(password) &&
      digitRegex.test(password) &&
      specialCharRegex.test(password)
    );
  }

  try {
    if (username === null || username === "") {
      console.log("Please check the  userName");
      response.status(406).send("Please check the userName");
    } else if (email === null || !isValidEmail(email) || email === "") {
      console.log("Please check the user Mail");
      response.status(406).send("Please check the user Mail");
    } else if (password === null || !isStrongPassword(password)) {
      console.log("Please give the Strong Password");
      response.status(406).send("Please give the Strong Password");
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);

      const getUserQuery = await User.findOne({
        where: { email: request.body.email },
      });
      //console.log("get user query  "+getUserQuery)
      const dbUser = getUserQuery;

      console.log("user email " + dbUser);

      if (dbUser !== null) {
        response.status(400);
        response.send("User already exists");
      } else {
        const info = {
          username: username,
          email: email,
          password: hashedPassword,
        };
        console.log("info information  " + info);
        const createUserQuery = await User.create(info);

        await db.createUserQuery;
        response.send("User created successfully");
      }
    }
  } catch (err) {
    console.log(err);
  }
};

//       login

const loginUser = async (request, response) => {
  const { email, password } = request.body;
  const payload = { email };
  try {
    const getUserQuery = await User.findOne({ where: { email: email } });
    const dbUser = getUserQuery.password;

    // console.log("getsssss   "+getUserQuery)

    //  console.log(dbUser)

    if (dbUser === undefined) {
      response.status(400);
      response.send("Invalid user");
    } else {
      const isPasswordMatched = await bcrypt.compare(password, dbUser);
      if (isPasswordMatched) {
        const jwtToken = jwt.sign(payload, "itsBalajiPassword", {
          expiresIn: "1s",
        });
        /////      changes

        const refreshToken = jwt.sign(payload, "secretKey", {
          expiresIn: "1d",
        });

        response
          .cookie("refreshToken", refreshToken, {
            httpOnly: true,
            sameSite: "strict",
          })
          .header("Authorization", jwtToken);
        //response.set('Authorization', jwtToken);

        //////   changesss complete

        response.send({ jwtToken });
      } else {
        response.status(400);
        response.send("Invalid password");
      }
    }
  } catch (err) {
    response.status(400);
    response.send("user does not exit");
  }
};

//changesss

//                refress the token

// app.post('/refresh',
const refreshToken = (req, res) => {
  const refreshToken = req.cookies["refreshToken"];
  if (!refreshToken) {
    return res.status(401).send("Access Denied. No refresh token provided.");
  }

  try {
    const decoded = jwt.verify(refreshToken, "secretKey");
    const email = decoded.email;
    const jwtToken = jwt.sign({ email }, "itsBalajiPassword", {
      expiresIn: "1h",
    });

    res.send(jwtToken);
  } catch (error) {
    return res.status(400).send("Invalid refresh token.");
  }
};

//changesssssss complete

//       AuthenticateUser

// const authenticateToken = (request, response, next) => {

//       changes start

const authenticateToken = async (request, response, next) => {
  // const accessToken = request.headers['Authorization'];
  const accessToken = request.headers["authorization"].split(" ")[1];
  const refreshToken = request.cookies["refreshToken"];
  console.log("access token  " + accessToken);
  console.log("refreshToken  " + refreshToken);

  if (!accessToken && !refreshToken) {
    return response.status(401).send("Access Denied. No token provided.");
  }

  try {
    const decoded = jwt.verify(accessToken, "itsBalajiPassword");
    const mail = decoded.email;
    console.log(mail);
    try {
      console.log("oneeeee");
      const getUser = await User.findOne({ where: { email: mail } });
      request.userId = getUser.id;
      console.log("userId  " + request.userId);
      next();
    } catch (err) {
      console.log(err);
      response.status(400).send("please login user");
    }

    // next();
  } catch (error) {
    if (!refreshToken) {
      return res.status(401).send("Access Denied. No refresh token provided.");
    }

    try {
      const decoded = jwt.verify(refreshToken, "secretKey");
      const email = decoded.email;
      console.log(email);
      const accessToken = jwt.sign({ email }, "itsBalajiPassword", {
        expiresIn: "1h",
      });

      // try{
      //   console.log("oneeeee");
      //        const getUser = await User.findOne({where:{email:req.email}})
      //         request.userId = getUser.id
      //     console.log("userId  "+request.userId)
      //         next()
      //       }catch(err){
      //      console.log(err);
      //       response.status(400).send("please login user");
      //  }

      response.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        sameSite: "strict",
      });
      // .header('Authorization', accessToken)
      response.send(accessToken);
    } catch (error) {
      return res.status(400).send("Invalid Token.");
    }
  }
};

//changes completed

//   const authToken = request.headers['authorization']
//   const refreshToken = req.cookies['refreshToken'];
// //  console.log("tokennn   "+authToken)
//   let jwtToken;
//   if (authToken !== undefined || authToken!==null) {
//     jwtToken = authToken.split(' ')[1]
//     console.log(jwtToken)
//   }
//   if (jwtToken === undefined) {
//     response.status(401)
//     response.send('Invalid JWT Token')
//   } else {
//     jwt.verify(jwtToken, 'itsBalajiPassword', async (error, payload) => {
//       if (error) {
//         response.status(401)
//         response.send('Invalid JWT Token itssssss')
//    //     console.log(error)
//       } else {
//         try{
//      //   console.log("oneeeee");
//         const getUser = await User.findOne({where:{email:payload.email}})
//         request.userId = getUser.id
//       //  console.log("userId  "+request.userId)
//         next()
//       }catch(err){
//         console.log(err);
//         response.status(400).send("please login user");
//       }

//       }
//     })
//   }

// }

// userArticle

const userArticle = async (request, response, next) => {
  const id = request.userId;
  const info = {
    userId: id,
    title: request.body.title,
    content: request.body.content,
  };
  const postArticle = await Article.create(info);
  response.status(200).send(postArticle);
  console.log(postArticle);
  next();
};

//      userComment

const userComment = async (request, response, next) => {
  const id = request.userId;
  const articleId = parseInt(request.params.id, 10);
  console.log(articleId);
  const info = {
    userId: id,
    articleId: articleId,
    comment: request.body.comment,
  };
  const commentArticle = await Comment.create(info);
  response.status(200).send(commentArticle);
  console.log(commentArticle);
  next();
};

//      userLikes

const userLikes = async (request, response, next) => {
  const id = request.userId;
  const articleId = request.params.id;
  const info = {
    userId: id,
    articleId: articleId,
    like: request.body.like,
  };
  const alreaduGiveLike = await Like.findOne({
    where: {
      userId: id,
      articleId: articleId,
    },
  });
  console.log(alreaduGiveLike);
  if (alreaduGiveLike === null) {
    const likeArticle = await Like.create(info);
    response.status(200).send(likeArticle);
    console.log(likeArticle);
    next();
  } else {
    const likeId = alreaduGiveLike.id;
    console.log(likeId);
    const likeArticle = await Like.update(request.body, {
      where: { id: likeId },
    });
    response.status(200).send(likeArticle);
    console.log(likeArticle);
  }
};

//      userRating
const userRatings = async (request, response, next) => {
  const id = request.userId;
  const articleId = request.params.id;
  const info = {
    userId: id,
    articleId: articleId,
    rating: request.body.rating,
  };

  const alreaduGiveRate = await Rating.findOne({
    where: {
      userId: id,
      articleId: articleId,
    },
  });
  console.log(alreaduGiveRate);
  if (alreaduGiveRate === null) {
    if (info.rating >= 1 && info.rating <= 5) {
      const ratingArticle = await Rating.create(info);
      response.status(200).send(ratingArticle);
      console.log(ratingArticle);
      next();
    } else {
      response.status(400).send("please give 1 to 5 rating");
      console.log("please give 1 to 5 rating");
    }
  } else {
    if (info.rating >= 1 && info.rating <= 5) {
      const rateId = alreaduGiveRate.id;
      console.log(rateId);
      const rateArticle = await Rating.update(request.body, {
        where: { id: rateId },
      });
      response.status(200).send(rateArticle);
      console.log(rateArticle);
    }
  }
};

//      get all articles

const userArticleAll = async (request, response, next) => {
  // const id=request.userId;

  const allArticle = await Article.findAll();
  response.status(200).send(allArticle);
  console.log(allArticle);
  next();
};

//         current user article

const currentUserArticle = async (request, response, next) => {
  const id = request.userId;
  const currentArticle = await Article.findAll({ where: { userId: id } });
  response.status(200).send(currentArticle);
  console.log(currentArticle);
  next();
};

module.exports = {
  register,
  loginUser,
  authenticateToken,
  userArticle,
  userComment,
  userLikes,
  userRatings,
  userArticleAll,
  currentUserArticle,
  refreshToken,
};
