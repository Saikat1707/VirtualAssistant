import express from 'express'
import dotenv from 'dotenv'
dotenv.config()
import connectDB from './src/service/DBconnection.js'
import cookieParser from 'cookie-parser'
import authRouter from './src/routes/auth.routes.js'
import userRouter from './src/routes/user.routes.js'

const app = express()
app.use(cookieParser())

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

connectDB()



app.use('/api/auth',authRouter)
app.use('/api/user',userRouter)

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
})