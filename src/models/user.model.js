const { model, Schema } = require("mongoose");
const bcrypt = require("bcryptjs");
/**
 * @status is status for user account, Pending if its new, Active if account confirmed, Inactive If user 
 */
const UserSchema = Schema({

  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  date: { type: Date, required: true },
  created: { type: Date, default: Date.now },
  updated: {type: Date,default: Date.now},
  imgProfileUrl: { type: String, default: '/img/perfil/DefaultProfile.png' },
  friends: [{
    _id: { type: Schema.Types.ObjectId, ref: 'User' },
    date: { type: Date, default: Date.now },
    request: { type: Schema.Types.ObjectId, ref: 'Request' }
  }],
  status: {
    type: String, enum: ['Inactive', 'Active', 'Pending'],
    default: 'Pending'
  },
  confirmationCode: {
    type: String,
    unique: true,required: true
  }
});

UserSchema.method('encryptPassword', async function(password){
  const salt =  await bcrypt.genSaltSync(7);
  const hash = await bcrypt.hashSync(password, salt);
  return hash;
});

UserSchema.methods.matchPassword = async function (password) {
  return await bcrypt.compareSync(password, this.password);
};
 
module.exports = model('User', UserSchema);