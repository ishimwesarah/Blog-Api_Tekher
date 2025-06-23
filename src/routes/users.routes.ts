import express, { Router } from 'express';
import { 
  getAllUsers, search, getById, updateUser, deleteUser, 
  changeUserRole, inviteUser, updateMyProfile, getMyProfile
} from '../controllers/users.controller';
import { authenticated } from '../middleware/auth.middleware';
import { authorize } from '../middleware/authorize';
import { validate } from '../middleware/validation.middleware';
import { 
  getUserByIdSchema, updateUserSchema, deleteUserSchema, 
  searchUsersSchema, changeRoleSchema, inviteUserSchema
} from '../schemas/user.schemas';
import upload from '../middleware/upload';

const router: Router = express.Router();


router.get('/search', validate(searchUsersSchema), search);



router.use(authenticated);



router.get('/profile/me', getMyProfile);
router.put('/profile/me', upload.single('profilePicture'), updateMyProfile);



router.get('/', authorize(['admin', 'super_admin']), getAllUsers);
router.get('/:id', validate(getUserByIdSchema), getById); // Now this won't catch '/profile/me'
router.put('/:id', authorize(['admin', 'super_admin']), validate(updateUserSchema), updateUser);
router.delete('/:id', authorize(['admin', 'super_admin']), validate(deleteUserSchema), deleteUser);



router.post('/invite', authorize(['super_admin']), validate(inviteUserSchema), inviteUser);
router.patch('/:id/role', authorize(['super_admin']), validate(changeRoleSchema), changeUserRole);

export default router;