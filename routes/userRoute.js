const express = require("express");
const router = express.Router();
const {createUser, loginUser, getAllUser, getUserById, deleteUserById, updateUserByAdmin, updateInfo, blockUser, unblockUser} = require('../controller/userController');
const {authMiddleware, isAdmin, checkUserBlock, } = require('../middlewares/authMiddleware');

const checkRoleAdmin = [authMiddleware, isAdmin];
const checkRoleUser = [authMiddleware, checkUserBlock];

router.post('/register', createUser);
router.post('/login', loginUser);
router.get('/all-users', checkRoleAdmin, getAllUser);
router.get('/:_id', checkRoleAdmin ,getUserById);
router.delete('/delete-user/:_id', checkRoleAdmin ,deleteUserById);
router.put('/edit-info', checkRoleUser, updateInfo);
router.put('/edit-user-by-admin/:_id',checkRoleAdmin, updateUserByAdmin);
router.put('/block-user/:_id', checkRoleAdmin, blockUser);
router.put('/unblock-user/:_id', checkRoleUser, unblockUser);

module.exports = router;
