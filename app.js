const admin = require("firebase-admin");
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

admin.initializeApp({
    credential: admin.credential.cert("./admin-firebase-firebase-adminsdk-gmz9h-264ea5c309.json"),
    databaseURL: "https://admin-firebase.firebaseio.com/"
});

const db = admin.database();
const usersRef = db.ref("usuarios");

app.use(cors());
app.use('/public', express.static('./public'));
app.use('/libs', express.static('./libs'));
app.use('/scripts', express.static('./scripts'));
app.set('views', './views');
app.set('view engine', 'jade');

app.get('/inicio', function (req, res) {
    res.render('inicio');
});

app.get('/api', function (req, res) {
    res.json({
        "id": "26",
        "nome": "David Coelho"
    });
});


app.route('/admin')
    .get(function (req, res) {
        res.render('admin');
    })
    .post(function (req, res) {
        var agora = new Date().getTime();
        admin.auth().createUser({
            email: req.body.email,
            password: req.body.password
        })
            .then(function (userRecord) {
                var id = userRecord.uid;
                usersRef.child(id).set({
                    email: req.body.email,
                    created_at: agora
                });
                res.redirect('listar');
            })
            .catch(function (error) {
                res.render('admin', {
                    "mensagem": error
                });
            });
    })


app.get('/listar', function (req, res) {
    res.render('listar');
});

app.post('/delete', function (req, res) {
    var uid = req.body.id;
    admin.auth().deleteUser(uid)
        .then(function () {
            usersRef.child(uid).set({});
            console.log("Usuário deletado!");
        })
        .catch(function (error) {
            console.log("Houve um erro:", error);
        });
});

app.listen(3000, function () {
    console.log('Servidor rodando na porta 3000!');
});
