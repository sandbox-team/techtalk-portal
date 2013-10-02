var mg = require("mongoose")
, validate = require('mongoose-validator').validate
, Schema = mg.Schema
, NewsSchema = new Schema({
  _id:         { type: String },
  title:       { type: String, trim: true, required: true, validate: validate('len', 3, 100)},
  date:        { type: Date, required: true },
  author:      { type: String, ref: 'User'},
  content:     { type: String },
  created:     { type: Date, "default": Date.now },
  updated:     { type: Date, "default": Date.now }
}, {_id: false});

exports.News = mg.model('News', NewsSchema);
