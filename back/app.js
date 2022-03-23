//Node
const path = require('path')
//Express
const express = require('express')
const session = require('express-session')
//Security Tool
const dotenv = require('dotenv')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const helmet = require('helmet')
const hpp = require('hpp')
//Auth Tool
const passport = require('passport')
//Debug Tool
const morgan = require('morgan')

/* Init Parameter Setting */
dotenv.config()

/* Import Project Folder */
//Sequlize
const { sequelize } = require('./models')

//Routes
const apiRouter = require('./routes/api')

//Passport Strategy
const passportConfig = require('./passport')

//Websocket
const webSocket = require('./socket')

/* Express Setting */
const app = express()
app.set('PORT', process.env.PORT || 3095)

//Sequlize
sequelize
    .sync()
    .then(() => {
        console.log('DB 연결 성공')
    })
    .catch(console.error)

//Express App Initialized
app.get('*', (req, res, next) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

const server = app.listen(app.get('PORT'), () => {
    console.log(`listening on port ${app.get('PORT')}`)
})
