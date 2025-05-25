const express = require("express");
const router = express.Router();

const foodController = require("../controllers/food/food.controller");
const deleteFood = require("../controllers/food/deleteFood.controller");
const updateFoodStatus = require("../controllers/food/updateFoodStatus.controller");

router.get("/folder/:folderId", foodController.listFoods); // แสดงอาหารใน folder นั้นๆ
router.post("/folder/:folderId", foodController.addFood);
router.put("/folderId/:foodId", foodController.updateFood);
router.delete("/:foodId", deleteFood);
router.put("/:foodId", updateFoodStatus);

module.exports = router;
