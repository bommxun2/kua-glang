const express = require("express");
const router = express.Router();

const folderController = require("../controllers/folder/folder.controller");
const saveFolderData = require("../controllers/folder/saveFolderData.controller");

router.get("/:userId", folderController.listFolders);
router.post("/:userId", saveFolderData);
router.put("/:userId/:folderId", folderController.updateFolder);
router.delete("/:userId/:folderId", folderController.deleteFolder);

module.exports = router;
