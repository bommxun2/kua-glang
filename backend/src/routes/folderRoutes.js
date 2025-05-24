const express = require('express');
const folderController = require('../controllers/food/folderController');
const router = express.Router();

router.get('/folder/:userId', folderController.listFolders);
router.post('/folder/:userId', folderController.addFolder);
router.put('/folder/:userId/:folderid', folderController.updateFolder);
router.delete('/folder/:userId/:folderid', folderController.deleteFolder);

module.exports = router;
