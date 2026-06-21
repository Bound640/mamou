// ============================================================
// TechShop Backend — Routes Produits
// Fichier : routes/productRoutes.js
// ============================================================

const express = require('express');
const router  = express.Router();
const {
  listerProduits,
  getProduit,
  creerProduit,
  modifierProduit,
  supprimerProduit,
  getProduitsVedettes,
} = require('../controllers/productController');
const { proteger, admin } = require('../middleware/auth');

// ---- Routes publiques ---------------------------------------
router.get('/vedettes', getProduitsVedettes);
router.get('/',         listerProduits);
router.get('/:id',      getProduit);

// ---- Routes admin (authentification + rôle admin requis) ----
router.post('/',    proteger, admin, creerProduit);
router.put('/:id',  proteger, admin, modifierProduit);
router.delete('/:id', proteger, admin, supprimerProduit);

module.exports = router;
