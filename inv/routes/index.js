var express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.render('index', { title: 'Express' });
});
router.get('/about', (req, res) => {
  res.render('about', { title: 'Express' });
});

module.exports = router;
