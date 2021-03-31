const router = require('express').Router();
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const path = require('path');


const userStorage = multer.diskStorage({
    destination: path.join(__dirname, (`../public/img/user/`)),
    filename: (req, file, cb) => {
        cb(null, uuidv4() + path.extname(file.originalname))
    }
});
const upload = multer({ storage: userStorage });

const {
    createPublicacion,
    getpublications,
    getmypublications,
    updatePublication,
    deletePublication,
    likePublication,
    commentPublication,
    editComment
} = require('../controllers/publicacion.controller');

const { isAuthenticated } = require('../helpers/authenticate');

router.post('/index', upload.array('image', 10), isAuthenticated, createPublicacion);
// router.get('/index', isAuthenticated, getpublications);
router.get('/user', isAuthenticated, getmypublications);
router.put('/index/edit_publication/:id', isAuthenticated, updatePublication);
router.delete('/index/delete_publication/:id', isAuthenticated, deletePublication);
router.get('/index/like_publicacion/:idpublicacion', likePublication);
router.put('/index/comment_publicacion/:idpublicacion/:iduser', commentPublication);
router.put('/index/edit_comment/:idpublicacion/:idcomment/:iduser', editComment);
// router.put('/index/delete_comment/:idcomment/:iduser',deleteComment);



module.exports = router;