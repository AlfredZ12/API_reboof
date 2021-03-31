'use strict'
const jwt = require('jwt-simple');
const moment = require('moment');


exports.generatetoken = (user) =>{
    const payload = {
              sub: user.confirmCode,
              name: user.name,
              email: user.email,
              iat: moment.unix(),
              exp: moment().add(30,'minutes').unix()
    }

    return jwt.encode(payload,process.env.SECRET_TOKEN);
}

