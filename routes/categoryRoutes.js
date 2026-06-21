// ============================================================
// TechShop Backend — Routes Catégories
// Fichier : routes/categoryRoutes.js
// ============================================================

const express = require('express');
const router  = express.Router();
const {
  listerCategories,
  getCategorie,
  creerCategorie,
  modifierCategorie,
  supprimerCategorie,
} = require('../controllers/categoryController');
const { proteger, admin } = require('../middleware/auth');

// Routes publiques
router.get('/',        listerCategories);
router.get('/:slug',   getCategorie);

// Routes admin
router.post('/',       proteger, admin, creerCategorie);
router.put('/:id',     proteger, admin, modifierCategorie);
router.delete('/:id',  proteger, admin, supprimerCategorie);

module.exports = router;
