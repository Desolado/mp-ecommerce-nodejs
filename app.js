var express = require('express');
var exphbs = require('express-handlebars');
const mercadopago = require('mercadopago');

var app = express();

// Agrega credenciales
mercadopago.configure({
    sandbox: true,
    access_token: 'APP_USR-5b9a3e27-3852-407d-8f49-e08bd5990007'
});

// Crea un objeto de preferencia
let preference = {};

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.get('/', function(req, res) {
    res.render('home');
});

app.get('/detail', function(req, res) {
    res.render('detail', req.query);

    preference = {
        items: [{
            id: '1234',
            title: req.query.title,
            description: 'Dispositivo móvil de Tienda e-commerce',
            quantity: 1,
            currency_id: 'MXN',
            unit_price: req.query.price
        }],
        payer: {
            name: "Lalo",
            surname: "Landa",
            email: "test_user_58295862@testuser.com",
            phone: {
                "area_code": "52",
                "number": "5549737300"
            },
            identification: {
                "type": "DNI",
                "number": "12345678"
            },
            address: {
                "street_name": "Insurgentes Sur",
                "street_number": 1602,
                "zip_code": "03940"
            }
        }
    };

    mercadopago.preferences.create(preference)
        .then(function(response) {
            // Este valor reemplazará el string "$$init_point$$" en tu HTML
            global.init_point = response.body.init_point;
        }).catch(function(error) {
            console.log(error);
        });
});


app.post('/procesar-pago', function(req, res) {

});


app.use(express.static('assets'));

app.use('/assets', express.static(__dirname + '/assets'));

app.listen(process.env.PORT);
app.listen(3000);