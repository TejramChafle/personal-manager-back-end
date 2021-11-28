const express = require('express');
const auth = require('../auth');

const _router = (model) => {
    const router = express.Router();
    const ctrl = require('../controller/controller.js')(model);
    router.route('/', auth).get(ctrl.get).post(ctrl.post);
    // router.use('/:id', auth, ctrl.filter);
    router.route('/:id', auth)
        .get(ctrl.filter)
        .put(ctrl.update)
        .delete(ctrl.remove);
    return router;
}

module.exports = _router;