const dbAdmin = require('./dbadmin');
const dbUser = require('./dbusers');
const dbRegister = require('./dbregistro');
const dbAccount = require('./dbcuenta');
const dbThird = require('./dbtercero');
const dbTransaction = require('./dbtransaccion');


var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');

var app = express();
var router = express.Router();

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json()); 
app.use(cors());
app.use('/api', router);

//Rutas para GET

router.route('/admins').get((request, response) => {
    dbAdmin.getAdmin().then(result => {
        response.json(result[0]);
    })
})

router.route('/users').get((request, response) => {
    dbUser.getUsers().then(result => {
        response.json(result[0]);
    })
})

//Get users by userName
router.route('/users/:uName').get((request, response) => {
    dbUser.getUser(request.params.uName).then(result => {
        response.json(result[0]);
    })
})

//Insert user
router.route('/users/insert').post((request, response) => {
    let usuario = {...request.body}
    dbUser.insertUser(usuario).then(result => {
        response.json(result[0]);
    })
})

//Delete users by userName
router.route('/users/delete').post((request, response) => {
    let usuario = {...request.body}
    dbUser.deleteUser(usuario).then(result => {
        response.json(result[0]);
    })
})

router.route('/register').get((request, response) => {
    dbRegister.getRegister().then(result => {
        response.json(result[0]);
    })
})

router.route('/account').get((request, response) => {
    dbAccount.getAccount().then(result => {
        response.json(result[0]);
    })
})

router.route('/third').get((request, response) => {
    dbThird.getThird().then(result => {
        response.json(result[0]);
    })
})

router.route('/transaction').get((request, response) => {
    dbTransaction.getTransaction().then(result => {
        response.json(result[0]);
    })
})

var port = process.env.port || 8090;

app.listen(port);

console.log('API Iniciada en el puerto: ' + port);