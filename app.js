const path = require('path')
const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const morgan = require('morgan')
const exphbs = require('express-handlebars')
const hbs = exphbs.create()
const passport = require('passport')
const session = require('express-session')
const MongoStore = require('connect-mongo')
const connectDB = require('./config/db')

// Load config
dotenv.config({ path: './config/config.env'})

// Passport config
require('./config/passport')(passport)

connectDB()

const app = express()

// Logging HTTP Methods
if (process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'))
}

// HandleBars
app.engine('.hbs', exphbs.engine({extname: '.hbs'}))
app.set('view engine','.hbs')
app.set('views', './views');
app.set('view options', { layout: 'main' });

// Session
app.use(session({
    secret: 'secrett',
    resave: false,
    saveUninitialized: false,
    cookie: {secure : false},
    store: MongoStore.create({mongoUrl: process.env.MONGO_URI})
}))

// Passport middleware
app.use(passport.initialize())
app.use(passport.session())

// Static Folder
app.use(express.static(path.join(__dirname ,'./public')))

//Routes
app.use('/',require('./routes/index'))
app.use('/auth',require('./routes/auth'))

const port = process.env.PORT || 5000

app.listen(port, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${port} `))