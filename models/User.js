var mg = require("mongoose"),
  Schema = mg.Schema,
  UserSchema = new Schema({
    name:        { type: String },
    email:       { type: String, unique: true },
    photo:       { type: String },
    created:     { type: Date, 'default': Date.now },
    updated:     { type: Date, 'default': Date.now }
  });

exports.User = mg.model('User', UserSchema);
