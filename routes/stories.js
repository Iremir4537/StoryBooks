import express from 'express'
const router = express.Router()
import authMiddleware from '../middleware/auth.js'
const {ensureAuth} = authMiddleware

import Story from '../models/Story.js'

router.get('/add',ensureAuth,(req,res) => {
    res.render('stories/add')
})

export default router