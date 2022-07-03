const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const movieRecord = new Schema({
  moviename: { type:String,required:true},
  released: { type:String,required:true},
  rating : { type:String,required:true},
  text: { type:String},
  photo: { type:String},
  vdo: { type:String}
  },
  { timestamps: true, versionKey: false }
);

const MoviesModel = mongoose.model('Movies', movieRecord);

module.exports = MoviesModel;
