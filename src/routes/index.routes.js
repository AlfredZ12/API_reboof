const router = require('express').Router();
const {
    getindex
} =  require('../controllers/index.controller');
const {isAuthenticated} = require('../helpers/authenticate');

 router.get('/index',isAuthenticated,getindex);

 //return res.status(200).
module.exports= router;