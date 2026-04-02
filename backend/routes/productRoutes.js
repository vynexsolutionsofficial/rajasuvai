import express from 'express';
import { getProducts, getProductById } from '../controllers/productController.js';

const router = express.Router();

// Product catalog is generally public
router.get('/', getProducts);
router.get('/:id', getProductById);

export default router;
