/**
 * **************** REQUIRES ***************
 */
const jwt = require('jwt-simple');
const moment = require('moment');

const helpers = {};
let payload;

/**
 * this method Verify, if User have a token, for authenticate session. 
 * 
 * @param {*} req REQUEST OF CLIENT 
 * @param {*} res RESPONSE SERVER TO CLIENT
 * @param {*} next NEXT MIDDLEWARE
 * @returns if user dont have a token, returns message and status 404. if token is expired, returns message and status: 403
 * 
 */
helpers.isAuthenticated = (req, res, next) => {
   
  if (!req.headers.authorization) {

    return res.status(200).send({ message: "Not Authenticated!!" ,status: 403})

  } else {

    let token = req.headers.authorization.replace(/['"]+/g, '');

    try {

      payload = jwt.decode(token, process.env.SECRET_TOKEN);

      if (payload.exp <= moment().unix()) {
       
               return res.status(200).send({ message: "token is expired!!" ,status: 401});

      }

    } catch (error) {
      
      return res.status(200).send({ message: "Invalid token!!" ,status: 404});

    }

    req.user = payload;
    
    next();
  }


 /**
  * -----------------------------  USE IF YOU WANT TO  RENDER ON THE SERVER --------------------------
  */
  // if (req.isAuthenticated()) {
  //     console.log('autenticado');
  //     return res.send({user: req.user});
  // //  return next();
  // }
  // req.flash('error_msg', 'Not Authorized.');
  // console.log(res.user);
  // res.send(res.user);

  /**
   * ------------------------------- FINISH THE RENDER OF SERVER  SECTION -----------------------------------------
   */
};

module.exports = helpers;