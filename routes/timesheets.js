var express     = require('express');
var mongoose    = require('mongoose');
var FuelResource= require('../models/FuelResource');
const auth      = require('../auth');

var router      = express.Router();

/**
 * @swagger
 * /fuel-resource:
 *   get:
 *     tags:
 *       - Fuel Resource
 *     description: Returns all resources
 *     security:
 *       - bearerAuth: []
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: An array of resources
 */
// GET Fuel resources (Only active)
router.get('/', auth, (req, resp) => {
    /* FuelResource.where({ is_active: true }).exec().then(resources => {
        return resp.status(200).json(resources);
    }).catch(error => {
        console.log('error : ', error);
        // 500 : Internal Sever Error. The request was not completed. The server met an unexpected condition.
        return resp.status(500).json({
            error: error
        });
    }); */


    let filter = {};
    filter.is_active = req.query.is_active || true;
    if (req.query.name) filter.name = new RegExp('.*' + req.query.name + '.*', 'i');
    if (req.query.owner) filter.owner = req.query.owner;
    if (req.query.mobile) filter.place = new RegExp('.*' + req.query.place + '.*', 'i');
    if (req.query.phone) filter.phone = new RegExp('.*' + req.query.phone + '.*', 'i');

    FuelResource.paginate(filter, { sort: { _id: req.query.sort_order }, page: parseInt(req.query.page), limit: parseInt(req.query.limit), populate: ['owner', 'created_by', 'updated_by'] }, (error, result) => {
        // 500 : Internal Sever Error. The request was not completed. The server met an unexpected condition.
        if (error) return resp.status(500).json({
            error: error
        });

        return resp.status(200).json(result);
    });
});


/**
 * @swagger
 * /fuel-resource/{id}:
 *   get:
 *     tags:
 *       - Fuel Resource
 *     description: Returns a single fuel resource
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: FuelResource's id
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: A single fuel resource
 */
// GET SINGLE FUEL RESOURCE BY ID
router.get('/:id', auth, (req, resp, next) => {
    FuelResource.findById(req.params.id).exec().then(resource => {
        return resp.status(200).json(resource);
    }).catch(error => {
        console.log('error : ', error);
        // 204 : No content. There is no fuel resource to send for this request, but the headers may be useful.
        return resp.status(204).json({
            error: error
        });
    });
});


/**
 * @swagger
 * /fuel-resource:
 *   post:
 *     tags:
 *       - Fuel Resource
 *     description: Creates a new fuel resource
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: fuel resource
 *         description: fuel resource object
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/FuelResource'
 *     responses:
 *       201:
 *         description: Fuel resource created successfully
 */
// SAVE FUEL RESOURCE
router.post('/', auth, (req, resp, next) => {
    // First check if the fuel resource with name already exists
    FuelResource.findOne({ name: req.body.name, is_active: true })
        .exec()
        .then(resource => {
            // If the resource with name already exists, then return error
            if (resource) {
                // 409 : Conflict. The request could not be completed because of a conflict.
                return resp.status(409).json({
                    message: "The fuel resource with name " + req.body.name + " already exist. Please check and edit if required."
                });
            } else {
                // Since the user doesn't exist, then save the detail
                console.log(req.body);
                const resource = new FuelResource({
                    _id:            new mongoose.Types.ObjectId(),
                    name:           req.body.name,
                    place:          req.body.place,
                    owner:          req.body.owner,
                    phone:          req.body.phone,
                    mobile:         req.body.mobile,
                    contact_person: req.body.contact_person,
                    description:    req.body.description,
                    created_by:     req.body.created_by,
                    updated_by:     req.body.updated_by,
                    created_date:   Date.now(),
                    updated_date:   Date.now()
                });

                resource.save()
                    .then(result => {
                        console.log(result);
                        return resp.status(201).json({
                            message: "Fuel resource created successfully.",
                            result: result
                        });
                    })
                    .catch(error => {
                        console.log('error : ', error);
                        // 500 : Internal Sever Error. The request was not completed. The server met an unexpected condition.
                        return resp.status(500).json({
                            error: error
                        });
                    });
            }
        }).catch(error => {
            console.log('error : ', error);
            // 500 : Internal Sever Error. The request was not completed. The server met an unexpected condition.
            return resp.status(500).json({
                error: error
            });
        });
});

/**
* @swagger
* /fuel-resource/{id}:
*   put:
*     tags:
*       - Fuel Resource
*     description: Updates a single fuel resource
*     produces: application/json
*     parameters:
*       name: fuel resource
*       in: body
*       description: Fields for the fuel resource
*       schema:
*         type: array
*         $ref: '#/definitions/FuelResource'
*     responses:
*       200:
*         description: Fuel resource updated successfully
*/
// UPDATE FUEL RESOURCE
router.put('/:id', auth, (req, resp, next) => {
    FuelResource.findByIdAndUpdate(req.params.id, req.body).exec().then(resource => {
        return resp.status(200).json(resource);
    }).catch(error => {
        // 500 : Internal Sever Error. The request was not completed. The server met an unexpected condition.
        return resp.status(500).json({
            error: error
        });
    });
});


/**
 * @swagger
 * /fuel-resource/{id}:
 *   delete:
 *     tags:
 *       - Fuel Resource
 *     description: Deletes a single fuel resource
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: fuel resource's id
 *         in: path
 *         required: true
 *         type: integer
 *     responses:
 *       200:
 *         description: Fuel resource deleted successfully
 */
// DELETE FUEL RESOURCE (Hard delete. This will delete the entire fuel resource detail. Only application admin should be allowed to perform this action )
router.delete('/:id', auth, (req, resp, next) => {
    FuelResource.findByIdAndRemove(req.params.id).exec().then(resource => {
        return resp.status(200).json(resource);
    }).catch(error => {
        console.log('error : ', error);
        // 500 : Internal Sever Error. The request was not completed. The server met an unexpected condition.
        return resp.status(500).json({
            error: error
        });
    });
});

module.exports = router;
