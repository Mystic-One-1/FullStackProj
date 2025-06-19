const router = require('express').Router();
const movieController = require('../controllers/movieController');

router.get('/', movieController.list);
router.get('/:id', movieController.detail);

module.exports = router;
