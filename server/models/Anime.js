const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
const _ = require('underscore');

let AnimeModel = {};

const convertId = mongoose.Types.ObjectId;
const setName = (name) => _.escape(name).trim();

const AnimeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    set: setName,
    unique: true,
  },

  id: {
    type: Number,
  },

  type: {
    type: String,
  },

  picture: {
    type: String,
  },

  synopsis: {
    type: String,
  },

  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },

  createdData: {
    type: Date,
    default: Date.now,
  },
});

AnimeSchema.statics.toAPI = (doc) => ({
  name: doc.name,
  id: doc.id,
  type: doc.type,
  picture: doc.picture,
  synopsis: doc.synopsis,
});

AnimeSchema.statics.findByOwner = (ownerId, callback) => {
  const search = {
    owner: convertId(ownerId),
  };

  return AnimeModel.find(search).select('name id type picture synopsis').lean().exec(callback);
};

AnimeModel = mongoose.model('Anime', AnimeSchema);

module.exports.AnimeModel = AnimeModel;
module.exports.AnimeSchema = AnimeSchema;
