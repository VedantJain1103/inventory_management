const { application } = require('express');
var express = require('express');
var router = express.Router();

const accountsServices = require('../services/accounts_services');
const categoryServices = require('../services/category_services');

router.get('/', async (req, res) => {
    try {
        const currentUser = await accountsServices.isLoggedIn(req.cookies.userName);
        const user = await accountsServices.getUser(currentUser);
        const categories = await categoryServices.listCategory(user.username);
        // console.log(products);
        res.render('categories/index', {
            title: 'Express', layout: 'users/users_layout', categories, user: user,
        });
    } catch (err) {
        res.render('accounts/sign_in', { error: err.message });
    }
});
router.get('/create', async (req, res) => {
    try {
        const currentUser = await accountsServices.isLoggedIn(req.cookies.userName);
        const user = await accountsServices.getUser(currentUser);
        res.render('categories/create', { title: 'Express', layout: 'users/users_layout', user: user });
    }
    catch (err) {
        res.render('accounts/sign_in', { error: err.message });
    }

});
router.get('/:username/:category_name/list', async (req, res) => {
    try {
        const currentUser = await accountsServices.isLoggedIn(req.cookies.userName);
        const user = await accountsServices.getUser(currentUser);
        const products = await categoryServices.getProductByCategory(user.username, req.params.category_name);
        res.render('categories/list', { title: 'Express', layout: 'users/users_layout', products, category: req.params.category_name, user: user });
    } catch (err) {
        res.render('accounts/sign_in', { error: err.message });
    }
})
router.get('/:category_id/update', async (req, res) => {
    try {
        const currentUser = await accountsServices.isLoggedIn(req.cookies.userName);
        const user = await accountsServices.getUser(currentUser);
        const category = await categoryServices.getCategory(req.params.category_id);
        res.render('categories/update', { title: 'Express', layout: 'users/users_layout', category, user: user });
    } catch (err) {
        res.render('accounts/sign_in', { error: err.message });
    }
});
router.post('/:category_id/update', async (req, res) => {
    try {
        const currentUser = await accountsServices.isLoggedIn(req.cookies.userName);
        const user = await accountsServices.getUser(currentUser);
        const username = user.userName;
        id = req.params.category_id;
        const { name } = req.body;
        const { description } = req.body;
        const update = await categoryServices.updateCategory(id, username, name, description);
        try {
            const update2 = await categoryServices.updateInProducts(id, username, name);
        } catch (err) {
            throw err;
        }
        res.redirect('/categories')
    } catch (err) {
        res.render('accounts/sign_in', { error: err.message });
    }
})

router.get('/:category_id/delete', async (req, res) => {
    try {
        const currentUser = await accountsServices.isLoggedIn(req.cookies.userName);
        const user = await accountsServices.getUser(currentUser);
        const category = await categoryServices.getCategory(req.params.category_id);
        res.render('categories/delete', { title: 'Express', layout: 'users/users_layout', category, user: user });
    } catch (err) {
        res.render('accounts/sign_in', { error: err.message });
    }
});
router.post('/:category_id/delete', async (req, res) => {
    try {
        const currentUser = await accountsServices.isLoggedIn(req.cookies.userName);
        const user = await accountsServices.getUser(currentUser);
        const username = user.userName;
        id = req.params.category_id;
        const category = await categoryServices.getCategory(id);
        console.log(category);
        const delet = await categoryServices.deleteCategory(id, username, category.name)
        res.redirect('/categories')
    } catch (err) {
        res.render('accounts/sign_in', { error: err.message });
    }
})

module.exports = router;