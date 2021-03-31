const { model, Schema } = require('mongoose');

const PublicacionSchema = new Schema({

    body: { type: String, require: true, },
    author: { type: Schema.Types.ObjectId, ref: 'User' },
    image: [
       
        {url:{type: String, require: false },
        cols: {type:Number, default: 2}
    }],
    likes: [
        { user_like: { type: Schema.Types.ObjectId, ref: 'User' },
         createdAt: {type:Date,default: Date.now},
         }
],
    comments: [
       {comment: { type:Schema.Types.ObjectId,ref: 'Comment', autopopulate: true} }]
       

}, { timestamps: true });




module.exports = model('Publicacion', PublicacionSchema);






