
// Express
var express     = require('express');
var mongoose    = require('mongoose');
var jwt         = require('jsonwebtoken');
var bcrypt      = require('bcrypt');

// Models import
var User        = require('../models/User');
var Contact     = require('../models/Contact');

// Router
var router      = express.Router();


/**
 * @swagger
 * /auth/login:
 *   post:
 *     tags:
 *       - Auth
 *     description: login to application with email and password
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: credentials
 *         description: credentials include email & password
 *         in: body
 *         required: true
 *     responses:
 *       200:
 *         description: Successfully authenticated
 */
// USER LOGIN
router.post("/login", async (req, resp) => {

    console.log('User : ', User);
    console.log('req.body : ', req.body);

    // CHECK if the email & password matches with the password present in db
    User.findOne({ email: req.body.email, is_active: true }).exec().then(async (user) => {

        console.log('user found : ', user);

        // Compare the password to match with the password saved in db
        if (!await user.comparePassword(req.body.password)) {
            // 401: Unauthorized. Authentication failed to due mismatch in credentials.
            resp.status(401).json({
                message: 'Authentication failed. Your email or password is incorrect!'
            });
        } else {
            // GENERATE jwt token with the expiry time
            const token = jwt.sign({ email: user.email, id: user._id }, process.env.JWT_ACCESS_KEY, { expiresIn: "24h" });

            // TODO: Store the token and other detail in Authentication table
            resp.status(201).json({
                user: {
                    id: user._id,
                    email: user.email,
                    name: user.name,
                    devices: user.devices
                },
                token: token
            });
        }
    }).catch(error => {
        console.log('Login error :', error);
        resp.status(401).json({
            message: 'Authentication failed. Your email address or password is incorrect!'
        });
    });
});

// USER SIGNUP
router.post("/signup", async (req, resp) => {

    console.log('User : ', User);
    console.log('req.body : ', req.body);

    // CHECK if the email & password matches with the password present in db
    User.findOne({ email: req.body.email, is_active: true }).populate('user').exec().then(async (user) => {

        console.log('user found : ', user);

        // Compare the password to match with the password saved in db
        if (user) {
            // 401: Unauthorized. Authentication failed to due mismatch in credentials.
            resp.status(409).json({
                message: 'Email id is already in use. Please login with the provided email!'
            });
        } else {
            // Since the user doesn't exist, then save the detail
            console.log(req.body);
            let user = new User(req.body);
            user._id = new mongoose.Types.ObjectId(),
            user.created_date = Date.now(),
            user.updated_date = Date.now();
            bcrypt.hash(user.password, 10, (err, result)=> {
                console.log('result of hash', result);
                user.password = result;
                user.save().then(result => {
                    console.log(result);

                    // GENERATE jwt token with the expiry time
                    const token = jwt.sign({ email: user.email, id: user._id }, process.env.JWT_ACCESS_KEY, { expiresIn: "24h" });

                    return resp.status(201).json({
                        message: 'User account created successfully.',
                        user: result,
                        token: token
                    });
                }).catch(error => {
                    console.log('error : ', error);
                    // 500 : Internal Sever Error. The request was not completed. The server met an unexpected condition.
                    // return resp.status(500).json(error);
                });
            });
        }
    }).catch(error => {
        console.log('signup error :', error);
        resp.status(401).json({
            message: 'User registration failed.',
            error: error
        });
    });
});

module.exports = router;
