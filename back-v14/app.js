const express = require('express')
const dotenv = require('dotenv')
const morgan = require('morgan')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const path = require('path')
const hpp = require('hpp')
const helmet = require('helmet')
const passport = require('passport')

dotenv.config()
const { sequelize } = require('./models')
const passportConfig = require('./passport')
const apiRouter = require('./routes/api')
const webSocket = require('./socket')

const app = express()
app.set('PORT', process.env.PORT || 3095)
sequelize
    .sync()
    .then(() => {
        console.log('DB 연결 성공')
    })
    .catch(console.error)
passportConfig()
const prod = process.env.NODE_ENV === 'production'

if (prod) {
    app.enable('trust proxy')
    app.use(morgan('combined'))
    app.use(helmet({ contentSecurityPolicy: false }))
    app.use(hpp())
} else {
    app.use(morgan('dev'))
    app.use(
        cors({
            origin: true,
            credentials: true,
        }),
    )
}
app.use(express.static(path.join(__dirname, 'public')))
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser(process.env.COOKIE_SECRET))
const sessionOption = {
    resave: false, // 수정된 적 없는 세션이라도 한번 발급된 세션은 저장 허용(=True). 경쟁조건을 일으킬 수 있음
    rolling: false, // 새로고침이 발생할 때마다 세션 refresh(=True, 를 위해서 saveUninitialized=True 가 필요함)
    saveUninitialized: false, // 초기화되지 않은 세션, 생성되었으나 한번도 수정되지 않은 세션을 저장할 것인지 (=True, 이면 아무것도 없는 세션이 강제 저장)
    secret: process.env.COOKIE_SECRET,
    cookie: {
        httpOnly: true,
    },
}
if (prod) {
    sessionOption.cookie.secure = true
    sessionOption.cookie.proxy = true
}
app.use(session(sessionOption))
app.use(passport.initialize())
app.use(passport.session())

app.use('/api', apiRouter)
app.get('*', (req, res, next) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

const server = app.listen(app.get('PORT'), () => {
    console.log(`listening on port ${app.get('PORT')}`)
})

webSocket(server, app)
