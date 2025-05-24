const express = require('express');
const foodController = require('../controllers/food/foodController');
const router = express.Router();

router.get('/food/:folderid', foodController.listFoods);
router.post('/food/:folderid', foodController.addFood);
router.put('/food/:folderid/:foodid', foodController.updateFood);

module.exports = router;
