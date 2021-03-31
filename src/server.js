// Dependencias ----
const express = require('express');
const path = require('path');
const methodOverride = require('method-override');
const expbhs = require('express-handlebars');
const session = require('express-session');
const flash = require('flash');
const passport = require('passport');
const morgan = require('morgan');
const Handlebars = require('handlebars');
const connectMongo = require("connect-mongo");
const multer = require('multer');
const mongoose = require('mongoose');
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access');
require('dotenv').config();

const app = express();
require('./config/passport');


//settings
app.set("port", process.env.PORT || 5000);
app.set("views", path.join(__dirname, "views"));
app.engine(".hbs",
    expbhs({
        handlebars: allowInsecurePrototypeAccess(Handlebars),
        defaultLayout: "main",
        layoutsDir: path.join(app.get("views"), "layouts"),
        partialsDir: path.join(app.get("views"), "partials"),
        extname: ".hbs",
        helpers: require('./libs/handlebars')
    })
);

app.set("view engine", ".hbs");


//middlewares
app.use(express.json());
app.use(morgan("dev"));
app.use(express.urlencoded({extended:false}));

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', process.env.CLIENT);
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

app.use(methodOverride("_method"));
const MongoStore = connectMongo(session);
app.use(
    session({
        secret: "secret",
        resave: true,
        saveUninitialized: true,
        store: new MongoStore({mongooseConnection: mongoose.connection} )
    })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());


//Global Variables

app.use((req,res,next)=>{
    res.locals.error_msg = req.flash('error_msg') ;
    res.locals.user = req.user || null;
    res.locals.request = req.request || null;
    next();
});

//routes
app.use(require("./routes/user.routes"));
app.use(require("./routes/index.routes"));
app.use(require("./routes/publicacion.routes"));
app.use(require("./routes/request.routes"));



//static files 
app.use(express.static(path.join(__dirname,"public")));
app.use((req, res) => {
    res.render("404");
  });


module.exports = app;