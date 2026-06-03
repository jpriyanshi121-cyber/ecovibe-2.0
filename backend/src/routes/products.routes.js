import express from 'express';
import Product from '../models/Product.model.js';
import { authenticateToken, authorizeRole } from '../middleware/auth.middleware.js';

const router = express.Router();

// GET ALL PRODUCTS
router.get('/', async (req, res) => {
  try {
    const { category, search, page = 1, limit = 10 } = req.query;

    let filter = {};
    if (category) filter.category = category;
    if (search) filter.name = { $regex: search, $options: 'i' };

    const products = await Product.find(filter)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('sellerId', 'name');

    const total = await Product.countDocuments(filter);

    res.json({
      products,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET SINGLE PRODUCT
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('sellerId');
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// CREATE PRODUCT (Seller only)
router.post('/', authenticateToken, authorizeRole(['seller', 'admin']), async (req, res) => {
  try {
    const { name, description, price, category, ecoTags, stock, recyclable } = req.body;

    if (!name || !price || !category) {
      return res.status(400).json({ error: 'Name, price, and category required' });
    }

    const product = new Product({
      name,
      description,
      price,
      category,
      ecoTags: ecoTags || [],
      stock: stock || 1,
      recyclable: recyclable || false,
      sellerId: req.user.id,
      images: [],
    });

    await product.save();
    res.status(201).json({ message: '✅ Product created', product });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// UPDATE PRODUCT
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    if (product.sellerId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized' });
    }

    Object.assign(product, req.body);
    await product.save();

    res.json({ message: '✅ Product updated', product });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE PRODUCT
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    if (product.sellerId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized' });
    }

    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: '✅ Product deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// LIKE/UNLIKE PRODUCT
router.post('/:id/like', authenticateToken, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const userId = req.user.id;
    const likeIndex = product.likes.indexOf(userId);

    if (likeIndex > -1) {
      product.likes.splice(likeIndex, 1);
    } else {
      product.likes.push(userId);
    }

    await product.save();
    res.json({ message: '✅ Like updated', likes: product.likes.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;