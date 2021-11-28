var createError = require('http-errors');
var express = require('express');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cors = require('cors');
var bodyParser = require('body-parser');
const cron = require("node-cron");

const router = require('./routes/router'); 

const expressValidator = require('express-validator')
var path = require('path');
// Swagger document
var swaggerJSDoc = require('swagger-jsdoc');

var dotenv = require('dotenv');
dotenv.config();

var app = express();


// ------------------------------------------------------------------------------------
// Start Server & Listen Port
// ------------------------------------------------------------------------------------
/*const PORT = 3000;
app.listen(PORT, () => console.log(`Express server currently running on port ${PORT}`));

// SET the access key
process.env.JWT_ACCESS_KEY = 'WizBee';*/

app.get('/', (req, res)=> {
    console.log('Testing API');
    res.send('Personal Manager V3 APIs working!');
});

/*var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/excavator')
    .then(() => console.log('connection succesful'))
    .catch((err) => console.error(err));*/

/*mongoose.connect('mongodb+srv://tejram:wizbeeuser@cluster0-qeebj.azure.mongodb.net/excavator?retryWrites=true')
    .then(() => console.log('connection succesful with azure.mongodb.net'))
    .catch((err) => console.error(err)); */

var mongoose = require('mongoose');
mongoose.connect(process.env.DB_URI, { useNewUrlParser: true })
    .then(() => console.log('connection succesful'))
    .catch((err) => console.error(err));


// ------------------------------------------------------------------------------------
// Swagger definition
// ------------------------------------------------------------------------------------

var swaggerDefinition = {
    info: {
        title: 'Excavator Node API',
        version: '1.0.0',
        description: 'Excavator RESTful API documentation with Swagger.',
    },
    host: 'localhost:3000',
    basePath: '/'
};

// options for the swagger docs
var options = {
    // import swaggerDefinitions
    swaggerDefinition: swaggerDefinition,
    // path to the API docs
    apis: ['./routes/*.js'],
};

// initialize swagger-jsdoc
var swaggerSpec = swaggerJSDoc(options);

// serve swagger
app.get('/swagger.json', function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
});
// ------------------------------------------------------------------------------------



/*app.use(function(request, response, next){
    response.header('Access-Control-Allow-Origin', '*');
    response.header('Access-Control-Allow-Header', 'Origin, X-Requested-Width, Content-Type, Accept');
    next();
});*/

app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

console.log('__dirname', __dirname);

app.use(express.static(path.join(__dirname, '')));
app.use('/', express.static(path.join(__dirname, '')));
// app.use(expressValidator());

// Set the route for the incoming request
app.use('/auth', require('./routes/auth'));
/* app.use('/expenditures', require('./routes/expenditures'));
app.use('/returnings', require('./routes/returnings'));
 */
app.use('/tasks', require('./routes/tasks'));
app.use('/profile', require('./routes/profile'));
app.use('/timesheets', require('./routes/timesheets'));
app.use('/purchases', require('./routes/purchases'));
app.use('/events', require('./routes/events'));

app.use('/expenditures', router(require('./models/Expenditures')));
app.use('/returnings', router(require('./models/Billing')));
/* app.use('/tasks', router(require('./models/Expenditures')));
app.use('/profile', router(require('./models/Expenditures')));
app.use('/timesheets', router(require('./models/Expenditures')));
app.use('/purchases', router(require('./models/Expenditures')));
app.use('/events', router(require('./models/Expenditures'))); */

app.use('/crm/employees', require('./routes/crm/employees'));
app.use('/crm/surveys', require('./routes/crm/surveys'));
app.use('/crm/auth', require('./routes/crm/auth'));

// Service to save device token and push notification
app.use('/push', require('./routes/push'));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    // res.send(err.status); // deprecated
    res.sendStatus(err.status);
});

const push = require('./routes/push');

// Schedule send notification on every 15 min 
// cron.schedule("*/1 * * * *", function() {
//     // push.sendMail();
//     console.log('This message will be printed every minute : ', new Date());
// });

// Send events notification to the user before every 15 min
cron.schedule("*/15 * * * *", function() {
    sendEventNotifications();
});

module.exports = app;
