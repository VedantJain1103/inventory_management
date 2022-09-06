const express = require('express');

const router = express.Router();

const accountsServices = require('../services/accounts_services');

router.get('/sign_in', (req, res) => {
    res.render('accounts/sign_in', { title: 'Express', email: '' });
});
router.get('/register', (req, res) => {
    res.render('accounts/register');
});

router.get('/logOut', async (req, res) => {
    try {
        const currentUser = await accountsServices.isLoggedIn(req.cookies.userName);
        const user = await accountsServices.getUser(currentUser);
        res.render('accounts/logOut', { title: 'Express', layout: 'users/users_layout', user: currentUser });
    } catch (err) {
        if (err.message === 'User not signed in.') {
            res.redirect('/accounts/sign_in');
        }
    }
});

router.post('/register', async (req, res) => {
    const { email } = req.body;
    const userName = req.body.username;
    const { password } = req.body;
    const { confirmPassword } = req.body;

    try {
        if (password != confirmPassword) res.render('accounts/register', { error: err.message });
        const re = await accountsServices.createUser(userName, email, confirmPassword);
        if (re == "Email or Username already exists") res.render('accounts/register', { error: 'Email or Username already exists' });
        else res.redirect('/accounts/sign_in');
    } catch (err) {
        console.log("===============");
        res.render('accounts/register', { error: err.message });
    }
});

router.post('/sign_in', async (req, res) => {
    const { email } = req.body;
    const { password } = req.body;
    try {
        const username = await accountsServices.signIn(email, password);
        // console.log('sId: ', sessionId);
        if (username == null) {
            const msg = "Invalid Username or Password";
            res.render('accounts/sign_in', { error: msg, email: email });
        }
        res.cookie('userName', username, { maxAge: 900000, httpOnly: true });
        res.redirect('/users');
    } catch (err) {
        res.render('accounts/sign_in', { error: err.message, email });
    }
});

router.post('/logOut', (req, res) => {
    try {
        accountsServices.logOut(req.cookies.userName);
        res.redirect('/');
    } catch (err) {
        console.error(err);
        res.redirect('/accounts/sign_in');
    }
});
module.exports = router;
