import express from 'express';
import { getCurrentUser, updateUser } from '../controller/user.controller.js';
import { isAuthenticated } from '../middlewares/isAuthenticated.js';
import upload from '../middlewares/multer.js'
const router = express.Router()

router.get('/current',isAuthenticated,getCurrentUser)
router.patch('/update',isAuthenticated,upload.single('assistantImage'),updateUser)

export default router