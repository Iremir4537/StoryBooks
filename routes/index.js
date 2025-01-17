import express from 'express'
const router = express.Router()
import authMiddleware from '../middleware/auth.js'
const {ensureAuth,ensureGuest} = authMiddleware
import Story from '../models/Story.js'

router.get('/',ensureGuest,(req,res) => {
    res.render('login',{
        layout:'login'
    })
})

router.get('/dashboard',ensureAuth, async (req,res) => {
    try {
        const stories = await Story.find({user: req.user.id}).lean()
        res.render('dashboard',{
            name:req.user.firstName,
            stories
        })
    } catch (err) {
        console.error(err)
        res.render('error/500')
    }
})

export default router