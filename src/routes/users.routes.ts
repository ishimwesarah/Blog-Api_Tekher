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

// --- Public Routes ---
router.get('/search', validate(searchUsersSchema), search);


// --- All routes below this line require a user to be logged in ---
router.use(authenticated);


// --- ✅ THE FIX: DEFINE SPECIFIC ROUTES FIRST ---
// This route for the logged-in user's profile must come before the generic /:id route.
router.get('/profile/me', getMyProfile);
router.put('/profile/me', upload.single('profilePicture'), updateMyProfile);


// --- Generic and Admin Routes ---
router.get('/', authorize(['admin', 'super_admin']), getAllUsers);
router.get('/:id', validate(getUserByIdSchema), getById); // Now this won't catch '/profile/me'
router.put('/:id', authorize(['admin', 'super_admin']), validate(updateUserSchema), updateUser);
router.delete('/:id', authorize(['admin', 'super_admin']), validate(deleteUserSchema), deleteUser);


// --- Super Admin Only Routes ---
router.post('/invite', authorize(['super_admin']), validate(inviteUserSchema), inviteUser);
router.patch('/:id/role', authorize(['super_admin']), validate(changeRoleSchema), changeUserRole);

export default router;