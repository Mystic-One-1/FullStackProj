const router = require('express').Router();
const watchlistController = require('../controllers/watchlistController');
const { verifyToken } = require('../middleware/auth');

router.get('/', verifyToken, watchlistController.getWatchlist);
router.post('/add', verifyToken, watchlistController.add);
router.post('/remove', verifyToken, watchlistController.remove);

module.exports = router;
