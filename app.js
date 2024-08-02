import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import morgan from 'morgan';
import exphbs from 'express-handlebars';
import passport from 'passport';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import connectDB from './config/db.js';

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
app.use('/public',express.static(path.join(__dirname ,'public')))

//Routes
app.use('/',mainroute)
app.use('/auth',authroute)
app.use('/stories',storiesroute)

const port = process.env.PORT || 5000

app.listen(port, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${port} `))