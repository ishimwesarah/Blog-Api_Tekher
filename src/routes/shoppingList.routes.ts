import { Router } from 'express';
import { getMyList, addItemsToList, toggleListItem, deleteListItem } from '../controllers/shoppingList.controller';
import { authenticated } from '../middleware/auth.middleware'; // Your 'protect' middleware

const router = Router();

router.use(authenticated);

router.get('/', getMyList);
router.post('/add', addItemsToList);
router.patch('/:id/toggle', toggleListItem); 
router.delete('/:id', deleteListItem);

export default router;