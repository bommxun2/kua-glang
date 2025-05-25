const express = require("express");
const router = express.Router();

const foodController = require("../controllers/food/food.controller");
const deleteFood = require("../controllers/food/food.controller").deleteFood;

router.get("/:folder/:folderId", foodController.listFoods);
router.post("/:folder/:folderId", foodController.addFood);
router.put("/:folderId/:foodId", foodController.updateFood);
router.delete("/:foodId", deleteFood);

module.exports = router;
