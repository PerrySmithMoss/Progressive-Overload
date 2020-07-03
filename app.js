// Load .env variables
if(process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

const express = require('express');
const expressLayouts = require("express-ejs-layouts");
const methodOverride = require('method-override');
const mongoose = require("mongoose");
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("passport");

const app = express();

// Locals 
app.locals.formatDate = function (date, format) {
    return moment(date).utc().format(format)
  },

app.locals.truncate = function (str, len) {
    if (str.length > len && str.length > 0) {
      let new_str = str + ' '
      new_str = str.substr(0, len)
      new_str = str.substr(0, new_str.lastIndexOf(' '))
      new_str = new_str.length > 0 ? new_str : str.substr(0, len)
      return new_str + '...'
    }
    return str
  },

app.locals.stripTags = function (input) {
    return input.replace(/<(?:.|\n)*?>/gm, '')
  },

app.locals.editIcon = function (workoutUser, loggedUser, workoutId, floating = true) {
    if (workoutUser._id.toString() == loggedUser._id.toString()) {
      if (floating) {
        return `<a href="/workouts/edit/${workoutId}" class="btn-floating halfway-fab blue"><i class="fas fa-edit fa-small"></i></a>`
      } else {
        return `<a href="/workouts/edit/${workoutId}"><i class="fas fa-edit"></i></a>`
      }
    } else {
      return ''
    }
  },

app.locals.select = function (selected, options) {
    return options
      .fn(this)
      .replace(
        new RegExp(' value="' + selected + '"'),
        '$& selected="selected"'
      )
      .replace(
        new RegExp('>' + selected + '</option>'),
        ' selected="selected"$&'
      )
  },

// Passport config 
require("./config/passport")(passport);

// DB config 
const db = require("./config/keys").MongoURI;

// Connect to Mongo
mongoose.connect(db, { useNewUrlParser: true })
    .then(() => console.log("MongoDB Connected..."))
    .catch(err => console.log(err));

// EJS Helpers 
const moment = require('moment');
const shortDateFormat = "MMMM Do YYYY, h:mm:ss"; 
app.locals.moment = moment; // makes moment available as a variable in every EJS page
app.locals.shortDateFormat = shortDateFormat;

// EJS 
app.use(expressLayouts);
app.set("view engine", "ejs");

// Express bodyparser
app.use(express.urlencoded({ extended: false}));
app.use(express.json());

// Method overrride
app.use(methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        // look in urlencoded POST bodies and delete it
        let method = req.body._method
        delete req.body._method
        return method
    }
}))


// Express session middleware
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
  }));

// Passport middleware 
app.use(passport.initialize());
app.use(passport.session());

// Connect flash 
app.use(flash());

// Global variables
app.use((req, res, next) => {
    res.locals.success_msg = req.flash("success_msg");
    res.locals.error_msg = req.flash("error_msg");
    res.locals.error = req.flash("error");
    res.locals.user = req.user || null
    next();
});


// Routes 
app.use("/", require("./routes/index"));
app.use("/users", require("./routes/users"));
app.use('/public', express.static('public'));
app.use('/workouts', require('./routes/workouts'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server started on port ${PORT}`));