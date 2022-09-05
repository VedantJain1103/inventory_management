var express = require('express');
var router = express.Router();

const accountsServices = require('../services/accounts_services');
const productServices = require('../services/product_services');

router.get('/', async (req, res) => {
    try {
        const currentUser = await accountsServices.isLoggedIn(req.cookies.userName);
        const user = await accountsServices.getUser(currentUser);
        const products = await productServices.listProduct(user.username);
        // console.log(products);
        res.render('products/index', {
            title: 'Express', layout: 'users/users_layout', products, user: user,
        });
    } catch (err) {
        if (err) res.render('accounts/sign_in', { error: err.message });
    }
});
router.get('/create', async (req, res) => {
    const currentUser = await accountsServices.isLoggedIn(req.cookies.userName);
    const user = await accountsServices.getUser(currentUser);
    res.render('products/create', { title: 'Express', layout: 'users/users_layout', user: user });
});

router.get('/404', async (req, res) => {
    const currentUser = await accountsServices.getLoggedInUser(req.cookies.userName);
    if (!currentUser) {
        res.redirect('/accounts/sign_in');
    }
    res.render('products/404', { error: 'product Inaccessible', layout: 'users/users_layout', user: currentUser });
});

router.get('/:productId/delete', async (req, res) => {
    try {
        const currentUser = await accountsServices.isLoggedIn(req.cookies.userName);
        const user = await accountsServices.getUser(currentUser);
        const product = await productServices.getProduct(req.params.productId);
        res.render('products/delete', {
            title: 'Express', layout: 'users/users_layout', product, user: user,
        });
    } catch (err) {
        if (err) {
            res.redirect('/products/404');
        }
    }
});

router.get('/:productId/update', async (req, res) => {
    try {
        const currentUser = await accountsServices.isLoggedIn(req.cookies.userName);
        const user = await accountsServices.getUser(currentUser);
        const product = await productServices.getProduct(req.params.productId);
        res.render('products/update', {
            title: 'Express', layout: 'users/users_layout', product, user: user,
        });
    } catch (err) {
        console.log(err);
        res.redirect('/products/404');
    }
});

router.get('/:productId/view', async (req, res) => {
    try {
        const currentUser = await accountsServices.isLoggedIn(req.cookies.userName);
        const user = await accountsServices.getUser(currentUser);
        const product = await productServices.getProduct(req.params.productId);
        res.render('products/view', {
            title: 'Express', layout: 'users/users_layout', product, user: user,
        });
    } catch (err) {
        console.log(err);
        res.redirect('/products/404');
    }
});

router.post('/create', async (req, res) => {
    try {
        const { name } = req.body;
        const { description } = req.body;
        const { category } = req.body;
        const { price } = req.body;
        const userName = req.cookies.userName;
        await productServices.addProduct(userName, name, category, price, description);
        res.redirect('/products');
    } catch (err) {
        if (err) res.render('products/create', { error: "Category required" });
    }
});

router.post('/:productId/delete', async (req, res) => {
    try {
        const currentUser = await accountsServices.isLoggedIn(req.cookies.userName);
        const user = await accountsServices.getUser(currentUser);
        const product = await productServices.getProduct(req.params.productId);
        if (product == null) {
            res.redirect('/products', { title: 'product Not Found' });
        } else {
            res.render('products/delete', {
                title: 'Express', layout: 'users/users_layout', product, user: user,
            });
        }
    } catch (err) {
        if (err) {
            res.redirect('/products/404');
        }
    }
});
router.post('/:productId/delete/confirm', async (req, res) => {
    try {
        const currentUser = await accountsServices.isLoggedIn(req.cookies.userName);
        const user = await accountsServices.getUser(currentUser);
        await productServices.deleteProduct(req.params.productId);
        res.redirect('/products');
    } catch (err) {
        console.error(err);
        res.redirect('/accounts/sign_in');
    }
});

router.post('/:productId/update', async (req, res) => {
    try {
        const currentUser = await accountsServices.isLoggedIn(req.cookies.userName);
        const user = await accountsServices.getUser(currentUser);
        const product = await productServices.getProduct(req.params.productId);
        res.render('products/update', {
            title: 'Express', layout: 'users/users_layout', product, user: user,
        });
    } catch (err) {
        res.redirect('/products/404');
    }
});

router.post('/:productId/update/confirm', async (req, res) => {
    try {
        const username = req.cookies.userName;
        const { name } = req.body;
        const { description } = req.body;
        const { category } = req.body;
        const { price } = req.body;
        await productServices.updateProduct(req.params.productId, name, category, price, description);
        res.redirect('/products');
    } catch (err) {
        console.error(err);
        if (err instanceof UserNotSignedIn) res.render('/accounts/sign_in', { error: err.message });
    }
});

module.exports = router;
