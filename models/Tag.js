var mg = require("mongoose")
, validate = require('mongoose-validator').validate
, Schema = mg.Schema
, TagSchema = new Schema({
  _id:         { type: String }
}, {_id: false});

exports.Tag = mg.model('Tag', TagSchema);
