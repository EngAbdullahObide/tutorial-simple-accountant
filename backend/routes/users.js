const express = require('express');
const validate = require('../handlers/validation');
const {SaveUser} = require('../middlewares/validators');
const {SaveWallet} = require('../middlewares/validators');
const {SaveSafe} = require('../middlewares/validators');
const {SaveExpenses} = require('../middlewares/validators');
const router = express.Router();
const userController = require('../controllers/userController')
const walletController = require ('../controllers/walletController')
const expensesController = require ('../controllers/expensesController')
const safeController = require ('../controllers/safeController')
const isLoggedIn = require('../middlewares/auth')


router.post('/account/signup', validate(SaveUser), userController.register);
router.post('/account/signin',userController.login);
router.get('/account/me', isLoggedIn, userController.me);

router.post('/wallet', isLoggedIn, validate(SaveWallet),walletController.toWallet);
router.get('/wallet', isLoggedIn, walletController.fromWallet);
router.delete('/wallet/:id', isLoggedIn, walletController.deleteWallet);

router.post('/expenses', isLoggedIn, validate(SaveExpenses), expensesController.toExpenses);
router.get('/expenses', isLoggedIn, expensesController.fromExpenses);
router.delete('/expenses/:id', isLoggedIn, expensesController.deleteExpenses);

router.post('/safe', isLoggedIn, validate(SaveSafe),safeController.toSafe);
router.get('/safe', isLoggedIn , safeController.fromSafe);
router.delete('/safe/:id', isLoggedIn, safeController.deleteSafe);



module.exports = router;
