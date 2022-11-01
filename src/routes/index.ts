import { Router } from 'express';

import ProductController from '../app/controllers/ProductController';

const router = Router();

router.use('/products', ProductController.index);

export default router;
