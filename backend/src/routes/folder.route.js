const express = require("express");
const router = express.Router();

const folderController = require("../controllers/folder/folder.controller");

router.get("/:userId", folderController.listFolders);
router.post("/:userId", folderController.addFolder);
router.put("/:userId/:folderId", folderController.updateFolder);
router.delete("/:userId/:folderId", folderController.deleteFolder);

module.exports = router;
