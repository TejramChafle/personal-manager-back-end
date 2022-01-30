
// Express
var express = require('express');
var mongoose = require('mongoose');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt');
var nodemailer = require('nodemailer');
// Models import
var User = require('../models/User');
// Router
var router = express.Router();
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

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
    // console.log('User : ', User);
    // console.log('req.body : ', req.body);
    // CHECK if the email & password matches with the password present in db
    User.findOne({ email: req.body.email, is_active: true }).populate('devices').exec().then(async (user) => {
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
    // CHECK if the email & password matches with the password present in db
    User.findOne({ email: req.body.email, is_active: true }).populate('user').exec()
        .then(async (user) => {
            // Throw error if user already exist with provided email address and active 
            if (user) {
                throw ({
                    STATUS_CODE: 409,
                    message: 'Email id is already in use. Please login with the provided email!'
                });
            }
        })
        .then(async () => {
            // Since the user doesn't exist, then save the detail
            try {
                // if the provided token is valid, save user information and login user
                const password = await bcrypt.hash(req.body.password, 10);
                const _user = new User({
                    _id: new mongoose.Types.ObjectId(),
                    name: req.body.name,
                    email: req.body.email,
                    photo: req.body.photo,
                    created_date: Date.now(),
                    updated_date: Date.now(),
                    password: password
                });
                await _user.save().then(registeredUser => {
                    // Send registration successful mail
                    // sendMail(registeredUser);
                    // GENERATE jwt token with the expiry time
                    const token = jwt.sign(
                        { email: registeredUser.email, id: registeredUser._id },
                        process.env.JWT_ACCESS_KEY,
                        { expiresIn: "24h" }
                    );
                    return resp.status(201).json({
                        message: 'User account created successfully.',
                        user: {
                            id: registeredUser._id,
                            email: registeredUser.email,
                            name: registeredUser.name,
                            devices: registeredUser.devices
                        },
                        token: token
                    });
                })
            } catch (error) {
                throw error;
            }
        })
        .catch(error => {
            // console.log('SIGNUP_ERROR: ', error);
            resp.status(401).json({
                message: 'User registration failed.',
                error: error
            });
        });
});

// Send Mail function using Nodemailer 
async function sendMail(user) {
    /* let mailTransporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "info@wizbee.co.in",
            pass: "working@24"
        }
    }); */
    // Generate test SMTP service account from ethereal.email
    // Only needed if you don't have a real mail account for testing
    let testAccount = await nodemailer.createTestAccount();
    // create reusable transporter object using the default SMTP transport
    let mailTransporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: testAccount.user, // generated ethereal user
            pass: testAccount.pass, // generated ethereal password
        },
    });
    // Setting credentials 
    let mailDetails = {
        from: "contact@hmtrading.biz",
        to: user.email,
        subject: "Registration successful",
        text: "Hi " + user.name + "\nThank you for regestering Personal Manager V3. We welcome you onboard and happy to offer you the wide range of services.\n"
            + "For any queries, please feel free to write us. We would be happy to help you.\n"
            + "Thank you.\nRegards, Personal Manager V3\n2305, Silver Oak, Somewhere near road,\nPune\nIndia-411014."
    };
    // Sending Email 
    mailTransporter.sendMail(mailDetails,
        function (err, data) {
            if (err) {
                console.log("Failed to send an email with error : ", err);
            } else {
                console.log('Sent signup email result : ', data);
                console.log("Email sent successfully.");
            }
        });
}


// User login/signup with google/facebook
router.post("/login-with-social", async (req, resp) => {
    const validateToken = new Promise(async function (resolve, reject) {
        try {
            // Validate google auth tokenId with google
            const ticket = await client.verifyIdToken({
                idToken: req.body.token,
                audience: process.env.CLIENT_ID
            });
            const payload = ticket.getPayload();
            resolve(payload);
        } catch (error) {
            reject('Invalid token signature!');
        }
    });
    var authenticatedUser;
    validateToken.then(async () => {
        // Check if the email is already registered, if not, save user
        await User.findOne({ email: req.body.email, is_active: true }).exec().then(async (user) => {
            if (user) {
                authenticatedUser = user;
            } else {
                // If user doesn't exist, register user and then login
                try {
                    // if the provided token is valid, save user information and login user
                    const password = await bcrypt.hash(req.body.token, 10);
                    const _user = new User({
                        _id: new mongoose.Types.ObjectId(),
                        name: req.body.name,
                        email: req.body.email,
                        photo: req.body.photo,
                        created_date: Date.now(),
                        updated_date: Date.now(),
                        password: password
                    });
                    await _user.save().then(registeredUser => {
                        authenticatedUser = {
                            _id: registeredUser._id,
                            name: registeredUser.name,
                            email: registeredUser.email,
                            photo: registeredUser.photo,
                            password: password
                        };
                    })
                } catch (error) {
                    throw error;
                }
            }
            return authenticatedUser;
        })
    }).then(() => {
        // GENERATE jwt token with the expiry time
        const token = jwt.sign({ email: authenticatedUser.email, id: authenticatedUser._id }, process.env.JWT_ACCESS_KEY, { expiresIn: "24h" });
        // TODO: Store the token and other detail in Authentication table
        resp.status(201).json({
            user: {
                id: authenticatedUser._id,
                email: authenticatedUser.email,
                name: authenticatedUser.name,
                devices: authenticatedUser.devices,
                photo: authenticatedUser.photo
            },
            token: token
        });
    }).catch(error => {
        console.log('Login error :', error);
        resp.status(401).json({
            message: 'Authentication failed. Your email address or password is incorrect!',
            error: error
        });
    });
});

module.exports = router;
