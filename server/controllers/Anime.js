const malScraper = require('mal-scraper');
const models = require('../models');

const { Anime } = models;

const makerPage = (req, res) => {
  Anime.AnimeModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }

    return res.render('app', { csrfToken: req.csrfToken(), animes: docs });
  });
};

const makeAnime = (req, res) => {
  if (!req.body.name) {
    return res.status(400).json({ error: 'Name is required to search!' });
  }

  return malScraper.getInfoFromName(req.body.name).then((data) => {
    const animeData = {
      name: data.title,
      id: data.id,
      type: data.type,
      picture: data.picture,
      synopsis: data.synopsis,
      owner: req.session.account._id,
    };

    const newAnime = new Anime.AnimeModel(animeData);
    const animePromise = newAnime.save();

    animePromise.then(() => res.json({ redirect: '/maker' }));

    animePromise.catch((err) => {
      console.log(err);
      if (err.code === 11000) {
        return res.status(400).json({ error: 'Anime already exists.' });
      }

      return res.status(400).json({ eerror: 'An error occurred' });
    });

    return animePromise;
  }).catch((err) => console.log(err));
};

const getAnimes = (request, response) => {
  const req = request;
  const res = response;

  return Anime.AnimeModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }

    return res.json({ animes: docs });
  });
};

const delAnime = (req, res) => {
  const condition = {
    name: req.body.name,
    id: req.body.id,
    type: req.body.type,
    owner: req.session.account._id,
  };

  return Anime.AnimeModel.deleteOne(condition, (err) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }

    return res.json({ success: 'Deleted' });
  });
};


module.exports.makerPage = makerPage;
module.exports.getAnimes = getAnimes;
module.exports.make = makeAnime;
module.exports.delAnime = delAnime;
