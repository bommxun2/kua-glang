const express = require("express");
const router = express.Router();

const folderController = require("../controllers/folder/folder.controller");

router.get("/:userid", folderController.listFolders);
router.post("/folder/:userid", folderController.addFolder);
router.put("/:userid/:folderid", folderController.updateFolder);
router.delete("/:userid/:folderid", folderController.deleteFolder);

module.exports = router;
