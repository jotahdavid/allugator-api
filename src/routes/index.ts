import { Router } from 'express';

import ProductController from '@controllers/ProductController';
import UserController from '@controllers/UserController';
import AuthController from '@controllers/AuthController';

const router = Router();

router.get('/products', ProductController.index);
router.post('/products', ProductController.store);

router.post('/users', UserController.store);

router.post('/auth/login', AuthController.login);

export default router;
