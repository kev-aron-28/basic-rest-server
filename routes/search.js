const { Router } = require('express');

const router = Router();

const { search } = require('../controllers/search');

router.get('/:collection/:term', search)

module.exports = router;