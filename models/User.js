var mg = require("mongoose"),
  Schema = mg.Schema,
  UserSchema = new Schema({
    _id:         { type: String, unique: true},
    name:        { type: String },
    email:       { type: String, unique: true },
    photo:       { type: String },
    created:     { type: Date, 'default': Date.now },
    updated:     { type: Date, 'default': Date.now }
  }, {_id: false});

exports.User = mg.model('User', UserSchema);
