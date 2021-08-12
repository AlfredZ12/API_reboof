const mongoose = require('mongoose');

// mongoose.connect(process.env.LOCAL_DB, {
//     useCreateIndex: true,
//     useNewUrlParser: true,
//     useFindAndModify: false,
//     useUnifiedTopology: true
// })

//     .then(db => console.log('Db is conected', db.connection.host))
//     .catch(err => console.error(err.message));


mongoose.connect(`mongodb+srv://root:${process.env.PASSWORD_DB}@myfirstcluster.bk6wo.mongodb.net/${process.env.NAME_DB}?retryWrites=true&w=majority`,{
   useCreateIndex: true,
   useNewUrlParser: true,
   useFindAndModify: false,
  useUnifiedTopology: true
})

   .then(db => console.log('Db is conected', db.connection.host))
.catch(err => console.error(err.message));


