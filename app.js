require("dotenv").config();

const express = require("express");
const hbs = require("hbs");
const SpotifyWebApi = require("spotify-web-api-node");
const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

const bodyParser = require("body-parser");
const { query } = require("express");
app.use(bodyParser.urlencoded({ extended: true }));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then((data) => spotifyApi.setAccessToken(data.body["access_token"]))
  .catch((error) =>
    console.log("Something went wrong when retrieving an access token", error)
  );

// Our routes go here:

//Home route
app.get("/", (req, res) => {
  res.render("homepage");
});

//Artist page
app.get("/artist-search", (req, res) => {
  const { artist } = req.query;

  spotifyApi
    .searchArtists(artist)
    .then((data) => {
      // console.log("The recieved data from the API:", data.body);
      const artists = data.body.artists.items;
      res.render("artist-search-results", { artists });
      // console.log(artists);
    })

    .catch((err) => console.log(err));
});

//Album page //using params here to get the artist id
app.get("/albums/:artistId", (req, res) => {
  const { artistId } = req.params;
  // console.log("this is the artistID:", artistId);

  spotifyApi.getArtistAlbums(artistId).then(
    function (data) {
      // console.log('Artist albums', data.body);
      const albums = data.body.items;
      console.log(albums);
      res.render("albums", { albums });
    },
    function (err) {
      console.error(err);
    }
  );
});

app.get("/tracks/:albumId", (req, res) => {
  // console.log("tracks");
  const { albumId } = req.params;
  // console.log(albumId);

  spotifyApi.getAlbumTracks(albumId).then(
    function (data) {
      // console.log("show me preview", data.body);
      const tracks = data.body.items;
      res.render("tracks", { tracks });
    },
    function (err) {
      console.log("Something went wrong!", err);
    }
  );
});

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
