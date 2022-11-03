import { Router } from 'express';

import ProductController from '@controllers/ProductController';
import UserController from '@controllers/UserController';
import AuthController from '@controllers/AuthController';
import SubscriptionController from '@controllers/SubscriptionController';

import authMiddleware from '@middlewares/authMiddleware';

const router = Router();

router.get('/products', ProductController.index);
router.post('/products', authMiddleware('admin'), ProductController.store);

router.post('/users', UserController.store);

router.get('/users/me', authMiddleware('user'), UserController.getByToken);

router.get('/users/me/subscriptions', authMiddleware('user'), SubscriptionController.getAllUserSubscriptions);
router.post('/users/me/subscriptions', authMiddleware('user'), SubscriptionController.store);

router.post('/auth/login', AuthController.login);

export default router;
