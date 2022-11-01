import { Router } from 'express';

import ProductController from '../app/controllers/ProductController';
import UserController from '../app/controllers/UserController';

const router = Router();

router.get('/products', ProductController.index);
router.post('/products', ProductController.store);

router.post('/users', UserController.store);

export default router;
