const router = require('express').Router();
const adminController = require('../controllers/adminController');
const { verifyToken, isAdmin } = require('../middleware/auth');

router.use(verifyToken, isAdmin);

router.get('/users', adminController.listUsers);
router.patch('/users/:userId', adminController.updateUser);

router.post('/movies', adminController.addMovie);
router.patch('/movies/:movieId', adminController.updateMovie);
router.delete('/movies/:movieId', adminController.deleteMovie);

module.exports = router;
