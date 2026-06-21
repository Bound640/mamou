// ============================================================
// TechShop Backend — Routes Authentification
// Fichier : routes/authRoutes.js
// ============================================================

const express = require('express');
const router  = express.Router();
const {
  inscription,
  connexion,
  moi,
  mettreAJourProfil,
  changerMotDePasse,
} = require('../controllers/authController');
const { proteger } = require('../middleware/auth');

// Routes publiques
router.post('/inscription', inscription);
router.post('/connexion',   connexion);

// Routes protégées (token requis)
router.get('/moi',                    proteger, moi);
router.put('/profil',                 proteger, mettreAJourProfil);
router.put('/changer-mot-de-passe',   proteger, changerMotDePasse);

module.exports = router;
