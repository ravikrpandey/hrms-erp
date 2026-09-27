const express = require('express')
const router = express.Router();

const assignUserController = require('../controllers/assignUserController')


router.post('/api/v1/createAssignUser',assignUserController.createAssignUser);
router.get('/api/v1/getEmployeeByRollId',assignUserController.getEmployeeByRollId);
router.get('/api/v1/getAssignUserList/:id?',assignUserController.getAssignUserList);
router.get('/api/v1/getEmployeeListOfBranchId/:branch_id',assignUserController.getEmployeeListOfBranchId);
router.get('/api/v1/getAssignUserListById/:id',assignUserController.getAssignUserListById);
router.patch('/api/v1/patchAssignUserListById/:id',assignUserController.patchAssignUserListById);
router.get('/api/v1/getSuperUserList',assignUserController.getSuperUserList);


module.exports = router;