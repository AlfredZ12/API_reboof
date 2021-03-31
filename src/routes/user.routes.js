const router = require('express').Router();
const bodyParser = require('body-parser');
const Bodyjson = bodyParser.json();

const {
   
    signUprender,
    singInrender,
    signUp,
    signin,
    logout,
    getfriends,
    myPerfil,
    searchUsers,
    deletefriend,
    confirmAccount
} = require('../controllers/user.controller');
const { isAuthenticated } = require('../helpers/authenticate');



router.get('/Signup', signUprender);
router.get('/',singInrender);
router.post('/',signin);
router.post('/Signup',signUp);
router.get('/logout',logout);
router.get('/user', isAuthenticated,myPerfil);
router.get('/user/myfriends',isAuthenticated,getfriends);
router.get('/search',Bodyjson,isAuthenticated,searchUsers);
router.get('/user/myfriends/:id/:request',isAuthenticated,deletefriend);
router.get('/confirm/:id',confirmAccount);



module.exports = router;
