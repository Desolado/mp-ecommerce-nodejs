var express = require('express');
var exphbs = require('express-handlebars');
const mercadopago = require('mercadopago');
var morgan = require('morgan');

var app = express();

// Agrega credenciales
mercadopago.configure({
    access_token: 'APP_USR-8058997674329963-062418-89271e2424bb1955bc05b1d7dd0977a8-592190948',
    integrator_id: 'dev_24c65fb163bf11ea96500242ac130004',

});


app.use(morgan('dev'));


// Crea un objeto de preferencia
let preference = null;
// let origen = location.origin;

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.get('/', function(req, res) {
    res.render('home');
});

app.get('/success', function(req, res) {
    res.render('success', req.query);
});

app.get('/failure', function(req, res) {
    res.render('failure');
});

app.get('/pending', function(req, res) {
    res.render('pending');
});

app.post('/notification', function(req, res) {

    console.log('req', req.query);
    //console.log('res', res)
    res.sendStatus(200);
    //logger.write(JSON.stringify(res)) // append string to your file
});

app.get('/detail', function(req, res) {
    res.render('detail', req.query);

    let origin = req.get('host');

    let urlImagen = origin + req.query.img.replace('.', '');

    preference = {
        items: [{
            id: '1234',
            picture_url: urlImagen,
            title: req.query.title,
            description: 'Dispositivo móvil de Tienda e-commerce',
            quantity: 1,
            currency_id: 'MXN',
            unit_price: parseFloat(req.query.price)
        }],
        payer: {
            name: "Lalo",
            surname: "Landa",
            email: "test_user_58295862@testuser.com",
            phone: {
                area_code: "52",
                number: 5549737300
            },
            identification: {
                type: "DNI",
                number: '1'
            },
            address: {
                street_name: "Insurgentes Sur",
                street_number: 1602,
                zip_code: "03940"
            }
        },
        back_urls: {
            success: origin + "/success",
            failure: origin + "/failure",
            pending: origin + "/pending"
        },
        auto_return: "approved",
        payment_methods: {
            excluded_payment_methods: [{
                id: "amex"
            }],
            excluded_payment_types: [{
                id: "atm"
            }],
            installments: 6
        },
        //notification_url: origin + "/notification",
        external_reference: 'ing.eperezcamacho@gmail.com'
    };


});


app.post('/procesar-pago', function(req, res) {
    console.log(preference);
    mercadopago.preferences.create(preference)
        .then(function(response) {
            // Este valor reemplazará el string "$$init_point$$" en tu HTML
            console.log('respuesta mercadopago', response.body);
            res.redirect(response.body.init_point);
        }).catch(function(error) {
            console.log(error);
        });
});


app.use(express.static('assets'));

app.use('/assets', express.static(__dirname + '/assets'));

app.listen(process.env.PORT);
app.listen(3000);