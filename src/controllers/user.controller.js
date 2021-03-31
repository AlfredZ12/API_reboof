

const User = require('../models/user.model');
const passport = require('passport');
const Request = require('../models/request.model');
const emailAuth = require('../helpers/emailAuth');
const publicacion = require('../models/publicacion.model');
const usertoken = require('../config/usertoken');



const usercontroller = {};
/**
 * 
 * @returns token for account authentication 
 */
Code = () => {
  const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let token = '';
  for (let i = 0; i < 25; i++) {
    token += characters[Math.floor(Math.random() * characters.length)];
  }
  return token;
};

usercontroller.signUprender = (req, res) => {
  res.render('user/signUp');
};
usercontroller.singInrender = (req, res) => {
  res.render('user/signIn')
};
//Agregar usuario
usercontroller.signUp = async (req, res) => {
  let errors = [];
  const { name, email, password, confirm_password, date } = req.body;

  let confirmationCode = Code();
  console.log(confirmationCode);
  if (password != confirm_password) {
    errors.push({ text: '' });

  }

  if (errors.length > 0) {
    // res.render('user/signUp', {
    //   name,
    //   email,
    //   password,
    //   confirm_password,
    //   date
    // });
    res.send({ message: "error" })
  } else {
    const emailUsed = await User.findOne({ email: email });
    if (emailUsed) {

      res.send({ message: "Use a diferent e-mail" });
    } else {

      const newuser = new User({ name, email, password, date, confirmationCode });
      newuser.password = await newuser.encryptPassword(password);
      emailAuth.sendEmail(email, name, confirmationCode).then(err => {

        if (err) {

          res.send({ message: "E-mail is invalid" })

        }

      });

      newuser.save((err, result) => {
        if (err) {
          res.send({ message: err });
        } else {
          res.send({ user: result });
        }
      });

    }
  }


};
//lista de amigos
usercontroller.getfriends = async (req, res) => {
  const friends = await User.findById(req.user.id).
    select('friends').
    populate("friends._id").
    populate("Request").sort({ "friends._id.name": 'desc' });


  console.log(friends)
  res.render('user/myFriends', friends);

}

usercontroller.myPerfil = async (req, res) => {

  const publications = await publicacion.find({ author: req.user.id }).sort({ 'createdAt': 'desc' }).populate('author');

  let images = [];

  if (publications.image > 0) {
    publications.image.forEach(image => {
      images.push(image);
    });
  }

  res.render('partials/userProfile', { publications: publications, image: images });
}

//Buscar usuarios
usercontroller.searchUsers = async (req, res) => {
  const friends = await getMyFriends(req, res);
  //console.log(friends);

  const search = req.query.search;

  // console.log("  impriumee\n" + "[ " + search + " ]\n++");
  // console.log("  ------- " + search)
  var searchs = await User.find({ "name": { $regex: new RegExp(`^${search}`), $options: 'i' }, status: 'Active' }).limit(20).sort({ "name": "asc" });
  let searchUser = [];
  let myfriends = [];
  // console.log(friends);
  // friends.forEach(friend => {
  //  console.log("my friend: " + friend._id);
  //});


  searchs.forEach(element => {
    if (element.id != req.user.id) {
      //   console.log("elemento:  " + `${element.id}`);
      if (friends.length != 0) {
        friends.forEach(friend => {
          console.log("elemento:  " + `${element.id}`);
          if (friend.id == element.id) {
            myfriends.push(element);
          } else {
            searchUser.push(element);
          }
        });
      } else {
        searchUser.push(element);
      }
    }
  });

  res.render('user/Search', { searchUser: searchUser, myfriends: myfriends });

}
//autenticar
// usercontroller.signin = passport.authenticate("local", {
//   successRedirect: "index",
//   failureRedirect: "/",
//   failureFlash: true
// });

usercontroller.signin = async (req, res) => {

  const auth = await User.findOne({ email: req.body.email });
 
  if (auth) {
    console.log(await auth.matchPassword(req.body.password));
    if (await auth.matchPassword(req.body.password) === true) {
      const token = usertoken.generatetoken(auth);
      console.log(token)
      return res.status(200).send({
          auth: auth.confirmationCode,
          token: token
      })
    } else {
      return res.status(403).send({ message: "Password is incorrect", status: 403 })
    }
  } else {
    return res.status(401).send({ message: "User Not Found", status: 401 })
  }


}

//cerrar sesion
usercontroller.logout = (req, res) => {
  req.logout();
  req.flash("success_msg", "You are logged out now.");
  res.redirect("/");
};

usercontroller.deletefriend = async (req, res) => {


  await Request.findByIdAndDelete(req.params.request);

  console.log(" Conectado: " + req.params.id);

  await User.findByIdAndUpdate(req.user.id, {
    "$pull": {
      "friends": { _id: req.params.id }
    }
  });

  await User.findByIdAndUpdate(req.params.id, {
    "$pull": {
      "friends": { _id: req.user.id }
    }
  });


  //select("friends").populate("friends").populate('User');

  /*await busqueda.update({
    $pull: {
      "friends": req.params._id
    }
  });*/




  res.redirect('/user/myFriends');


}
usercontroller.confirmAccount = async (req, res) => {
  console.log(req.params.id);

  const token = req.params.id;

  const confirm = await User.findOne({ confirmationCode: token });

  if (confirm) {
    let status = confirm.status;
    if (status == 'Pending') {
      confirm.status = 'Active';
      await confirm.save();
      res.render('user/confirmed', { name: confirm.name, email: confirm.email });
    }
  } else {

  }


};



async function getMyFriends(req) {

  const friends = await User.findById(req.user.id).select('friends').sort({ "friends._id.name": 'desc' });

  return friends.friends;
}



module.exports = usercontroller;