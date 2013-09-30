var mg = require("mongoose"),
  Schema = mg.Schema,
  UserSchema = new Schema({
    id:          { type: String },
    name:        { type: String },
    email:       { type: String },
    photo:       { type: String },
    created:     { type: Date, 'default': Date.now },
    updated:     { type: Date, 'default': Date.now }
  }, {_id: false});

exports.User = mg.model('User', UserSchema);
