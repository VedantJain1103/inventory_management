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
    res.redirect('/accounts/sign_in');
  }

});
router.get('/profile', async (req, res, next) => {
  try {
    const currentUser = await accountsServices.isLoggedIn(req.cookies.userName);
    const user = await accountsServices.getUser(currentUser);
    if (user == null) res.redirect('/accounts/sign_in');
    res.render('users/settings', { layout: 'users/users_layout', user: user });
  } catch (err) {
    res.redirect('/accounts/sign_in');
  }
})
router.post('/update', async (req, res) => {
  const currentUser = await accountsServices.isLoggedIn(req.cookies.userName);
  const user = await accountsServices.getUser(currentUser);
  if (user == null) res.redirect('/accounts/sign_in');
  const { username } = req.body;
  const { email } = req.body;
  const { password } = req.body;
  const { confirmPassword } = req.body;
  if (password != confirmPassword) res.render('users/settings', { layout: 'users/users_layout', user: user, err: "Passwords do not match!" });
  else {
    try {
      if (password == user.password) res.render('users/settings', { layout: 'users/users_layout', user: user, err: "Password should not be same as the old one." })
      else {
        const upd = await accountsServices.updateUser(user.username, email, password);
        res.redirect('/users/settings');
      }
    } catch (err) {
      res.redirect('/accounts/sign_in');
    }
  }
})
module.exports = router;
