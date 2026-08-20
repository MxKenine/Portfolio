require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express()

app.use(cors({
  origin: 'http://localhost:3000',
//   origin: 'http://localhost:5173',
//   credentials: true
}));

app.use(express.json());
app.use('/user, userRoute')

const PORT = process.env.PORT || 3000 
app.listen(PORT, ()=> console.log(`Server is running on port ${PORT}`))

// const userRoute = require('./routes/user.route')
// const formationRoute = require('./routes/formation.route')

// app.use('/users', userRoute)
// app.use('/formation', formationRoute)

// const bcrypt = require('bcrypt')

// const UserModel = require('./models/user.model')

// const authRoute = require('./routes/auth.route')
// server.use('/register', authRoute)

// server.get('/', (req, res) => {
//     res.json({ message: "vous utilisez express js" })
// })

// const authRoute = require('./routes/auth.route')
// const cookieParser = require('coockie-parser')

// server.use('', authRoute)

// export default function verfyToken(req, res, next) {
//     try {
//         // const authHeaders = req.headers.authorization
//         // const token = authHeaders.split(' ')[1]
//         const token = req.cookies.token
//         console.log(token)
//         if (!token) {
//             return res.status(403).json({ message: 'Token manquant !' })
//         }
//         const decode = jwt.verify(token, process.env.JWT_SECRET)
//         req.user = decode
//         next()
//     } catch (err) {
//         res.status(500).json({ message: err })
//     }
// }

// import dotenv from 'dotenv'
// import cookieParser from 'cookie-parser'
// dotenv.config()

// import authRoute from './routes/auth.route.js'

// // app.use(express.static(path.join(__dirname, "..", "public", "images")))

// app.use(cookieParser())
// app.use(express.json())

// app.use('/uploads', express.static('uploads'))

// app.use('', authRoute)

// import dotenv from 'dotenv'
// dotenv.config()
// import authRoute from './routes/auth.route.js'

// const app = express()
// const PORT = process.env.PORT || 3000

// app.use('', authRoute)