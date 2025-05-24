const express = require("express");
const router = express.Router();

const foodController = require("../controllers/food/food.controller");
const deleteFood = require("../controllers/food/deleteFood.controller");
const updateFoodStatus = require("../controllers/food/updateFoodStatus.controller");

router.get("/:folderid", foodController.listFoods);
router.post("/:folderid", foodController.addFood);
router.put("/:folderid/:foodid", foodController.updateFood);
router.delete("/:foodId", deleteFood);
router.put("/:foodId", updateFoodStatus);

module.exports = router;
