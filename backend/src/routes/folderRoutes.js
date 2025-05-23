const express = require('express');
const folderController = require('../controllers/folderController');
const router = express.Router();

router.get('/folder/:userid', folderController.listFolders);
router.post('/folder/:userid', folderController.addFolder);
router.put('/folder/:userid/:folderid', folderController.updateFolder);
router.delete('/folder/:userid/:folderid', folderController.deleteFolder);

module.exports = router;
