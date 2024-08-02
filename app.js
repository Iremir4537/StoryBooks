import path from 'path'
import { fileURLToPath } from 'url'
import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import morgan from 'morgan'
import exphbs from 'express-handlebars'
import methodOverride from "method-override"
import passport from 'passport'
import session from 'express-session'
import MongoStore from 'connect-mongo'
import connectDB from './config/db.js'

import mainroute from './routes/index.js'
import authroute from './routes/auth.js'
import storiesroute from './routes/stories.js'

import configPassport from './config/passport.js'

const hbs = exphbs.create();

const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory

// Load config
dotenv.config({ path: './config/config.env'})

// Passport config
configPassport(passport)

connectDB()

const app = express()

app.use(express.urlencoded({extended:false}))

app.use(methodOverride(function (req, res) {
    if(req.body && typeof req.body === 'object' && '_method' in req.body){
        
        let method = req.body._method
        delete req.body._method
        return method
    }
}))

// Logging HTTP Methods
if (process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'))
}

import helpers from './helpers/hbs.js'
const {formatDate,stripTags,truncate,editIcon,select} = helpers

// HandleBars
app.engine('.hbs', exphbs.engine({helpers:{
    formatDate,
    stripTags,
    truncate,
    editIcon,
    select
},extname: '.hbs'}))
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

app.use(function (req,res,next){
    res.locals.user = req.user || null
    next()
})

// Static Folder
app.use('/public',express.static(path.join(__dirname ,'public')))

//Routes
app.use('/',mainroute)
app.use('/auth',authroute)
app.use('/stories',storiesroute)

const port = process.env.PORT || 5000

app.listen(port, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${port} `))