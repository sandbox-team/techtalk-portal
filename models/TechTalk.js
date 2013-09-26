var mg = require("mongoose")
, validate = require('mongoose-validator').validate
, Schema = mg.Schema
, TechTalkSchema = new Schema({
  _id:         { type: String },
  title:       { type: String, trim: true, required: true, validate: validate('len', 3, 100)},
  date:        { type: Date, required: true },
  location:    { type: String, validate: validate('len', 3, 20) },
  description: { type: String },
  level:       { type: String, validate: validate('len', 1, 20) },
  notes:       { type: String },
  lector:      { type: String },
  attendees:   [ { type: String } ],
  tags:        [ { type: String } ],
  created:     { type: Date, "default": Date.now },
  updated:     { type: Date, "default": Date.now }
}, {_id: false});

exports.TechTalk = mg.model('TechTalk', TechTalkSchema);
