
const userControllers=require('../Controllers/User.controller.js');

const router=require("express").Router();

// router.post('/addproduct',productControllers.addProduct);

// router.get('/allproduct',productControllers.getAllProducts);

router.post('/register/',userControllers.register);

router.post('/login/',userControllers.loginUser);

router.post('/user/article/',userControllers.authenticateToken,userControllers.userArticle)

router.post('/user/comment/:id',userControllers.authenticateToken,userControllers.userComment)

router.post('/user/like/:id',userControllers.authenticateToken,userControllers.userLikes)

router.post('/user/rating/:id',userControllers.authenticateToken,userControllers.userRatings)

router.get('/allarticle/',userControllers.userArticleAll);

router.get('/current/user/article',userControllers.authenticateToken,userControllers.currentUserArticle)

router.post('/refresh',userControllers.refreshToken)

module.exports=router;