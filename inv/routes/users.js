var express = require('express');
var router = express.Router();
const accountsServices = require('../services/accounts_services');
/* GET users listing. */
router.get('/', async (req, res, next) => {
  try {
    const currentUser = await accountsServices.isLoggedIn(req.cookies.userName);
    const user = await accountsServices.getUser(currentUser);
    res.render('users/user_index', { layout: 'users/users_layout', user: user });
  } catch (err) {
    res.redirect('accounts/sign_in');
  }

});
router.get('/profile', async (req, res, next) => {
  try {
    const currentUser = await accountsServices.isLoggedIn(req.cookies.userName);
    const user = await accountsServices.getUser(currentUser);
    res.render('users/settings', { layout: 'users/users_layout', user: user });
  } catch (err) {
    res.redirect('accounts/sign_in');
  }
})
module.exports = router;
