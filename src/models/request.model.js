const {model,Schema} = require('mongoose');


const RequestSchema = new Schema( {
        send: {type: Schema.Types.ObjectId, ref: 'User'},
        received: {type: Schema.Types.ObjectId, ref: 'User'},
        accept: {type: Boolean, default: false},
        date: {type: Date,default: Date.now}
});


module.exports = model('Request', RequestSchema);
