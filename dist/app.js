
const Server = require('./server.js')
const MongoClient = require('mongodb').MongoClient
const bodyParser = require('body-parser')
const db = require('./config/db') || null;
const port = (process.env.PORT || 8080)
const app = Server.app()

//const session = require('express-session')
//const passport = require('passport')
//const LocalStrategy = require('passport-local').Strategy

const express = require('express')
const router = express.Router()

//const bcrypt = require('bcrypt')

//app.use(passport.initialize());

let uri
if(db) uri = db.url

//process.env.MONGODB_URI 

//console.log("process.env.NODE_ENV", process.env.NODE_ENV)

if (process.env.NODE_ENV !== 'production') {
  //console.log("process.env.NODE_ENV IS NOT PRODUCTION")
  const webpack = require('webpack')
  const webpackDevMiddleware = require('webpack-dev-middleware')
  const webpackHotMiddleware = require('webpack-hot-middleware')
  const config = require('../webpack.config.js')
  //const config = require('../webpack.deployment.config.js')
  const compiler = webpack(config)

  app.use(webpackHotMiddleware(compiler))
  app.use(webpackDevMiddleware(compiler, {
    noInfo: true,
    publicPath: config.output.publicPathdist
  }))
}


MongoClient.connect(uri, { useNewUrlParser: true}, (err, database) => {

  if (err) return console.log(err);
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json())
  require('./routes')(app, database.db("boilerplate"));

  app.listen(port, () => {
    console.log('We are live on http://localhost:' + port);
  });               
})



// for deployment
// 1) commment out line 5: const db = require('./config/db') || null
// 2) comment out lines 20 and 21: let uri; if(db) uri = db.url
// 3) comment out line 32: const config = require('../webpack.config.js')
// 4) replace var uri with process.env.MONGODB_URI at line 43