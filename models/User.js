var mg = require("mongoose")
, Schema = mg.Schema
, UserSchema = new Schema({
  _id: String,
  internal_id: { type: String },
  full_name:   { type: String },
  email:       { type: String },
  photo_url:   { type: String },
  created:     { type: Date, "default": Date.now },
  updated:     { type: Date, "default": Date.now },
}, {_id: false});

exports.User = mg.model('User', UserSchema);
