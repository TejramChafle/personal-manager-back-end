const express     = require('express');
const mongoose    = require('mongoose');
const Device      = require('../models/Device');
const User        = require('../models/User');
const auth        = require('../auth');
const router      = express.Router();

var admin = require('firebase-admin');


/**
 * @swagger
 * /todo:
 *   post:
 *     tags:
 *       - Device
 *     description: Creates a new todo
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: todo
 *         description: Device object
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/Device'
 *     responses:
 *       201:
 *         description: Device information saved successfully
 */
// SAVE DEVICE
router.post('/save-device-information', auth, (req, resp) => {
    console.log(req.body);
    const device = new Device({
        _id: new mongoose.Types.ObjectId(),
        ...req.body,
        created_date: Date.now(),
        updated_date: Date.now()
    });

    device.save().then(result => {
        console.log('Device:', result);

        // Get the user detail
        User.findOne({_id: req.body.user}).then((user)=> {
            console.log(user);
            var devices = user.devices;
            if (Array.isArray(devices)) {
                devices.push(result._id);
                console.log('devices : ', devices);
            }
            User.findOneAndUpdate({_id: req.body.user}, { devices: devices }).then((userdevicesresult)=> {
                console.log('userdevicesresult : ', userdevicesresult);
                if (userdevicesresult) {
                    return resp.status(201).json({
                        message: "Device information saved successfully.",
                        user: {
                            _id: userdevicesresult._id,
                            name: userdevicesresult.name,
                            email: userdevicesresult.email
                        }
                    });
                }

            })
        });
    }).catch(error => {
        console.log('error : ', error);
        // 500 : Internal Sever Error. The request was not completed. The server met an unexpected condition.
        return resp.status(500).json({
            error: error
        });
    });
});



// Send notification for testing
router.post('/send-notification', auth, (req, resp) => {

    Device.find({user: req.body.user}).exec().then((devices)=> {
        console.log(devices);
        if (Array.isArray(devices)) {
            // devices.push(result._id);
            console.log('devices : ', devices);

            // -----------------------------------------------------------------------------------    
            // FIREBASE NOTIFICATION
            // -----------------------------------------------------------------------------------
            admin.initializeApp({
              credential: admin.credential.cert(serviceAccount),
              databaseURL: "https://ng-personal-manager.firebaseio.com"
            });

            // This registration token comes from the client FCM SDKs.
            var registrationToken = devices[0]['firebase-token'];

            var message = {
              data: {
                score: '850',
                time: '2:45'
              },
              token: registrationToken
            };

            // Send a message to the device corresponding to the provided
            // registration token.
            admin.messaging().send(message)
              .then((response) => {
                // Response is a message ID string.
                console.log('Successfully sent message:', response);
              })
              .catch((error) => {
                console.log('Error sending message:', error);
              });

            // -----------------------------------------------------------------------------------

            return resp.status(201).json({
                devices: devices
            });
        }
        /*User.findOneAndUpdate({_id: req.body.user}, { devices: devices }).then((userdevicesresult)=> {
            console.log('userdevicesresult : ', userdevicesresult);
            if (userdevicesresult) {
                return resp.status(201).json({
                    message: "Device information saved successfully.",
                    user: {
                        _id: userdevicesresult._id,
                        name: userdevicesresult.name,
                        email: userdevicesresult.email
                    }
                });
            }

        })*/
    });

    /*console.log(req.body);
    const device = new Device({
        _id: new mongoose.Types.ObjectId(),
        ...req.body,
        created_date: Date.now(),
        updated_date: Date.now()
    });

    device.save().then(result => {
        console.log('Device:', result);
        // Get the user detail
        
    }).catch(error => {
        console.log('error : ', error);
        // 500 : Internal Sever Error. The request was not completed. The server met an unexpected condition.
        return resp.status(500).json({
            error: error
        });
    });*/
});

module.exports = router;
