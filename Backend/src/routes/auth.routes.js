import express from 'express';
import { logIn, logOut, SignUp } from '../controller/auth.controller.js';

const router = express.Router();

router.post('/signup',SignUp)
router.post('/login',logIn)
router.get('/logout',logOut)

export default router