import express from 'express';
import { verifyCoupon } from '../controllers/couponController.js';

const router = express.Router();

// Coupon verification can be public or semi-protected.
// We'll allow it if they provide the code and current cart total.
router.get('/verify/:code', verifyCoupon);

export default router;
