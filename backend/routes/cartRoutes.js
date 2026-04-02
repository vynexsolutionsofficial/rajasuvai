import express from 'express';
import { getCart, addToCart, updateQuantity, removeCartItem, syncCart, clearCart } from '../controllers/cartController.js';
import { authenticateToken } from '../authMiddleware.js';

const router = express.Router();

router.get('/', authenticateToken, getCart);
router.post('/', authenticateToken, addToCart);
router.put('/', authenticateToken, updateQuantity);
router.delete('/:product_id', authenticateToken, removeCartItem);
router.post('/sync', authenticateToken, syncCart);
router.delete('/', authenticateToken, clearCart);

export default router;
