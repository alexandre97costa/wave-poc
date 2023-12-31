require('dotenv').config()
const express = require('express')
const cors = require('cors')
const path = require('path');
const interceptor = require('express-interceptor')
const { expressjwt: validate_jwt } = require('express-jwt');
const app = express()
app.set('port', process.env.PORT || 4001)
const port = app.get('port')

const supabase = require('./config/supabase')
const sequelize = require('./config/database')
sequelize.sync(
    // { alter: true }
)

const { dev: devClass } = require('./_dev/dev')
const dev = new devClass;

const dev_routes = require('./routes/dev')
const wave_routes = require('./routes/wave')
const user_routes = require('./routes/user')

//* Middlewares
app.use(cors());
app.use(express.json());

// log dos pedidos todos que o servidor recebe (incluindo o status!)
app.use(interceptor((req, res) => {
    return {
        isInterceptable: () => { return true },
        intercept: (body, send) => {
            console.log(
                '\x1b[30m\x1b[45m ' + req.method +
                ' \x1b[0m ' + req.baseUrl + req._parsedUrl.pathname +
                ' \x1b[33m' + res.statusCode +

                // params
                (Object.keys(req?.params ?? {}).length !== 0 ? '\n\x1b[35m⤷ params \x1b[30m' + JSON.stringify(req?.params ?? {}).replaceAll('"', '\'') : '') +
                // query
                (!!req._parsedUrl.query ? '\n\x1b[35m⤷ query \x1b[30m' + req._parsedUrl.query.replaceAll('&', ' ') : '') +
                // body
                (!!req._body ? '\n\x1b[35m⤷ body \x1b[30m' + JSON.stringify(req.body).replaceAll('"', '\'') : '') +
                '\x1b[0m');

            send(body);
        }
    }
}))

// validação jwt (com exclusoes dentro do unless)
app.use(
    validate_jwt({
        secret: process.env.JWT_SECRET,
        algorithms: [process.env.JWT_ALGORITHM],
    }).unless({
        path: [
            { url: '/user', methods: ['POST'] },
            { url: '/user/supabase_login', methods: ['GET'] },
            { url: '/user/login', methods: ['POST'] },
            { url: '/' },

            // ? para cenas que nos ajudam em modo dev
            // ? os controllers devolvem 403 se estiver em prod
            { url: /^\/dev/ },
        ]
    })
);

// tratamento de erros do validate_jwt
app.use(function (e, req, res, next) {
    if (e.name === 'UnauthorizedError')
        return res.status(e.status).json({ msg: e.inner.message })

    console.log(e)
    next(e);
});

//* Rotas
app.use('/dev', dev_routes)
app.use('/wave', wave_routes)
app.use('/user', user_routes)


// Rota de Introdução
app.use('/', (req, res) => {
    if (req.headers['user-agent'].includes('Thunder Client')) {
        // se for um pedido de thunder client, envia um json 200
        return res.status(200).json({
            msg: 'Vieste para o root. Se não era suposto, verifica o método ou o url!',
            method: req.method,
            url: req.baseUrl + req._parsedUrl.pathname
        });
    } else {
        // se for um pedido de um browser, envia uma página html de exemplo
        return res.status(200).sendFile(path.join(__dirname, './root.html'));
    }
})


// * daqui pra baixo são só cenas para iniciar a bd como deve ser
// * e depois iniciar o app.listen()

async function assertConnections() {
    // sequelize connection
    console.log(`\x1b[30mConnecting to the database...`);
    try {
        await sequelize.authenticate();
        console.log('\x1b[30mDatabase connected!');
    } catch (error) {
        console.log('\x1b[30mUnable to connect to the database.');
        console.log('\x1b[31m' + error.message + '\x1b[0m');
        process.exit(1);
    }

    if (!!supabase) {
        console.log('Supabase connected!')
    } else {
        console.log('Unable to connect to Supabase.');
        process.exit(1);
    }

}
async function init() {
    console.log('\x1b[30mStarting backend in ' + process.env.MODE + ' mode...');
    await assertConnections();
    app.listen(port, () => {
        (process.env.MODE === "dev") ?
            console.log('\x1b[30mBackend online! \x1b[0m\x1b[34m▶ http://localhost:' + port + '\x1b[0m\n') :
            console.log('\x1b[30mBackend online!\x1b[0m\n')
    });
}
init();
